<?php
declare(strict_types=1);

// /llms.txt – en kort, maskinläsbar beskrivning av sajten för AI-tjänster
// (formatet från llmstxt.org). Genereras från samma innehåll som sidorna, så att
// verk, priser och vanliga frågor alltid stämmer med det som visas.
require __DIR__ . '/seo.php';
require_once __DIR__ . '/portfolio_core.php';

header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
if (seo_is_stage()) {
  header('X-Robots-Tag: noindex');
}

$payload = portfolio_load_overrides();
$baseUrl = seo_base_url();
$page = seo_page_meta('home', 'sv');
$line = static fn (string $value): string => trim((string) preg_replace('/\s+/u', ' ', strip_tags($value)));
$linkText = static fn (string $value): string => str_replace(['[', ']'], ['(', ')'], $value);

$artworks = isset($payload['gallery']['artworks']) && is_array($payload['gallery']['artworks'])
  ? $payload['gallery']['artworks']
  : [];
$slugByIndex = array_flip(portfolio_build_artwork_slug_map($payload));

$statusLabels = [
  'available' => 'Tillgänglig',
  'reserved' => 'Reserverad',
  'sold' => 'Såld',
  'nfs' => 'Ej till salu'
];
$forSalePrices = [];
$artworkLines = [];
foreach ($artworks as $index => $artwork) {
  if (!is_array($artwork) || !isset($slugByIndex[$index])) {
    continue;
  }
  $title = isset($artwork['title']) && is_string($artwork['title']) ? $line($artwork['title']) : '';
  if ($title === '') {
    continue;
  }
  $availability = isset($artwork['availability']) && is_string($artwork['availability']) ? $artwork['availability'] : '';
  $price = isset($artwork['priceLabel']) && is_string($artwork['priceLabel']) ? $line($artwork['priceLabel']) : '';
  $facts = array_filter([
    'Akvarell',
    isset($artwork['format']) && is_string($artwork['format']) ? $line($artwork['format']) : '',
    !empty($artwork['year']) ? (string) (int) $artwork['year'] : ''
  ]);
  $status = array_filter([
    $statusLabels[$availability] ?? '',
    !in_array($availability, ['sold', 'nfs'], true) && preg_match('/[0-9]/', $price) === 1 ? $price : ''
  ]);
  $text = implode(', ', $facts) . '.';
  if ($status !== []) {
    $text .= ' ' . implode(', ', $status) . '.';
  }
  if (!empty($artwork['fineArtPrint']) && seo_artwork_print_sizes($payload, $artwork, 'sv') !== []) {
    $text .= ' Finns som Fine Art Print.';
  }
  if (!in_array($availability, ['sold', 'nfs'], true)) {
    $amount = (int) preg_replace('/[^0-9]/', '', $price);
    if ($amount > 0) {
      $forSalePrices[] = $amount;
    }
  }
  $artworkLines[] = '- [' . $linkText($title) . '](' . seo_artwork_url((string) $slugByIndex[$index], 'sv') . '): ' . $text;
}

$printSizes = seo_print_sizes($payload, 'sv');
$printList = implode(', ', array_map(
  static fn (array $size): string => $line($size['format'] . ($size['price'] !== '' ? ' ' . $size['price'] : '')),
  $printSizes
));
$faqItems = seo_parse_faq_items(seo_localized_payload_array($payload, 'sv', ['about', 'faqItems']));
$publicContact = portfolio_public_contact_config($payload);
$email = isset($publicContact['email']) && is_string($publicContact['email']) ? $publicContact['email'] : '';
$formatAmount = static fn (int $amount): string => number_format($amount, 0, ',', ' ') . ' kr';

