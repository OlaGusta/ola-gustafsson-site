<?php
declare(strict_types=1);

// Shared helpers for SEO-aware PHP templates (sitemap + artwork pages).
if (function_exists('header_remove')) {
  header_remove('X-Powered-By');
}

function portfolio_slugify(string $value): string
{
  if (function_exists('mb_strtolower')) {
    $value = trim(mb_strtolower($value, 'UTF-8'));
  } else {
    $value = trim(strtolower($value));
  }

  // Transliterate common Swedish characters (and a few common diacritics) to ASCII.
  $map = [
    'å' => 'a',
    'ä' => 'a',
    'ö' => 'o',
    'é' => 'e',
    'è' => 'e',
    'ê' => 'e',
    'ü' => 'u',
    'í' => 'i',
    'á' => 'a',
    'à' => 'a',
    'ô' => 'o',
    'ó' => 'o',
    'ñ' => 'n',
  ];
  $value = strtr($value, $map);

  // Keep only a-z, 0-9 and hyphen separators.
  $value = preg_replace('/[^a-z0-9]+/u', '-', $value) ?? '';
  $value = trim($value, '-');
  $value = preg_replace('/-+/', '-', $value) ?? $value;

  return $value !== '' ? $value : 'verk';
}

function portfolio_normalize_image_name_for_match(string $value): string
{
  $next = trim(strtolower($value));
  if ($next === '') {
    return '';
  }

  $map = [
    'å' => 'a',
    'ä' => 'a',
    'ö' => 'o',
    'é' => 'e',
    'è' => 'e',
    'ê' => 'e',
    'ü' => 'u',
    'í' => 'i',
    'á' => 'a',
    'à' => 'a',
    'ô' => 'o',
    'ó' => 'o',
    'ñ' => 'n',
  ];
  $next = strtr($next, $map);
  $next = preg_replace('/\.[a-z0-9]+$/i', '', $next) ?? $next;
  $next = preg_replace('/[^a-z0-9]+/', '-', $next) ?? $next;
  $next = preg_replace('/-+/', '-', $next) ?? $next;

  return trim($next, '-');
}

function portfolio_collect_gallery_artwork_srcs(array $payload): array
{
  $artworks = isset($payload['gallery']) && is_array($payload['gallery']) && isset($payload['gallery']['artworks'])
    ? $payload['gallery']['artworks']
    : [];
  if (!is_array($artworks)) {
    return [];
  }

  $sources = [];
  foreach ($artworks as $artwork) {
    if (!is_array($artwork)) {
      continue;
    }
    $src = isset($artwork['src']) && is_string($artwork['src']) ? ltrim(trim($artwork['src']), '/') : '';
    if ($src !== '') {
      $sources[$src] = true;
    }
  }

  return array_keys($sources);
}

function portfolio_build_image_src_lookup(array $sources): array
{
  $byExact = [];
  $byNormalized = [];
  $byBaseNoNumber = [];
  $records = [];

  foreach ($sources as $rawSrc) {
    if (!is_string($rawSrc)) {
      continue;
    }

    $src = ltrim(trim($rawSrc), '/');
    if ($src === '') {
      continue;
    }

    $byExact[$src] = true;

    $clean = preg_split('/[?#]/', $src, 2);
    $path = is_array($clean) && isset($clean[0]) ? trim((string) $clean[0]) : $src;
    $fileName = $path !== '' ? basename($path) : '';
    $normalized = $fileName !== '' ? portfolio_normalize_image_name_for_match($fileName) : '';
    if ($normalized === '') {
      continue;
    }

    if (!isset($byNormalized[$normalized])) {
      $byNormalized[$normalized] = $src;
    }

    $baseNoNumber = preg_replace('/-\d+$/', '', $normalized) ?? $normalized;
    if (!isset($byBaseNoNumber[$baseNoNumber])) {
      $byBaseNoNumber[$baseNoNumber] = [];
    }

    $record = [
      'src' => $src,
      'normalized' => $normalized,
      'baseNoNumber' => $baseNoNumber,
    ];
    $byBaseNoNumber[$baseNoNumber][] = $record;
    $records[] = $record;
  }

  return [
    'byExact' => $byExact,
    'byNormalized' => $byNormalized,
    'byBaseNoNumber' => $byBaseNoNumber,
    'records' => $records,
  ];
}

