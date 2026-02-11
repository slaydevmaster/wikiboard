// 회원가입 API
// POST /api/auth/register — 이메일/비밀번호 회원가입

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 필수 항목 검증
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "이름, 이메일, 비밀번호를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 형식이 아닙니다." },
        { status: 400 }
      );
    }

    // 비밀번호 복잡도 검증 (영문+숫자 조합, 최소 8자)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: "비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다." },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다." },
        { status: 409 }
      );
    }

    // 비밀번호 해싱 + 유저 생성
    const hashedPassword = await bcrypt.hash(password, 12);

    await db.insert(users).values({
      id: crypto.randomUUID(),
      email,
      name,
      password: hashedPassword,
      role: "member",
      status: "active",
      authMode: "LOCAL",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("회원가입 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
