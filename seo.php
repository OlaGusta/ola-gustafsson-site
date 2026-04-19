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

function seo_google_font_family_query(string $fontKey): string
{
  switch (strtolower(trim($fontKey))) {
    case 'fraunces':
      return 'family=Fraunces:opsz,wght@9..144,300..800';
    case 'playfair':
      return 'family=Playfair+Display:wght@400;500;600;700';
    case 'cormorant':
      return 'family=Cormorant+Garamond:wght@400;500;600;700';
    case 'jakarta':
      return 'family=Plus+Jakarta+Sans:wght@400;500;600;700';
    case 'sourcesans':
      return 'family=Source+Sans+3:wght@400;500;600;700';
    case 'lora':
      return 'family=Lora:wght@400;500;600;700';
    default:
      return '';
  }
}

function seo_google_fonts_href(array $payload): string
{
  $displayKey = seo_array_get_path($payload, ['theme', 'fontDisplay']);
  $bodyKey = seo_array_get_path($payload, ['theme', 'fontBody']);
  $displayKey = is_string($displayKey) && trim($displayKey) !== '' ? $displayKey : 'fraunces';
  $bodyKey = is_string($bodyKey) && trim($bodyKey) !== '' ? $bodyKey : 'jakarta';
  $queries = [];

  foreach ([$displayKey, $bodyKey] as $fontKey) {
    $query = seo_google_font_family_query($fontKey);
    if ($query !== '') {
      $queries[$query] = true;
    }
  }

  if ($queries === []) {
    return '';
  }

  return 'https://fonts.googleapis.com/css2?' . implode('&', array_keys($queries)) . '&display=optional';
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

function seo_localized_payload_array(array $payload, string $lang, array $path): array
{
  if ($lang !== 'sv') {
    $translatedPath = array_merge(['translations', $lang], $path);
    $translated = seo_array_get_path($payload, $translatedPath);
    if (is_array($translated) && $translated !== []) {
      return $translated;
    }
  }

  $base = seo_array_get_path($payload, $path);
  return is_array($base) ? $base : [];
}

function seo_escape_html(string $value): string
{
  return htmlspecialchars($value, ENT_QUOTES);
}

function seo_image_dimensions(string $imageValue): array
{
  $normalized = seo_normalize_image_value($imageValue);
  if ($normalized === '' || preg_match('/^https?:\/\//i', $normalized) === 1) {
    return [];
  }

  $filePath = seo_local_file_path_from_web_path($normalized);
  if ($filePath === '' || !is_file($filePath)) {
    return [];
  }

  $meta = @getimagesize($filePath);
  if (!is_array($meta)) {
    return [];
  }

  $width = isset($meta[0]) ? (int) $meta[0] : 0;
  $height = isset($meta[1]) ? (int) $meta[1] : 0;
  if ($width <= 0 || $height <= 0) {
    return [];
  }

  return [
    'width' => $width,
    'height' => $height,
  ];
}

function seo_base_image_source(string $imageValue): string
{
  $normalized = seo_normalize_image_value($imageValue);
  if ($normalized === '' || preg_match('/^https?:\/\//i', $normalized) === 1) {
    return $normalized;
  }

  if (preg_match('#^/images/thumbs/([^/]+)$#i', $normalized, $matches) === 1) {
    return '/images/' . $matches[1];
  }

  if (preg_match('#^/images/web/(.+)-hero(\.[^/.]+)$#i', $normalized, $matches) === 1) {
    return '/images/' . $matches[1] . $matches[2];
  }

  if (preg_match('#^/images/web/([^/]+)$#i', $normalized, $matches) === 1) {
    return '/images/' . $matches[1];
  }

  return $normalized;
}

function seo_local_variant_exists(string $imageValue): bool
{
  $normalized = seo_normalize_image_value($imageValue);
  if ($normalized === '' || preg_match('/^https?:\/\//i', $normalized) === 1) {
    return false;
  }

  $filePath = seo_local_file_path_from_web_path($normalized);
  return $filePath !== '' && is_file($filePath);
}

function seo_named_image_variant_src(string $src, string $variant): string
{
  $trimmed = trim($src);
  $variantName = trim($variant);
  if ($trimmed === '' || $variantName === '') {
    return '';
  }

  if (
    preg_match('/^(data:|blob:)/i', $trimmed) === 1 ||
    preg_match('/^https?:\/\//i', $trimmed) === 1 ||
    preg_match('#^images/#', $trimmed) !== 1
  ) {
    return $trimmed;
  }

  $base = ltrim(seo_base_image_source($trimmed), '/');
  $fileName = basename($base);
  if ($fileName === '') {
    return $trimmed;
  }

  if ($variantName === 'hero') {
    $pathInfo = pathinfo($fileName);
    $name = isset($pathInfo['filename']) ? trim((string) $pathInfo['filename']) : '';
    $extension = isset($pathInfo['extension']) ? trim((string) $pathInfo['extension']) : '';
    if ($name === '' || $extension === '') {
      return $trimmed;
    }

    return 'images/web/' . $name . '-hero.' . $extension;
  }

  return 'images/' . trim($variantName, '/') . '/' . $fileName;
}

function seo_preferred_hero_image_src(string $src): string
{
  $hero = seo_named_image_variant_src($src, 'hero');
  if ($hero !== '' && seo_local_variant_exists($hero)) {
    return $hero;
  }

  $web = seo_image_variant_src($src, false);
  if ($web !== '' && seo_local_variant_exists($web)) {
    return $web;
  }

  $thumb = seo_image_variant_src($src, true);
  if ($thumb !== '' && seo_local_variant_exists($thumb)) {
    return $thumb;
  }

  return trim($src);
}

function seo_responsive_image_sources(string $imageValue): array
{
  $normalized = seo_base_image_source($imageValue);
  if ($normalized === '' || preg_match('/^https?:\/\//i', $normalized) === 1) {
    return [];
  }

  $sources = [];
  $variantBase = ltrim($normalized, '/');
  $thumb = seo_image_variant_src($variantBase, true);
  $hero = seo_named_image_variant_src($variantBase, 'hero');
  $web = seo_image_variant_src($variantBase, false);

  foreach ([$thumb, $hero, $web] as $candidate) {
    $candidate = seo_normalize_image_value($candidate);
    if ($candidate === '' || isset($sources[$candidate])) {
      continue;
    }
    if (!seo_local_variant_exists($candidate)) {
      continue;
    }

    $dimensions = seo_image_dimensions($candidate);
    $width = isset($dimensions['width']) ? (int) $dimensions['width'] : 0;
    $height = isset($dimensions['height']) ? (int) $dimensions['height'] : 0;
    if ($width <= 0 || $height <= 0) {
      continue;
    }
    $sources[$candidate] = [
      'src' => $candidate,
      'width' => $width,
      'height' => $height,
    ];
  }

  return array_values($sources);
}

function seo_render_multiline_html(string $value): string
{
  $trimmed = trim($value);
  if ($trimmed === '') {
    return '';
  }

  return nl2br(seo_escape_html($trimmed), false);
}

function seo_render_linkified_html(string $value): string
{
  $input = trim($value);
  if ($input === '') {
    return '';
  }

  $pattern = '/\[([^\]]+)\]\s*\((https?:\/\/[^\s)]+)\)/';
  $offset = 0;
  $output = '';

  if (preg_match_all($pattern, $input, $matches, PREG_OFFSET_CAPTURE) !== false) {
    foreach ($matches[0] as $index => $fullMatch) {
      [$matchedText, $matchOffset] = $fullMatch;
      $matchOffset = (int) $matchOffset;
      if ($matchOffset > $offset) {
        $output .= seo_escape_html(substr($input, $offset, $matchOffset - $offset));
      }

      $label = isset($matches[1][$index][0]) ? trim((string) $matches[1][$index][0]) : '';
      $href = isset($matches[2][$index][0]) ? trim((string) $matches[2][$index][0]) : '';
      $safeHref = '';
      if ($href !== '') {
        $validated = filter_var($href, FILTER_VALIDATE_URL);
        if (is_string($validated) && preg_match('/^https?:\/\//i', $validated) === 1) {
          $safeHref = $validated;
        }
      }

      if ($label !== '' && $safeHref !== '') {
        $output .= '<a href="' . seo_escape_html($safeHref) . '" target="_blank" rel="noopener noreferrer">'
          . seo_escape_html($label)
          . '</a>';
      } else {
        $output .= seo_escape_html($matchedText);
      }

      $offset = $matchOffset + strlen($matchedText);
    }
  }

  if ($offset < strlen($input)) {
    $output .= seo_escape_html(substr($input, $offset));
  }

  return $output;
}

function seo_image_variant_src(string $src, bool $preferThumb = false): string
{
  $trimmed = trim($src);
  if ($trimmed === '') {
    return '';
  }

  if (
    preg_match('/^(data:|blob:)/i', $trimmed) === 1 ||
    preg_match('/^https?:\/\//i', $trimmed) === 1 ||
    preg_match('#^images/#', $trimmed) !== 1
  ) {
    return $trimmed;
  }

  return seo_named_image_variant_src($trimmed, $preferThumb ? 'thumbs' : 'web');
}

function seo_normalize_artwork_category(string $value): string
{
  $normalized = strtolower(trim($value));
  if ($normalized === '' || $normalized === 'all') {
    return 'nature';
  }
  return $normalized === 'forest' ? 'nature' : $normalized;
}

function seo_normalize_artwork_availability(?string $value): string
{
  $normalized = strtolower(trim((string) $value));
  return in_array($normalized, ['available', 'reserved', 'sold', 'nfs'], true) ? $normalized : '';
}

function seo_artwork_availability_meta(string $lang, string $key): array
{
  $key = seo_normalize_artwork_availability($key);
  if ($key === '') {
    return ['label' => '', 'tone' => 'default'];
  }

  $labels = $lang === 'en'
    ? [
        'available' => 'Available',
        'reserved' => 'Reserved',
        'sold' => 'Sold',
        'nfs' => 'Not for sale',
      ]
    : [
        'available' => 'Tillgänglig',
        'reserved' => 'Reserverad',
        'sold' => 'Såld',
        'nfs' => 'Ej till salu',
      ];

  return [
    'label' => $labels[$key] ?? '',
    'tone' => $key,
  ];
}

function seo_normalize_string_list(array $value): array
{
  $output = [];
  foreach ($value as $entry) {
    if (!is_string($entry)) {
      continue;
    }
    $trimmed = trim($entry);
    if ($trimmed !== '') {
      $output[] = $trimmed;
    }
  }
  return $output;
}

function seo_localized_image_entries(array $payload, string $lang, array $path): array
{
  $baseEntries = seo_localized_payload_array($payload, 'sv', $path);
  if ($baseEntries === []) {
    return [];
  }

  $output = [];
  $localizedAltBySrc = [];
  if ($lang !== 'sv') {
    $translatedEntries = seo_localized_payload_array($payload, $lang, $path);
    foreach ($translatedEntries as $entry) {
      if (!is_array($entry)) {
        continue;
      }
      $src = isset($entry['src']) && is_string($entry['src']) ? trim($entry['src']) : '';
      $alt = isset($entry['alt']) && is_string($entry['alt']) ? trim($entry['alt']) : '';
      if ($src !== '' && $alt !== '') {
        $localizedAltBySrc[$src] = $alt;
      }
    }
  }

  foreach ($baseEntries as $entry) {
    if (!is_array($entry)) {
      continue;
    }
    $src = isset($entry['src']) && is_string($entry['src']) ? trim($entry['src']) : '';
    if ($src === '') {
      continue;
    }
    $alt = isset($entry['alt']) && is_string($entry['alt']) ? trim($entry['alt']) : '';
    if (isset($localizedAltBySrc[$src])) {
      $alt = $localizedAltBySrc[$src];
    }
    $output[] = ['src' => $src, 'alt' => $alt];
  }

  return $output;
}

function seo_gallery_items(array $payload, string $lang): array
{
  $gallery = isset($payload['gallery']) && is_array($payload['gallery']) ? $payload['gallery'] : [];
  $artworks = isset($gallery['artworks']) && is_array($gallery['artworks']) ? $gallery['artworks'] : [];
  $items = [];

  foreach ($artworks as $index => $item) {
    if (!is_array($item)) {
      continue;
    }

    $src = isset($item['src']) && is_string($item['src']) ? trim($item['src']) : '';
    if ($src === '') {
      continue;
    }

    $textOverride = portfolio_artwork_translation($payload, $lang, $src);
    $title = isset($textOverride['title']) && is_string($textOverride['title']) && trim($textOverride['title']) !== ''
      ? trim($textOverride['title'])
      : (isset($item['title']) && is_string($item['title']) ? trim($item['title']) : '');
    if ($title === '') {
      $title = $lang === 'en' ? 'Artwork' : 'Verk';
    }

    $rawSlug = isset($item['slug']) && is_string($item['slug']) ? trim($item['slug']) : '';
    $slug = $rawSlug !== '' ? portfolio_slugify($rawSlug) : portfolio_slugify($title);
    if ($slug === '') {
      $slug = portfolio_slugify(pathinfo($src, PATHINFO_FILENAME));
    }

    $format = isset($textOverride['format']) && is_string($textOverride['format']) && trim($textOverride['format']) !== ''
      ? trim($textOverride['format'])
      : (isset($item['format']) && is_string($item['format']) ? trim($item['format']) : '');
    $alt = isset($textOverride['alt']) && is_string($textOverride['alt']) && trim($textOverride['alt']) !== ''
      ? trim($textOverride['alt'])
      : (isset($item['alt']) && is_string($item['alt']) ? trim($item['alt']) : $title);
    $priceLabel = isset($textOverride['priceLabel']) && is_string($textOverride['priceLabel']) && trim($textOverride['priceLabel']) !== ''
      ? trim($textOverride['priceLabel'])
      : (isset($item['priceLabel']) && is_string($item['priceLabel']) ? trim($item['priceLabel']) : '');
    $categoryKey = seo_normalize_artwork_category(isset($item['category']) && is_string($item['category']) ? $item['category'] : '');
    $categoryLabel = portfolio_category_label($payload, $lang, $categoryKey);
    $availabilityKey = seo_normalize_artwork_availability(isset($item['availability']) && is_string($item['availability']) ? $item['availability'] : '');
    $availabilityMeta = seo_artwork_availability_meta($lang, $availabilityKey);
    if ($priceLabel !== '' && $availabilityMeta['label'] !== '' && $priceLabel === $availabilityMeta['label']) {
      $priceLabel = '';
    }

    $year = isset($item['year']) && is_numeric($item['year']) ? (int) $item['year'] : 0;
    $order = isset($item['order']) && is_numeric($item['order']) ? (int) $item['order'] : ($index + 1);
    $metaParts = [];
    if ($format !== '') {
      $metaParts[] = $format;
    }
    if ($categoryLabel !== '') {
      $metaParts[] = $categoryLabel;
    }
    if ($year > 0) {
      $metaParts[] = (string) $year;
    }

    $items[] = [
      'slug' => $slug,
      'href' => seo_artwork_url($slug, $lang),
      'src' => seo_image_variant_src($src, true),
      'title' => $title,
      'alt' => $alt,
      'meta_line' => implode(' · ', $metaParts),
      'price_label' => $priceLabel,
      'price_prefix' => $lang === 'en' ? 'Price:' : 'Pris:',
      'featured' => !empty($item['featured']),
      'order' => $order,
      'year' => $year,
      'availability_label' => $availabilityMeta['label'],
      'availability_tone' => $availabilityMeta['tone'],
    ];
  }

  usort(
    $items,
    static function (array $a, array $b): int {
      return ($a['order'] <=> $b['order']);
    }
  );

  return $items;
}

function seo_home_gallery_items(array $payload, string $lang): array
{
  $items = seo_gallery_items($payload, $lang);
  $featured = array_values(array_filter($items, static fn(array $item): bool => $item['featured'] === true));
  if ($featured !== []) {
    return $featured;
  }

  return array_slice($items, 0, 6);
}

function seo_sorted_gallery_page_items(array $payload, string $lang): array
{
  $items = seo_gallery_items($payload, $lang);
  usort(
    $items,
    static function (array $a, array $b): int {
      $yearDiff = ($b['year'] <=> $a['year']);
      if ($yearDiff !== 0) {
        return $yearDiff;
      }
      $orderDiff = ($a['order'] <=> $b['order']);
      if ($orderDiff !== 0) {
        return $orderDiff;
      }
      return strcmp($a['title'], $b['title']);
    }
  );

  return $items;
}

function seo_render_gallery_card_html(array $item, int $index = 0, string $pageType = 'gallery'): string
{
  $title = seo_escape_html((string) ($item['title'] ?? ''));
  $href = seo_escape_html((string) ($item['href'] ?? '#'));
  $src = seo_escape_html((string) ($item['src'] ?? ''));
  $alt = seo_escape_html((string) ($item['alt'] ?? ''));
  $metaLine = seo_escape_html((string) ($item['meta_line'] ?? ''));
  $priceLabel = seo_escape_html((string) ($item['price_label'] ?? ''));
  $pricePrefix = seo_escape_html((string) ($item['price_prefix'] ?? ''));
  $availabilityLabel = seo_escape_html((string) ($item['availability_label'] ?? ''));
  $availabilityTone = preg_replace('/[^a-z-]/', '', (string) ($item['availability_tone'] ?? 'default')) ?: 'default';
  $pageType = strtolower(trim($pageType));
  $eagerLimit = $pageType === 'home' ? 0 : 2;
  $loading = $index < $eagerLimit ? 'eager' : 'lazy';
  $fetchPriority = $pageType !== 'home' && $index === 0 ? 'high' : 'auto';

  $badgeHtml = $availabilityLabel !== ''
    ? '<span class="artwork-status-badge is-' . seo_escape_html($availabilityTone) . '">' . $availabilityLabel . '</span>'
    : '';
  $metaHtml = $metaLine !== ''
    ? '<p>' . $metaLine . '</p>'
    : '';
  $priceHtml = $priceLabel !== ''
    ? '<p class="work-price">' . ($pricePrefix !== '' ? $pricePrefix . ' ' : '') . $priceLabel . '</p>'
    : '';

  return '<a class="work-card" href="' . $href . '">'
    . '<figure class="work-image">'
    . '<img class="artwork-photo" src="' . $src . '" alt="' . $alt . '" loading="' . $loading . '" fetchpriority="' . $fetchPriority . '" decoding="async" />'
    . $badgeHtml
    . '</figure>'
    . '<div class="work-meta">'
    . '<h3>' . $title . '</h3>'
    . $metaHtml
    . $priceHtml
    . '</div>'
    . '</a>';
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