function portfolio_choose_closest_image_src(string $requestedSrc, array $lookup): string
{
  $src = ltrim(trim($requestedSrc), '/');
  if (
    $src === '' ||
    preg_match('/^(data:|blob:)/i', $src) === 1 ||
    !isset($lookup['byExact'], $lookup['byNormalized'], $lookup['byBaseNoNumber'], $lookup['records'])
  ) {
    return '';
  }

  if (!empty($lookup['byExact'][$src])) {
    return $src;
  }

  $clean = preg_split('/[?#]/', $src, 2);
  $path = is_array($clean) && isset($clean[0]) ? trim((string) $clean[0]) : $src;
  $fileName = $path !== '' ? basename($path) : '';
  $normalized = $fileName !== '' ? portfolio_normalize_image_name_for_match($fileName) : '';
  if ($normalized === '') {
    return '';
  }

  if (isset($lookup['byNormalized'][$normalized]) && is_string($lookup['byNormalized'][$normalized])) {
    return $lookup['byNormalized'][$normalized];
  }

  $baseNoNumber = preg_replace('/-\d+$/', '', $normalized) ?? $normalized;
  $sameBase = isset($lookup['byBaseNoNumber'][$baseNoNumber]) && is_array($lookup['byBaseNoNumber'][$baseNoNumber])
    ? $lookup['byBaseNoNumber'][$baseNoNumber]
    : [];

  if ($sameBase !== []) {
    foreach ($sameBase as $entry) {
      if (!is_array($entry)) {
        continue;
      }
      $entryNormalized = isset($entry['normalized']) && is_string($entry['normalized']) ? $entry['normalized'] : '';
      $entrySrc = isset($entry['src']) && is_string($entry['src']) ? $entry['src'] : '';
      if ($entryNormalized === $baseNoNumber && $entrySrc !== '') {
        return $entrySrc;
      }
    }

    usort(
      $sameBase,
      static function (array $left, array $right) use ($baseNoNumber): int {
        $leftNormalized = isset($left['normalized']) && is_string($left['normalized']) ? $left['normalized'] : '';
        $rightNormalized = isset($right['normalized']) && is_string($right['normalized']) ? $right['normalized'] : '';
        $leftOrder = preg_match('/^' . preg_quote($baseNoNumber, '/') . '-(\d+)$/', $leftNormalized, $matchLeft) === 1
          ? (int) $matchLeft[1]
          : PHP_INT_MAX;
        $rightOrder = preg_match('/^' . preg_quote($baseNoNumber, '/') . '-(\d+)$/', $rightNormalized, $matchRight) === 1
          ? (int) $matchRight[1]
          : PHP_INT_MAX;
        return $leftOrder <=> $rightOrder;
      }
    );

    $first = $sameBase[0] ?? null;
    if (is_array($first) && isset($first['src']) && is_string($first['src']) && $first['src'] !== '') {
      return $first['src'];
    }
  }

  $compact = str_replace('-', '', $normalized);
  $parts = explode('-', $normalized);
  $token = isset($parts[0]) ? trim((string) $parts[0]) : '';
  $bestSrc = '';
  $bestDistance = PHP_INT_MAX;
  $bestLength = PHP_INT_MAX;

  foreach ($lookup['records'] as $entry) {
    if (!is_array($entry)) {
      continue;
    }

    $entryNormalized = isset($entry['normalized']) && is_string($entry['normalized']) ? $entry['normalized'] : '';
    $entrySrc = isset($entry['src']) && is_string($entry['src']) ? $entry['src'] : '';
    if ($entryNormalized === '' || $entrySrc === '') {
      continue;
    }
    if ($token !== '' && str_starts_with($entryNormalized, $token) === false) {
      continue;
    }

    $entryCompact = str_replace('-', '', $entryNormalized);
    $distance = levenshtein($compact, $entryCompact);
    $maxLength = max(strlen($compact), strlen($entryCompact), 1);
    if (($distance / $maxLength) > 0.26) {
      continue;
    }

    $entryLength = strlen($entryNormalized);
    if ($distance < $bestDistance || ($distance === $bestDistance && $entryLength < $bestLength)) {
      $bestSrc = $entrySrc;
      $bestDistance = $distance;
      $bestLength = $entryLength;
    }
  }

  return $bestSrc;
}

