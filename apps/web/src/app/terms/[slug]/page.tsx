/**
 * 용어 상세 페이지
 * - Strapi에서 slug로 용어 조회
 * - Markdown 본문 렌더링
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTermBySlug, type StrapiItem } from "@/lib/strapi";

interface Term {
  title: string;
  slug: string;
  one_liner: string | null;
  summary: string | null;
  body: string | null;
  aliases: string | null;
  publishedAt: string | null;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await getTermBySlug(slug);
    const term: StrapiItem<Term> | null = response.data?.[0] || null;

    if (!term) {
      return {
        title: "용어를 찾을 수 없습니다 - WikiBoard",
      };
    }

    return {
      title: `${term.attributes.title} - WikiBoard`,
      description: term.attributes.one_liner || term.attributes.summary || undefined,
    };
  } catch {
    return {
      title: "용어를 찾을 수 없습니다 - WikiBoard",
    };
  }
}

export default async function TermDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let term: StrapiItem<Term> | null = null;

  try {
    const response = await getTermBySlug(slug);
    term = response.data?.[0] || null;
  } catch (error) {
    console.error("용어 조회 실패:", error);
  }

  if (!term) {
    notFound();
  }

  const { title, one_liner, summary, body, aliases, publishedAt } = term.attributes;

  return (
    <article>
      {/* 상단 헤더 */}
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{title}</h1>

        {one_liner && (
          <p className="mb-3 text-lg text-gray-700">{one_liner}</p>
        )}

        {aliases && (
          <div className="mb-2 text-sm text-gray-500">
            <span className="font-medium">별칭:</span> {aliases}
          </div>
        )}

        {publishedAt && (
          <div className="text-sm text-gray-400">
            발행일: {new Date(publishedAt).toLocaleDateString("ko-KR")}
          </div>
        )}
      </header>

      {/* 요약 */}
      {summary && (
        <section className="mb-6 rounded-lg bg-blue-50 p-4">
          <h2 className="mb-2 text-sm font-semibold text-blue-900">요약</h2>
          <p className="text-sm text-blue-800">{summary}</p>
        </section>
      )}

      {/* 본문 (Markdown 렌더링) */}
      {body && (
        <section className="prose prose-slate max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // 링크 새 탭에서 열기
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
              // 헤딩 스타일
              h1: ({ node, ...props }) => (
                <h1 className="text-2xl font-bold text-gray-900" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="mt-6 text-xl font-semibold text-gray-800" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="mt-4 text-lg font-medium text-gray-800" {...props} />
              ),
              // 코드 블록
              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match;

                if (isInline) {
                  return (
                    <code
                      className="rounded bg-gray-100 px-1 py-0.5 text-sm text-gray-800"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }

                return (
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4">
                    <code className={`text-sm text-gray-100 ${className}`} {...props}>
                      {children}
                    </code>
                  </pre>
                );
              },
              // 인용구
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-gray-300 pl-4 italic text-gray-600"
                  {...props}
                />
              ),
            }}
          >
            {body}
          </ReactMarkdown>
        </section>
      )}

      {!body && !summary && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
          본문이 작성되지 않았습니다.
        </div>
      )}

      {/* 하단 네비게이션 */}
      <footer className="mt-12 border-t border-gray-200 pt-6">
        <a
          href="/terms"
          className="inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          ← 용어 목록으로 돌아가기
        </a>
      </footer>
    </article>
  );
}
