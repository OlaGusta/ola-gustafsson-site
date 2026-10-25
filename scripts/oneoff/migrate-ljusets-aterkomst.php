<?php
declare(strict_types=1);

// Engångsskript (2026-10-25): flyttar utställningssidan Ljusets återkomst från
// den hårdkodade ljusets-aterkomst.php till payload.exhibitions (redigeras i
// Studio → Utställningar). Läser texterna direkt ur den gamla filen.
//
//   php scripts/oneoff/migrate-ljusets-aterkomst.php <gammal ljusets-aterkomst.php> <overrides.js>
//
// Skriver om overrides.js på plats (samma format som Studio). Avbryter om
// utställningen redan finns.

$oldFile = $argv[1] ?? '';
$overridesFile = $argv[2] ?? '';
if (!is_file($oldFile) || !is_file($overridesFile)) {
  fwrite(STDERR, "användning: migrate-ljusets-aterkomst.php <ljusets-aterkomst.php> <overrides.js>\n");
  exit(1);
}
require dirname(__DIR__, 2) . '/portfolio_core.php';

$source = (string) file_get_contents($oldFile);
// Bilddata ($images) och texterna ($essay, $jarvaLink, $sections, $works) ur den gamla filen.
$cut = static function (string $from, string $to) use ($source): string {
  $start = strpos($source, $from);
  $end = strpos($source, $to, $start === false ? 0 : $start);
  if ($start === false || $end === false) {
    fwrite(STDERR, "hittade inte $from\n");
    exit(1);
  }
  return substr($source, $start, $end - $start);
};
$imagesCode = $cut('$images = [', '$h = static fn');
$textCode = $cut('$essay = $en ? [', '$personId = ');

$extract = static function (bool $en) use ($imagesCode, $textCode): array {
  eval($imagesCode);
  eval($textCode);
  return [$images, $essay, $sections, $works];
};

// <a href="URL" ...>text</a> -> [text](URL)
$toMarkdown = static function (string $html): string {
  return (string) preg_replace('#<a href="([^"]+)"[^>]*>(.*?)</a>#', '[$2]($1)', $html);
};
$src = static fn (string $id): string => 'images/ljusets-aterkomst/' . $id . '.jpg';

$build = static function (bool $en) use ($extract, $toMarkdown, $src): array {
  [$images, $essay, $sections, $works] = $extract($en);
  $alt = static fn (string $id): string => $images[$id][$en ? 1 : 0];
  $cap = static fn (string $id): string => $images[$id][$en ? 3 : 2];

  $blocks = [];
  $pending = [];
  $flush = static function () use (&$pending, &$blocks): void {
    if ($pending !== []) {
      $blocks[] = ['type' => 'text', 'heading' => '', 'body' => implode("\n\n", $pending)];
      $pending = [];
    }
  };
  foreach ($essay as $item) {
    if (is_array($item)) {
      $flush();
      $blocks[] = ['type' => 'image', 'image' => $src($item[0]), 'alt' => $alt($item[0]), 'caption' => $cap($item[0])];
    } else {
      $pending[] = $toMarkdown($item);
    }
  }
  $flush();
  foreach ($sections as $section) {
    [$heading, $paragraphs] = $section;
    $blocks[] = ['type' => 'text', 'heading' => $heading, 'body' => implode("\n\n", array_map($toMarkdown, $paragraphs))];
    foreach (array_slice($section, 2) as $group) {
      if (count($group) === 2) {
        $blocks[] = [
          'type' => 'pair',
          'image' => $src($group[0]), 'alt' => $alt($group[0]), 'caption' => $cap($group[0]),
          'image2' => $src($group[1]), 'alt2' => $alt($group[1]), 'caption2' => $cap($group[1]),
        ];
      } else {
        $blocks[] = ['type' => 'image', 'image' => $src($group[0]), 'alt' => $alt($group[0]), 'caption' => $cap($group[0])];
      }
    }
  }
  return [
    'title' => $en ? 'The Return of Light' : 'Ljusets återkomst',
    'altTitle' => $en ? 'Ljusets återkomst' : 'The Return of Light',
    'eyebrow' => $en ? 'Exhibition · October 2026' : 'Utställning · Oktober 2026',
    'meta' => $en ? 'Husby konsthall · 3–25 October 2026 · with Jenny Övrebö' : 'Husby konsthall · 3–25 oktober 2026 · tillsammans med Jenny Övrebö',
    'description' => $en
      ? 'The Return of Light (Ljusets återkomst), an exhibition of watercolors by Ola Gustafsson and Jenny Övrebö at Husby konsthall, 3–25 October 2026: 100 Days of Sun and ten large watercolors of the sun in water.'
      : 'Ljusets återkomst, en utställning med akvareller av Ola Gustafsson och Jenny Övrebö i Husby konsthall 3–25 oktober 2026: 100 dagar av sol och tio stora akvareller med solen i vatten.',
    'heroAlt' => $alt('00-utstallningen'),
    'heroCaption' => $cap('00-utstallningen'),
    'worksHeading' => $en ? 'The works' : 'Verken',
    'worksNote' => $en ? 'Watercolor on paper, height × width.' : 'Akvarell på papper, höjd × bredd.',
    'worksText' => implode("\n", array_map(static fn (array $w): string => $w[0] . ' | ' . $w[1], $works)),
    'ctaEyebrow' => 'Fine Art Print',
    'ctaHeading' => $en ? 'The suns are still here' : 'Solarna finns kvar',
    'ctaText' => $en ? 'All hundred suns from 100 Days of Sun are available as signed Fine Art Prints.' : 'Alla hundra solar från 100 dagar av sol finns som signerad Fine Art Print.',
    'ctaLinkLabel' => $en ? 'See all 100 suns' : 'Se alla 100 solar',
    'ctaImageAlt' => $alt('15-solvaggen'),
    'blocks' => $blocks,
  ];
};

