<?php
declare(strict_types=1);

// /ateljebrev: anmälan. /ateljebrev/bekrafta/<token>: bekräftelse.
// /ateljebrev/avsluta/<token>: avregistrering. /ateljebrev/avsluta: begär avregistreringslänk.
require __DIR__ . '/seo.php';
require_once __DIR__ . '/portfolio_core.php';
require_once __DIR__ . '/api/newsletter_lib.php';
require_once __DIR__ . '/page_chrome.php';

$lang = seo_normalize_lang($_GET['lang'] ?? null);
$h = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES);
$t = static fn (string $sv, string $en): string => $lang === 'en' ? $en : $sv;
$action = isset($_GET['action']) && is_string($_GET['action']) ? $_GET['action'] : '';
$token = isset($_GET['token']) && is_string($_GET['token']) ? strtolower(trim($_GET['token'])) : '';

$heading = $t('Ateljébrev', 'Studio letter');
$message = '';
$showForm = 'subscribe';
if ($action !== '') {
  try {
    $pdo = api_get_pdo();
    newsletter_ensure_schema($pdo);
    $row = $token !== '' ? newsletter_find_by_token($pdo, $token) : null;
  } catch (Throwable $error) {
    $row = null;
  }
  if ($action === 'bekrafta') {
    $showForm = '';
    if ($row && $row['status'] !== 'unsubscribed') {
      newsletter_confirm($pdo, $row);
      $heading = $t('Tack, du är med', 'Thank you, you are on the list');
      $message = $t('Du får ateljébrevet när det finns nya målningar eller utställningar.', 'You will get the studio letter when there are new paintings or exhibitions.');
    } else {
      http_response_code(404);
      $heading = $t('Länken fungerar inte', 'The link does not work');
      $message = $t('Anmäl dig gärna igen nedan.', 'Feel free to sign up again below.');
      $showForm = 'subscribe';
    }
  } elseif ($action === 'avsluta' && $token !== '') {
    $showForm = '';
    if ($row) {
      newsletter_unsubscribe($pdo, $row);
      $heading = $t('Du är avregistrerad', 'You have unsubscribed');
      $message = $t('Du får inga fler ateljébrev. Ångrar du dig kan du anmäla dig igen här.', 'You will not get any more studio letters. If you change your mind, you can sign up again here.');
      $showForm = 'subscribe';
    } else {
      http_response_code(404);
      $heading = $t('Länken fungerar inte', 'The link does not work');
      $message = $t('Skriv din e-postadress nedan så skickar jag en ny avregistreringslänk.', 'Enter your email address below and I will send a new unsubscribe link.');
      $showForm = 'unsubscribe';
    }
  } elseif ($action === 'avsluta') {
    $heading = $t('Avsluta ateljébrevet', 'Unsubscribe from the studio letter');
    $message = $t('Skriv din e-postadress så skickar jag en länk som avslutar prenumerationen.', 'Enter your email address and I will send a link that ends the subscription.');
    $showForm = 'unsubscribe';
  }
}

page_chrome_open($lang, $heading . ' | Ola Gustafsson', [
  'canonical' => $action === '' ? seo_canonical_url('newsletter', $lang) : '',
  'description' => $t('Ateljébrevet från akvarellkonstnären Ola Gustafsson: nya målningar och utställningar.', 'The studio letter from watercolour artist Ola Gustafsson: new paintings and exhibitions.'),
  'robots' => $action === '' ? 'index,follow' : 'noindex,nofollow',
  'page' => 'newsletter'
]);
?>
    <main>
      <section class="section newsletter-page">
        <div class="container newsletter-container">
          <p class="eyebrow"><?= $h($t('Ateljébrev', 'Studio letter')) ?></p>
          <h1><?= $h($heading) ?></h1>
          <?php if ($message !== ''): ?>
            <p class="section-lead"><?= $h($message) ?></p>
          <?php elseif ($action === ''): ?>
            <p class="section-lead" data-newsletter-pitch></p>
          <?php endif; ?>
          <?php if ($showForm !== ''): ?>
            <div data-newsletter-slot="<?= $showForm === 'unsubscribe' ? 'unsubscribe' : 'page' ?>" data-newsletter-source="ateljebrev"></div>
          <?php endif; ?>
          <?php if ($action === ''): ?>
            <p class="field-hint"><a href="<?= $h('/ateljebrev/avsluta' . ($lang === 'en' ? '?lang=en' : '')) ?>"><?= $h($t('Avsluta ateljébrevet', 'Unsubscribe')) ?></a></p>
          <?php endif; ?>
        </div>
      </section>
    </main>
<?php
page_chrome_close();
