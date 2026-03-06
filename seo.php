<?php
declare(strict_types=1);

require_once __DIR__ . '/portfolio_core.php';

function seo_normalize_lang(?string $lang): string
{
  $lang = strtolower(trim((string) $lang));
  return $lang === 'en' ? 'en' : 'sv';
}

function seo_host(): string
{
  return (string) ($_SERVER['HTTP_HOST'] ?? 'localhost');
}

function seo_is_stage(): bool
{
  $host = seo_host();
  return preg_match('/^stage\\./i', $host) === 1;
}

function seo_base_url(): string
{
  // The site enforces HTTPS via .htaccess, so canonicalize to https://.
  return 'https://' . seo_host();
}

function seo_lang_locale(string $lang): string
{
  return $lang === 'en' ? 'en-US' : 'sv-SE';
}

function seo_lang_og_locale(string $lang): string
{
  return $lang === 'en' ? 'en_US' : 'sv_SE';
}

function seo_text(string $lang): array
{
  $lang = seo_normalize_lang($lang);
  if ($lang === 'en') {
    return [
      'site_name' => 'Ola Gustafsson Watercolor Gallery',
      'home_title' => 'Ola Gustafsson | Watercolor Gallery',
      'home_description' =>
        'Online gallery for Ola Gustafsson: watercolor paintings focused on light, mood, nature, and Nordic landscapes.',
      'gallery_title' => 'Gallery | Ola Gustafsson Watercolor Gallery',
      'gallery_description' => "Complete gallery of Ola Gustafsson's watercolor paintings.",
      'og_image' => '/images/ola-02.jpg',
      'og_image_alt' => 'Watercolor painting by Ola Gustafsson',
      'robots_live' => 'index,follow',
      'robots_stage' => 'noindex,nofollow',
    ];
  }

  return [
    'site_name' => 'Ola Gustafsson Akvarellgalleri',
    'home_title' => 'Ola Gustafsson | Akvarellkonstnär',
    'home_description' =>
      'Ola Gustafsson är akvarellkonstnär. Online-galleri med akvarellmålningar i nordiskt ljus: landskap, natur och stadsvyer.',
    'gallery_title' => 'Galleri | Ola Gustafsson Akvarellkonstnär',
    'gallery_description' => 'Hela galleriet med akvarellmålningar av akvarellkonstnären Ola Gustafsson.',
    'og_image' => '/images/ola-02.jpg',
    'og_image_alt' => 'Akvarellmålning av Ola Gustafsson',
    'robots_live' => 'index,follow',
    'robots_stage' => 'noindex,nofollow',
  ];
}

function seo_overrides_payload(): array
{
  static $payload = null;
  if (is_array($payload)) {
    return $payload;
  }

  if (function_exists('portfolio_load_overrides')) {
    $loaded = portfolio_load_overrides();
    $payload = is_array($loaded) ? $loaded : [];
    return $payload;
  }

  $payload = [];
  return $payload;
}

function seo_array_get_path(array $data, array $path)
{
  $cursor = $data;
  foreach ($path as $segment) {
    if (!is_array($cursor) || !array_key_exists($segment, $cursor)) {
      return null;
    }
    $cursor = $cursor[$segment];
  }
  return $cursor;
}

function seo_localized_payload_string(array $payload, string $lang, array $path): string
{
  if ($lang !== 'sv') {
    $translatedPath = array_merge(['translations', $lang], $path);
    $translated = seo_array_get_path($payload, $translatedPath);
    if (is_string($translated) && trim($translated) !== '') {
      return trim($translated);
    }
  }

  $base = seo_array_get_path($payload, $path);
  if (is_string($base) && trim($base) !== '') {
    return trim($base);
  }

  return '';
}

function seo_normalize_image_value(string $value): string
{
  $value = trim($value);
  if ($value === '') {
    return '';
  }
  if (preg_match('/^https?:\\/\\//i', $value) === 1) {
    return $value;
  }
  if (preg_match('/^(data:|blob:)/i', $value) === 1) {
    return '';
  }
  return '/' . ltrim($value, '/');
}

function seo_strip_query_fragment(string $value): string
{
  $value = trim($value);
  if ($value === '') {
    return '';
  }
  $parts = preg_split('/[?#]/', $value, 2);
  return is_array($parts) && isset($parts[0]) ? trim((string) $parts[0]) : $value;
}

function seo_local_file_path_from_web_path(string $webPath): string
{
  $normalized = '/' . ltrim(seo_strip_query_fragment($webPath), '/');
  if ($normalized === '/') {
    return '';
  }
  return dirname(__FILE__) . $normalized;
}

