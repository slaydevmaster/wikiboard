// 어드민 패널 설정
// 관리자 패널의 인증, URL 등을 구성합니다.

export default ({ env }) => ({
  // 어드민 패널 인증 관련 비밀 키 (루트 .env: STRAPI_ADMIN_JWT_SECRET)
  auth: {
    secret: env("STRAPI_ADMIN_JWT_SECRET", env("ADMIN_JWT_SECRET", "wikiboard-admin-jwt-secret-change-me")),
  },

  // API 토큰용 솔트 값 (루트 .env: STRAPI_API_TOKEN_SALT)
  apiToken: {
    salt: env("STRAPI_API_TOKEN_SALT", env("API_TOKEN_SALT", "wikiboard-api-token-salt-change-me")),
  },

  // 전송 토큰용 솔트 값 (루트 .env: STRAPI_TRANSFER_TOKEN_SALT)
  transfer: {
    token: {
      salt: env("STRAPI_TRANSFER_TOKEN_SALT", env("TRANSFER_TOKEN_SALT", "wikiboard-transfer-token-salt-change-me")),
    },
  },

  // 어드민 패널이 호스팅될 URL 경로
  url: env("ADMIN_URL", "/admin"),

  // 자동 열기 비활성화 (CI/CD 환경 등에서 유용)
  autoOpen: false,

  // 비밀번호 보안 설정
  forgotPassword: {
    // 비밀번호 재설정 이메일의 발신 주소
    from: env("ADMIN_FORGOT_PASSWORD_FROM", "no-reply@wikiboard.local"),
    // 비밀번호 재설정 페이지 URL
    replyTo: env("ADMIN_FORGOT_PASSWORD_REPLY_TO", "no-reply@wikiboard.local"),
  },
});
