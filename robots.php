<?php
declare(strict_types=1);

require __DIR__ . '/seo.php';

header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');

$baseUrl = seo_base_url();

if (seo_is_stage()) {
  echo "User-agent: facebookexternalhit\n";
  echo "Allow: /\n";
  echo "\n";
  echo "User-agent: Facebot\n";
  echo "Allow: /\n";
  echo "\n";
  echo "User-agent: Twitterbot\n";
  echo "Allow: /\n";
  echo "\n";
  echo "User-agent: LinkedInBot\n";
  echo "Allow: /\n";
  echo "\n";
  echo "User-agent: *\n";
  echo "Disallow: /\n";
  echo "\n";
  echo "Sitemap: {$baseUrl}/sitemap.xml\n";
  exit;
}

echo "User-agent: *\n";
echo "Allow: /\n";
echo "Disallow: /studio.html\n";
echo "Disallow: /api/\n";
echo "\n";
echo "Sitemap: {$baseUrl}/sitemap.xml\n";
