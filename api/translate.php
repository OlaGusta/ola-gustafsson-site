<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

api_require_method('POST');
api_require_authenticated_user();

$pdo = api_get_pdo();
api_ensure_schema($pdo);

$request = api_decode_request_json();
$text = isset($request['text']) && is_string($request['text']) ? trim($request['text']) : '';
$from = isset($request['from']) && is_string($request['from']) ? strtolower(trim($request['from'])) : 'sv';
$to = isset($request['to']) && is_string($request['to']) ? strtolower(trim($request['to'])) : 'en';
$field = isset($request['field']) && is_string($request['field']) ? strtolower(trim($request['field'])) : 'generic';

if ($text === '') {
  api_respond_json(400, [
    'ok' => false,
    'error' => 'missing_text',
    'message' => 'Text saknas.'
  ]);
}

if (strlen($text) > 800) {
  api_respond_json(413, [
    'ok' => false,
    'error' => 'text_too_long',
    'message' => 'Texten är för lång för autoöversättning (max 800 tecken).'
  ]);
}

$direction = "{$from}-{$to}";
if (!(($from === 'sv' && $to === 'en') || ($from === 'en' && $to === 'sv'))) {
  api_respond_json(400, [
    'ok' => false,
    'error' => 'unsupported_language',
    'message' => 'Endast översättning mellan svenska och engelska stöds just nu.'
  ]);
}

$allowedFields = ['title', 'alt', 'format', 'medium', 'seotitle', 'seodescription', 'generic'];
if (!in_array($field, $allowedFields, true)) {
  $field = 'generic';
}

$cfg = openai_config();
if ($cfg['apiKey'] === '') {
  api_respond_json(400, [
    'ok' => false,
    'error' => 'openai_not_configured',
    'message' => 'OpenAI saknar konfiguration (OPENAI_API_KEY eller openai.apiKey i .db-config.php).'
  ]);
}

// Protect against accidental runaway costs.
$rateScope = 'openai_translate';
$rateKey = api_security_client_ip() . '|' . $direction . '|' . $field;
api_security_require_not_rate_limited(
  $pdo,
  $rateScope,
  $rateKey,
  'För många översättningsförsök på kort tid. Vänta en stund och försök igen.'
);

try {
  $translation = openai_translate_text($cfg, $text, $field, $from, $to);
  api_security_rate_limit_clear($pdo, $rateScope, $rateKey);

  api_respond_json(200, [
    'ok' => true,
    'translation' => $translation
  ]);
} catch (Throwable $error) {
  api_security_rate_limit_register_failure($pdo, $rateScope, $rateKey, 20, 300, 600);
  api_respond_json(502, [
    'ok' => false,
    'error' => 'openai_translate_failed',
    'message' => $error->getMessage() !== '' ? $error->getMessage() : 'Kunde inte översätta texten via OpenAI.'
  ]);
}

function openai_config(): array
{
  $db = api_load_db_config();
  $openai = isset($db['openai']) && is_array($db['openai']) ? $db['openai'] : [];

  $apiKey = trim((string) (($openai['apiKey'] ?? '') ?: (getenv('OPENAI_API_KEY') ?: '')));
  $model = trim((string) (($openai['model'] ?? '') ?: (getenv('OPENAI_MODEL') ?: '') ?: 'gpt-5.2'));
  $fallbackModel = trim((string) (($openai['fallbackModel'] ?? '') ?: (getenv('OPENAI_FALLBACK_MODEL') ?: '') ?: 'gpt-4o-mini'));
  $timeoutSeconds = (int) ($openai['timeoutSeconds'] ?? getenv('OPENAI_TIMEOUT_SECONDS') ?: 18);
  if ($timeoutSeconds < 5 || $timeoutSeconds > 60) {
    $timeoutSeconds = 18;
  }
  $organizationId = trim((string) ($openai['organizationId'] ?? getenv('OPENAI_ORGANIZATION_ID') ?: ''));
  $projectId = trim((string) ($openai['projectId'] ?? getenv('OPENAI_PROJECT_ID') ?: ''));

  return [
    'apiKey' => $apiKey,
    'model' => $model,
    'fallbackModel' => $fallbackModel,
    'timeoutSeconds' => $timeoutSeconds,
    'organizationId' => $organizationId,
    'projectId' => $projectId
  ];
}

