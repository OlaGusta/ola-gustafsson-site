<?php
declare(strict_types=1);

// Utställningssidor (payload.exhibitions), redigeras i Studio → Utställningar.
// Struktur och bilder ligger i grundinnehållet; texten per språk i
// translations.<lang>.exhibitions på samma plats i listan (block på samma plats
// inom utställningen). Kräver seo.php.

// Utställningar som fick en egen adress innan sidorna blev allmänna.
const SEO_EXHIBITION_LEGACY_PATHS = ['ljusets-aterkomst' => '/ljusets-aterkomst'];

// Textfälten i en utställning respektive ett block (sparas per språk).
const SEO_EXHIBITION_TEXT_KEYS = [
  'title', 'altTitle', 'eyebrow', 'meta', 'description', 'heroAlt', 'heroCaption',
  'worksHeading', 'worksNote', 'worksText', 'ctaEyebrow', 'ctaHeading', 'ctaText', 'ctaLinkLabel', 'ctaImageAlt',
];
const SEO_EXHIBITION_BLOCK_TEXT_KEYS = ['heading', 'body', 'alt', 'caption', 'alt2', 'caption2'];

function seo_exhibition_slug_valid(string $slug): bool
{
  return preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug) === 1;
}

function seo_exhibition_path(string $slug): string
{
  return SEO_EXHIBITION_LEGACY_PATHS[$slug] ?? '/utstallning/' . $slug;
}

function seo_exhibition_url(string $slug, string $lang): string
{
  $url = seo_base_url() . seo_exhibition_path($slug);
  return seo_normalize_lang($lang) === 'sv' ? $url : $url . '?lang=' . rawurlencode(seo_normalize_lang($lang));
}

// Alla utställningar med giltig adress: [index => grundposten].
function seo_exhibitions(array $payload): array
{
  $list = isset($payload['exhibitions']) && is_array($payload['exhibitions']) ? array_values($payload['exhibitions']) : [];
  $out = [];
  foreach ($list as $index => $exhibition) {
    if (!is_array($exhibition)) {
      continue;
    }
    $slug = isset($exhibition['slug']) && is_string($exhibition['slug']) ? trim($exhibition['slug']) : '';
    if (!seo_exhibition_slug_valid($slug)) {
      continue;
    }
    $exhibition['slug'] = $slug;
    $out[$index] = $exhibition;
  }
  return $out;
}

// En utställning med texten för språket (tomt fält faller tillbaka på svenskan).
function seo_exhibition_localized(array $payload, int $index, array $base, string $lang): array
{
  $localized = $lang !== 'sv' ? seo_array_get_path($payload, ['translations', $lang, 'exhibitions', $index]) : null;
  $localized = is_array($localized) ? $localized : [];
  $text = static function (array $source, array $override, string $key): string {
    $value = isset($override[$key]) && is_string($override[$key]) ? trim($override[$key]) : '';
    if ($value !== '') {
      return $value;
    }
    return isset($source[$key]) && is_string($source[$key]) ? trim($source[$key]) : '';
  };

  $out = $base;
  foreach (SEO_EXHIBITION_TEXT_KEYS as $key) {
    $out[$key] = $text($base, $localized, $key);
  }
  $blocks = isset($base['blocks']) && is_array($base['blocks']) ? array_values($base['blocks']) : [];
  $localizedBlocks = isset($localized['blocks']) && is_array($localized['blocks']) ? array_values($localized['blocks']) : [];
  $out['blocks'] = [];
  foreach ($blocks as $blockIndex => $block) {
    if (!is_array($block)) {
      continue;
    }
    $blockLocalized = isset($localizedBlocks[$blockIndex]) && is_array($localizedBlocks[$blockIndex]) ? $localizedBlocks[$blockIndex] : [];
    foreach (SEO_EXHIBITION_BLOCK_TEXT_KEYS as $key) {
      $block[$key] = $text($block, $blockLocalized, $key);
    }
    $out['blocks'][] = $block;
  }
  return $out;
}

function seo_exhibition_find(array $payload, string $slug, string $lang): ?array
{
  foreach (seo_exhibitions($payload) as $index => $exhibition) {
    if ($exhibition['slug'] === $slug) {
      return seo_exhibition_localized($payload, (int) $index, $exhibition, $lang);
    }
  }
  return null;
}

// Löptext: <i>/<em> för titlar och [text](https://…) för länkar, allt annat escapat.
// Länkar till den egna sajten öppnas i samma flik.
function seo_exhibition_inline_html(string $value): string
{
  $output = '';
  $parts = preg_split('/(\[[^\]]+\]\s*\(https?:\/\/[^\s)]+\))/i', $value, -1, PREG_SPLIT_DELIM_CAPTURE) ?: [];
  foreach ($parts as $part) {
    if (preg_match('/^\[([^\]]+)\]\s*\((https?:\/\/[^\s)]+)\)$/i', $part, $m) === 1) {
      $href = filter_var($m[2], FILTER_VALIDATE_URL);
      if (is_string($href)) {
        $host = strtolower((string) parse_url($href, PHP_URL_HOST));
        $internal = preg_match('/(^|\.)olagustafsson\.com$/', $host) === 1;
        $output .= '<a href="' . seo_escape_html($href) . '"' . ($internal ? '' : ' target="_blank" rel="noopener"') . '>'
          . seo_exhibition_emphasis_html($m[1]) . '</a>';
        continue;
      }
    }
    $output .= seo_exhibition_emphasis_html($part);
  }
  return $output;
}

