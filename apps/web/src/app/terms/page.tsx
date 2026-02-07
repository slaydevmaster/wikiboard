/**
 * 용어 목록 페이지
 * - 초성(ㄱ~ㅎ) / A-Z 인덱스로 탐색
 * - Strapi 연동 후 실제 용어 데이터 표시
 */

import type { Metadata } from "next";

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

export default async function TermsPage({
  searchParams,
}: {
  searchParams: Promise<{ index?: string; page?: string }>;
}) {
  const params = await searchParams;
  const activeIndex = params.index || "ㄱ";
  const currentPage = Number(params.page) || 1;

  // TODO: Strapi API 연동 - getTerms() 호출
  // const terms = await getTerms(currentPage);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">용어 목록</h1>

      {/* 한글 초성 인덱스 */}
      <section className="mb-4">
        <h2 className="mb-2 text-sm font-medium text-gray-500">한글 초성</h2>
        <div className="flex flex-wrap gap-1">
          {KOREAN_INITIALS.map((initial) => (
            <a
              key={initial}
              href={`/terms?index=${encodeURIComponent(initial)}`}
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
              href={`/terms?index=${letter}`}
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

      {/* 용어 목록 (Strapi 연동 전 플레이스홀더) */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          &ldquo;{activeIndex}&rdquo; (으)로 시작하는 용어
        </h2>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
          Strapi 연동 후 &ldquo;{activeIndex}&rdquo;(으)로 시작하는 용어
          목록이 표시됩니다.
          <br />
          현재 페이지: {currentPage}
        </div>

        {/* TODO: 실제 용어 목록 렌더링 */}
        {/*
        <ul className="divide-y divide-gray-100">
          {terms.data.map((term) => (
            <li key={term.id} className="py-3">
              <a href={`/terms/${term.attributes.slug}`}>
                <h3>{term.attributes.title}</h3>
                <p>{term.attributes.one_liner}</p>
              </a>
            </li>
          ))}
        </ul>
        */}
      </section>
    </div>
  );
}