function portfolio_sanitize_artwork_translation_maps(array &$payload): void
{
  if (!isset($payload['translations']) || !is_array($payload['translations'])) {
    return;
  }

  $activeSrcs = portfolio_collect_gallery_artwork_srcs($payload);
  if ($activeSrcs === []) {
    return;
  }

  $lookup = portfolio_build_image_src_lookup($activeSrcs);

  foreach ($payload['translations'] as &$pack) {
    if (!is_array($pack)) {
      continue;
    }

    $gallery = isset($pack['gallery']) && is_array($pack['gallery']) ? $pack['gallery'] : null;
    if ($gallery === null) {
      continue;
    }

    $map = isset($gallery['artworkTextBySrc']) && is_array($gallery['artworkTextBySrc'])
      ? $gallery['artworkTextBySrc']
      : null;
    if ($map === null) {
      continue;
    }

    $nextMap = [];
    foreach ($map as $rawSrc => $entry) {
      if (!is_string($rawSrc) || !is_array($entry)) {
        continue;
      }

      $src = trim($rawSrc);
      if ($src === '') {
        continue;
      }

      $targetSrc = portfolio_choose_closest_image_src($src, $lookup);
      if ($targetSrc === '') {
        continue;
      }

      if (!isset($nextMap[$targetSrc]) || !is_array($nextMap[$targetSrc])) {
        $nextMap[$targetSrc] = $entry;
        continue;
      }

      $nextMap[$targetSrc] = array_replace($nextMap[$targetSrc], $entry);
    }

    $pack['gallery']['artworkTextBySrc'] = $nextMap;
  }
  unset($pack);
}

function portfolio_sanitize_payload(array &$payload): void
{
  portfolio_sanitize_artwork_translation_maps($payload);
}

function portfolio_parse_overrides_file(string $raw): array
{
  if ($raw === '') {
    return [];
  }

  $needle = 'window.PORTFOLIO_OVERRIDES';
  $pos = strpos($raw, $needle);
  if ($pos === false) {
    return [];
  }

  $start = strpos($raw, '{', $pos);
  $end = strrpos($raw, '}');
  if ($start === false || $end === false || $end <= $start) {
    return [];
  }

  $json = substr($raw, $start, $end - $start + 1);
  if (!is_string($json) || trim($json) === '') {
    return [];
  }

  try {
    $decoded = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
  } catch (Throwable $error) {
    return [];
  }

  return is_array($decoded) ? $decoded : [];
}

function portfolio_load_overrides(): array
{
  $path = __DIR__ . '/overrides.js';
  if (!is_file($path)) {
    return [];
  }

  $raw = @file_get_contents($path);
  if (!is_string($raw)) {
    return [];
  }

  $payload = portfolio_parse_overrides_file($raw);
  portfolio_sanitize_payload($payload);

  return $payload;
}

function portfolio_build_artwork_slug_map(array $payload): array
{
  $artworks = [];
  if (isset($payload['gallery']) && is_array($payload['gallery']) && isset($payload['gallery']['artworks'])) {
    $artworks = $payload['gallery']['artworks'];
  }
  if (!is_array($artworks)) {
    return [];
  }

  $map = [];
  foreach ($artworks as $index => $artwork) {
    if (!is_array($artwork)) {
      continue;
    }

    $candidate = '';
    if (isset($artwork['slug']) && is_string($artwork['slug'])) {
      $candidate = portfolio_slugify($artwork['slug']);
    }
    if ($candidate === '') {
      $title = isset($artwork['title']) && is_string($artwork['title']) ? trim($artwork['title']) : '';
      if ($title !== '') {
        $candidate = portfolio_slugify($title);
      }
    }
    if ($candidate === '') {
      $src = isset($artwork['src']) && is_string($artwork['src']) ? trim($artwork['src']) : '';
      $filename = $src !== '' ? pathinfo($src, PATHINFO_FILENAME) : '';
      $candidate = portfolio_slugify($filename !== '' ? $filename : 'verk');
    }

    $base = $candidate;
    $suffix = 2;
    while (isset($map[$candidate])) {
      $candidate = "{$base}-{$suffix}";
      $suffix += 1;
    }

    $map[$candidate] = (int) $index;
  }

  return $map;
}

function portfolio_artwork_translation(array $payload, string $lang, string $src): array
{
  if ($lang === 'sv' || $src === '') {
    return [];
  }

  $translations = $payload['translations'] ?? null;
  if (!is_array($translations)) {
    return [];
  }

  $pack = $translations[$lang] ?? null;
  if (!is_array($pack)) {
    return [];
  }

  $gallery = $pack['gallery'] ?? null;
  if (!is_array($gallery)) {
    return [];
  }

  $map = $gallery['artworkTextBySrc'] ?? null;
  if (!is_array($map)) {
    return [];
  }

  $entry = $map[$src] ?? null;
  return is_array($entry) ? $entry : [];
}

