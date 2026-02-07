/** 콘텐츠 발행 상태 */
export type ContentStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';

/** 용어 (사전형 핵심) */
export interface Term {
  id: number;
  title: string;
  slug: string;
  one_liner: string;       // 한줄 정의
  summary: string;          // 요약
  body: string;             // 본문 (마크다운)
  aliases: string[];        // 동의어/약어
  status: ContentStatus;
  publish_at: string | null;    // 예약 발행 시각
  published_at: string | null;  // 실제 발행 시각
  created_at: string;
  updated_at: string;
  category: Category | null;
  tags: Tag[];
}

/** 글/가이드 */
export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;          // 발췌
  body: string;
  status: ContentStatus;
  publish_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category: Category | null;
  tags: Tag[];
}

/** 카테고리 */
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

/** 태그 */
export interface Tag {
  id: number;
  name: string;
  slug: string;
}

/** 다운로드 자료 */
export interface Download {
  id: number;
  title: string;
  slug: string;
  description: string;
  file_url: string;
  file_size: number;
  status: ContentStatus;
  download_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category: Category | null;
  tags: Tag[];
}
