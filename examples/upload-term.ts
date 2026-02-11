/**
 * WikiBoard 용어 업로드 예시 (Node.js/TypeScript)
 *
 * 사용법:
 *   1. 환경변수 설정:
 *      set STRAPI_URL=http://localhost:1337
 *      set STRAPI_API_TOKEN=your-token-here
 *   2. npx tsx examples/upload-term.ts
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.STRAPI_API_TOKEN || "";

interface TermData {
  title: string;
  slug: string;
  body: string;
  status?: "draft" | "review" | "scheduled" | "published" | "archived";
  one_liner?: string;
  summary?: string;
  aliases?: string[];
  category?: number;
  tags?: number[];
}

interface ArticleData {
  title: string;
  slug: string;
  body: string;
  status?: "draft" | "review" | "scheduled" | "published" | "archived";
  excerpt?: string;
  category?: number;
  tags?: number[];
}

/**
 * WikiBoard에 용어 업로드
 */
async function uploadTerm(termData: TermData) {
  if (!API_TOKEN) {
    console.error("STRAPI_API_TOKEN 환경변수를 설정하세요.");
    process.exit(1);
  }

  const response = await fetch(`${STRAPI_URL}/api/terms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ data: termData }),
  });

  const result = await response.json();

  if (response.ok) {
    const docId = result.data?.documentId || "?";
    console.log(`  용어 생성 성공: ${termData.title} (documentId: ${docId})`);
    return result;
  } else {
    console.error(`  용어 생성 실패: ${response.status}`);
    console.error("  응답:", JSON.stringify(result, null, 2));
    return null;
  }
}

/**
 * WikiBoard에 글/보고서 업로드
 */
async function uploadArticle(articleData: ArticleData) {
  if (!API_TOKEN) {
    console.error("STRAPI_API_TOKEN 환경변수를 설정하세요.");
    process.exit(1);
  }

  const response = await fetch(`${STRAPI_URL}/api/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ data: articleData }),
  });

  const result = await response.json();

  if (response.ok) {
    const docId = result.data?.documentId || "?";
    console.log(`  글 생성 성공: ${articleData.title} (documentId: ${docId})`);
    return result;
  } else {
    console.error(`  글 생성 실패: ${response.status}`);
    console.error("  응답:", JSON.stringify(result, null, 2));
    return null;
  }
}

// 사용 예시
async function main() {
  console.log("=== WikiBoard 콘텐츠 업로드 예시 ===\n");

  // 용어 업로드
  await uploadTerm({
    title: "GraphQL",
    slug: "graphql",
    one_liner: "Facebook이 개발한 API 쿼리 언어",
    summary: "클라이언트가 필요한 데이터를 정확히 요청할 수 있는 쿼리 언어입니다.",
    body: "# GraphQL\n\nGraphQL은 API를 위한 쿼리 언어이자 데이터에 대한 타입 시스템을 제공합니다.\n\n## 장점\n- 오버페칭/언더페칭 해결\n- 강력한 타입 시스템\n- 단일 엔드포인트",
    status: "draft",
    aliases: ["GQL"],
  });

  // 보고서 업로드
  await uploadArticle({
    title: "프로젝트 시작 가이드",
    slug: "project-start-guide",
    excerpt: "새 프로젝트를 시작할 때 참고하는 체크리스트",
    body: "# 프로젝트 시작 가이드\n\n## 1단계: 환경 설정\n- Node.js 설치\n- Docker 설치\n\n## 2단계: 프로젝트 클론\n```bash\ngit clone ...\nnpm install\n```",
    status: "draft",
  });
}

main().catch(console.error);

export { uploadTerm, uploadArticle };
export type { TermData, ArticleData };
