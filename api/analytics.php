<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

api_require_method('POST');
api_require_authenticated_user();

$pdo = api_get_pdo();
api_ensure_schema($pdo);

$request = api_decode_request_json();
$days = (int) ($request['days'] ?? 28);
if (!in_array($days, [7, 14, 28, 90], true)) {
  $days = 28;
}

$cfg = ga_config();
if ($cfg['propertyId'] === '' || $cfg['clientEmail'] === '' || $cfg['privateKey'] === '') {
  api_respond_json(400, [
    'ok' => false,
    'error' => 'ga_not_configured',
    'message' => 'Google Analytics Data API saknar konfiguration (propertyId, clientEmail, privateKey).'
  ]);
}

$rateScope = 'analytics_fetch';
$rateKey = api_security_client_ip() . '|' . $cfg['propertyId'];
api_security_require_not_rate_limited(
  $pdo,
  $rateScope,
  $rateKey,
  'För många analytics-anrop på kort tid. Vänta en stund och försök igen.'
);

try {
  $token = ga_fetch_access_token($cfg['clientEmail'], $cfg['privateKey']);
  $dashboard = ga_build_dashboard(
    $cfg['propertyId'],
    $token,
    $days,
    $cfg['timezone'],
    $cfg['includeToday']
  );
  api_security_rate_limit_clear($pdo, $rateScope, $rateKey);

  api_respond_json(200, [
    'ok' => true,
    'propertyId' => $cfg['propertyId'],
    'days' => $days,
    'dashboard' => $dashboard
  ]);
} catch (Throwable $error) {
  api_security_rate_limit_register_failure($pdo, $rateScope, $rateKey, 8, 300, 600);
  api_respond_json(502, [
    'ok' => false,
    'error' => 'ga_fetch_failed',
    'message' => $error->getMessage() !== '' ? $error->getMessage() : 'Kunde inte hämta data från Google Analytics.'
  ]);
}

function ga_config(): array
{
  $db = api_load_db_config();
  $ga = isset($db['googleAnalytics']) && is_array($db['googleAnalytics']) ? $db['googleAnalytics'] : [];

  $propertyId = trim((string) ($ga['propertyId'] ?? getenv('GA4_PROPERTY_ID') ?: ''));
  $propertyId = preg_replace('/^properties\//i', '', $propertyId);
  $propertyId = preg_replace('/\D+/', '', (string) $propertyId);

  $clientEmail = trim((string) ($ga['clientEmail'] ?? getenv('GA4_CLIENT_EMAIL') ?: ''));
  $privateKey = (string) ($ga['privateKey'] ?? getenv('GA4_PRIVATE_KEY') ?: '');
  $privateKeyBase64 = trim((string) ($ga['privateKeyBase64'] ?? getenv('GA4_PRIVATE_KEY_BASE64') ?: ''));
  $serviceAccountJson = trim((string) ($ga['serviceAccountJson'] ?? getenv('GA4_SERVICE_ACCOUNT_JSON') ?: ''));

  if ($privateKey === '' && $privateKeyBase64 !== '') {
    $decoded = base64_decode($privateKeyBase64, true);
    if (is_string($decoded) && $decoded !== '') {
      $privateKey = $decoded;
    }
  }

  if (($clientEmail === '' || $privateKey === '') && $serviceAccountJson !== '') {
    $jsonRaw = $serviceAccountJson;
    if ($serviceAccountJson[0] !== '{' && is_file($serviceAccountJson)) {
      $jsonRaw = (string) file_get_contents($serviceAccountJson);
    }

    $decoded = json_decode($jsonRaw, true);
    if (is_array($decoded)) {
      if ($clientEmail === '') {
        $clientEmail = trim((string) ($decoded['client_email'] ?? ''));
      }
      if ($privateKey === '') {
        $privateKey = (string) ($decoded['private_key'] ?? '');
      }
    }
  }

  if (str_contains($privateKey, '\n')) {
    $privateKey = str_replace('\n', "\n", $privateKey);
  }
  if (str_contains($privateKey, '\r')) {
    $privateKey = str_replace('\r', '', $privateKey);
  }
  $privateKey = trim($privateKey);

  $timezoneName = trim((string) ($ga['timezone'] ?? getenv('GA4_TIMEZONE') ?: 'Europe/Stockholm'));
  if ($timezoneName === '') {
    $timezoneName = 'Europe/Stockholm';
  }
  try {
    $timezone = new DateTimeZone($timezoneName);
  } catch (Throwable $error) {
    $timezone = new DateTimeZone('UTC');
  }

  $excludeTodayRaw = $ga['excludeToday'] ?? getenv('GA4_EXCLUDE_TODAY') ?? null;
  $excludeToday = false;
  if (is_bool($excludeTodayRaw)) {
    $excludeToday = $excludeTodayRaw;
  } elseif (is_numeric($excludeTodayRaw)) {
    $excludeToday = ((int) $excludeTodayRaw) === 1;
  } elseif (is_string($excludeTodayRaw)) {
    $excludeToday = in_array(strtolower(trim($excludeTodayRaw)), ['1', 'true', 'yes', 'on'], true);
  }

  return [
    'propertyId' => is_string($propertyId) ? trim($propertyId) : '',
    'clientEmail' => $clientEmail,
    'privateKey' => $privateKey,
    'timezone' => $timezone,
    'includeToday' => !$excludeToday
  ];
}

