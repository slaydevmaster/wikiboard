// Admin 유저 목록 API
// GET /api/admin/users — 검색, 페이지네이션

import { NextRequest, NextResponse } from "next/server";
import { like, or, count, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";

export async function GET(req: NextRequest) {
  // 관리자 권한 확인
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "접근 권한이 없습니다." },
      { status: 403 }
    );
  }

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
  const searchRaw = searchParams.get("search")?.trim();

  // 검색어 길이 검증 (2-100자)
  let search: string | undefined;
  if (searchRaw) {
    if (searchRaw.length < 2) {
      return NextResponse.json(
        { error: "검색어는 최소 2자 이상이어야 합니다." },
        { status: 400 }
      );
    }
    if (searchRaw.length > 100) {
      return NextResponse.json(
        { error: "검색어는 최대 100자까지 가능합니다." },
        { status: 400 }
      );
    }
    search = searchRaw;
  }

  // 검색 조건
  const where = search
    ? or(
        like(users.name, `%${search}%`),
        like(users.email, `%${search}%`)
      )
    : undefined;

  // 전체 수 조회
  const [{ total }] = await db
    .select({ total: count() })
    .from(users)
    .where(where);

  // 페이지네이션된 목록 조회
  const userList = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      status: users.status,
      xp: users.xp,
      level: users.level,
      authMode: users.authMode,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(where)
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(desc(users.createdAt));

  return NextResponse.json({
    users: userList,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
