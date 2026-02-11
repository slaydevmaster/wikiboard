// WikiBoard v0 인증 API 테스트
// 회원가입 API 검증 (비밀번호 복잡도, 이메일 형식)

import "dotenv/config";
import crypto from "crypto";

const WEB_PORT = process.env.WEB_PORT || 3050;
const BASE_URL = `http://localhost:${WEB_PORT}`;

let totalTests = 0;
let passedTests = 0;

function log(icon, message) {
  console.log(`${icon} ${message}`);
}

async function testRegisterSuccess() {
  totalTests++;
  const testEmail = `test-verify-${Date.now()}@example.com`;
  const testPassword = "Test1234"; // 영문+숫자

  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: testEmail,
        password: testPassword,
      }),
    });

    if (response.status === 201) {
      log("✅", `회원가입 성공 (${testEmail})`);
      passedTests++;
      return true;
    } else {
      const data = await response.json();
      log("❌", `회원가입 실패 (${response.status}): ${data.error}`);
      return false;
    }
  } catch (error) {
    log("❌", `회원가입 API 호출 오류: ${error.message}`);
    return false;
  }
}

async function testWeakPassword() {
  totalTests++;
  const testEmail = `test-weak-${Date.now()}@example.com`;
  const weakPassword = "12345678"; // 숫자만

  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: testEmail,
        password: weakPassword,
      }),
    });

    if (response.status === 400) {
      const data = await response.json();
      if (data.error.includes("영문과 숫자")) {
        log("✅", `약한 비밀번호 거부 ("${weakPassword}")`);
        passedTests++;
        return true;
      }
    }

    log("❌", `약한 비밀번호 검증 실패 (응답: ${response.status})`);
    return false;
  } catch (error) {
    log("❌", `약한 비밀번호 테스트 오류: ${error.message}`);
    return false;
  }
}

async function testInvalidEmail() {
  totalTests++;
  const invalidEmail = "test@test"; // 잘못된 형식
  const testPassword = "Test1234";

  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: invalidEmail,
        password: testPassword,
      }),
    });

    if (response.status === 400) {
      const data = await response.json();
      if (data.error.includes("이메일 형식")) {
        log("✅", `잘못된 이메일 거부 ("${invalidEmail}")`);
        passedTests++;
        return true;
      }
    }

    log("❌", `이메일 형식 검증 실패 (응답: ${response.status})`);
    return false;
  } catch (error) {
    log("❌", `이메일 검증 테스트 오류: ${error.message}`);
    return false;
  }
}

async function testDuplicateEmail() {
  totalTests++;
  const testEmail = `test-duplicate-${Date.now()}@example.com`;
  const testPassword = "Test1234";

  try {
    // 첫 번째 가입
    const response1 = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User 1",
        email: testEmail,
        password: testPassword,
      }),
    });

    if (response1.status !== 201) {
      log("❌", `중복 이메일 테스트 - 첫 번째 가입 실패`);
      return false;
    }

    // 두 번째 가입 (중복)
    const response2 = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User 2",
        email: testEmail,
        password: testPassword,
      }),
    });

    if (response2.status === 409) {
      const data = await response2.json();
      if (data.error.includes("이미 사용 중")) {
        log("✅", "중복 이메일 거부");
        passedTests++;
        return true;
      }
    }

    log("❌", `중복 이메일 검증 실패 (응답: ${response2.status})`);
    return false;
  } catch (error) {
    log("❌", `중복 이메일 테스트 오류: ${error.message}`);
    return false;
  }
}

export async function verifyAuth() {
  console.log("=== [2/4] 인증 API 테스트 ===\n");

  await testRegisterSuccess();
  await testWeakPassword();
  await testInvalidEmail();
  await testDuplicateEmail();

  console.log("\nℹ️  로그인 및 JWT 검증은 수동 점검에서 확인하세요:");
  console.log("   1. /login에서 로그인");
  console.log("   2. F12 → Application → Cookies → authjs.session-token");
  console.log("   3. jwt.io에서 exp 필드 확인 (현재시각 + 7일)");
  console.log();

  return { total: totalTests, passed: passedTests };
}

// 단독 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyAuth()
    .then(({ total, passed }) => {
      console.log(`결과: ${passed}/${total} 통과`);
      process.exit(passed === total ? 0 : 1);
    })
    .catch((error) => {
      console.error("인증 테스트 실행 오류:", error);
      process.exit(1);
    });
}