function ga_base64url(string $value): string
{
  return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function ga_build_jwt(string $clientEmail, string $privateKey): string
{
  $now = time();
  $header = ['alg' => 'RS256', 'typ' => 'JWT'];
  $claims = [
    'iss' => $clientEmail,
    'scope' => 'https://www.googleapis.com/auth/analytics.readonly',
    'aud' => 'https://oauth2.googleapis.com/token',
    'iat' => $now,
    'exp' => $now + 3600
  ];

  $encodedHeader = ga_base64url((string) json_encode($header, JSON_UNESCAPED_SLASHES));
  $encodedClaims = ga_base64url((string) json_encode($claims, JSON_UNESCAPED_SLASHES));
  $message = $encodedHeader . '.' . $encodedClaims;

  $signature = '';
  $ok = openssl_sign($message, $signature, $privateKey, OPENSSL_ALGO_SHA256);
  if ($ok !== true) {
    throw new RuntimeException('Kunde inte signera JWT med service account-nyckeln.');
  }

  return $message . '.' . ga_base64url($signature);
}

function ga_http_request(string $url, array $headers, string $body, int $timeoutSeconds = 25): array
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
    throw new RuntimeException('Nätverksfel mot Google API: ' . $curlErr);
  }

  if (!is_string($responseBody)) {
    $responseBody = '';
  }

  return [$httpCode, $responseBody];
}

function ga_extract_google_error(string $body): string
{
  $decoded = json_decode($body, true);
  if (!is_array($decoded)) {
    return '';
  }

  if (isset($decoded['error_description']) && is_string($decoded['error_description']) && trim($decoded['error_description']) !== '') {
    return trim($decoded['error_description']);
  }

  if (isset($decoded['error']['message']) && is_string($decoded['error']['message']) && trim($decoded['error']['message']) !== '') {
    return trim($decoded['error']['message']);
  }

  if (isset($decoded['error']) && is_string($decoded['error']) && trim($decoded['error']) !== '') {
    return trim($decoded['error']);
  }

  return '';
}

function ga_fetch_access_token(string $clientEmail, string $privateKey): string
{
  $jwt = ga_build_jwt($clientEmail, $privateKey);
  $payload = http_build_query([
    'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    'assertion' => $jwt
  ]);

  [$status, $body] = ga_http_request(
    'https://oauth2.googleapis.com/token',
    ['Content-Type: application/x-www-form-urlencoded'],
    $payload
  );

  if ($status < 200 || $status >= 300) {
    $errorText = ga_extract_google_error($body);
    throw new RuntimeException(
      'Kunde inte hämta access-token från Google OAuth (' . $status . ')' . ($errorText !== '' ? ': ' . $errorText : '.')
    );
  }

  $decoded = json_decode($body, true);
  $token = is_array($decoded) ? (string) ($decoded['access_token'] ?? '') : '';
  if ($token === '') {
    throw new RuntimeException('Google OAuth returnerade ingen access-token.');
  }

  return $token;
}

