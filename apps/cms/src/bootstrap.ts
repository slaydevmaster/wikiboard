// 부트스트랩 파일
// Strapi 서버가 완전히 시작된 후 실행되는 초기화 로직입니다.
// Meilisearch 인덱싱 훅, 권한 설정 등에 사용합니다.

import { MeiliSearch } from "meilisearch";

// Meilisearch 클라이언트 (환경변수 기반)
const MEILI_HOST = process.env.MEILI_HOST || "http://127.0.0.1:7700";
const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY || "";

let meiliClient: MeiliSearch | null = null;

function getMeiliClient(): MeiliSearch | null {
  if (!MEILI_HOST) return null;

  if (!meiliClient) {
    meiliClient = new MeiliSearch({
      host: MEILI_HOST,
      apiKey: MEILI_MASTER_KEY || undefined,
    });
  }
  return meiliClient;
}

/**
 * Meilisearch에 콘텐츠를 인덱싱
 * published 상태인 경우에만 인덱싱하고, archived/삭제 시 제거합니다.
 */
async function indexToMeilisearch(
  indexName: string,
  document: Record<string, unknown>,
  status: string
) {
  const client = getMeiliClient();
  if (!client) return;

  try {
    if (status === "published") {
      await client.index(indexName).addDocuments([document]);
      console.log(`[Meilisearch] ${indexName}/${document.id} 인덱싱 완료`);
    } else if (status === "archived") {
      await client.index(indexName).deleteDocument(document.id as number);
      console.log(`[Meilisearch] ${indexName}/${document.id} 제거 (archived)`);
    }
  } catch (error) {
    // Meilisearch 연결 실패 시 콘텐츠 저장은 정상 진행
    console.warn(`[Meilisearch] 인덱싱 실패 (${indexName}):`, (error as Error).message);
  }
}

async function removeFromMeilisearch(indexName: string, id: number) {
  const client = getMeiliClient();
  if (!client) return;

  try {
    await client.index(indexName).deleteDocument(id);
    console.log(`[Meilisearch] ${indexName}/${id} 삭제 완료`);
  } catch (error) {
    console.warn(`[Meilisearch] 삭제 실패 (${indexName}):`, (error as Error).message);
  }
}

/**
 * 퍼블릭 역할에 콘텐츠 읽기 권한 부여
 * Term, Article, Category, Tag, Download의 find/findOne을 퍼블릭으로 설정합니다.
 */
async function setupPublicPermissions(strapi) {
  // 퍼블릭 읽기를 허용할 API 액션 목록
  const publicActions = [
    "api::term.term.find",
    "api::term.term.findOne",
    "api::article.article.find",
    "api::article.article.findOne",
    "api::category.category.find",
    "api::category.category.findOne",
    "api::tag.tag.find",
    "api::tag.tag.findOne",
    "api::download.download.find",
    "api::download.download.findOne",
  ];

  // public 역할 조회
  const publicRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "public" } });

  if (!publicRole) {
    strapi.log.warn("  퍼블릭 역할을 찾을 수 없습니다.");
    return;
  }

  // 각 액션에 대해 권한이 없으면 생성
  for (const action of publicActions) {
    const existing = await strapi
      .query("plugin::users-permissions.permission")
      .findOne({
        where: {
          role: publicRole.id,
          action,
        },
      });

    if (!existing) {
      await strapi
        .query("plugin::users-permissions.permission")
        .create({
          data: {
            action,
            role: publicRole.id,
            enabled: true,
          },
        });
    }
  }

  strapi.log.info("  퍼블릭 읽기 권한 설정 완료 (Term, Article, Category, Tag, Download)");
}

export default async ({ strapi }) => {
  // 서버 시작 로그
  strapi.log.info("=================================");
  strapi.log.info("  WikiBoard CMS 서버가 시작되었습니다.");
  strapi.log.info("=================================");

  // 퍼블릭 읽기 권한 자동 설정
  await setupPublicPermissions(strapi);

  // Meilisearch 연결 확인
  const client = getMeiliClient();
  if (client) {
    try {
      await client.health();
      strapi.log.info("  Meilisearch 연결 성공");

      // 인덱스 초기화 (없으면 생성)
      const indexes = ["terms", "articles"];
      for (const name of indexes) {
        try {
          await client.getIndex(name);
        } catch {
          await client.createIndex(name, { primaryKey: "id" });
          strapi.log.info(`  Meilisearch 인덱스 생성: ${name}`);
        }
      }

      // 검색 가능 필드 설정
      await client.index("terms").updateSearchableAttributes([
        "title", "one_liner", "summary", "body", "aliases",
      ]);
      await client.index("articles").updateSearchableAttributes([
        "title", "excerpt", "body",
      ]);
    } catch (error) {
      strapi.log.warn(`  Meilisearch 연결 실패: ${(error as Error).message}`);
      strapi.log.warn("  검색 기능 없이 계속 실행됩니다.");
    }
  }

  // === Term(용어) Lifecycle Hook ===
  strapi.db.lifecycles.subscribe({
    models: ["api::term.term"],

    async afterCreate(event) {
      const { result } = event;
      await indexToMeilisearch("terms", {
        id: result.id,
        title: result.title,
        slug: result.slug,
        one_liner: result.one_liner,
        summary: result.summary,
        body: result.body,
        aliases: result.aliases,
      }, result.status || "draft");
    },

    async afterUpdate(event) {
      const { result } = event;
      await indexToMeilisearch("terms", {
        id: result.id,
        title: result.title,
        slug: result.slug,
        one_liner: result.one_liner,
        summary: result.summary,
        body: result.body,
        aliases: result.aliases,
      }, result.status || "draft");
    },

    async afterDelete(event) {
      const { result } = event;
      if (result?.id) {
        await removeFromMeilisearch("terms", result.id);
      }
    },
  });

  // === Article(글/가이드) Lifecycle Hook ===
  strapi.db.lifecycles.subscribe({
    models: ["api::article.article"],

    async afterCreate(event) {
      const { result } = event;
      await indexToMeilisearch("articles", {
        id: result.id,
        title: result.title,
        slug: result.slug,
        excerpt: result.excerpt,
        body: result.body,
      }, result.status || "draft");
    },

    async afterUpdate(event) {
      const { result } = event;
      await indexToMeilisearch("articles", {
        id: result.id,
        title: result.title,
        slug: result.slug,
        excerpt: result.excerpt,
        body: result.body,
      }, result.status || "draft");
    },

    async afterDelete(event) {
      const { result } = event;
      if (result?.id) {
        await removeFromMeilisearch("articles", result.id);
      }
    },
  });

  strapi.log.info("  Lifecycle Hooks 등록 완료 (Term, Article → Meilisearch)");
};
