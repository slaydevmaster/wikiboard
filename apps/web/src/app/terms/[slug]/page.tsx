/**
 * 용어 상세 페이지
 * - 동적 라우트: /terms/[slug]
 * - Strapi에서 slug 기반으로 용어 조회
 */

import type { Metadata } from "next";
// import { getTermBySlug } from "@/lib/strapi";
import { notFound } from "next/navigation";

/** 동적 메타데이터 생성 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // TODO: Strapi 연동 후 실제 데이터로 메타데이터 생성
  // const response = await getTermBySlug(slug);
  // const term = response.data[0];

  return {
    title: `${slug} - WikiBoard`,
    description: `${slug} 용어에 대한 상세 설명`,
  };
}

export default async function TermDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // TODO: Strapi API 연동
  // const response = await getTermBySlug(slug);
  // const term = response.data[0];
  // if (!term) notFound();

  // 플레이스홀더 데이터 (Strapi 연동 전)
  const term = {
    title: slug,
    oneLiner: "용어에 대한 한줄 설명이 여기에 표시됩니다.",
    summary: "용어 요약이 여기에 표시됩니다.",
    body: "용어에 대한 상세 설명(본문)이 여기에 표시됩니다. Strapi CMS 연동 후 실제 콘텐츠로 대체됩니다.",
    category: "미분류",
    tags: ["예시태그"],
    aliases: [],
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* 브레드크럼 */}
      <nav className="mb-6 text-sm text-gray-500">
        <a href="/" className="hover:text-gray-700">
          홈
        </a>
        <span className="mx-2">/</span>
        <a href="/terms" className="hover:text-gray-700">
          용어 목록
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{term.title}</span>
      </nav>

      {/* 용어 헤더 */}
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{term.title}</h1>
        <p className="text-lg text-gray-600">{term.oneLiner}</p>

        {/* 메타 정보 */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            {term.category}
          </span>
          {term.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* 요약 */}
      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-800">요약</h2>
        <div className="rounded-lg bg-gray-50 p-4 text-gray-700">
          {term.summary}
        </div>
      </section>

      {/* 본문 */}
      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold text-gray-800">상세 설명</h2>
        <div className="prose prose-gray max-w-none">
          {/* TODO: Strapi 마크다운/리치텍스트 렌더링 */}
          <p>{term.body}</p>
        </div>
      </section>

      {/* 별칭 (있는 경우) */}
      {term.aliases.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            다른 표현 (별칭)
          </h2>
          <ul className="list-disc pl-5 text-gray-600">
            {term.aliases.map((alias) => (
              <li key={alias}>{alias}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 수정일 */}
      <footer className="border-t border-gray-200 pt-4 text-sm text-gray-400">
        마지막 수정:{" "}
        {new Date(term.updatedAt).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </footer>
    </div>
  );
}
