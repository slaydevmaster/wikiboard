// NextAuth v5 설정
// Credentials 프로바이더 (LOCAL 모드) + JWT 세션
// DrizzleAdapter는 OAuth(소셜 로그인) 사용 시 필요 — v0에서는 Credentials만 쓰므로 제외
// v1에서 SSO/OAuth 추가 시 어댑터 다시 연결

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "./schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // JWT 세션 전략 (DB 세션 조회 없이 role/level 확인 가능)
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7일 (604800초)
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "이메일 로그인",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // 정지된 계정 차단
        if (user.status !== "active") return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          status: user.status,
          level: user.level,
          xp: user.xp,
        };
      },
    }),
  ],

  callbacks: {
    // JWT 토큰에 커스텀 필드 추가
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.status = user.status;
        token.level = user.level;
        token.xp = user.xp;
      }
      return token;
    },

    // 세션에 JWT 토큰 데이터 전달
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
        session.user.level = token.level as number;
        session.user.xp = token.xp as number;
      }
      return session;
    },
  },

  trustHost: true,
});
