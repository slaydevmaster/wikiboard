"use client";

/**
 * 카테고리 사이드바 네비게이션 (클라이언트 컴포넌트)
 * - URL의 category 파라미터로 활성 카테고리 감지
 * - FN위키 스타일 왼쪽 메뉴
 */

import { useSearchParams, usePathname } from "next/navigation";

interface CategorySidebarNavProps {
  categories: { id: number; name: string; slug: string }[];
}

export function CategorySidebarNav({ categories }: CategorySidebarNavProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeCategory = searchParams.get("category") || "";
  // 상세 페이지(/terms/[slug])인지 판별
  const isDetailPage = pathname !== "/terms" && pathname.startsWith("/terms/");

  return (
    <aside className="w-52 shrink-0">
      <nav className="sticky top-4 space-y-0.5">
        {/* 전체 용어 */}
        <a
          href="/terms"
          className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
            !activeCategory && !isDetailPage
              ? "bg-brand-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          전체 용어
        </a>

        {/* 카테고리 목록 */}
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/terms?category=${cat.slug}`}
            className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              activeCategory === cat.slug
                ? "bg-brand-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {cat.name}
          </a>
        ))}

        {categories.length === 0 && (
          <p className="px-3 py-2 text-xs text-gray-400">
            Strapi에서 카테고리를 추가하세요
          </p>
        )}

        {/* 구분선 + 추가 링크 */}
        <div className="my-3 border-t border-gray-200" />

        <a
          href="/search"
          className="block rounded-md px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          검색
        </a>
      </nav>
    </aside>
  );
}
