// 미들웨어 설정
// Strapi에서 사용하는 미들웨어 목록과 설정을 구성합니다.

export default [
  // 에러 핸들링 미들웨어
  "strapi::errors",

  // 보안 관련 미들웨어 (CORS, CSP, XSS 등)
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io", // Strapi 마켓플레이스 이미지
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },

  // CORS 설정
  {
    name: "strapi::cors",
    config: {
      // 허용할 오리진 목록 (개발 환경에서는 모두 허용)
      origin: ["*"],
      headers: ["*"],
    },
  },

  // Powered-By 헤더 미들웨어
  "strapi::poweredBy",

  // 로거 미들웨어
  "strapi::logger",

  // 쿼리 파서 미들웨어
  "strapi::query",

  // 요청 바디 파서 미들웨어
  "strapi::body",

  // 세션 미들웨어
  "strapi::session",

  // 인증 관련 미들웨어
  "strapi::favicon",

  // 퍼블릭 파일 서빙 미들웨어
  "strapi::public",
];
