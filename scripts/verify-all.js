// WikiBoard v0 전체 자동 검증
// 서비스 헬스체크 + 인증 + 관리자 + Strapi 연동

import { verifyHealth } from "./verify-health.js";
import { verifyAuth } from "./verify-auth.js";
import { verifyAdmin } from "./verify-admin.js";
import { verifyStrapi } from "./verify-strapi.js";
import { verifyExternalApi } from "./verify-external-api.js";

async function main() {
  console.log("╔═══════════════════════════════════════════════════════╗");
  console.log("║   WikiBoard v0 자동 검증 스크립트                    ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");

  const startTime = Date.now();
  let totalTests = 0;
  let totalPassed = 0;

  try {
    // 1. 서비스 헬스체크
    const healthResult = await verifyHealth();
    totalTests += healthResult.total;
    totalPassed += healthResult.passed;

    // 2. 인증 API 테스트
    const authResult = await verifyAuth();
    totalTests += authResult.total;
    totalPassed += authResult.passed;

    // 3. 관리자 API 테스트
    const adminResult = await verifyAdmin();
    totalTests += adminResult.total;
    totalPassed += adminResult.passed;

    // 4. Strapi API 연동 테스트
    const strapiResult = await verifyStrapi();
    totalTests += strapiResult.total;
    totalPassed += strapiResult.passed;

    // 5. 외부 콘텐츠 업로드 API 테스트
    const externalResult = await verifyExternalApi();
    totalTests += externalResult.total;
    totalPassed += externalResult.passed;

    // 최종 리포트
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    const failedTests = totalTests - totalPassed;

    console.log("╔═══════════════════════════════════════════════════════╗");
    console.log("║   검증 완료                                           ║");
    console.log("╚═══════════════════════════════════════════════════════╝");
    console.log();
    console.log(`✅ 성공: ${totalPassed}/${totalTests}`);

    if (failedTests > 0) {
      console.log(`❌ 실패: ${failedTests}/${totalTests}`);
      console.log();
      console.log("⚠️  실패한 테스트가 있습니다. 위의 오류 메시지를 확인하세요.");
    }

    console.log(`⏱️  소요 시간: ${duration}초`);
    console.log();

    console.log("═══════════════════════════════════════════════════════");
    console.log("다음 단계: 최소 수동 점검 (2-3분)");
    console.log("═══════════════════════════════════════════════════════");
    console.log();
    console.log("브라우저에서 확인:");
    console.log("  1. /register - 비밀번호 강도 게이지, 필드별 에러");
    console.log("  2. /login - 로그인 성공 토스트");
    console.log("  3. /admin/users - 테이블 스켈레톤, 역할 변경 토스트");
    console.log("  4. /terms - 용어 목록 (Strapi 데이터)");
    console.log("  5. / - 최근 용어 5개");
    console.log();
    console.log("개발자 도구 (F12):");
    console.log("  - Application → Cookies → authjs.session-token");
    console.log("  - jwt.io에서 exp 필드 확인 (현재시각 + 7일)");
    console.log();

    process.exit(totalPassed === totalTests ? 0 : 1);
  } catch (error) {
    console.error("\n❌ 검증 중 치명적 오류 발생:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
