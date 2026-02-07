/**
 * 메인 페이지
 * - 위키보드 타이틀 + 검색바 UI
 * - 최근 등록 용어, 인기 용어 등은 추후 추가
 */
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      {/* 타이틀 영역 */}
      <h1 className="mb-2 text-4xl font-bold text-gray-900">WikiBoard</h1>
      <p className="mb-10 text-lg text-gray-500">
        사전형 위키보드 -- 용어와 지식을 검색하세요
      </p>

      {/* 검색바 */}
      <form action="/search" method="GET" className="w-full max-w-xl">
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200">
          <input
            type="text"
            name="q"
            placeholder="용어, 키워드, 주제를 검색하세요..."
            className="flex-1 px-4 py-3 text-base outline-none placeholder:text-gray-400"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
          >
            검색
          </button>
        </div>
      </form>

      {/* 바로가기 */}
      <div className="mt-8 flex gap-4">
        <a
          href="/terms"
          className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          초성/A-Z 용어 색인
        </a>
        <a
          href="/search"
          className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          전체 검색
        </a>
      </div>

      {/* 최근 등록 용어 (추후 Strapi 연동) */}
      <section className="mt-16 w-full max-w-3xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          최근 등록된 용어
        </h2>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
          Strapi 연동 후 최근 발행된 용어가 표시됩니다.
        </div>
      </section>
    </div>
  );
}