function ga_run_report(string $propertyId, string $accessToken, array $reportBody): array
{
  $url = sprintf('https://analyticsdata.googleapis.com/v1beta/properties/%s:runReport', rawurlencode($propertyId));
  $jsonBody = json_encode($reportBody, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if (!is_string($jsonBody)) {
    throw new RuntimeException('Kunde inte serialisera GA-report request.');
  }

  [$status, $body] = ga_http_request($url, [
    'Authorization: Bearer ' . $accessToken,
    'Content-Type: application/json'
  ], $jsonBody, 30);

  if ($status < 200 || $status >= 300) {
    $errorText = ga_extract_google_error($body);
    throw new RuntimeException(
      'Google Analytics Data API svarade med fel (' . $status . ')' . ($errorText !== '' ? ': ' . $errorText : '.')
    );
  }

  $decoded = json_decode($body, true);
  if (!is_array($decoded)) {
    throw new RuntimeException('Ogiltigt JSON-svar från Google Analytics Data API.');
  }

  return $decoded;
}

function ga_date_ranges(int $days, DateTimeZone $tz, bool $includeToday = true): array
{
  $days = max(1, $days);
  $today = new DateTimeImmutable('today', $tz);
  $currentEnd = $includeToday ? $today : $today->modify('-1 day');
  $currentStart = $currentEnd->modify(sprintf('-%d days', $days - 1));
  $previousEnd = $currentStart->modify('-1 day');
  $previousStart = $previousEnd->modify(sprintf('-%d days', $days - 1));

  return [
    'current' => [
      'startDate' => $currentStart->format('Y-m-d'),
      'endDate' => $currentEnd->format('Y-m-d')
    ],
    'previous' => [
      'startDate' => $previousStart->format('Y-m-d'),
      'endDate' => $previousEnd->format('Y-m-d')
    ]
  ];
}

function ga_to_int($value): int
{
  return (int) round((float) $value);
}

function ga_extract_metric_row(array $report, array $metricNames): array
{
  $row = $report['rows'][0]['metricValues'] ?? [];
  $out = [];
  foreach ($metricNames as $index => $name) {
    $raw = $row[$index]['value'] ?? 0;
    $out[$name] = ga_to_int($raw);
  }
  return $out;
}

function ga_metric_with_delta(array $currentMap, array $previousMap, string $metric): array
{
  $current = ga_to_int($currentMap[$metric] ?? 0);
  $previous = ga_to_int($previousMap[$metric] ?? 0);
  $changePct = 0.0;
  if ($previous > 0) {
    $changePct = (($current - $previous) / $previous) * 100;
  } elseif ($current > 0) {
    $changePct = 100.0;
  }

  return [
    'value' => $current,
    'previous' => $previous,
    'changePct' => round($changePct, 2)
  ];
}

function ga_extract_trend(array $report): array
{
  $rows = isset($report['rows']) && is_array($report['rows']) ? $report['rows'] : [];
  $trend = [];

  foreach ($rows as $row) {
    $rawDate = (string) ($row['dimensionValues'][0]['value'] ?? '');
    $rawValue = $row['metricValues'][0]['value'] ?? 0;
    if ($rawDate === '') {
      continue;
    }

    $formattedDate = $rawDate;
    if (preg_match('/^\d{8}$/', $rawDate) === 1) {
      $formattedDate = substr($rawDate, 0, 4) . '-' . substr($rawDate, 4, 2) . '-' . substr($rawDate, 6, 2);
    }

    $trend[] = [
      'date' => $formattedDate,
      'value' => ga_to_int($rawValue)
    ];
  }

  return $trend;
}

function ga_fill_trend_range(array $trend, array $range): array
{
  $startRaw = isset($range['startDate']) ? trim((string) $range['startDate']) : '';
  $endRaw = isset($range['endDate']) ? trim((string) $range['endDate']) : '';
  if ($startRaw === '' || $endRaw === '') {
    return $trend;
  }
  if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $startRaw) !== 1 || preg_match('/^\d{4}-\d{2}-\d{2}$/', $endRaw) !== 1) {
    return $trend;
  }

  try {
    $startDate = new DateTimeImmutable($startRaw);
    $endDate = new DateTimeImmutable($endRaw);
  } catch (Throwable $error) {
    return $trend;
  }

  if ($startDate->getTimestamp() > $endDate->getTimestamp()) {
    return $trend;
  }

  $valuesByDate = [];
  foreach ($trend as $point) {
    if (!is_array($point)) {
      continue;
    }
    $date = isset($point['date']) ? trim((string) $point['date']) : '';
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) !== 1) {
      continue;
    }
    $valuesByDate[$date] = ga_to_int($point['value'] ?? 0);
  }

  $filled = [];
  $cursor = $startDate;
  $endTs = $endDate->getTimestamp();
  while ($cursor->getTimestamp() <= $endTs) {
    $iso = $cursor->format('Y-m-d');
    $filled[] = [
      'date' => $iso,
      'value' => $valuesByDate[$iso] ?? 0
    ];
    $cursor = $cursor->modify('+1 day');
  }

  return $filled;
}

function ga_extract_breakdown_map(array $report): array
{
  $rows = isset($report['rows']) && is_array($report['rows']) ? $report['rows'] : [];
  $map = [];

  foreach ($rows as $row) {
    $label = trim((string) ($row['dimensionValues'][0]['value'] ?? ''));
    if ($label === '') {
      $label = 'Unknown';
    }
    $map[$label] = ga_to_int($row['metricValues'][0]['value'] ?? 0);
  }

  return $map;
}

