// Admin 유저 수정 API
// PATCH /api/admin/users/[id] — 역할/상태 변경

import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";

const VALID_ROLES = ["admin", "member"];
const VALID_STATUSES = ["active", "suspended"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 관리자 권한 확인
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "접근 권한이 없습니다." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await req.json();
  const { role, status } = body;

  // 유효성 검증
  if (role && !VALID_ROLES.includes(role)) {
    return NextResponse.json(
      { error: `유효하지 않은 역할입니다. (${VALID_ROLES.join(", ")})` },
      { status: 400 }
    );
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `유효하지 않은 상태입니다. (${VALID_STATUSES.join(", ")})` },
      { status: 400 }
    );
  }

  // 대상 유저 존재 확인
  const [targetUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!targetUser) {
    return NextResponse.json(
      { error: "사용자를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  // 자기 자신의 역할은 변경 불가 (안전장치)
  if (role && id === session.user.id) {
    return NextResponse.json(
      { error: "자신의 역할은 변경할 수 없습니다." },
      { status: 400 }
    );
  }

  // 업데이트
  const updateData: Record<string, string> = {};
  if (role) updateData.role = role;
  if (status) updateData.status = status;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "변경할 항목이 없습니다." },
      { status: 400 }
    );
  }

  await db.update(users).set(updateData).where(eq(users.id, id));

  return NextResponse.json({ success: true });
}
