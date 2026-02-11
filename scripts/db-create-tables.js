// wb_ 테이블 직접 생성 스크립트
// drizzle-kit push가 Strapi 테이블과의 호환성 문제로 실패할 때 사용
// 이 스크립트는 wb_ 프리픽스 테이블만 생성합니다

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

// .env 로드
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    process.env[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
  }
}

const SQL_STATEMENTS = [
  // 사용자 테이블
  `CREATE TABLE IF NOT EXISTS wb_users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    image VARCHAR(512),
    role VARCHAR(20) NOT NULL DEFAULT 'member',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    xp INT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1,
    auth_mode VARCHAR(20) NOT NULL DEFAULT 'LOCAL',
    email_verified DATETIME,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  // OAuth 계정 연결 (v1 SSO용 준비)
  `CREATE TABLE IF NOT EXISTS wb_accounts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INT,
    token_type VARCHAR(255),
    scope VARCHAR(255),
    id_token TEXT,
    session_state VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES wb_users(id) ON DELETE CASCADE
  )`,

  // DB 세션 (v0 미사용, 스키마만 준비)
  `CREATE TABLE IF NOT EXISTS wb_sessions (
    id VARCHAR(36) PRIMARY KEY,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(36) NOT NULL,
    expires DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES wb_users(id) ON DELETE CASCADE
  )`,

  // 이메일 인증 토큰
  `CREATE TABLE IF NOT EXISTS wb_verification_tokens (
    identifier VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires DATETIME NOT NULL,
    PRIMARY KEY (identifier, token)
  )`,

  // XP 활동 로그
  `CREATE TABLE IF NOT EXISTS wb_xp_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    action VARCHAR(100) NOT NULL,
    xp_amount INT NOT NULL,
    description VARCHAR(500) NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_xp_events_user (user_id),
    INDEX idx_xp_events_created (created_at),
    FOREIGN KEY (user_id) REFERENCES wb_users(id) ON DELETE CASCADE
  )`,
];

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USERNAME || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "wikiboard",
  });

  console.log("MariaDB 연결 완료");

  for (const sql of SQL_STATEMENTS) {
    const tableName = sql.match(/CREATE TABLE IF NOT EXISTS (\S+)/)?.[1];
    try {
      await connection.execute(sql);
      console.log(`✓ ${tableName} 생성 완료`);
    } catch (err) {
      console.error(`✗ ${tableName} 생성 실패:`, err.message);
    }
  }

  // 결과 확인
  const [tables] = await connection.execute(
    "SHOW TABLES LIKE 'wb_%'"
  );
  console.log(`\n생성된 wb_ 테이블 (${tables.length}개):`);
  for (const row of tables) {
    const name = Object.values(row)[0];
    console.log(`  - ${name}`);
  }

  await connection.end();
}

main().catch((err) => {
  console.error("오류:", err);
  process.exit(1);
});
