/**
 * Strapi API 클라이언트 (서버 컴포넌트 전용)
 *
 * - fetch 기반으로 구현하여 Next.js 서버 컴포넌트에서 직접 사용
 * - Strapi v5 REST API 호출
 * - 환경변수: STRAPI_API_URL, STRAPI_API_TOKEN
 */

const CMS_PORT = process.env.CMS_PORT || "1337";
const STRAPI_API_URL =
  process.env.STRAPI_API_URL || `http://localhost:${CMS_PORT}/api`;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";

/** Strapi API 응답의 공통 구조 */
interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/** Strapi API 단일 항목 구조 */
interface StrapiItem<T> {
  id: number;
  documentId: string;
  attributes: T;
}

/** Strapi API 요청 옵션 */
interface StrapiRequestOptions {
  /** 쿼리 파라미터 (필터, 정렬, 페이지네이션 등) */
  params?: Record<string, string | number | boolean>;
  /** Next.js fetch 캐시 옵션 */
  cache?: RequestCache;
  /** Next.js revalidate 옵션 (초 단위) */
  revalidate?: number;
}

/**
 * Strapi REST API 범용 fetch 함수
 *
 * @param endpoint - API 엔드포인트 (예: "/terms", "/categories")
 * @param options - 요청 옵션
 * @returns Strapi API 응답 데이터
 */
export async function strapiGet<T>(
  endpoint: string,
  options: StrapiRequestOptions = {}
): Promise<StrapiResponse<T>> {
  const { params, cache, revalidate } = options;

  // 쿼리 스트링 생성
  const url = new URL(`${STRAPI_API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  // fetch 옵션 구성
  const fetchOptions: RequestInit & { next?: { revalidate?: number } } = {
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_API_TOKEN && {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      }),
    },
  };

  if (cache) {
    fetchOptions.cache = cache;
  }

  if (revalidate !== undefined) {
    fetchOptions.next = { revalidate };
  }

  const response = await fetch(url.toString(), fetchOptions);

  if (!response.ok) {
    throw new Error(
      `Strapi API 오류: ${response.status} ${response.statusText} - ${endpoint}`
    );
  }

  return response.json();
}

/**
 * 용어 목록 조회
 *
 * @param page - 페이지 번호
 * @param pageSize - 페이지 크기
 * @returns 용어 목록 + 페이지네이션 정보
 */
export async function getTerms(page = 1, pageSize = 25) {
  return strapiGet("/terms", {
    params: {
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      "sort[0]": "title:asc",
      "filters[status][$eq]": "published",
      "populate": "*",
    },
    revalidate: 5, // 5초마다 재검증 (개발용)
  });
}

/**
 * 용어 단일 조회 (slug 기반)
 *
 * @param slug - 용어 slug
 * @returns 용어 상세 데이터
 */
export async function getTermBySlug(slug: string) {
  return strapiGet("/terms", {
    params: {
      "filters[slug][$eq]": slug,
      "filters[status][$eq]": "published",
      "populate": "*",
    },
    revalidate: 5, // 5초마다 재검증 (개발용)
  });
}

/**
 * 카테고리 목록 조회
 */
export async function getCategories() {
  return strapiGet("/categories", {
    params: {
      "sort[0]": "name:asc",
      "populate": "*",
    },
    revalidate: 300, // 5분마다 재검증
  });
}

/**
 * 최근 등록 용어 조회
 *
 * @param limit - 조회할 용어 개수
 * @returns 최근 등록 용어 목록
 */
export async function getRecentTerms(limit = 5) {
  return strapiGet("/terms", {
    params: {
      "pagination[limit]": limit,
      "sort[0]": "publishedAt:desc",
      "filters[status][$eq]": "published",
      "populate": "*",
    },
    revalidate: 5, // 5초마다 재검증 (개발용)
  });
}

/**
 * 초성/A-Z로 용어 필터링
 *
 * @param initial - 초성 또는 영문 첫 글자 (예: "ㄱ", "A")
 * @param page - 페이지 번호
 * @param pageSize - 페이지 크기
 * @returns 필터링된 용어 목록
 */
export async function getTermsByInitial(
  initial: string,
  page = 1,
  pageSize = 25
) {
  // 한글 초성 (ㄱ-ㅎ) 또는 영문 대문자 (A-Z) 여부 확인
  const isKorean = /^[ㄱ-ㅎ]$/.test(initial);
  const isEnglish = /^[A-Z]$/.test(initial);

  if (!isKorean && !isEnglish) {
    throw new Error("초성은 ㄱ-ㅎ 또는 A-Z만 가능합니다");
  }

  return strapiGet("/terms", {
    params: {
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      "sort[0]": "title:asc",
      "filters[status][$eq]": "published",
      "filters[title][$startsWith]": initial,
      "populate": "*",
    },
    revalidate: 5, // 5초마다 재검증 (개발용)
  });
}

/**
 * 카테고리별 용어 목록 조회
 *
 * @param categorySlug - 카테고리 slug
 * @param page - 페이지 번호
 * @param pageSize - 페이지 크기
 * @returns 해당 카테고리의 용어 목록
 */
export async function getTermsByCategory(
  categorySlug: string,
  page = 1,
  pageSize = 25
) {
  return strapiGet("/terms", {
    params: {
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      "sort[0]": "title:asc",
      "filters[status][$eq]": "published",
      "filters[category][slug][$eq]": categorySlug,
      "populate": "*",
    },
    revalidate: 5, // 5초마다 재검증 (개발용)
  });
}

export type { StrapiResponse, StrapiItem, StrapiRequestOptions };
