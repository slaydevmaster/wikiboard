// Admin XP 조정 API
// POST /api/admin/xp — XP 수동 조정 (트랜잭션)

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, xpEvents } from "@/lib/schema";
import { addXpAndRecalculate } from "@/lib/level";

export async function POST(req: Request) {
  // 관리자 권한 확인
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "접근 권한이 없습니다." },
      { status: 403 }
    );
  }

  const { userId, xpAmount, action, description } = await req.json();

  // 유효성 검증
  if (!userId || xpAmount === undefined || !action) {
    return NextResponse.json(
      { error: "userId, xpAmount, action은 필수입니다." },
      { status: 400 }
    );
  }

  if (typeof xpAmount !== "number" || xpAmount === 0) {
    return NextResponse.json(
      { error: "xpAmount는 0이 아닌 숫자여야 합니다." },
      { status: 400 }
    );
  }

  // 대상 유저 확인
  const [user] = await db
    .select({ id: users.id, xp: users.xp })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return NextResponse.json(
      { error: "사용자를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  // XP 재계산
  const { newXp, newLevel } = addXpAndRecalculate(user.xp, xpAmount);

  // 트랜잭션: XP 이벤트 기록 + 유저 XP/레벨 업데이트
  await db.transaction(async (tx) => {
    await tx.insert(xpEvents).values({
      userId,
      action,
      xpAmount,
      description: description || "",
    });

    await tx
      .update(users)
      .set({ xp: newXp, level: newLevel })
      .where(eq(users.id, userId));
  });

  return NextResponse.json({
    success: true,
    newXp,
    newLevel,
  });
}
