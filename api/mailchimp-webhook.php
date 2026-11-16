<?php
declare(strict_types=1);

// Mailchimp → sajten. Registrerad i Mailchimp som
// https://olagustafsson.com/api/mailchimp-webhook.php?secret=<webhookSecret>
// GET: Mailchimps kontroll när webhooken skapas (svarar 200).
// POST (form): type=unsubscribe|cleaned → avregistrerad på sajten,
//              type=subscribe → bekräftad på sajten (t.ex. lagd till direkt i Mailchimp),
//              type=upemail → ny adress.

require __DIR__ . '/newsletter_lib.php';

$cfg = newsletter_mailchimp_config();
$secret = isset($_GET['secret']) && is_string($_GET['secret']) ? $_GET['secret'] : '';
if ($cfg['webhookSecret'] === '' || !hash_equals($cfg['webhookSecret'], $secret)) {
  http_response_code(403);
  exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  http_response_code(200);
  echo 'ok';
  exit;
}

$type = isset($_POST['type']) && is_string($_POST['type']) ? $_POST['type'] : '';
$data = isset($_POST['data']) && is_array($_POST['data']) ? $_POST['data'] : [];
$listId = isset($data['list_id']) && is_string($data['list_id']) ? $data['list_id'] : '';
if ($listId !== '' && $listId !== $cfg['listId']) {
  http_response_code(200);
  exit;
}

$pdo = api_get_pdo();
api_ensure_schema($pdo);
newsletter_ensure_schema($pdo);

$email = strtolower(trim((string) ($data['email'] ?? '')));
if ($type === 'upemail') {
  $old = strtolower(trim((string) ($data['old_email'] ?? '')));
  $new = strtolower(trim((string) ($data['new_email'] ?? '')));
  if (filter_var($old, FILTER_VALIDATE_EMAIL) && filter_var($new, FILTER_VALIDATE_EMAIL) && !newsletter_find_by_email($pdo, $new)) {
    $pdo->prepare('UPDATE newsletter_subscribers SET email = :new WHERE email = :old')->execute([':new' => $new, ':old' => $old]);
  }
  http_response_code(200);
  exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(200);
  exit;
}

$row = newsletter_find_by_email($pdo, $email);
if ($type === 'unsubscribe' || $type === 'cleaned') {
  if ($row && $row['status'] !== 'unsubscribed') {
    newsletter_unsubscribe($pdo, $row, true);
  }
} elseif ($type === 'subscribe') {
  $lang = (($data['merges']['LANG'] ?? '') === 'en') ? 'en' : 'sv';
  if (!$row) {
    $pdo->prepare('INSERT INTO newsletter_subscribers (email, language, source, status, token, confirmed_at, mailchimp_synced_at) VALUES (:email, :lang, \'mailchimp\', \'confirmed\', :token, UTC_TIMESTAMP(), UTC_TIMESTAMP())')
      ->execute([':email' => $email, ':lang' => $lang, ':token' => bin2hex(random_bytes(20))]);
  } elseif ($row['status'] !== 'confirmed') {
    $pdo->prepare('UPDATE newsletter_subscribers SET status = \'confirmed\', confirmed_at = UTC_TIMESTAMP(), unsubscribed_at = NULL, mailchimp_synced_at = UTC_TIMESTAMP(), mailchimp_error = NULL WHERE id = :id')
      ->execute([':id' => (int) $row['id']]);
  }
}
http_response_code(200);
echo 'ok';
