# 검색 시스템 (Meilisearch)

## 개요

사전형 위키보드에서 검색은 핵심 UX입니다.
DB 검색 대신 Meilisearch로 통일하여 자동완성, 오타 허용, 즉시 응답을 제공합니다.

## 인덱스 구조

| 인덱스 | 소스 | 검색 대상 필드 |
|--------|------|----------------|
| terms | Term | title, slug, one_liner, summary, tags, aliases, category |
| articles | Article | title, slug, excerpt, tags, category |
| downloads | Download | title, slug, description, tags, category |

## 인덱싱 전략

### 발행 시 인덱스 갱신
```
Strapi에서 콘텐츠 발행/수정/삭제
    ↓ lifecycle hook 또는 webhook
Meilisearch 인덱스 업데이트
    ↓
사용자 검색 시 최신 데이터 반영
```

### 색인 규칙
- **발행(published) 상태만 인덱싱** — 초안/검수 중인 콘텐츠는 검색에 노출하지 않음
- **보관(archived) 시 인덱스에서 제거**
- **수정 시 인덱스 갱신** — documentId 기반 업서트

## 검색 기능

### 자동완성
```
사용자 입력: "자바스"
Meilisearch 응답: ["자바스크립트", "자바스크립트 엔진", "자바스크립트 프레임워크"]
```
- 입력 즉시 검색 (debounce 200ms 권장)
- 최대 5개 결과 표시
- 제목 + 한줄 정의 표시

### 오타 허용 (Typo Tolerance)
```
입력: "자바스크리트" (오타)
결과: "자바스크립트" (정확한 결과)
```
- Meilisearch 기본 제공 기능
- 한글/영문 모두 지원

### 검색 결과
- **하이라이팅**: 검색어 일치 부분 강조
- **필터링**: 카테고리, 태그별 필터
- **정렬**: 관련도순 (기본), 최신순, 가나다순
- **페이지네이션**: 기본 25개씩

## 환경변수

| 변수 | 용도 |
|------|------|
| MEILI_HOST | Meilisearch 서버 URL |
| MEILI_MASTER_KEY | 관리 키 (인덱스 생성/수정용, 서버 전용) |
| MEILI_SEARCH_KEY | 검색 키 (검색 전용, 클라이언트에 노출 가능) |

## 클라이언트 (apps/web/src/lib/meilisearch.ts)

| 함수 | 용도 |
|------|------|
| searchTerms(query, options) | 용어 검색 (하이라이팅, 필터 지원) |
| autoComplete(query) | 자동완성 (5개 제한) |
| searchClient | 검색 전용 클라이언트 (공개 키) |
| adminClient | 관리 전용 클라이언트 (서버 전용) |
