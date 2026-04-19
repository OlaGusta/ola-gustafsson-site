<?php
declare(strict_types=1);

// Copy this file to ".db-config.php" and fill in the real values locally/on server.
// ".db-config.php" is ignored by git because it contains secrets.
return [
  'host' => 'localhost',
  'database' => 'your_database',
  'username' => 'your_username',
  'password' => 'your_password',
  'charset' => 'utf8mb4',
  'googleAnalytics' => [
    'propertyId' => '',
    'clientEmail' => '',
    'privateKey' => '',
    'privateKeyBase64' => '',
    'serviceAccountJson' => ''
  ],
  'openai' => [
    'apiKey' => '',
    'model' => 'gpt-5.2',
    'timeoutSeconds' => 18
  ],
  'security' => [
    'authMode' => 'session-2fa',
    'sessionName' => 'ola_studio_session',
    'sessionTtlSeconds' => 1800,
    'loginMaxAttempts' => 5,
    'loginWindowSeconds' => 900,
    'loginBlockSeconds' => 1800,
    'resetMaxRequests' => 3,
    'resetWindowSeconds' => 900,
    'resetBlockSeconds' => 1800,
    'resetTokenTtlSeconds' => 1800,
    // Set this explicitly in production, e.g. https://example.com/studio.html
    'resetBaseUrl' => '',
    // Generate with `openssl rand -hex 32` and keep stable across deploys.
    'appSecret' => '',
    'bootstrapAccessKey' => '',
    'mailerFrom' => '',
    'mailerReplyTo' => '',
    'contactRecipient' => '',
    // Public contact form is only enabled when BOTH Turnstile values are set.
    'turnstileSiteKey' => '',
    'turnstileSecret' => '',
    'contactMaxRequests' => 3,
    'contactWindowSeconds' => 600,
    'contactBlockSeconds' => 1800
  ]
];
