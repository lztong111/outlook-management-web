import db from './index';

export function runMigrations() {
  // 1. 创建 accounts 表
  db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      password TEXT DEFAULT '',
      client_id TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active','inactive','error')),
      last_synced_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email);
  `);

  // 2. 创建 proxies 表
  db.exec(`
    CREATE TABLE IF NOT EXISTS proxies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL CHECK(type IN ('socks5','http')),
      host TEXT NOT NULL,
      port INTEGER NOT NULL,
      username TEXT DEFAULT '',
      password TEXT DEFAULT '',
      is_default INTEGER DEFAULT 0,
      last_tested_at DATETIME,
      last_test_ip TEXT DEFAULT '',
      status TEXT DEFAULT 'untested' CHECK(status IN ('untested','active','failed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. 重建 mail_cache 表（删除旧表，确保结构正确）
  db.exec(`DROP TABLE IF EXISTS mail_cache;`);
  db.exec(`
    CREATE TABLE mail_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL,
      mailbox TEXT NOT NULL DEFAULT 'INBOX',
      mail_id TEXT DEFAULT '',
      sender TEXT DEFAULT '',
      sender_name TEXT DEFAULT '',
      subject TEXT DEFAULT '',
      text_content TEXT DEFAULT '',
      html_content TEXT DEFAULT '',
      mail_date DATETIME,
      is_read INTEGER DEFAULT 0,
      cached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX idx_mail_cache_unique ON mail_cache(account_id, mailbox, mail_id);
    CREATE INDEX idx_mail_cache_account ON mail_cache(account_id, mailbox);
    CREATE INDEX idx_mail_cache_date ON mail_cache(mail_date DESC);
  `);

  // 4. 新增 token_refreshed_at 字段（兼容已有数据库）
  try {
    db.exec(`ALTER TABLE accounts ADD COLUMN token_refreshed_at DATETIME`);
  } catch {
    // 字段已存在则忽略
  }

  // 5. 新增 remark 备注字段
  try {
    db.exec(`ALTER TABLE accounts ADD COLUMN remark TEXT DEFAULT ''`);
  } catch {
    // 字段已存在则忽略
  }

  // 6. 新增 is_used 是否已使用字段（0=未使用，1=已使用）
  try {
    db.exec(`ALTER TABLE accounts ADD COLUMN is_used INTEGER DEFAULT 0`);
  } catch {
    // 字段已存在则忽略
  }

  // 6. 标签系统
  db.exec(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL DEFAULT '#3B82F6',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS account_tags (
      account_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (account_id, tag_id),
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `);
}
