# 콘텐츠 모델 (Strapi)

## 콘텐츠 타입 개요

| 타입 | 설명 | API 엔드포인트 |
|------|------|----------------|
| Term | 용어 (사전형 핵심) | /api/terms |
| Article | 글/가이드 (긴 글, 연재) | /api/articles |
| Category | 카테고리 (분류) | /api/categories |
| Tag | 태그 | /api/tags |
| Download | 자료 (파일/템플릿/문서) | /api/downloads |

## Term (용어)

사전형 위키보드의 핵심 콘텐츠 타입

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| title | string | O | 용어 제목 |
| slug | uid (title 기반) | O | URL 슬러그 |
| one_liner | string | O | 한줄 정의 |
| summary | text | - | 요약 |
| body | richtext | - | 본문 (마크다운) |
| aliases | json | - | 동의어/약어 배열 |
| status | enum | O | draft/review/scheduled/published/archived |
| publish_at | datetime | - | 예약 발행 시각 |
| published_at | datetime | - | 실제 발행 시각 |
| category | relation (manyToOne) | - | 소속 카테고리 |
| tags | relation (manyToMany) | - | 태그 목록 |

## Article (글/가이드)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| title | string | O | 글 제목 |
| slug | uid (title 기반) | O | URL 슬러그 |
| excerpt | text | - | 발췌/요약 |
| body | richtext | - | 본문 (마크다운) |
| status | enum | O | draft/review/scheduled/published/archived |
| publish_at | datetime | - | 예약 발행 시각 |
| published_at | datetime | - | 실제 발행 시각 |
| category | relation (manyToOne) | - | 소속 카테고리 |
| tags | relation (manyToMany) | - | 태그 목록 |

## Category (카테고리)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | string (unique) | O | 카테고리 이름 |
| slug | uid (name 기반) | O | URL 슬러그 |
| description | text | - | 설명 |
| terms | relation (oneToMany) | - | 소속 용어 목록 |
| articles | relation (oneToMany) | - | 소속 글 목록 |
| downloads | relation (oneToMany) | - | 소속 자료 목록 |

## Tag (태그)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | string (unique) | O | 태그 이름 |
| slug | uid (name 기반) | O | URL 슬러그 |
| terms | relation (manyToMany) | - | 연결된 용어 |
| articles | relation (manyToMany) | - | 연결된 글 |
| downloads | relation (manyToMany) | - | 연결된 자료 |

## Download (자료)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| title | string | O | 자료 제목 |
| slug | uid (title 기반) | O | URL 슬러그 |
| description | text | - | 설명 |
| file | media | - | 첨부 파일 |
| file_size | integer | - | 파일 크기 (bytes) |
| status | enum | O | draft/review/scheduled/published/archived |
| download_count | integer | - | 다운로드 횟수 (기본 0) |
| published_at | datetime | - | 발행 시각 |
| category | relation (manyToOne) | - | 소속 카테고리 |
| tags | relation (manyToMany) | - | 태그 목록 |

## 관계도 (ER)

```
Category ──┬── 1:N ──── Term
            ├── 1:N ──── Article
            └── 1:N ──── Download

Tag ───────┬── N:M ──── Term
            ├── N:M ──── Article
            └── N:M ──── Download
```