function portfolio_category_label(array $payload, string $lang, string $category): string
{
  $category = trim(strtolower($category));
  if ($category === '') {
    return '';
  }

  if ($category === 'forest') {
    $category = 'nature';
  }

  if ($lang !== 'sv') {
    $translations = $payload['translations'] ?? null;
    if (is_array($translations) && isset($translations[$lang]) && is_array($translations[$lang])) {
      $gallery = $translations[$lang]['gallery'] ?? null;
      if (is_array($gallery) && isset($gallery['categoryLabels']) && is_array($gallery['categoryLabels'])) {
        $label = $gallery['categoryLabels'][$category] ?? '';
        if (is_string($label) && trim($label) !== '') {
          return trim($label);
        }
      }
    }

    $fallback = [
      'all' => 'All',
      'sea' => 'Seascapes',
      'forest' => 'Forest landscapes',
      'portrait' => 'Portraits',
      'city' => 'Cityscapes',
      'nature' => 'Nature',
    ];
    if (isset($fallback[$category])) {
      return $fallback[$category];
    }
  }

  $gallery = $payload['gallery'] ?? null;
  if (is_array($gallery) && isset($gallery['categoryLabels']) && is_array($gallery['categoryLabels'])) {
    $label = $gallery['categoryLabels'][$category] ?? '';
    if (is_string($label) && trim($label) !== '') {
      return trim($label);
    }
  }

  return $category;
}

function portfolio_category_labels(array $payload, string $lang, $categories, string $fallbackCategory = ''): array
{
  $rawValues = is_array($categories) ? $categories : [$categories];
  $normalized = [];

  foreach ($rawValues as $rawValue) {
    if (!is_string($rawValue)) {
      continue;
    }
    $key = trim(strtolower($rawValue));
    if ($key === '' || $key === 'all') {
      continue;
    }
    if ($key === 'forest') {
      $key = 'nature';
    }
    if (!in_array($key, $normalized, true)) {
      $normalized[] = $key;
    }
  }

  $fallback = trim(strtolower($fallbackCategory));
  if ($fallback === 'forest') {
    $fallback = 'nature';
  }
  if ($normalized === [] && $fallback !== '' && $fallback !== 'all') {
    $normalized[] = $fallback;
  }

  $labels = [];
  foreach ($normalized as $category) {
    $label = portfolio_category_label($payload, $lang, $category);
    if ($label !== '' && !in_array($label, $labels, true)) {
      $labels[] = $label;
    }
  }

  return $labels;
}

function portfolio_parse_format_cm(string $format): array
{
  $format = trim($format);
  if ($format === '') {
    return [];
  }

  if (!preg_match('/^(\\d+(?:[\\.,]\\d+)?)\\s*[x×]\\s*(\\d+(?:[\\.,]\\d+)?)\\s*cm\\b/i', $format, $m)) {
    return [];
  }

  $w = (float) str_replace(',', '.', $m[1]);
  $h = (float) str_replace(',', '.', $m[2]);
  if ($w <= 0 || $h <= 0) {
    return [];
  }

  return ['width_cm' => $w, 'height_cm' => $h];
}

function portfolio_load_private_config(): array
{
  static $config = null;
  if (is_array($config)) {
    return $config;
  }

  $path = __DIR__ . '/.db-config.php';
  if (!is_file($path)) {
    $config = [];
    return $config;
  }

  $loaded = require $path;
  $config = is_array($loaded) ? $loaded : [];
  return $config;
}

function portfolio_public_contact_config(array $payload = []): array
{
  $db = portfolio_load_private_config();
  $security = isset($db['security']) && is_array($db['security']) ? $db['security'] : [];
  $contact = isset($payload['contact']) && is_array($payload['contact']) ? $payload['contact'] : [];

  $email = isset($contact['email']) && is_string($contact['email']) ? trim($contact['email']) : '';
  $emailPublic = !array_key_exists('emailPublic', $contact) || $contact['emailPublic'] !== false;
  if (!$emailPublic || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $email = '';
  }

  $siteKey = isset($security['turnstileSiteKey']) && is_string($security['turnstileSiteKey'])
    ? trim($security['turnstileSiteKey'])
    : '';
  $secret = isset($security['turnstileSecret']) && is_string($security['turnstileSecret'])
    ? trim($security['turnstileSecret'])
    : '';

  return [
    'email' => $email,
    'emailLabel' => isset($contact['emailLabel']) && is_string($contact['emailLabel']) && trim($contact['emailLabel']) !== ''
      ? trim($contact['emailLabel'])
      : 'Skicka e-post',
    'formEnabled' => ($siteKey !== '' && $secret !== ''),
    'turnstileSiteKey' => $siteKey
  ];
}
