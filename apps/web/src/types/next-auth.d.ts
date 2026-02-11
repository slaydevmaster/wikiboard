// Auth.js 타입 확장
// JWT 토큰과 세션에 커스텀 필드(role, status, level, xp) 추가

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    status?: string;
    level?: number;
    xp?: number;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      status: string;
      level: number;
      xp: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    status?: string;
    level?: number;
    xp?: number;
  }
}
