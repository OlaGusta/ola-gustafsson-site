<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

api_require_method('GET');
api_require_authenticated_user();

$imagesDir = dirname(__DIR__) . '/images';
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
$images = [];

if (is_dir($imagesDir)) {
  try {
    $iterator = new DirectoryIterator($imagesDir);
    foreach ($iterator as $entry) {
      if (!$entry->isFile() || $entry->isDot()) {
        continue;
      }

      $filename = $entry->getFilename();
      if (strpos($filename, '.') === 0) {
        continue;
      }

      $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
      if (!in_array($extension, $allowedExtensions, true)) {
        continue;
      }

      $images[] = 'images/' . $filename;
    }
  } catch (Throwable $error) {
    api_respond_json(500, [
      'ok' => false,
      'error' => 'image_scan_failed',
      'message' => 'Kunde inte läsa bildmappen.'
    ]);
  }
}

natcasesort($images);

api_respond_json(200, [
  'ok' => true,
  'images' => array_values($images)
]);