$out = [];
$out[] = '# Ola Gustafsson – svensk akvarellkonstnär';
$out[] = '';
$out[] = '> ' . $line((string) ($page['description'] ?? 'Ola Gustafsson är svensk akvarellkonstnär.'));
$out[] = '';
$out[] = 'Sajten är Ola Gustafssons egen portfolio och säljer hans originalmålningar i akvarell och signerade Fine Art Prints. Fakta nedan hämtas från samma innehåll som sidorna visar.';
$out[] = '';
$out[] = '- Konstnär: Ola Gustafsson, Stockholm. Målar landskap, natur och stadsvyer i akvarell.';
if ($forSalePrices !== []) {
  $out[] = '- Original: ' . count($forSalePrices) . ' verk till salu, ' . $formatAmount(min($forSalePrices)) . ' till ' . $formatAmount(max($forSalePrices)) . '. Säljs oinramade och signerade. Pris och tillgänglighet står på varje verks sida.';
}
$out[] = '- Fine Art Print: tryck på ' . seo_print_paper_label('sv') . ', signerade och numrerade, upplaga om ' . SEO_PRINT_EDITION_SIZE . ' exemplar per bild. Format (ramens yttermått) och pris inklusive moms: ' . $printList . '. ' . seo_print_mount_note('sv') . ' ' . seo_print_extras_note('sv');
$out[] = '- Tillägg för original: ' . seo_order_extras_note('sv');
$out[] = '- Köp: via intresseanmälan på verkets sida. Anmälan är inte bindande; konstnären svarar med totalpris och betalningsuppgifter.';
if ($email !== '') {
  $out[] = '- Kontakt: ' . $email;
}
$socialLinks = isset($payload['contact']['socialLinks']) && is_array($payload['contact']['socialLinks'])
  ? $payload['contact']['socialLinks']
  : [];
foreach ($socialLinks as $social) {
  $label = is_array($social) && isset($social['label']) && is_string($social['label']) ? $line($social['label']) : '';
  $url = is_array($social) && isset($social['url']) && is_string($social['url']) ? trim($social['url']) : '';
  if ($label !== '' && preg_match('/^https?:\/\//i', $url) === 1) {
    $out[] = '- ' . $label . ': ' . $url;
  }
}
$out[] = '- Språk: svenska. Engelsk version av varje sida med ?lang=en.';
$out[] = '';
$out[] = '## Sidor';
$out[] = '';
$out[] = '- [Startsida](' . seo_canonical_url('home', 'sv') . '): presentation, artist statement, utställningar och kontakt.';
$out[] = '- [Galleri](' . seo_canonical_url('gallery', 'sv') . '): alla målningar, filtrerbara på motiv och år.';
$out[] = '- [100 dagar av sol](' . seo_canonical_url('sun', 'sv') . '): projekt med hundra solakvareller från sommaren 2025. Varje sol kan beställas som Fine Art Print.';
if ($faqItems !== []) {
  $out[] = '- [Vanliga frågor](' . seo_canonical_url('home', 'sv') . '#faq): köp, priser, print, passepartout och frakt.';
}
if ($faqItems !== []) {
  $out[] = '';
  $out[] = '## Vanliga frågor';
  foreach ($faqItems as $item) {
    $out[] = '';
    $out[] = '### ' . $line($item['q']);
    $out[] = '';
    $out[] = $line(seo_strip_link_markup($item['a']));
  }
}
if ($artworkLines !== []) {
  $out[] = '';
  $out[] = '## Målningar';
  $out[] = '';
  array_push($out, ...$artworkLines);
}
$out[] = '';
$out[] = '## In English';
$out[] = '';
$out[] = '- [Home](' . seo_canonical_url('home', 'en') . '): Ola Gustafsson is a Swedish watercolour artist based in Stockholm, painting landscapes, nature and city views.';
$out[] = '- [Gallery](' . seo_canonical_url('gallery', 'en') . '): all paintings with size, year, availability and price in SEK.';
$out[] = '- [100 days of sun](' . seo_canonical_url('sun', 'en') . '): one hundred sun watercolours, each available as a signed fine art print in an edition of ' . SEO_PRINT_EDITION_SIZE . '.';

$out[] = '';
$out[] = '## Upphovsrätt';
$out[] = '';
$out[] = 'Bilder av målningarna och texterna tillhör Ola Gustafsson. Återanvänd dem inte utan tillstånd.';

echo implode("\n", $out) . "\n";
