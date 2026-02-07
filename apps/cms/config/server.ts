// 서버 설정
// Strapi 서버의 호스트, 포트, 보안 키 등을 구성합니다.

export default ({ env }) => ({
  // 서버 호스트 (기본: 0.0.0.0)
  host: env("HOST", "0.0.0.0"),

  // 서버 포트 (루트 .env의 CMS_PORT 사용)
  port: env.int("CMS_PORT", env.int("PORT", 1337)),

  // 앱 보안 키 (루트 .env의 STRAPI_APP_KEYS 사용)
  app: {
    keys: env.array("STRAPI_APP_KEYS", env.array("APP_KEYS", [
      "wikiboard-key-1-change-me",
      "wikiboard-key-2-change-me",
    ])),
  },

  // 웹훅 설정
  webhooks: {
    // 웹훅 호출 시 자체 서명 인증서 허용 여부
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },

  // API 응답 설정
  api: {
    rest: {
      // 기본 페이지네이션 제한
      defaultLimit: 25,
      maxLimit: 100,
    },
  },

  // URL 설정 (프록시 뒤에서 실행할 때 설정)
  url: env("PUBLIC_URL", ""),
});
