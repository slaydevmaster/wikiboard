/**
 * Meilisearch 클라이언트 설정
 *
 * - Meilisearch JS 클라이언트를 사용한 검색 기능
 * - 자동완성, 오타 허용, 빠른 검색 지원
 * - 환경변수: MEILISEARCH_HOST, MEILISEARCH_API_KEY
 */

import { MeiliSearch } from "meilisearch";

/** Meilisearch 호스트 주소 */
const MEILISEARCH_HOST =
  process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "http://localhost:7700";

/** Meilisearch 검색 전용 API 키 (공개 가능) */
const MEILISEARCH_SEARCH_KEY =
  process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY || "";

/** Meilisearch 관리 API 키 (서버 전용, 비공개) */
const MEILISEARCH_ADMIN_KEY =
  process.env.MEILISEARCH_ADMIN_KEY || "";

/**
 * 검색 전용 클라이언트 (클라이언트/서버 모두 사용 가능)
 * - 읽기 전용 검색 키 사용
 */
export const searchClient = new MeiliSearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_SEARCH_KEY,
});

/**
 * 관리 전용 클라이언트 (서버 컴포넌트/API 라우트에서만 사용)
 * - 인덱스 생성, 문서 추가/삭제 등 관리 작업용
 */
export const adminClient = new MeiliSearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_ADMIN_KEY,
});

/** 인덱스 이름 상수 */
export const INDEXES = {
  TERMS: "terms",
  ARTICLES: "articles",
  DOWNLOADS: "downloads",
} as const;

/** 검색 결과 타입 */
export interface SearchResult {
  id: number;
  title: string;
  slug: string;
  oneLiner: string;
  category: string;
  tags: string[];
}

/**
 * 용어 검색
 *
 * @param query - 검색 쿼리
 * @param options - 검색 옵션 (limit, offset, filter 등)
 * @returns 검색 결과
 */
export async function searchTerms(
  query: string,
  options?: {
    limit?: number;
    offset?: number;
    filter?: string[];
  }
) {
  const index = searchClient.index(INDEXES.TERMS);

  return index.search<SearchResult>(query, {
    limit: options?.limit ?? 20,
    offset: options?.offset ?? 0,
    filter: options?.filter,
    attributesToHighlight: ["title", "oneLiner"],
    highlightPreTag: "<mark>",
    highlightPostTag: "</mark>",
  });
}

/**
 * 자동완성용 검색 (빠른 응답을 위해 결과 수 제한)
 *
 * @param query - 검색 쿼리
 * @returns 자동완성 결과 (최대 5개)
 */
export async function autoComplete(query: string) {
  const index = searchClient.index(INDEXES.TERMS);

  return index.search<SearchResult>(query, {
    limit: 5,
    attributesToRetrieve: ["title", "slug", "oneLiner"],
  });
}
