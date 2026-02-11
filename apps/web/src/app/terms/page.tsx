/**
 * 용어 목록 페이지
 * - 초성(ㄱ~ㅎ) / A-Z 인덱스로 탐색
 * - 카테고리별 필터링 지원
 * - Strapi API 연동으로 실제 용어 데이터 표시
 */

import type { Metadata } from "next";
import {
  getTermsByInitial,
  getTermsByCategory,
  getTerms,
  type StrapiItem,
} from "@/lib/strapi";

export const metadata: Metadata = {
  title: "용어 목록 - WikiBoard",
  description: "초성/A-Z 인덱스로 탐색하는 위키보드 용어 목록",
};

/** 한글 초성 배열 */
const KOREAN_INITIALS = [
  "ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ",
  "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];

/** 영문 알파벳 배열 */
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface Term {
  title: string;
  slug: string;
  one_liner: string | null;
  summary: string | null;
}

export default async function TermsPage({
  searchParams,
}: {
  searchParams: Promise<{ index?: string; page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || "";
  const activeIndex = params.index || "";
  const currentPage = Number(params.page) || 1;

  // 카테고리 모드 vs 초성 모드 판별
  const isCategoryMode = !!activeCategory;
  const displayIndex = activeIndex || "ㄱ";

  let terms: StrapiItem<Term>[] = [];
  let pagination = null;
  let error = null;

  try {
    if (isCategoryMode) {
      // 카테고리별 필터
      const response = await getTermsByCategory(activeCategory, currentPage, 20);
      terms = response.data;
      pagination = response.meta?.pagination;
    } else if (activeIndex) {
      // 초성/A-Z 필터
      const response = await getTermsByInitial(activeIndex, currentPage, 20);
      terms = response.data;
      pagination = response.meta?.pagination;
    } else {
      // 기본: 전체 목록 (초성 없이)
      const response = await getTerms(currentPage, 20);
      terms = response.data;
      pagination = response.meta?.pagination;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "용어를 불러오는 중 오류가 발생했습니다";
    console.error("용어 목록 조회 실패:", err);
  }

  // 페이지네이션 URL 생성 헬퍼
  const buildPageUrl = (page: number) => {
    const qs = new URLSearchParams();
    if (activeCategory) qs.set("category", activeCategory);
    if (activeIndex) qs.set("index", activeIndex);
    qs.set("page", String(page));
    return `/terms?${qs.toString()}`;
  };

  // 제목 결정
  let sectionTitle = "전체 용어";
  if (isCategoryMode) {
    sectionTitle = `카테고리: ${activeCategory}`;
  } else if (activeIndex) {
    sectionTitle = `"${activeIndex}" (으)로 시작하는 용어`;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">용어 목록</h1>

      {/* 한글 초성 인덱스 */}
      <section className="mb-4">
        <h2 className="mb-2 text-sm font-medium text-gray-500">한글 초성</h2>
        <div className="flex flex-wrap gap-1">
          {KOREAN_INITIALS.map((initial) => (
            <a
              key={initial}
              href={`/terms?index=${encodeURIComponent(initial)}${activeCategory ? `&category=${activeCategory}` : ""}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                activeIndex === initial
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {initial}
            </a>
          ))}
        </div>
      </section>

      {/* 영문 A-Z 인덱스 */}
      <section className="mb-8">
        <h2 className="mb-2 text-sm font-medium text-gray-500">A - Z</h2>
        <div className="flex flex-wrap gap-1">
          {ALPHABET.map((letter) => (
            <a
              key={letter}
              href={`/terms?index=${letter}${activeCategory ? `&category=${activeCategory}` : ""}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                activeIndex === letter
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {letter}
            </a>
          ))}
        </div>
      </section>

      {/* 용어 목록 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          {sectionTitle}
          {pagination && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({pagination.total}개)
            </span>
          )}
        </h2>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!error && terms.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
            {isCategoryMode
              ? "이 카테고리에 등록된 용어가 없습니다."
              : activeIndex
                ? `"${activeIndex}"(으)로 시작하는 용어가 없습니다.`
                : "등록된 용어가 없습니다."}
          </div>
        )}

        {!error && terms.length > 0 && (
          <>
            <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
              {terms.map((term) => (
                <li key={term.id} className="p-4 transition-colors hover:bg-gray-50">
                  <a href={`/terms/${term.attributes.slug}`} className="block">
                    <h3 className="mb-1 text-base font-semibold text-gray-900">
                      {term.attributes.title}
                    </h3>
                    {term.attributes.one_liner && (
                      <p className="text-sm text-gray-600">
                        {term.attributes.one_liner}
                      </p>
                    )}
                  </a>
                </li>
              ))}
            </ul>

            {/* 페이지네이션 */}
            {pagination && pagination.pageCount > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <a
                    href={buildPageUrl(currentPage - 1)}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    ← 이전
                  </a>
                )}
                <span className="text-sm text-gray-600">
                  {currentPage} / {pagination.pageCount}
                </span>
                {currentPage < pagination.pageCount && (
                  <a
                    href={buildPageUrl(currentPage + 1)}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    다음 →
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
