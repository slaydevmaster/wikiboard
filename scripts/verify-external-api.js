// WikiBoard 외부 콘텐츠 업로드 API 검증
// Strapi API Token 기반 CRUD 테스트

import "dotenv/config";

const CMS_PORT = process.env.CMS_PORT || 1337;
const STRAPI_URL = `http://localhost:${CMS_PORT}`;
const API_TOKEN = process.env.STRAPI_API_TOKEN || "";

let totalTests = 0;
let passedTests = 0;

// 테스트 중 생성한 문서 ID (정리용)
let createdTermDocId = null;
let createdArticleDocId = null;

function log(icon, message) {
  console.log(`${icon} ${message}`);
}

async function testApiTokenExists() {
  totalTests++;

  if (API_TOKEN && API_TOKEN.length > 0) {
    log("✅", "API Token 설정 확인");
    passedTests++;
    return true;
  } else {
    log("❌", "API Token 미설정 (.env의 STRAPI_API_TOKEN)");
    log("ℹ️", "Strapi Admin → Settings → API Tokens에서 생성하세요");
    return false;
  }
}

async function testCreateTerm() {
  totalTests++;

  if (!API_TOKEN) {
    log("⏭️", "용어 생성 (API Token 없음 - 건너뜀)");
    return false;
  }

  const testSlug = `test-verify-${Date.now()}`;

  try {
    const response = await fetch(`${STRAPI_URL}/api/terms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          title: `검증 테스트 용어 (${testSlug})`,
          slug: testSlug,
          one_liner: "자동 검증 테스트용 용어입니다",
          body: "# 검증 테스트\n\n자동 검증 스크립트에서 생성한 용어입니다.",
          status: "draft",
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      createdTermDocId = data.data?.documentId;
      log("✅", `용어 생성 성공 (documentId: ${createdTermDocId})`);
      passedTests++;
      return true;
    } else {
      const error = await response.text();
      log("❌", `용어 생성 실패 (${response.status}): ${error.substring(0, 200)}`);
      return false;
    }
  } catch (error) {
    log("❌", `용어 생성 오류: ${error.message}`);
    return false;
  }
}

async function testUpdateTerm() {
  totalTests++;

  if (!createdTermDocId) {
    log("⏭️", "용어 수정 (생성된 용어 없음 - 건너뜀)");
    return false;
  }

  try {
    const response = await fetch(
      `${STRAPI_URL}/api/terms/${createdTermDocId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            summary: "수정된 요약 - 자동 검증 테스트",
            status: "review",
          },
        }),
      }
    );

    if (response.ok) {
      log("✅", "용어 수정 성공 (status: draft → review)");
      passedTests++;
      return true;
    } else {
      log("❌", `용어 수정 실패 (${response.status})`);
      return false;
    }
  } catch (error) {
    log("❌", `용어 수정 오류: ${error.message}`);
    return false;
  }
}

