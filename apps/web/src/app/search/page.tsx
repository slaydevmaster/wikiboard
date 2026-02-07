/**
 * 검색 결과 페이지
 * - URL 쿼리 파라미터 q로 검색어 전달
 * - Meilisearch를 통한 빠른 검색 + 하이라이팅
 */

import type { Metadata } from "next";
// import { searchTerms } from "@/lib/meilisearch";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || "";

  return {
    title: query ? `"${query}" 검색 결과 - WikiBoard` : "검색 - WikiBoard",
    description: "위키보드에서 용어, 가이드, 자료를 검색하세요.",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const currentPage = Number(params.page) || 1;
  const pageSize = 20;

  // TODO: Meilisearch 연동
  // let results = null;
  // if (query) {
  //   results = await searchTerms(query, {
  //     limit: pageSize,
  //     offset: (currentPage - 1) * pageSize,
  //   });
  // }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">검색</h1>

      {/* 검색 입력 폼 */}
      <form action="/search" method="GET" className="mb-8">
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="검색어를 입력하세요..."
            className="flex-1 px-4 py-3 text-base outline-none placeholder:text-gray-400"
            autoComplete="off"
            autoFocus
          />
          <button
            type="submit"
            className="bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
          >
            검색
          </button>
        </div>
      </form>

      {/* 검색 결과 */}
      {query ? (
        <section>
          <div className="mb-4 text-sm text-gray-500">
            &ldquo;{query}&rdquo; 검색 결과
            {/* TODO: 실제 결과 수 표시 */}
          </div>

          {/* 결과 목록 (Meilisearch 연동 전 플레이스홀더) */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
            Meilisearch 연동 후 &ldquo;{query}&rdquo;에 대한 검색 결과가
            표시됩니다.
            <br />
            오타 허용, 자동완성, 하이라이팅 기능이 포함됩니다.
          </div>

          {/* TODO: 실제 검색 결과 렌더링 */}
          {/*
          {results && results.hits.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {results.hits.map((hit) => (
                <li key={hit.id} className="py-4">
                  <a href={`/terms/${hit.slug}`} className="block hover:bg-gray-50 -mx-2 px-2 py-1 rounded">
                    <h3 className="text-base font-medium text-gray-900"
                        dangerouslySetInnerHTML={{
                          __html: hit._formatted?.title || hit.title,
                        }}
                    />
                    <p className="mt-1 text-sm text-gray-500"
                       dangerouslySetInnerHTML={{
                         __html: hit._formatted?.oneLiner || hit.oneLiner,
                       }}
                    />
                    <span className="mt-1 inline-block text-xs text-gray-400">
                      {hit.category}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-gray-500">
              검색 결과가 없습니다.
            </p>
          )}
          */}

          {/* 페이지네이션 영역 */}
          <nav className="mt-8 flex justify-center gap-2">
            {currentPage > 1 && (
              <a
                href={`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                이전
              </a>
            )}
            <span className="rounded-md border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
              {currentPage}
            </span>
            <a
              href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              다음
            </a>
          </nav>
        </section>
      ) : (
        /* 검색어가 없을 때 안내 */
        <div className="py-16 text-center">
          <p className="text-lg text-gray-400">
            검색어를 입력하면 용어, 가이드, 자료를 검색할 수 있습니다.
          </p>
          <p className="mt-2 text-sm text-gray-300">
            자동완성과 오타 허용 검색을 지원합니다.
          </p>
        </div>
      )}
    </div>
  );
}