function ga_build_breakdown(
  string $propertyId,
  string $accessToken,
  string $dimensionName,
  array $currentRange,
  array $previousRange,
  int $limit = 7
): array {
  $requestCurrent = [
    'dateRanges' => [$currentRange],
    'dimensions' => [['name' => $dimensionName]],
    'metrics' => [['name' => 'sessions']],
    'limit' => $limit,
    'orderBys' => [[
      'metric' => ['metricName' => 'sessions'],
      'desc' => true
    ]]
  ];
  $requestPrevious = [
    'dateRanges' => [$previousRange],
    'dimensions' => [['name' => $dimensionName]],
    'metrics' => [['name' => 'sessions']],
    'limit' => $limit,
    'orderBys' => [[
      'metric' => ['metricName' => 'sessions'],
      'desc' => true
    ]]
  ];

  $currentReport = ga_run_report($propertyId, $accessToken, $requestCurrent);
  $previousReport = ga_run_report($propertyId, $accessToken, $requestPrevious);

  $currentMap = ga_extract_breakdown_map($currentReport);
  $previousMap = ga_extract_breakdown_map($previousReport);

  $result = [];
  foreach ($currentMap as $label => $value) {
    $previous = $previousMap[$label] ?? 0;
    $changePct = 0.0;
    if ($previous > 0) {
      $changePct = (($value - $previous) / $previous) * 100;
    } elseif ($value > 0) {
      $changePct = 100.0;
    }

    $result[] = [
      'label' => $label,
      'value' => $value,
      'previousValue' => $previous,
      'changePct' => round($changePct, 2)
    ];
  }

  usort($result, static function (array $a, array $b): int {
    return ($b['value'] ?? 0) <=> ($a['value'] ?? 0);
  });

  return array_slice($result, 0, $limit);
}

function ga_build_dashboard(
  string $propertyId,
  string $accessToken,
  int $days,
  DateTimeZone $timezone,
  bool $includeToday
): array
{
  $ranges = ga_date_ranges($days, $timezone, $includeToday);
  $currentRange = $ranges['current'];
  $previousRange = $ranges['previous'];

  $metrics = ['sessions', 'activeUsers', 'engagedSessions', 'eventCount'];

  $currentTotals = ga_run_report($propertyId, $accessToken, [
    'dateRanges' => [$currentRange],
    'metrics' => array_map(static fn(string $metric): array => ['name' => $metric], $metrics)
  ]);
  $previousTotals = ga_run_report($propertyId, $accessToken, [
    'dateRanges' => [$previousRange],
    'metrics' => array_map(static fn(string $metric): array => ['name' => $metric], $metrics)
  ]);

  $currentMetricMap = ga_extract_metric_row($currentTotals, $metrics);
  $previousMetricMap = ga_extract_metric_row($previousTotals, $metrics);

  $trendReport = ga_run_report($propertyId, $accessToken, [
    'dateRanges' => [$currentRange],
    'dimensions' => [['name' => 'date']],
    'metrics' => [['name' => 'activeUsers']],
    'keepEmptyRows' => true,
    'orderBys' => [[
      'dimension' => ['dimensionName' => 'date'],
      'desc' => false
    ]]
  ]);

  $channels = ga_build_breakdown($propertyId, $accessToken, 'sessionDefaultChannelGroup', $currentRange, $previousRange);
  $locations = ga_build_breakdown($propertyId, $accessToken, 'country', $currentRange, $previousRange);
  $devices = ga_build_breakdown($propertyId, $accessToken, 'deviceCategory', $currentRange, $previousRange);
  $trend = ga_fill_trend_range(ga_extract_trend($trendReport), $currentRange);
  $latestTrendDate = '';
  if (!empty($trend)) {
    $last = $trend[count($trend) - 1];
    if (is_array($last) && isset($last['date']) && is_string($last['date'])) {
      $latestTrendDate = $last['date'];
    }
  }

  return [
    'period' => [
      'days' => $days,
      'current' => $currentRange,
      'previous' => $previousRange,
      'timezone' => $timezone->getName(),
      'includeToday' => $includeToday,
      'latestTrendDate' => $latestTrendDate
    ],
    'summary' => [
      'sessions' => ga_metric_with_delta($currentMetricMap, $previousMetricMap, 'sessions'),
      'activeUsers' => ga_metric_with_delta($currentMetricMap, $previousMetricMap, 'activeUsers'),
      'engagedSessions' => ga_metric_with_delta($currentMetricMap, $previousMetricMap, 'engagedSessions'),
      'eventCount' => ga_metric_with_delta($currentMetricMap, $previousMetricMap, 'eventCount')
    ],
    'trend' => $trend,
    'breakdowns' => [
      'channels' => $channels,
      'locations' => $locations,
      'devices' => $devices
    ],
    'generatedAt' => api_now_iso_utc()
  ];
}
