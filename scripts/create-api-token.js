/**
 * Strapi API Token 자동 생성 스크립트
 * - Admin API로 토큰 생성 후 .env에 자동 저장
 *
 * 사용법: node scripts/create-api-token.js
 * 필요: Strapi 실행 중 + 관리자 계정
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// dotenv 수동 로드
const envPath = path.resolve(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const CMS_PORT = process.env.CMS_PORT || 1337;
const STRAPI_URL = `http://localhost:${CMS_PORT}`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log("=== Strapi API Token 생성 스크립트 ===\n");

  // 1. 관리자 로그인 정보 입력
  const email = await ask("Strapi 관리자 이메일: ");
  const password = await ask("Strapi 관리자 비밀번호: ");

  // 2. 관리자 로그인
  console.log("\n관리자 로그인 중...");
  const loginResponse = await fetch(`${STRAPI_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!loginResponse.ok) {
    const err = await loginResponse.text();
    console.error("로그인 실패:", loginResponse.status, err);
    process.exit(1);
  }

  const loginData = await loginResponse.json();
  const adminToken = loginData.data?.token;

  if (!adminToken) {
    console.error("관리자 토큰을 받지 못했습니다.");
    process.exit(1);
  }

  console.log("로그인 성공!\n");

  // 3. 기존 토큰 확인 및 삭제
  const listResponse = await fetch(`${STRAPI_URL}/admin/api-tokens`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  if (listResponse.ok) {
    const listData = await listResponse.json();
    const existing = listData.data?.find(
      (t) => t.name === "WikiBoard External API"
    );

    if (existing) {
      console.log(`기존 토큰 "${existing.name}" 삭제 중...`);
      await fetch(`${STRAPI_URL}/admin/api-tokens/${existing.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      console.log("삭제 완료.\n");
    }
  }

  // 4. 새 API Token 생성
  console.log("새 API Token 생성 중...");
  const createResponse = await fetch(`${STRAPI_URL}/admin/api-tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: "WikiBoard External API",
      description: "외부 시스템 콘텐츠 업로드용 토큰",
      type: "full-access",
      lifespan: null, // 무기한
    }),
  });

  if (!createResponse.ok) {
    const err = await createResponse.text();
    console.error("토큰 생성 실패:", createResponse.status, err);
    process.exit(1);
  }

  const createData = await createResponse.json();
  const apiToken = createData.data?.accessKey;

  if (!apiToken) {
    console.error("토큰 값을 받지 못했습니다. 응답:", JSON.stringify(createData, null, 2));
    process.exit(1);
  }

  // 5. .env 파일에 저장
  let currentEnv = fs.readFileSync(envPath, "utf-8");

  if (currentEnv.includes("STRAPI_API_TOKEN=")) {
    currentEnv = currentEnv.replace(
      /STRAPI_API_TOKEN=.*/,
      `STRAPI_API_TOKEN=${apiToken}`
    );
  } else {
    currentEnv += `\nSTRAPI_API_TOKEN=${apiToken}\n`;
  }

  fs.writeFileSync(envPath, currentEnv);

  console.log("\n========================================");
  console.log("  API Token 생성 완료!");
  console.log("========================================");
  console.log(`토큰: ${apiToken.substring(0, 20)}...`);
  console.log(`.env에 자동 저장되었습니다.`);
  console.log("\nStrapi와 Next.js를 재시작하세요.");

  rl.close();
}

main().catch((err) => {
  console.error("오류:", err.message);
  rl.close();
  process.exit(1);
});
