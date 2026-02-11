/**
 * 어드민 대시보드 페이지
 * - 주요 통계 카드 (실제 DB 데이터)
 * - 최근 활동 로그
 * - 빠른 액션 버튼
 */

import type { Metadata } from "next";
import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, xpEvents } from "@/lib/schema";

export const metadata: Metadata = {
  title: "관리 대시보드 - WikiBoard",
  description: "WikiBoard 운영 관리 대시보드",
};

export default async function AdminDashboardPage() {
  // 실제 통계 조회
  const [
    [{ totalUsers }],
    [{ adminCount }],
    [{ activeUsers }],
    [{ totalXpEvents }],
  ] = await Promise.all([
    db.select({ totalUsers: count() }).from(users),
    db.select({ adminCount: count() }).from(users).where(eq(users.role, "admin")),
    db.select({ activeUsers: count() }).from(users).where(eq(users.status, "active")),
    db.select({ totalXpEvents: count() }).from(xpEvents),
  ]);

  const statCards = [
    { label: "전체 사용자", value: String(totalUsers), sub: `관리자 ${adminCount}명` },
    { label: "활성 사용자", value: String(activeUsers), sub: `전체의 ${totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%` },
    { label: "발행된 용어", value: "-", sub: "Strapi 연동 대기" },
    { label: "XP 이벤트", value: String(totalXpEvents), sub: "누적 기록" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">운영 대시보드</h1>

      {/* 통계 카드 그리드 */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-gray-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* 빠른 액션 */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">빠른 액션</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={`http://localhost:${process.env.CMS_PORT || 1337}/admin`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
          >
            Strapi CMS 열기
          </a>
          <Link
            href="/admin/users"
            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            사용자 관리
          </Link>
          <Link
            href="/admin/levels"
            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            레벨/XP 관리
          </Link>
        </div>
      </section>

      {/* 최근 활동 로그 */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">최근 활동</h2>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
          감사 로그 시스템 연동 후 최근 활동이 표시됩니다.
          <br />
          (사용자 가입, 용어 발행, 검수 요청 등)
        </div>
      </section>

      {/* 인기 용어 / 검색어 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            인기 용어 (조회수)
          </h2>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-400">
            통계 시스템 연동 후 표시됩니다.
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            인기 검색어
          </h2>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-400">
            Meilisearch 분석 연동 후 표시됩니다.
          </div>
        </section>
      </div>
    </div>
  );
}
