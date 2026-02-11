// WikiBoard v0 Strapi API 연동 테스트
// 용어 조회, 초성 필터, 발행 상태 확인

import "dotenv/config";

const CMS_PORT = process.env.CMS_PORT || 1337;
const STRAPI_URL = `http://localhost:${CMS_PORT}`;

let totalTests = 0;
let passedTests = 0;

function log(icon, message) {
  console.log(`${icon} ${message}`);
}

async function testRecentTerms() {
  totalTests++;

  try {
    const params = new URLSearchParams({
      "pagination[limit]": "5",
      "sort[0]": "publishedAt:desc",
      "filters[status][$eq]": "published",
      "populate": "*",
    });

    const response = await fetch(`${STRAPI_URL}/api/terms?${params}`);

    if (!response.ok) {
      log("❌", `최근 용어 조회 실패 (${response.status})`);
      return false;
    }

    const data = await response.json();
    const count = data.data?.length || 0;

    log("✅", `최근 용어 조회 (${count}개)`);
    passedTests++;
    return true;
  } catch (error) {
    log("❌", `최근 용어 조회 오류: ${error.message}`);
    log("ℹ️", `Strapi가 실행 중인지 확인하세요: npm run dev:cms`);
    return false;
  }
}

async function testTermsByInitial() {
  totalTests++;

  try {
    const params = new URLSearchParams({
      "pagination[page]": "1",
      "pagination[pageSize]": "25",
      "sort[0]": "title:asc",
      "filters[status][$eq]": "published",
      "filters[title][$startsWith]": "ㄱ",
      "populate": "*",
    });

    const response = await fetch(`${STRAPI_URL}/api/terms?${params}`);

    if (!response.ok) {
      log("❌", `초성별 용어 조회 실패 (${response.status})`);
      return false;
    }

    const data = await response.json();
    const count = data.data?.length || 0;

    log("✅", `초성별 용어 조회 ("ㄱ" → ${count}개)`);
    passedTests++;
    return true;
  } catch (error) {
    log("❌", `초성별 용어 조회 오류: ${error.message}`);
    return false;
  }
}

async function testPublishedFilter() {
  totalTests++;

  try {
    // 전체 용어 조회
    const allParams = new URLSearchParams({
      "pagination[limit]": "100",
    });

    const allResponse = await fetch(`${STRAPI_URL}/api/terms?${allParams}`);

    if (!allResponse.ok) {
      log("❌", `발행 상태 필터링 테스트 실패 (${allResponse.status})`);
      return false;
    }

    const allData = await allResponse.json();
    const totalCount = allData.meta?.pagination?.total || 0;

    // published만 조회
    const publishedParams = new URLSearchParams({
      "pagination[limit]": "100",
      "filters[status][$eq]": "published",
    });

    const publishedResponse = await fetch(`${STRAPI_URL}/api/terms?${publishedParams}`);

    if (!publishedResponse.ok) {
      log("❌", `발행 상태 필터링 실패 (${publishedResponse.status})`);
      return false;
    }

    const publishedData = await publishedResponse.json();
    const publishedCount = publishedData.meta?.pagination?.total || 0;

    log("✅", `발행 상태 필터링 (전체: ${totalCount}, published: ${publishedCount})`);
    passedTests++;
    return true;
  } catch (error) {
    log("❌", `발행 상태 필터링 오류: ${error.message}`);
    return false;
  }
}

export async function verifyStrapi() {
  console.log("=== [4/4] Strapi API 연동 테스트 ===\n");

  await testRecentTerms();
  await testTermsByInitial();
  await testPublishedFilter();

  console.log("\nℹ️  Strapi 데이터가 비어있다면:");
  console.log("   1. http://localhost:1337/admin 접속");
  console.log("   2. Content Manager → Term → Create new entry");
  console.log("   3. title, slug 입력 후 Publish");
  console.log();

  return { total: totalTests, passed: passedTests };
}

// 단독 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyStrapi()
    .then(({ total, passed }) => {
      console.log(`결과: ${passed}/${total} 통과`);
      process.exit(passed === total ? 0 : 1);
    })
    .catch((error) => {
      console.error("Strapi API 테스트 실행 오류:", error);
      process.exit(1);
    });
}