function seo_choose_share_image(
  string $imageValue,
  string $fallbackPath = '/images/ola-portrait.jpg',
  bool $preferThumb = false
): string
{
  $normalized = seo_normalize_image_value($imageValue);
  if ($normalized === '') {
    $normalized = seo_normalize_image_value($fallbackPath);
  }
  if ($normalized === '') {
    return '/images/ola-portrait.jpg';
  }

  // Keep externally hosted images unchanged.
  if (preg_match('/^https?:\\/\\//i', $normalized) === 1) {
    return $normalized;
  }

  $webPath = '/' . ltrim(seo_strip_query_fragment($normalized), '/');
  $filePath = seo_local_file_path_from_web_path($webPath);

  $candidateThumb = '';
  if (preg_match('#^/images/#i', $webPath) === 1 && preg_match('#^/images/thumbs/#i', $webPath) !== 1) {
    $baseName = basename($webPath);
    $candidateThumb = '/images/thumbs/' . $baseName;
    $candidateThumbPath = seo_local_file_path_from_web_path($candidateThumb);
    if ($preferThumb && is_file($candidateThumbPath)) {
      return $candidateThumb;
    }
  }

  // If chosen image is very large, use a safe fallback for social crawlers.
  if ($filePath !== '' && is_file($filePath)) {
    $size = @filesize($filePath);
    if (is_int($size) && $size > 7_500_000) {
      if ($candidateThumb !== '') {
        $candidateThumbPath = seo_local_file_path_from_web_path($candidateThumb);
        if (is_file($candidateThumbPath)) {
          return $candidateThumb;
        }
      }
      return '/images/ola-portrait.jpg';
    }
    return $webPath;
  }

  return seo_normalize_image_value($fallbackPath) ?: '/images/ola-portrait.jpg';
}

function seo_choose_feed_share_image(string $imageValue, string $fallbackPath = '/images/ola-02.jpg'): string
{
  $primary = seo_choose_share_image($imageValue, $fallbackPath, false);

  // Keep externally hosted images unchanged.
  if (preg_match('/^https?:\\/\\//i', $primary) === 1) {
    return $primary;
  }

  $pickIfLandscape = static function (string $path): string {
    $meta = seo_local_image_meta($path);
    if (!isset($meta['width'], $meta['height'])) {
      return '';
    }
    $width = (int) $meta['width'];
    $height = (int) $meta['height'];
    if ($width <= 0 || $height <= 0) {
      return '';
    }
    $ratio = $width / $height;
    if ($ratio >= 1.2 && $width >= 600) {
      return $path;
    }
    return '';
  };

  $normalizedPrimary = '/' . ltrim(seo_strip_query_fragment($primary), '/');
  // Prefer the optimized thumb variant for social crawlers when available.
  if (preg_match('#^/images/#i', $normalizedPrimary) === 1 && preg_match('#^/images/thumbs/#i', $normalizedPrimary) !== 1) {
    $thumbPath = '/images/thumbs/' . basename($normalizedPrimary);
    $landscapeThumb = $pickIfLandscape($thumbPath);
    if ($landscapeThumb !== '') {
      return $landscapeThumb;
    }
  }

  $landscapePrimary = $pickIfLandscape($normalizedPrimary);
  if ($landscapePrimary !== '') {
    return $landscapePrimary;
  }

  $fallbackCandidates = [
    '/images/thumbs/ola-02.jpg',
    '/images/ola-02.jpg',
    '/images/thumbs/ola-12.jpg',
    '/images/ola-12.jpg',
    '/images/ola-portrait.jpg'
  ];
  foreach ($fallbackCandidates as $candidate) {
    $landscapeCandidate = $pickIfLandscape($candidate);
    if ($landscapeCandidate !== '') {
      return $landscapeCandidate;
    }
  }

  return $normalizedPrimary;
}