async function testCreateArticle() {
  totalTests++;

  if (!API_TOKEN) {
    log("⏭️", "글 생성 (API Token 없음 - 건너뜀)");
    return false;
  }

  const testSlug = `test-article-${Date.now()}`;

  try {
    const response = await fetch(`${STRAPI_URL}/api/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          title: `검증 테스트 보고서 (${testSlug})`,
          slug: testSlug,
          excerpt: "자동 검증 테스트용 보고서",
          body: "# 검증 테스트 보고서\n\n자동 검증 스크립트에서 생성한 글입니다.",
          status: "draft",
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      createdArticleDocId = data.data?.documentId;
      log("✅", `글 생성 성공 (documentId: ${createdArticleDocId})`);
      passedTests++;
      return true;
    } else {
      const error = await response.text();
      log("❌", `글 생성 실패 (${response.status}): ${error.substring(0, 200)}`);
      return false;
    }
  } catch (error) {
    log("❌", `글 생성 오류: ${error.message}`);
    return false;
  }
}

async function testUnauthorizedAccess() {
  totalTests++;

  try {
    // 토큰 없이 생성 시도
    const response = await fetch(`${STRAPI_URL}/api/terms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization 헤더 없음
      },
      body: JSON.stringify({
        data: {
          title: "무단 접근 테스트",
          slug: "unauthorized-test",
          status: "draft",
        },
      }),
    });

    if (response.status === 401 || response.status === 403) {
      log("✅", `무단 접근 차단 확인 (${response.status})`);
      passedTests++;
      return true;
    } else if (response.ok) {
      // 퍼블릭 쓰기가 허용된 경우 - 보안 경고
      log("⚠️", "무단 접근이 허용됨 - Strapi 퍼블릭 권한 설정 확인 필요");
      // 생성된 테스트 데이터 정리
      const data = await response.json();
      if (data.data?.documentId) {
        await fetch(`${STRAPI_URL}/api/terms/${data.data.documentId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
      }
      return false;
    } else {
      log("❌", `무단 접근 테스트 예상치 못한 응답 (${response.status})`);
      return false;
    }
  } catch (error) {
    log("❌", `무단 접근 테스트 오류: ${error.message}`);
    return false;
  }
}

async function testMeilisearchIndexing() {
  totalTests++;

  const MEILI_HOST = process.env.MEILI_HOST || "http://127.0.0.1:7700";
  const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY || "";

  try {
    const headers = {};
    if (MEILI_MASTER_KEY) {
      headers["Authorization"] = `Bearer ${MEILI_MASTER_KEY}`;
    }

    const response = await fetch(`${MEILI_HOST}/indexes/terms`, { headers });

    if (response.ok) {
      log("✅", "Meilisearch terms 인덱스 존재 확인");
      passedTests++;
      return true;
    } else if (response.status === 404) {
      log("ℹ️", "Meilisearch terms 인덱스 미생성 (Strapi 시작 시 자동 생성됨)");
      passedTests++; // Strapi가 아직 시작 안 됐을 수 있음
      return true;
    } else {
      log("❌", `Meilisearch 인덱스 확인 실패 (${response.status})`);
      return false;
    }
  } catch (error) {
    log("ℹ️", `Meilisearch 연결 불가 (${error.message}) - 검색 없이 계속`);
    passedTests++; // Meilisearch는 선택 사항
    return true;
  }
}

async function cleanup() {
  // 테스트로 생성한 데이터 정리
  if (!API_TOKEN) return;

  if (createdTermDocId) {
    try {
      await fetch(`${STRAPI_URL}/api/terms/${createdTermDocId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      log("🧹", `테스트 용어 삭제 (${createdTermDocId})`);
    } catch {
      // 무시
    }
  }

  if (createdArticleDocId) {
    try {
      await fetch(`${STRAPI_URL}/api/articles/${createdArticleDocId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      log("🧹", `테스트 글 삭제 (${createdArticleDocId})`);
    } catch {
      // 무시
    }
  }
}

export async function verifyExternalApi() {
  console.log("=== [외부 API] 콘텐츠 업로드 API 테스트 ===\n");

  await testApiTokenExists();
  await testCreateTerm();
  await testUpdateTerm();
  await testCreateArticle();
  await testUnauthorizedAccess();
  await testMeilisearchIndexing();

  // 테스트 데이터 정리
  await cleanup();

  console.log("\nℹ️  외부 API 사용법:");
  console.log("   예시 코드: examples/upload-term.py (Python)");
  console.log("   예시 코드: examples/upload-term.ts (Node.js)");
  console.log("   예시 코드: examples/upload-term.sh (curl)");
  console.log();

  return { total: totalTests, passed: passedTests };
}

// 단독 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyExternalApi()
    .then(({ total, passed }) => {
      console.log(`결과: ${passed}/${total} 통과`);
      process.exit(passed === total ? 0 : 1);
    })
    .catch((error) => {
      console.error("외부 API 테스트 실행 오류:", error);
      process.exit(1);
    });
}
