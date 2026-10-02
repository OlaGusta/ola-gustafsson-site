<?php
declare(strict_types=1);

$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
if (!is_string($requestPath) || $requestPath === '') {
  $requestPath = '/';
}

if ($requestPath === '/' || $requestPath === '/index.html') {
  require __DIR__ . '/index.php';
  return true;
}

if ($requestPath === '/gallery.html') {
  require __DIR__ . '/gallery.php';
  return true;
}

if ($requestPath === '/robots.txt') {
  require __DIR__ . '/robots.php';
  return true;
}

if ($requestPath === '/llms.txt') {
  require __DIR__ . '/llms.php';
  return true;
}

if ($requestPath === '/sitemap.xml') {
  require __DIR__ . '/sitemap.php';
  return true;
}

if ($requestPath === '/sitemap_index.xml') {
  header('Location: /sitemap.xml', true, 301);
  return true;
}

if (preg_match('#^/100-dagar-av-sol/?$#', $requestPath) === 1) {
  require __DIR__ . '/sol.php';
  return true;
}

if (preg_match('#^/(?:sol|solar|100-days-of-sun)/?$#', $requestPath) === 1) {
  header('Location: /100-dagar-av-sol', true, 301);
  return true;
}

if (preg_match('#^/verk/([^/]+)/?$#', $requestPath, $matches) === 1) {
  $_GET['slug'] = rawurldecode($matches[1]);
  require __DIR__ . '/artwork.php';
  return true;
}

$fullPath = __DIR__ . $requestPath;
if ($requestPath !== '/' && is_file($fullPath)) {
  return false;
}

return false;
