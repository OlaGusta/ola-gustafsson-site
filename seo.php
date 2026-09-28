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
      return 'family=Fraunces:ital,opsz,wght@0,9..144,300..800;1,9..144,300..800';
    case 'playfair':
      return 'family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800';
    case 'cormorant':
      return 'family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700';
    case 'jakarta':
      return 'family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800';
    case 'plexmono':
      return 'family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700';
    case 'sourcesans':
      return 'family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800';
    case 'lora':
      return 'family=Lora:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700';
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

function seo_render_inline_formatted_html(string $value): string
{
  $input = trim($value);
  if ($input === '') {
    return '';
  }

  $pattern = '/<(i|em|n|normal)>([\s\S]*?)<\/\1>/i';
  $offset = 0;
  $output = '';

  if (preg_match_all($pattern, $input, $matches, PREG_OFFSET_CAPTURE) !== false) {
    foreach ($matches[0] as $index => $fullMatch) {
      [$matchedText, $matchOffset] = $fullMatch;
      $matchOffset = (int) $matchOffset;
      if ($matchOffset > $offset) {
        $output .= seo_escape_html(substr($input, $offset, $matchOffset - $offset));
      }

      $tagName = strtolower((string) ($matches[1][$index][0] ?? ''));
      $innerText = (string) ($matches[2][$index][0] ?? '');
      $safeInnerText = seo_escape_html($innerText);
      if ($tagName === 'em') {
        $output .= '<em class="inline-italic">' . $safeInnerText . '</em>';
      } elseif ($tagName === 'i') {
        $output .= '<i class="inline-italic">' . $safeInnerText . '</i>';
      } elseif ($tagName === 'n' || $tagName === 'normal') {
        $output .= '<span class="inline-normal">' . $safeInnerText . '</span>';
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

function seo_render_linkified_html(string $value): string
{
  $input = trim($value);
  if ($input === '') {
    return '';
  }

  $pattern = '/\[([^\]]+)\]\s*\((https?:\/\/[^\s)]+)\)(\{nofollow\})?/i';
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
      $nofollow = isset($matches[3][$index][0]) && $matches[3][$index][0] !== '';
      $safeHref = '';
      if ($href !== '') {
        $validated = filter_var($href, FILTER_VALIDATE_URL);
        if (is_string($validated) && preg_match('/^https?:\/\//i', $validated) === 1) {
          $safeHref = $validated;
        }
      }

      if ($label !== '' && $safeHref !== '') {
        $rel = 'noopener noreferrer' . ($nofollow ? ' nofollow' : '');
        $output .= '<a href="' . seo_escape_html($safeHref) . '" target="_blank" rel="' . seo_escape_html($rel) . '">'
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
      // Designbeslut 2026-09-28: priset står utan "Pris:" och i nedtonad stil.
      'price_prefix' => '',
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

function seo_gallery_year_key(array $item): string
{
  $year = isset($item['year']) && is_numeric($item['year']) ? (int) $item['year'] : 0;
  return $year > 0 ? (string) $year : 'undated';
}

function seo_gallery_year_counts(array $items): array
{
  $counts = [];
  foreach ($items as $item) {
    if (!is_array($item)) {
      continue;
    }
    $yearKey = seo_gallery_year_key($item);
    $counts[$yearKey] = ($counts[$yearKey] ?? 0) + 1;
  }

  return $counts;
}

function seo_render_gallery_year_divider_html(string $yearKey, int $count, string $lang): string
{
  $yearLabel = preg_match('/^\d{3,4}$/', $yearKey) === 1
    ? $yearKey
    : ($lang === 'en' ? 'Undated' : 'Utan år');
  if ($lang === 'en') {
    $countLabel = $count === 1 ? '1 work' : $count . ' works';
  } else {
    $countLabel = $count === 1 ? '1 verk' : $count . ' verk';
  }

  return '<div class="gallery-year-divider" data-gallery-year="' . seo_escape_html($yearKey) . '">'
    . '<h2 class="gallery-year-label">' . seo_escape_html($yearLabel) . '</h2>'
    . '<span class="gallery-year-count">' . seo_escape_html($countLabel) . '</span>'
    . '</div>';
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

  // Bildens proportion (bredd/höjd) styr kortets bredd i de justerade raderna
  // (styles.css, "Justerade rader"). Läses från den lokala miniatyrfilen.
  $aspect = seo_local_image_aspect((string) ($item['src'] ?? ''));
  $styleAttr = $aspect > 0 ? ' style="--ar: ' . number_format($aspect, 4, '.', '') . '"' : '';

  return '<a class="work-card" href="' . $href . '"' . $styleAttr . '>'
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
  } elseif (strtolower(trim($pageType)) === 'sun') {
    $path = '/100-dagar-av-sol';
  }

  // Keep Swedish/default canonical URLs clean (no lang query) for better social share consistency.
  if ($lang === 'sv') {
    return $base . $path;
  }

  return $base . $path . '?lang=' . rawurlencode($lang);
}

function seo_request_has_explicit_sv_lang(): bool
{
  $queryString = isset($_SERVER['QUERY_STRING']) && is_string($_SERVER['QUERY_STRING'])
    ? $_SERVER['QUERY_STRING']
    : '';
  if ($queryString === '') {
    return false;
  }

  parse_str($queryString, $params);
  $lang = isset($params['lang']) && is_string($params['lang']) ? $params['lang'] : null;
  return $lang !== null && seo_normalize_lang($lang) === 'sv';
}

function seo_redirect_explicit_sv_lang_to(string $canonicalUrl): void
{
  if ($canonicalUrl === '' || !seo_request_has_explicit_sv_lang()) {
    return;
  }

  header('Location: ' . $canonicalUrl, true, 301);
  exit;
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

// Fine Art Print: Olas regel är högst 20 signerade och numrerade ex per motiv.
const SEO_PRINT_EDITION_SIZE = 20;

function seo_print_edition_label(string $lang): string
{
  return $lang === 'en'
    ? sprintf('Signed and numbered by the artist, edition of %d', SEO_PRINT_EDITION_SIZE)
    : sprintf('Signerad och numrerad av konstnären, upplaga om %d ex', SEO_PRINT_EDITION_SIZE);
}

// Tryckpapper för alla prints (Olas val sep 2026).
function seo_print_paper_label(string $lang): string
{
  return 'Hahnemühle Photo Rag';
}

// Tilläggskostnader som ska synas vid varje beställning/intresseanmälan (original och print).
function seo_order_extras_note(string $lang): string
{
  return $lang === 'en'
    ? 'Mat with backing board is added (from 300 SEK depending on size), as is shipping (within Sweden usually 150–250 SEK).'
    : 'Passepartout med bakstycke tillkommer (från 300 kr beroende på format), liksom frakt (inom Sverige normalt 150–250 kr).';
}

// Printprislista per format. Gäller alla Fine Art Prints (solar och galleriverk).
// Redigeras i Studio (Projekt → "Printprislista"); lagras som project.printSizes.
// Standardstegen (beslut 2026-09-28): 50×70 = 3 800 kr, övriga skalade med
// yta^0,70 (samma kurva som originalprislistan), avrundat till hundratal.
// Formatet = RAMENS yttermått (passepartoutens yttermått). 40×50 ersattes av 40×60
// 2026-09-28: 40×50 är för brett för solarnas förhållande (se seo_print_image_size).
function seo_print_sizes(array $payload, string $lang): array
{
  $raw = $payload['project']['printSizes'] ?? null;
  $sizes = [];
  if (is_array($raw)) {
    foreach ($raw as $row) {
      $format = is_array($row) && isset($row['format']) && is_string($row['format']) ? trim($row['format']) : '';
      $price = is_array($row) && isset($row['price']) && is_string($row['price']) ? trim($row['price']) : '';
      if ($format !== '') {
        $sizes[] = ['format' => $format, 'price' => $price];
      }
    }
  }
  if ($sizes === []) {
    $sizes = [
      ['format' => '30 × 40 cm', 'price' => '1 800 kr'],
      ['format' => '40 × 60 cm', 'price' => '2 900 kr'],
      ['format' => '50 × 70 cm', 'price' => '3 800 kr'],
    ];
  }
  if ($lang === 'en') {
    foreach ($sizes as &$size) {
      $size['price'] = (string) preg_replace('/\s*kr\s*$/u', ' SEK', $size['price']);
    }
    unset($size);
  }
  return $sizes;
}

function seo_print_from_label(array $sizes, string $lang): string
{
  $first = $sizes[0]['price'] ?? '';
  if ($first === '') {
    return $lang === 'en' ? 'price on request' : 'pris på förfrågan';
  }
  return ($lang === 'en' ? 'from ' : 'från ') . $first;
}

// Proportion (bredd/höjd) för en lokal bild, t.ex. "images/thumbs/x.webp?v=1".
// 0 om filen saknas eller inte går att läsa. Cachas per anrop.
function seo_local_image_aspect(string $src): float
{
  static $cache = [];
  $path = (string) preg_replace('/[?#].*$/', '', trim($src));
  if ($path === '' || preg_match('/^(https?:|data:|blob:)/i', $path) === 1) {
    return 0.0;
  }
  if (array_key_exists($path, $cache)) {
    return $cache[$path];
  }
  $file = __DIR__ . '/' . ltrim($path, '/');
  $size = is_file($file) ? @getimagesize($file) : false;
  $aspect = is_array($size) && $size[0] > 0 && $size[1] > 0 ? $size[0] / $size[1] : 0.0;
  return $cache[$path] = $aspect;
}

// "För ram 30 × 40 cm" – formaten i prislistan är ramens/passepartoutens yttermått.
function seo_print_frame_label(string $format, string $lang): string
{
  return ($lang === 'en' ? 'For frame ' : 'För ram ') . $format;
}

// "För ram 30 × 40 – 50 × 70 cm" för hela listan (verkssidan).
function seo_print_frame_range_label(array $sizes, string $lang): string
{
  if ($sizes === []) {
    return '';
  }
  $first = (string) preg_replace('/\s*cm$/u', '', $sizes[0]['format']);
  $last = (string) $sizes[count($sizes) - 1]['format'];
  $range = count($sizes) > 1 ? $first . ' – ' . $last : $last;
  return ($lang === 'en' ? 'For frame ' : 'För ram ') . $range;
}

// Ungefärligt bildmått för ett grafiskt blad i en given ram, t.ex. "ca 15 × 23 cm".
// Regler (lathunden): passepartouten visar bilden + 0,8 cm papper upptill/på sidorna
// och 1,5 cm nedtill (upplaga/signatur); arket har 2 cm marginal; lika kant upptill
// och på sidorna med 1–1,5 cm bredare nederkant om det ger kanter på 5–10 cm, annars
// fast sidkant och överskottet vertikalt. Tomt om ramen inte passar förhållandet.
// Standardförhållande = solarnas bildruta 14,5 × 22,5 (målad yta 14,2 × 22,2 på arket
// 18 × 26 med 1,9 cm marginal, plus ~1,5 mm papper runt om). Printarna räknas på rutan.
function seo_print_image_size(string $format, string $lang, float $ratio = 14.5 / 22.5): string
{
  if (preg_match('/(\d+(?:[.,]\d+)?)\s*[×x]\s*(\d+(?:[.,]\d+)?)/u', $format, $m) !== 1) {
    return '';
  }
  $fw = (float) str_replace(',', '.', $m[1]);
  $fh = (float) str_replace(',', '.', $m[2]);
  if ($fw > $fh) {
    [$fw, $fh] = [$fh, $fw];
  }
  $reveal = 0.8;
  $revealBottom = 1.5;
  $bottomExtra = $fh <= 40 ? 1.0 : ($fh <= 60 ? 1.2 : 1.5);
  $equal = ($fw - 2 * $reveal - $ratio * ($fh - $bottomExtra - $reveal - $revealBottom)) / (2 * (1 - $ratio));
  if ($equal >= 5 && $equal <= 10) {
    $imageW = $fw - 2 * $equal - 2 * $reveal;
  } else {
    $side = $fw >= 40 ? 6.5 : 5.5;
    $imageW = $fw - 2 * $side - 2 * $reveal;
    $top = ($fh - ($imageW / $ratio + $reveal + $revealBottom) - $bottomExtra) / 2;
    if ($top < 4) {
      return '';
    }
  }
  $imageH = $imageW / $ratio;
  if ($imageW <= 0) {
    return '';
  }
  return sprintf('%s %d × %d cm', $lang === 'en' ? 'approx.' : 'ca', (int) round($imageW), (int) round($imageH));
}
