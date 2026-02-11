/**
 * 어드민 레이아웃
 * - /admin 하위 모든 페이지에 적용
 * - 좌측 사이드바 네비게이션 + 우측 콘텐츠 영역
 * - Auth.js 세션 확인 후 접근 제어
 */

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/** 어드민 사이드바 메뉴 항목 */
const ADMIN_MENU = [
  { label: "대시보드", href: "/admin", icon: "dashboard" },
  { label: "사용자 관리", href: "/admin/users", icon: "users" },
  { label: "레벨/XP 관리", href: "/admin/levels", icon: "levels" },
  { label: "감사 로그", href: "/admin/logs", icon: "logs" },
  { label: "통계", href: "/admin/stats", icon: "stats" },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 인증 확인 - 관리자만 접근 가능
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      {/* 사이드바 */}
      <aside className="w-60 shrink-0 border-r border-gray-200 bg-gray-50">
        <div className="p-4">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
            운영 관리
          </h2>
          <nav className="space-y-1">
            {ADMIN_MENU.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                {/* TODO: 아이콘 컴포넌트로 교체 */}
                <span className="h-4 w-4 rounded bg-gray-300" />
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* 공개 사이트로 돌아가기 */}
        <div className="border-t border-gray-200 p-4">
          <a
            href="/"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            공개 사이트로 돌아가기
          </a>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
