<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

api_require_method('POST');

$pdo = api_get_pdo();
api_ensure_schema($pdo);

api_security_require_authenticated_admin($pdo);
api_security_require_csrf();
api_security_logout();

api_respond_json(200, [
  'ok' => true,
  'message' => 'Du är nu utloggad.'
]);
