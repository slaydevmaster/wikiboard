// 부트스트랩 파일
// Strapi 서버가 완전히 시작된 후 실행되는 초기화 로직입니다.
// 초기 데이터 시딩, 권한 설정, 외부 서비스 연결 등에 사용합니다.

export default async ({ strapi }) => {
  // 서버 시작 로그
  strapi.log.info("=================================");
  strapi.log.info("  WikiBoard CMS 서버가 시작되었습니다.");
  strapi.log.info("=================================");

  // 예시: 기본 퍼블릭 권한 설정 (필요 시 주석 해제)
  // await setupDefaultPermissions(strapi);
};

/**
 * 기본 퍼블릭 권한 설정 예시
 * API의 find, findOne 엔드포인트를 퍼블릭으로 설정합니다.
 */
// async function setupDefaultPermissions(strapi) {
//   const publicRole = await strapi
//     .query("plugin::users-permissions.role")
//     .findOne({ where: { type: "public" } });
//
//   if (publicRole) {
//     // 퍼블릭 역할에 읽기 권한 부여 로직
//     strapi.log.info("퍼블릭 권한이 설정되었습니다.");
//   }
// }