$sv = $build(false);
$en = $build(true);
if (count($sv['blocks']) !== count($en['blocks'])) {
  fwrite(STDERR, "olika antal block på svenska och engelska\n");
  exit(1);
}

$base = $sv + [
  'slug' => 'ljusets-aterkomst',
  'enabled' => true,
  'startDate' => '2026-10-03',
  'endDate' => '2026-10-25',
  'venue' => 'Husby konsthall',
  'city' => 'Stockholm',
  'artists' => 'Jenny Övrebö',
  'heroImage' => $src('00-utstallningen'),
  'ogImage' => 'images/ljusets-aterkomst/og.jpg',
  'ctaEnabled' => true,
  'ctaImage' => $src('15-solvaggen'),
  'ctaHref' => '100-dagar-av-sol',
  'ctaPoster' => true,
];
$base = ['slug' => $base['slug'], 'enabled' => true] + $base;

// Engelska: bara textfälten, blocken på samma plats.
$enPack = [];
foreach ($en as $key => $value) {
  if ($key !== 'blocks') {
    $enPack[$key] = $value;
  }
}
$enPack['blocks'] = array_map(static function (array $block): array {
  return array_intersect_key($block, array_flip(['heading', 'body', 'alt', 'caption', 'alt2', 'caption2']));
}, $en['blocks']);

$payload = portfolio_parse_overrides_file((string) file_get_contents($overridesFile));
if ($payload === [] || !isset($payload['gallery']['artworks'])) {
  fwrite(STDERR, "overrides.js ser inte giltig ut\n");
  exit(1);
}
foreach ($payload['exhibitions'] ?? [] as $existing) {
  if (is_array($existing) && ($existing['slug'] ?? '') === 'ljusets-aterkomst') {
    fwrite(STDERR, "ljusets-aterkomst finns redan i innehållet – avbryter\n");
    exit(1);
  }
}
$payload['exhibitions'] = array_values(array_merge($payload['exhibitions'] ?? [], [$base]));
$payload['translations']['en']['exhibitions'] = array_values(array_merge($payload['translations']['en']['exhibitions'] ?? [], [$enPack]));
portfolio_sanitize_payload($payload);
$js = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
file_put_contents($overridesFile, "// Live overrides för hela sajten.\n// Auto-genererad av Studio API.\nwindow.PORTFOLIO_OVERRIDES = {$js};\n");
echo 'ok: ' . count($base['blocks']) . " block\n";
