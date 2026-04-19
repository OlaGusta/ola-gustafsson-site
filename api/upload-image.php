<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

api_require_method('POST');
api_require_authenticated_user();

if (!isset($_FILES['image']) || !is_array($_FILES['image'])) {
  api_respond_json(400, [
    'ok' => false,
    'error' => 'image_missing',
    'message' => 'Ingen bildfil skickades.'
  ]);
}

$upload = $_FILES['image'];
$errorCode = isset($upload['error']) ? (int) $upload['error'] : UPLOAD_ERR_NO_FILE;
if ($errorCode !== UPLOAD_ERR_OK) {
  $messages = [
    UPLOAD_ERR_INI_SIZE => 'Bilden är för stor för serverns uppladdningsgräns.',
    UPLOAD_ERR_FORM_SIZE => 'Bilden är för stor.',
    UPLOAD_ERR_PARTIAL => 'Uppladdningen avbröts. Försök igen.',
    UPLOAD_ERR_NO_FILE => 'Ingen bildfil valdes.',
    UPLOAD_ERR_NO_TMP_DIR => 'Servern saknar temporär katalog för uppladdning.',
    UPLOAD_ERR_CANT_WRITE => 'Servern kunde inte skriva filen.',
    UPLOAD_ERR_EXTENSION => 'Uppladdningen stoppades av servern.'
  ];
  $message = $messages[$errorCode] ?? 'Okänt uppladdningsfel.';
  api_respond_json(400, [
    'ok' => false,
    'error' => 'upload_failed',
    'message' => $message
  ]);
}

$tmpPath = isset($upload['tmp_name']) && is_string($upload['tmp_name']) ? $upload['tmp_name'] : '';
if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
  api_respond_json(400, [
    'ok' => false,
    'error' => 'invalid_upload',
    'message' => 'Ogiltig uppladdning.'
  ]);
}

