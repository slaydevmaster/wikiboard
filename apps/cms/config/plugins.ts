// 플러그인 설정
// Strapi에서 사용하는 플러그인의 활성화 여부와 옵션을 구성합니다.

export default ({ env }) => ({
  // 사용자 권한 플러그인
  "users-permissions": {
    config: {
      jwt: {
        // JWT 토큰 만료 시간 (기본: 30일)
        expiresIn: env("JWT_EXPIRES_IN", "30d"),
      },
      // JWT 비밀 키
      jwtSecret: env("JWT_SECRET", "wikiboard-jwt-secret-change-me"),
    },
  },

  // 파일 업로드 플러그인
  upload: {
    config: {
      // 업로드 파일 크기 제한 (기본: 200MB)
      sizeLimit: env.int("UPLOAD_SIZE_LIMIT", 200 * 1024 * 1024),

      // 로컬 서버 프로바이더 설정 (기본값)
      provider: "local",
      providerOptions: {
        localServer: {
          maxage: 300000, // 캐시 유효 시간 (밀리초)
        },
      },
      // 허용할 파일 확장자
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
    },
  },

  // 국제화(i18n) 플러그인
  i18n: {
    enabled: true,
    config: {
      defaultLocale: "ko", // 기본 로케일: 한국어
    },
  },
});