function openai_http_request(string $url, array $headers, string $body, int $timeoutSeconds): array
{
  if (!function_exists('curl_init')) {
    throw new RuntimeException('PHP cURL saknas på servern.');
  }

  $ch = curl_init($url);
  if ($ch === false) {
    throw new RuntimeException('Kunde inte initiera nätverksanrop.');
  }

  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => $timeoutSeconds
  ]);

  $responseBody = curl_exec($ch);
  $curlErrNo = curl_errno($ch);
  $curlErr = curl_error($ch);
  $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  if ($curlErrNo !== 0) {
    throw new RuntimeException('Nätverksfel mot OpenAI API: ' . $curlErr);
  }

  if (!is_string($responseBody)) {
    $responseBody = '';
  }

  return [$httpCode, $responseBody];
}

function openai_extract_error(string $body): string
{
  $decoded = json_decode($body, true);
  if (!is_array($decoded)) {
    return '';
  }

  if (isset($decoded['error']['message']) && is_string($decoded['error']['message']) && trim($decoded['error']['message']) !== '') {
    return trim($decoded['error']['message']);
  }

  if (isset($decoded['message']) && is_string($decoded['message']) && trim($decoded['message']) !== '') {
    return trim($decoded['message']);
  }

  return '';
}

function openai_field_instructions(string $field, string $from, string $to): string
{
  $svToEn = $from === 'sv' && $to === 'en';
  switch ($field) {
    case 'title':
      return $svToEn
        ? "Translate an artwork title from Swedish to idiomatic English. Keep proper nouns (names/places). Preserve punctuation. Do not add quotes."
        : "Translate an artwork title from English to idiomatic Swedish. Keep proper nouns (names/places). Preserve punctuation. Do not add quotes.";
    case 'alt':
      return $svToEn
        ? "Translate an image alt text from Swedish to English. Keep it descriptive and natural. Preserve meaning; do not add extra details."
        : "Translate an image alt text from English to Swedish. Keep it descriptive and natural. Preserve meaning; do not add extra details.";
    case 'format':
      return $svToEn
        ? "Translate a short format/dimensions line from Swedish to English. Preserve numbers, units, and symbols like ×. Only translate words if needed."
        : "Translate a short format/dimensions line from English to Swedish. Preserve numbers, units, and symbols like ×. Only translate words if needed.";
    case 'medium':
      return $svToEn
        ? "Translate an artwork medium line from Swedish to English. Keep it concise."
        : "Translate an artwork medium line from English to Swedish. Keep it concise.";
    case 'seotitle':
      return $svToEn
        ? "Translate a short SEO title for an artwork page from Swedish to natural English. Keep key terms and proper nouns. No quotes."
        : "Translate a short SEO title for an artwork page from English to natural Swedish. Keep key terms and proper nouns. No quotes.";
    case 'seodescription':
      return $svToEn
        ? "Translate a concise SEO meta description for an artwork page from Swedish to English. Keep it fluent, search-friendly, and within about 155 characters when possible."
        : "Translate a concise SEO meta description for an artwork page from English to Swedish. Keep it fluent, search-friendly, and within about 155 characters when possible.";
    default:
      return $svToEn
        ? "Translate the text from Swedish to English accurately and naturally. Do not add explanations."
        : "Translate the text from English to Swedish accurately and naturally. Do not add explanations.";
  }
}