function seo_exhibition_emphasis_html(string $value): string
{
  $output = '';
  $offset = 0;
  if (preg_match_all('/<(i|em)>([\s\S]*?)<\/\1>/i', $value, $matches, PREG_OFFSET_CAPTURE) !== false) {
    foreach ($matches[0] as $index => [$full, $position]) {
      $output .= seo_escape_html(substr($value, $offset, $position - $offset));
      $output .= '<em>' . seo_escape_html((string) $matches[2][$index][0]) . '</em>';
      $offset = $position + strlen($full);
    }
  }
  return $output . seo_escape_html(substr($value, $offset));
}

// Stycken skiljs av tomrad; enkel radbrytning blir <br>.
function seo_exhibition_paragraphs_html(string $body): string
{
  $html = '';
  foreach (preg_split('/\R\s*\R/', trim($body)) ?: [] as $paragraph) {
    $paragraph = trim($paragraph);
    if ($paragraph === '') {
      continue;
    }
    $lines = array_map('seo_exhibition_inline_html', preg_split('/\R/', $paragraph) ?: []);
    $html .= '<p>' . implode('<br />', $lines) . '</p>';
  }
  return $html;
}

// Bildkälla, mått och miniatyr. Bilder i en egen undermapp (images/<mapp>/) har
// thumb/ och manifest.json bredvid sig; Studio-uppladdade bilder i images/ har
// images/web/ och images/thumbs/.
function seo_exhibition_image(string $src): ?array
{
  $src = trim($src);
  if ($src === '' || preg_match('#^images/[A-Za-z0-9._/-]+$#', $src) !== 1 || str_contains($src, '..')) {
    return null;
  }
  $root = __DIR__ . '/';
  $display = $src;
  $thumb = '';
  if (preg_match('#^images/([^/]+)/([^/]+)$#', $src, $m) === 1 && !in_array($m[1], ['web', 'thumbs'], true)) {
    if (is_file($root . 'images/' . $m[1] . '/thumb/' . $m[2])) {
      $thumb = 'images/' . $m[1] . '/thumb/' . $m[2];
    }
  } else {
    $web = seo_image_variant_src($src, false);
    if ($web !== $src && is_file($root . strtok($web, '?'))) {
      $display = strtok($web, '?');
    }
    $small = seo_image_variant_src($src, true);
    if ($small !== $src && is_file($root . strtok($small, '?'))) {
      $thumb = strtok($small, '?');
    }
  }
  $size = is_file($root . $display) ? @getimagesize($root . $display) : false;
  if (!is_array($size)) {
    return null;
  }
  $thumbSize = $thumb !== '' ? @getimagesize($root . $thumb) : false;
  return [
    'src' => $display,
    'width' => (int) $size[0],
    'height' => (int) $size[1],
    'thumb' => is_array($thumbSize) ? $thumb : '',
    'thumbWidth' => is_array($thumbSize) ? (int) $thumbSize[0] : 0,
  ];
}

// <figure> för en bild. $layout: wide (hela containern), prose (textspalten),
// pair (halva). Stående bilder i textspalten blir smalare.
function seo_exhibition_figure_html(string $src, string $alt, string $caption, string $layout = 'prose', bool $eager = false, ?float $ratio = null): string
{
  $image = seo_exhibition_image($src);
  if ($image === null) {
    return '';
  }
  $sizes = [
    'wide' => '(max-width: 1220px) 100vw, 1160px',
    'prose' => '(max-width: 760px) 100vw, 704px',
    'pair' => '(max-width: 760px) 100vw, 570px',
    'portrait' => '(max-width: 600px) 100vw, 512px',
  ];
  $portrait = $layout === 'prose' && $image['height'] > $image['width'];
  if ($portrait) {
    $layout = 'portrait';
  }
  $srcset = $image['thumb'] !== ''
    ? ' srcset="' . seo_escape_html($image['thumb']) . ' ' . $image['thumbWidth'] . 'w, ' . seo_escape_html($image['src']) . ' ' . $image['width'] . 'w" sizes="' . $sizes[$layout] . '"'
    : '';
  $style = $ratio !== null ? ' style="aspect-ratio: ' . number_format($ratio, 4, '.', '') . '; object-fit: cover;"' : '';
  $loading = $eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"';
  return '<figure class="exhibition-figure' . ($portrait ? ' exhibition-figure--portrait' : '') . '">'
    . '<img src="' . seo_escape_html($image['src']) . '"' . $srcset . $style
    . ' width="' . $image['width'] . '" height="' . $image['height'] . '"'
    . ' alt="' . seo_escape_html($alt) . '"' . $loading . ' decoding="async" />'
    . ($caption !== '' ? '<figcaption>' . seo_exhibition_inline_html($caption) . '</figcaption>' : '')
    . '</figure>';
}

// Ett bildpar beskärs till den smalaste bildens proportion så att båda blir lika höga.
function seo_exhibition_pair_ratio(string $a, string $b): ?float
{
  $ratios = [];
  foreach ([$a, $b] as $src) {
    $image = seo_exhibition_image($src);
    if ($image !== null && $image['height'] > 0) {
      $ratios[] = $image['width'] / $image['height'];
    }
  }
  return count($ratios) === 2 ? min($ratios) : null;
}

// Verklistan: en rad per verk, "Titel | mått".
function seo_exhibition_works(string $worksText): array
{
  $works = [];
  foreach (preg_split('/\R/', $worksText) ?: [] as $line) {
    $line = trim($line);
    if ($line === '') {
      continue;
    }
    [$title, $size] = array_pad(array_map('trim', explode('|', $line, 2)), 2, '');
    if ($title !== '') {
      $works[] = [$title, $size];
    }
  }
  return $works;
}
