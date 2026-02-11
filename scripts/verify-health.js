// WikiBoard v0 서비스 헬스체크
// DB, Strapi, Meilisearch, Next.js 응답 확인

import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const WEB_PORT = process.env.WEB_PORT || 3050;
const CMS_PORT = process.env.CMS_PORT || 1337;
const MEILI_HOST = process.env.MEILI_HOST || "http://127.0.0.1:7700";
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

let totalTests = 0;
let passedTests = 0;

function log(icon, message) {
  console.log(`${icon} ${message}`);
}

async function checkDatabase() {
  totalTests++;
  try {
    const connection = await mysql.createConnection({
      host: DATABASE_HOST,
      port: parseInt(DATABASE_PORT),
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
    });

    const db = drizzle(connection);

    // 간단한 쿼리로 연결 확인
    await connection.query("SELECT 1");
    await connection.end();

    log("✅", `MariaDB 연결 성공 (${DATABASE_NAME})`);
    passedTests++;
    return true;
  } catch (error) {
    log("❌", `MariaDB 연결 실패: ${error.message}`);
    return false;
  }
}

async function checkStrapi() {
  totalTests++;
  try {
    const response = await fetch(`http://localhost:${CMS_PORT}/_health`, {
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      log("✅", `Strapi API 응답 (${response.status} OK)`);
      passedTests++;
      return true;
    } else {
      log("❌", `Strapi API 응답 오류 (${response.status})`);
      return false;
    }
  } catch (error) {
    log("❌", `Strapi API 연결 실패: ${error.message}`);
    log("ℹ️", `Strapi가 실행 중인지 확인하세요: npm run dev:cms`);
    return false;
  }
}

async function checkMeilisearch() {
  totalTests++;
  try {
    const response = await fetch(`${MEILI_HOST}/health`, {
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      log("✅", `Meilisearch 응답 (${response.status} OK)`);
      passedTests++;
      return true;
    } else {
      log("❌", `Meilisearch 응답 오류 (${response.status})`);
      return false;
    }
  } catch (error) {
    log("❌", `Meilisearch 연결 실패: ${error.message}`);
    log("ℹ️", `Meilisearch가 실행 중인지 확인하세요: npm run docker:dev`);
    return false;
  }
}

async function checkNextJs() {
  totalTests++;
  try {
    const response = await fetch(`http://localhost:${WEB_PORT}`, {
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      log("✅", `Next.js 응답 (${response.status} OK)`);
      passedTests++;
      return true;
    } else {
      log("❌", `Next.js 응답 오류 (${response.status})`);
      return false;
    }
  } catch (error) {
    log("❌", `Next.js 연결 실패: ${error.message}`);
    log("ℹ️", `Next.js가 실행 중인지 확인하세요: npm run dev:web`);
    return false;
  }
}

export async function verifyHealth() {
  console.log("=== [1/4] 서비스 헬스체크 ===\n");

  await checkDatabase();
  await checkStrapi();
  await checkMeilisearch();
  await checkNextJs();

  console.log();
  return { total: totalTests, passed: passedTests };
}

// 단독 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyHealth()
    .then(({ total, passed }) => {
      console.log(`결과: ${passed}/${total} 통과`);
      process.exit(passed === total ? 0 : 1);
    })
    .catch((error) => {
      console.error("헬스체크 실행 오류:", error);
      process.exit(1);
    });
}
