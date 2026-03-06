<?php
declare(strict_types=1);

// Shared helpers for SEO-aware PHP templates (sitemap + artwork pages).

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

  return portfolio_parse_overrides_file($raw);
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
  $category = trim($category);
  if ($category === '') {
    return '';
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

function portfolio_parse_format_cm(string $format): array
{
  $format = trim($format);
  if ($format === '') {
    return [];
  }

  if (!preg_match('/^(\\d+(?:[\\.,]\\d+)?)\\s*x\\s*(\\d+(?:[\\.,]\\d+)?)\\s*cm\\b/i', $format, $m)) {
    return [];
  }

  $w = (float) str_replace(',', '.', $m[1]);
  $h = (float) str_replace(',', '.', $m[2]);
  if ($w <= 0 || $h <= 0) {
    return [];
  }

  return ['width_cm' => $w, 'height_cm' => $h];
}
