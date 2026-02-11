/**
 * 용어 영역 공통 레이아웃
 * - 왼쪽: 카테고리 사이드바 (FN위키 스타일)
 * - 오른쪽: 콘텐츠 영역
 */

import { Suspense } from "react";
import { CategorySidebar } from "@/components/wiki/category-sidebar";

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
      {/* 사이드바 - 데스크톱에서만 표시 */}
      <div className="hidden lg:block">
        <Suspense
          fallback={
            <aside className="w-52 shrink-0">
              <nav className="sticky top-4 space-y-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-9 animate-pulse rounded-md bg-gray-100"
                  />
                ))}
              </nav>
            </aside>
          }
        >
          <CategorySidebar />
        </Suspense>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
