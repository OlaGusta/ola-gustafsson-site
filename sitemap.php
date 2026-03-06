<?php
declare(strict_types=1);

require __DIR__ . '/seo.php';
require_once __DIR__ . '/portfolio_core.php';

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');

$overridesMtime = @filemtime(__DIR__ . '/overrides.js');
$contentMtime = @filemtime(__DIR__ . '/content.js');
$lastMod = max((int) $overridesMtime, (int) $contentMtime, (int) @filemtime(__FILE__));
$lastModIso = gmdate('c', $lastMod > 0 ? $lastMod : time());

$pages = [
  ['type' => 'home', 'priority' => '1.0', 'changefreq' => 'weekly'],
  ['type' => 'gallery', 'priority' => '0.9', 'changefreq' => 'weekly']
];

$payload = portfolio_load_overrides();
$artworkSlugMap = portfolio_build_artwork_slug_map($payload);
asort($artworkSlugMap);

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
echo "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n";

foreach ($pages as $page) {
  $type = (string) ($page['type'] ?? 'home');
  $sv = seo_canonical_url($type, 'sv');
  $en = seo_canonical_url($type, 'en');
  $priority = (string) ($page['priority'] ?? '0.8');
  $changefreq = (string) ($page['changefreq'] ?? 'weekly');

  echo "  <url>\n";
  echo "    <loc>" . htmlspecialchars($sv, ENT_QUOTES) . "</loc>\n";
  echo "    <xhtml:link rel=\"alternate\" hreflang=\"sv\" href=\"" . htmlspecialchars($sv, ENT_QUOTES) . "\" />\n";
  echo "    <xhtml:link rel=\"alternate\" hreflang=\"en\" href=\"" . htmlspecialchars($en, ENT_QUOTES) . "\" />\n";
  echo "    <xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"" . htmlspecialchars($sv, ENT_QUOTES) . "\" />\n";
  echo "    <lastmod>{$lastModIso}</lastmod>\n";
  echo "    <changefreq>{$changefreq}</changefreq>\n";
  echo "    <priority>{$priority}</priority>\n";
  echo "  </url>\n";
}

foreach ($artworkSlugMap as $slug => $index) {
  $sv = seo_artwork_url((string) $slug, 'sv');
  $en = seo_artwork_url((string) $slug, 'en');

  echo "  <url>\n";
  echo "    <loc>" . htmlspecialchars($sv, ENT_QUOTES) . "</loc>\n";
  echo "    <xhtml:link rel=\"alternate\" hreflang=\"sv\" href=\"" . htmlspecialchars($sv, ENT_QUOTES) . "\" />\n";
  echo "    <xhtml:link rel=\"alternate\" hreflang=\"en\" href=\"" . htmlspecialchars($en, ENT_QUOTES) . "\" />\n";
  echo "    <xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"" . htmlspecialchars($sv, ENT_QUOTES) . "\" />\n";
  echo "    <lastmod>{$lastModIso}</lastmod>\n";
  echo "    <changefreq>monthly</changefreq>\n";
  echo "    <priority>0.7</priority>\n";
  echo "  </url>\n";
}

echo "</urlset>\n";