function seo_page_meta(string $pageType, string $lang): array
{
  $lang = seo_normalize_lang($lang);
  $t = seo_text($lang);
  $payload = seo_overrides_payload();

  $pageType = strtolower(trim($pageType));
  $meta = [];
  if ($pageType === 'gallery') {
    $meta = [
      'title' => $t['gallery_title'],
      'description' => $t['gallery_description'],
      'og_image' => $t['og_image'],
      'og_image_alt' => $t['og_image_alt'],
    ];
  } else {
    $meta = [
      'title' => $t['home_title'],
      'description' => $t['home_description'],
      'og_image' => $t['og_image'],
      'og_image_alt' => $t['og_image_alt'],
    ];
  }

  if (!is_array($payload) || $payload === []) {
    return $meta;
  }

  if ($pageType === 'home') {
    $siteTitle = seo_localized_payload_string($payload, $lang, ['site', 'title']);
    if ($siteTitle !== '') {
      $meta['title'] = $siteTitle;
    }
    $siteDescription = seo_localized_payload_string($payload, $lang, ['site', 'metaDescription']);
    if ($siteDescription !== '') {
      $meta['description'] = $siteDescription;
    }

    $seoTitle = seo_localized_payload_string($payload, $lang, ['seo', 'home', 'title']);
    if ($seoTitle !== '') {
      $meta['title'] = $seoTitle;
    }
    $seoDescription = seo_localized_payload_string($payload, $lang, ['seo', 'home', 'description']);
    if ($seoDescription !== '') {
      $meta['description'] = $seoDescription;
    }

    $seoImage = seo_localized_payload_string($payload, $lang, ['seo', 'home', 'image']);
    if ($seoImage === '') {
      $seoImage = seo_localized_payload_string($payload, $lang, ['hero', 'image']);
    }
    $normalizedImage = $seoImage !== '' ? seo_normalize_image_value($seoImage) : '';
    if ($normalizedImage !== '') {
      $meta['og_image'] = $normalizedImage;
    }

    $seoImageAlt = seo_localized_payload_string($payload, $lang, ['seo', 'home', 'imageAlt']);
    if ($seoImageAlt === '') {
      $seoImageAlt = seo_localized_payload_string($payload, $lang, ['hero', 'imageAlt']);
    }
    if ($seoImageAlt !== '') {
      $meta['og_image_alt'] = $seoImageAlt;
    }
  }

  if ($pageType === 'gallery') {
    $seoTitle = seo_localized_payload_string($payload, $lang, ['seo', 'gallery', 'title']);
    $seoDescription = seo_localized_payload_string($payload, $lang, ['seo', 'gallery', 'description']);
    $seoImage = seo_localized_payload_string($payload, $lang, ['seo', 'gallery', 'image']);
    $seoImageAlt = seo_localized_payload_string($payload, $lang, ['seo', 'gallery', 'imageAlt']);

    if ($seoTitle !== '') {
      $meta['title'] = $seoTitle;
    }
    if ($seoDescription !== '') {
      $meta['description'] = $seoDescription;
    }
    if ($seoImage !== '') {
      $normalizedImage = seo_normalize_image_value($seoImage);
      if ($normalizedImage !== '') {
        $meta['og_image'] = $normalizedImage;
      }
    }
    if ($seoImageAlt !== '') {
      $meta['og_image_alt'] = $seoImageAlt;
    }
  }

  $rawOgImage = isset($meta['og_image']) && is_string($meta['og_image']) && trim($meta['og_image']) !== ''
    ? $meta['og_image']
    : $t['og_image'];
  if ($pageType === 'home' || $pageType === 'gallery') {
    $meta['og_image'] = seo_choose_feed_share_image($rawOgImage, '/images/ola-02.jpg');
  } else {
    $meta['og_image'] = seo_choose_share_image($rawOgImage, '/images/ola-02.jpg', false);
  }

  return $meta;
}

function seo_canonical_url(string $pageType, string $lang): string
{
  $base = seo_base_url();
  $lang = seo_normalize_lang($lang);

  $path = '/';
  if (strtolower(trim($pageType)) === 'gallery') {
    $path = '/gallery.html';
  }

  // Keep Swedish/default canonical URLs clean (no lang query) for better social share consistency.
  if ($lang === 'sv') {
    return $base . $path;
  }

  return $base . $path . '?lang=' . rawurlencode($lang);
}

function seo_artwork_url(string $slug, string $lang): string
{
  $base = seo_base_url();
  $lang = seo_normalize_lang($lang);
  $slug = trim($slug);
  $slug = $slug !== '' ? $slug : 'verk';

  $url = $base . '/verk/' . rawurlencode($slug);
  if ($lang === 'sv') {
    return $url;
  }
  return $url . '?lang=' . rawurlencode($lang);
}

function seo_local_image_meta(string $path): array
{
  $path = '/' . ltrim(seo_strip_query_fragment(trim($path)), '/');
  if ($path === '/') {
    return [];
  }

  $filePath = dirname(__FILE__) . $path;
  if (!is_file($filePath)) {
    return [];
  }

  $size = @getimagesize($filePath);
  if (!is_array($size)) {
    return [];
  }

  $width = isset($size[0]) ? (int) $size[0] : 0;
  $height = isset($size[1]) ? (int) $size[1] : 0;
  $mime = isset($size['mime']) && is_string($size['mime']) ? $size['mime'] : '';

  if ($width <= 0 || $height <= 0) {
    return [];
  }

  return [
    'width' => $width,
    'height' => $height,
    'mime' => $mime,
  ];
}
