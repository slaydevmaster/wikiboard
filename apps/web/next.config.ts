import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 모노레포에서 shared 패키지 트랜스파일
  transpilePackages: ["@wikiboard/shared"],

  // 이미지 최적화 - Strapi 업로드 도메인 허용
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },

  // 서버 액션 활성화 (Next.js 15 기본 활성)
  experimental: {
    // 필요 시 실험적 기능 추가
  },
};

export default nextConfig;