function openai_translate_text(array $cfg, string $text, string $field, string $from, string $to): string
{
  $system = implode("\n", [
    "You are a professional translation engine.",
    "Return JSON only.",
    "Output must be a single JSON object with exactly one key: translation (string).",
    "Do not wrap the JSON in markdown."
  ]);

  $fromLabel = $from === 'en' ? 'English' : 'Swedish';
  $toLabel = $to === 'sv' ? 'Swedish' : 'English';

  $user = implode("\n", [
    "Task: translate from {$fromLabel} to {$toLabel}.",
    "Field: {$field}.",
    "Instructions: " . openai_field_instructions($field, $from, $to),
    "",
    "Text:",
    $text
  ]);

  $headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $cfg['apiKey']
  ];
  if (isset($cfg['organizationId']) && is_string($cfg['organizationId']) && trim($cfg['organizationId']) !== '') {
    $headers[] = 'OpenAI-Organization: ' . trim($cfg['organizationId']);
  }
  if (isset($cfg['projectId']) && is_string($cfg['projectId']) && trim($cfg['projectId']) !== '') {
    $headers[] = 'OpenAI-Project: ' . trim($cfg['projectId']);
  }

  $modelsToTry = [];
  $primaryModel = trim((string) ($cfg['model'] ?? ''));
  if ($primaryModel !== '') {
    $modelsToTry[] = $primaryModel;
  }
  $fallbackModel = trim((string) ($cfg['fallbackModel'] ?? ''));
  if ($fallbackModel !== '' && !in_array($fallbackModel, $modelsToTry, true)) {
    $modelsToTry[] = $fallbackModel;
  }
  if (count($modelsToTry) === 0) {
    $modelsToTry[] = 'gpt-4o-mini';
  }

  $lastError = 'Kunde inte översätta texten via OpenAI.';
  $lastStatus = 0;

  foreach ($modelsToTry as $modelIndex => $modelName) {
    $payload = [
      'model' => $modelName,
      'temperature' => 0.2,
      'response_format' => ['type' => 'json_object'],
      'messages' => [
        ['role' => 'system', 'content' => $system],
        ['role' => 'user', 'content' => $user]
      ]
    ];

    $json = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if (!is_string($json)) {
      throw new RuntimeException('Kunde inte serialisera OpenAI payload.');
    }

    [$status, $body] = openai_http_request(
      'https://api.openai.com/v1/chat/completions',
      $headers,
      $json,
      (int) $cfg['timeoutSeconds']
    );

    $lastStatus = $status;
    if ($status >= 200 && $status < 300) {
      $decoded = json_decode($body, true);
      $content = is_array($decoded) ? (string) (($decoded['choices'][0]['message']['content'] ?? '') ?: '') : '';
      if (trim($content) === '') {
        $lastError = 'OpenAI returnerade ingen översättning.';
      } else {
        $parsed = json_decode($content, true);
        $translation = is_array($parsed) ? trim((string) ($parsed['translation'] ?? '')) : '';
        if ($translation === '') {
          // Recover when model returns plain text.
          $translation = trim($content);
        }
        if ($translation !== '') {
          return $translation;
        }
        $lastError = 'OpenAI returnerade en tom översättning.';
      }
    } else {
      $errorText = openai_extract_error($body);
      $lastError = 'OpenAI API-fel (' . $status . ')' . ($errorText !== '' ? ': ' . $errorText : '.');
    }

    $hasNextModel = $modelIndex < (count($modelsToTry) - 1);
    if (!$hasNextModel) {
      break;
    }

    if (!openai_should_try_fallback_model($status, $lastError)) {
      break;
    }
  }

  $attemptedModels = implode(', ', $modelsToTry);
  throw new RuntimeException(
    $lastError . ($lastStatus > 0 ? " [försökta modeller: {$attemptedModels}]" : '')
  );
}

function openai_should_try_fallback_model(int $status, string $error): bool
{
  if (in_array($status, [400, 401, 403, 404, 422, 429], true)) {
    return true;
  }

  $haystack = strtolower(trim($error));
  if ($haystack === '') {
    return false;
  }

  $hints = [
    'model',
    'unsupported',
    'not found',
    'insufficient permissions',
    'missing scopes',
    'permission',
    'not permitted',
    'unauthorized',
    'access denied',
    'does not support',
    'response_format',
    'temperature',
    'invalid parameter'
  ];

  foreach ($hints as $hint) {
    if (strpos($haystack, $hint) !== false) {
      return true;
    }
  }

  return false;
}
