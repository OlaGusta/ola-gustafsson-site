<?php
declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

api_require_method('GET');

$pdo = api_get_pdo();
api_ensure_schema($pdo);

api_respond_json(200, api_security_public_status($pdo));
