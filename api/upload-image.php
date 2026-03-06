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

api_respond_json(200, [
  'ok' => true,
  'src' => 'images/' . $filename,
  'width' => (int) $imageInfo[0],
  'height' => (int) $imageInfo[1],
  'mimeType' => $mimeType,
  'size' => $size
]);

