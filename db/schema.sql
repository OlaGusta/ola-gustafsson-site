CREATE TABLE IF NOT EXISTS portfolio_state (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  payload_json LONGTEXT NOT NULL,
  payload_hash CHAR(64) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS studio_admin (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  totp_secret VARCHAR(64) NOT NULL,
  session_version INT UNSIGNED NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY studio_admin_email_unique (email)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS studio_recovery_codes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id TINYINT UNSIGNED NOT NULL,
  code_hash VARCHAR(255) NOT NULL,
  used_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX studio_recovery_user_idx (user_id, used_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS security_rate_limits (
  scope VARCHAR(64) NOT NULL,
  key_hash CHAR(64) NOT NULL,
  hits INT UNSIGNED NOT NULL DEFAULT 0,
  window_started_at DATETIME NOT NULL,
  blocked_until DATETIME NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (scope, key_hash)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS studio_password_resets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id TINYINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  request_ip_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY studio_password_resets_token_unique (token_hash),
  INDEX studio_password_resets_user_idx (user_id, used_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  lead_kind VARCHAR(32) NOT NULL DEFAULT 'general',
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  message TEXT NOT NULL,
  inquiry_slug VARCHAR(190) NULL,
  inquiry_title VARCHAR(255) NULL,
  inquiry_status VARCHAR(32) NULL,
  inquiry_price_label VARCHAR(255) NULL,
  inquiry_source_url VARCHAR(512) NULL,
  inquiry_language VARCHAR(16) NULL,
  follow_up_status VARCHAR(32) NOT NULL DEFAULT 'new',
  ip_hash CHAR(64) NOT NULL,
  user_agent_hash CHAR(64) NOT NULL,
  mail_delivered TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX contact_messages_lead_kind_idx (lead_kind, created_at),
  INDEX contact_messages_follow_up_idx (follow_up_status, created_at),
  INDEX contact_messages_inquiry_slug_idx (inquiry_slug)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
