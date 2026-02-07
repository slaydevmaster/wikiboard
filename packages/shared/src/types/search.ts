/** Meilisearch 검색 요청 */
export interface SearchRequest {
  query: string;
  limit?: number;
  offset?: number;
  filter?: string;
}

/** Meilisearch 검색 결과 */
export interface SearchResult<T = SearchHit> {
  hits: T[];
  query: string;
  processingTimeMs: number;
  estimatedTotalHits: number;
}

/** 검색 히트 (용어 인덱스) */
export interface SearchHit {
  id: number;
  title: string;
  slug: string;
  one_liner: string;
  summary: string;
  tags: string[];
  aliases: string[];
  category: string;
}
