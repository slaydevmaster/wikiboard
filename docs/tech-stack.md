# 기술 스택

## 핵심 기술

| 구성 요소 | 기술 | 버전 | 역할 |
|-----------|------|------|------|
| Public Web + Admin | Next.js (App Router) | 15.x | 공개 위키 UX, 운영 어드민 |
| CMS | Strapi | v5.35+ | 콘텐츠 관리, RBAC, 발행 워크플로우 |
| DB | PostgreSQL | 16+ | Strapi DB + 유저/레벨 DB |
| 검색 | Meilisearch | 1.x | 자동완성, 오타허용, 빠른 검색 |
| 인증 | Auth.js (NextAuth) | v5 | 로컬/소셜/SSO/TRUSTED 모드 |
| 스타일링 | Tailwind CSS | v4 | 유틸리티 기반 CSS |
| 언어 | TypeScript | 5.7+ | 전체 코드베이스 |
| 패키지 관리 | npm workspaces | - | 모노레포 의존성 관리 |
| 배포 | Docker Compose | - | 전 서비스 컨테이너화 |

## 프론트엔드 (apps/web)

### 핵심 의존성
- **next** ^15.1.0 — App Router, 서버 컴포넌트, ISR/SSG
- **react** ^19.0.0 — UI 라이브러리
- **next-auth** ^5.0.0-beta — Auth.js (인증)
- **meilisearch** ^0.44.0 — 검색 클라이언트
- **tailwindcss** ^4.0.0 — 스타일링
- **@tailwindcss/postcss** ^4.0.0 — PostCSS 플러그인

### 주요 특징
- App Router 기반 파일 시스템 라우팅
- 서버 컴포넌트로 Strapi API 직접 호출 (fetch)
- ISR로 SEO 최적화 (검색 유입에 유리)
- Tailwind v4 + 한글 폰트 스택 (Pretendard, Noto Sans KR)

## CMS (apps/cms)

### 핵심 의존성
- **@strapi/strapi** ^5.35.0 — CMS 프레임워크
- **@strapi/plugin-users-permissions** ^5.35.0 — 사용자 권한
- **@strapi/plugin-cloud** ^5.35.0 — 클라우드 기능
- **pg** ^8.13.0 — PostgreSQL 드라이버

### 선택적 의존성
- **better-sqlite3** — 로컬 개발 시 SQLite 사용 가능
- **mysql2** — MariaDB 사용 시

## 공유 패키지 (packages/shared)

- 콘텐츠 타입 인터페이스 (Term, Article, Category, Tag, Download)
- 사용자 타입 인터페이스 (User, XpEvent, AuditLog)
- 검색 타입 인터페이스 (SearchRequest, SearchResult, SearchHit)

## 개발 도구

| 도구 | 용도 |
|------|------|
| dotenv-cli | 루트 .env를 하위 앱에 주입 |
| ESLint | 코드 린팅 |
| Prettier | 코드 포매팅 |
| Docker Compose | 로컬/프로덕션 인프라 |