$size = isset($upload['size']) ? (int) $upload['size'] : 0;
$maxBytes = 15 * 1024 * 1024;
if ($size <= 0 || $size > $maxBytes) {
  api_respond_json(400, [
    'ok' => false,
    'error' => 'file_too_large',
    'message' => 'Bilden måste vara mellan 1 byte och 15 MB.'
  ]);
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = (string) $finfo->file($tmpPath);
$mimeToExt = [
  'image/jpeg' => 'jpg',
  'image/png' => 'png',
  'image/webp' => 'webp',
  'image/gif' => 'gif',
  'image/avif' => 'avif'
];

function upload_copy_variant(string $sourcePath, string $targetPath): bool
{
  if (!@copy($sourcePath, $targetPath)) {
    return false;
  }

  @chmod($targetPath, 0644);
  return true;
}

function upload_create_gd_image(string $sourcePath, string $mimeType)
{
  switch ($mimeType) {
    case 'image/jpeg':
      return function_exists('imagecreatefromjpeg') ? @imagecreatefromjpeg($sourcePath) : false;
    case 'image/png':
      return function_exists('imagecreatefrompng') ? @imagecreatefrompng($sourcePath) : false;
    case 'image/webp':
      return function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($sourcePath) : false;
    case 'image/gif':
      return function_exists('imagecreatefromgif') ? @imagecreatefromgif($sourcePath) : false;
    case 'image/avif':
      return function_exists('imagecreatefromavif') ? @imagecreatefromavif($sourcePath) : false;
    default:
      return false;
  }
}

function upload_write_gd_image($image, string $targetPath, string $mimeType, int $quality): bool
{
  switch ($mimeType) {
    case 'image/jpeg':
      return function_exists('imagejpeg') ? @imagejpeg($image, $targetPath, max(45, min(92, $quality))) : false;
    case 'image/png':
      if (!function_exists('imagepng')) {
        return false;
      }
      $compression = max(0, min(9, 9 - (int) round(($quality / 100) * 9)));
      return @imagepng($image, $targetPath, $compression);
    case 'image/webp':
      return function_exists('imagewebp') ? @imagewebp($image, $targetPath, max(45, min(92, $quality))) : false;
    case 'image/gif':
      return function_exists('imagegif') ? @imagegif($image, $targetPath) : false;
    default:
      return false;
  }
}

function upload_render_webp_variant(string $sourcePath, string $targetPath, string $mimeType, int $maxEdge, int $quality): bool
{
  if (!function_exists('imagewebp')) {
    return false;
  }

  $imageInfo = @getimagesize($sourcePath);
  if (!is_array($imageInfo) || empty($imageInfo[0]) || empty($imageInfo[1])) {
    return false;
  }

  $sourceWidth = (int) $imageInfo[0];
  $sourceHeight = (int) $imageInfo[1];
  if ($sourceWidth <= 0 || $sourceHeight <= 0) {
    return false;
  }

  $sourceImage = upload_create_gd_image($sourcePath, $mimeType);
  if (!$sourceImage) {
    return false;
  }

  $scale = min($maxEdge / max($sourceWidth, $sourceHeight), 1);
  $targetWidth = max(1, (int) round($sourceWidth * $scale));
  $targetHeight = max(1, (int) round($sourceHeight * $scale));
  $targetImage = function_exists('imagecreatetruecolor') ? @imagecreatetruecolor($targetWidth, $targetHeight) : false;

  if (!$targetImage) {
    imagedestroy($sourceImage);
    return false;
  }

  imagealphablending($targetImage, false);
  imagesavealpha($targetImage, true);
  $transparent = imagecolorallocatealpha($targetImage, 0, 0, 0, 127);
  imagefill($targetImage, 0, 0, $transparent);

  $resampled = @imagecopyresampled(
    $targetImage,
    $sourceImage,
    0,
    0,
    0,
    0,
    $targetWidth,
    $targetHeight,
    $sourceWidth,
    $sourceHeight
  );

  imagedestroy($sourceImage);
  if ($resampled !== true) {
    imagedestroy($targetImage);
    return false;
  }

  $written = @imagewebp($targetImage, $targetPath, max(45, min(92, $quality)));
  imagedestroy($targetImage);
  if ($written !== true) {
    return false;
  }

  @chmod($targetPath, 0644);
  return true;
}

function upload_resize_variant(string $sourcePath, string $targetPath, string $mimeType, int $maxEdge, int $quality): bool
{
  $imageInfo = @getimagesize($sourcePath);
  if (!is_array($imageInfo) || empty($imageInfo[0]) || empty($imageInfo[1])) {
    return upload_copy_variant($sourcePath, $targetPath);
  }

  $sourceWidth = (int) $imageInfo[0];
  $sourceHeight = (int) $imageInfo[1];
  if ($sourceWidth <= 0 || $sourceHeight <= 0) {
    return upload_copy_variant($sourcePath, $targetPath);
  }

  if (max($sourceWidth, $sourceHeight) <= $maxEdge) {
    return upload_copy_variant($sourcePath, $targetPath);
  }

  $sourceImage = upload_create_gd_image($sourcePath, $mimeType);
  if (!$sourceImage) {
    return upload_copy_variant($sourcePath, $targetPath);
  }

  $scale = $maxEdge / max($sourceWidth, $sourceHeight);
  $targetWidth = max(1, (int) round($sourceWidth * $scale));
  $targetHeight = max(1, (int) round($sourceHeight * $scale));
  $targetImage = function_exists('imagecreatetruecolor') ? @imagecreatetruecolor($targetWidth, $targetHeight) : false;

  if (!$targetImage) {
    imagedestroy($sourceImage);
    return upload_copy_variant($sourcePath, $targetPath);
  }

  if (in_array($mimeType, ['image/png', 'image/webp', 'image/gif'], true)) {
    imagealphablending($targetImage, false);
    imagesavealpha($targetImage, true);
    $transparent = imagecolorallocatealpha($targetImage, 0, 0, 0, 127);
    imagefill($targetImage, 0, 0, $transparent);
  }

  $resampled = @imagecopyresampled(
    $targetImage,
    $sourceImage,
    0,
    0,
    0,
    0,
    $targetWidth,
    $targetHeight,
    $sourceWidth,
    $sourceHeight
  );

  if ($resampled !== true) {
    imagedestroy($targetImage);
    imagedestroy($sourceImage);
    return upload_copy_variant($sourcePath, $targetPath);
  }

  $written = upload_write_gd_image($targetImage, $targetPath, $mimeType, $quality);
  imagedestroy($targetImage);
  imagedestroy($sourceImage);

  if ($written !== true) {
    return upload_copy_variant($sourcePath, $targetPath);
  }

  @chmod($targetPath, 0644);
  return true;
}

function upload_generate_image_variants(string $sourcePath, string $filename, string $imagesDir, string $mimeType): void
{
  $variants = [
    'hero' => ['maxEdge' => 1280, 'quality' => 76],
    'web' => ['maxEdge' => 1800, 'quality' => 82],
    'thumbs' => ['maxEdge' => 900, 'quality' => 72]
  ];

  foreach ($variants as $variant => $config) {
    $variantDir = $variant === 'hero' ? $imagesDir . '/web' : $imagesDir . '/' . $variant;
    if (!is_dir($variantDir)) {
      @mkdir($variantDir, 0755, true);
    }
    if (!is_dir($variantDir) || !is_writable($variantDir)) {
      continue;
    }

    $targetFilename = $filename;
    if ($variant === 'hero') {
      $pathInfo = pathinfo($filename);
      $name = isset($pathInfo['filename']) ? trim((string) $pathInfo['filename']) : '';
      $extension = isset($pathInfo['extension']) ? trim((string) $pathInfo['extension']) : '';
      if ($name === '' || $extension === '') {
        continue;
      }
      $targetFilename = $name . '-hero.' . $extension;
    }

    $targetPath = $variantDir . '/' . $targetFilename;
    upload_resize_variant(
      $sourcePath,
      $targetPath,
      $mimeType,
      (int) $config['maxEdge'],
      (int) $config['quality']
    );

    if (strtolower(pathinfo($filename, PATHINFO_EXTENSION)) !== 'webp') {
      upload_render_webp_variant(
        $targetPath,
        $targetPath . '.webp',
        $mimeType,
        (int) $config['maxEdge'],
        (int) $config['quality']
      );
    }
  }
}

if (!array_key_exists($mimeType, $mimeToExt)) {
  api_respond_json(400, [
    'ok' => false,
    'error' => 'unsupported_type',
    'message' => 'Filtypen stöds inte. Använd JPG, PNG, WEBP, GIF eller AVIF.'
  ]);
}

$imageInfo = @getimagesize($tmpPath);
if (!is_array($imageInfo) || empty($imageInfo[0]) || empty($imageInfo[1])) {
  api_respond_json(400, [
    'ok' => false,
    'error' => 'invalid_image',
    'message' => 'Filen kunde inte verifieras som en giltig bild.'
  ]);
}

$originalName = isset($upload['name']) && is_string($upload['name']) ? $upload['name'] : '';
$filenameHint = isset($_POST['filenameHint']) && is_string($_POST['filenameHint']) ? trim($_POST['filenameHint']) : '';
$base = $filenameHint !== '' ? $filenameHint : pathinfo($originalName, PATHINFO_FILENAME);
$base = strtolower($base);
$base = preg_replace('/[^a-z0-9]+/', '-', $base ?? '');
$base = trim((string) $base, '-');
if ($base === '') {
  $base = 'bild-' . gmdate('Ymd-His');
}

$extension = $mimeToExt[$mimeType];
$imagesDir = dirname(__DIR__) . '/images';
if (!is_dir($imagesDir)) {
  @mkdir($imagesDir, 0755, true);
}
if (!is_dir($imagesDir) || !is_writable($imagesDir)) {
  api_respond_json(500, [
    'ok' => false,
    'error' => 'images_dir_unwritable',
    'message' => 'Servern kan inte skriva till images/.'
  ]);
}

$filename = $base . '.' . $extension;
$targetPath = $imagesDir . '/' . $filename;
$suffix = 2;
while (is_file($targetPath)) {
  $filename = sprintf('%s-%d.%s', $base, $suffix, $extension);
  $targetPath = $imagesDir . '/' . $filename;
  $suffix += 1;
}

if (!@move_uploaded_file($tmpPath, $targetPath)) {
  api_respond_json(500, [
    'ok' => false,
    'error' => 'move_failed',
    'message' => 'Kunde inte spara bilden på servern.'
  ]);
}

@chmod($targetPath, 0644);
upload_generate_image_variants($targetPath, $filename, $imagesDir, $mimeType);

api_respond_json(200, [
  'ok' => true,
  'src' => 'images/' . $filename,
  'width' => (int) $imageInfo[0],
  'height' => (int) $imageInfo[1],
  'mimeType' => $mimeType,
  'size' => $size
]);
