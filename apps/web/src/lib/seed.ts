// 시드 스크립트 — 초기 관리자 계정 생성
// 실행: npm run db:seed

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { users } from "./schema";

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USERNAME || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "wikiboard",
  });

  const db = drizzle(pool, { mode: "default" });

  console.log("시드 실행 중...");

  // 관리자 계정 확인
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, "admin@wikiboard.local"))
    .limit(1);

  if (existing.length > 0) {
    console.log("관리자 계정이 이미 존재합니다: admin@wikiboard.local");
  } else {
    const hashedPassword = await bcrypt.hash("admin1234", 12);
    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: "admin@wikiboard.local",
      name: "관리자",
      password: hashedPassword,
      role: "admin",
      status: "active",
      authMode: "LOCAL",
      xp: 0,
      level: 1,
    });
    console.log("관리자 계정 생성 완료: admin@wikiboard.local / admin1234");
  }

  await pool.end();
  console.log("시드 완료!");
}

seed().catch((err) => {
  console.error("시드 실패:", err);
  process.exit(1);
});
