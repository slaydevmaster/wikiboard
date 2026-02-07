# WikiBoard 프로젝트

## 언어 규칙
- 모든 대화 및 문서는 **한글**로 작성
- 코드 주석도 가능한 한 한글로 작성
- 변수명/함수명은 영문, 설명은 한글

## 프로젝트 개요
사전형 위키보드 — 용어/가이드/자료를 등록·검수·발행하고, 초성/A-Z 인덱스 + 검색으로 제공하는 플랫폼

## 기술 스택
| 구성 요소 | 기술 | 역할 |
|-----------|------|------|
| Public Web + Admin | Next.js (App Router) | 공개 위키 UX, 운영 어드민 |
| CMS | Strapi v5 | 콘텐츠 관리(용어/글/자료), RBAC, 발행 워크플로우 |
| DB | PostgreSQL **또는** MariaDB (선택) | Strapi DB + 유저/레벨 DB |
| 검색 | Meilisearch | 자동완성, 오타허용, 빠른 검색 |
| 인증 | Auth.js (NextAuth v5) | 로컬/소셜/SSO/TRUSTED 모드 |
| 배포 | Docker Compose | 전 서비스 컨테이너화 |

## 아키텍처

### 전체 흐름
```
운영자 → Strapi(콘텐츠 작성/검수/발행)
         ↓ webhook
      Meilisearch(인덱스 갱신)

사용자 → Next.js(공개 위키)
         ├─ Strapi API → 콘텐츠 조회
         ├─ Meilisearch → 검색/자동완성
         └─ Auth.js → 로그인/세션

관리자 → Next.js /admin(운영 어드민)
         ├─ 유저/레벨/정지/로그
         └─ 통계/랭킹
```

### Strapi 콘텐츠 타입
- **Term** (용어): 사전형 핵심 — title, slug, one_liner, summary, body, aliases
- **Article** (글/가이드): 긴 글, 연재
- **Category**: 분류
- **Tag**: 태그
- **Download** (자료): 파일/템플릿/문서

### 발행 워크플로우
```
Draft(초안) → Review(검수) → Scheduled(예약) → Published(발행) → Archived(보관)
```
- status: draft | review | scheduled | published | archived
- publish_at: 예약 발행 시각
- published_at: 실제 발행 시각

### Strapi RBAC (콘텐츠 운영)
- **Author**: 초안 작성/수정, 발행 불가
- **Reviewer**: review 승인 가능
- **Publisher(Admin)**: publish/예약 발행

### Next.js 인증 모드
- **LOCAL**: Auth.js 로컬/소셜 로그인 (개인용)
- **SSO**: OIDC 사내 IdP 연동 (사내용)
- **TRUSTED**: 프록시 뒤 헤더/JWT 신뢰 (사내망 전용, 외부 노출 금지)

### 레벨/등급 (게임화)
- 권한(role)과 레벨(level/xp)은 분리
- users: role, status, xp, level
- xp_events: 활동 로그
- 레벨 혜택: 편집 제안 한도, 다운로드 제한, 배지 등

### 운영 Admin (/admin)
- 유저 목록/검색, 정지/해제, role 변경
- 레벨/XP 조정, 감사 로그
- 통계(조회수/다운로드/인기 용어)

## 모노레포 구조
```
WikiBoard/
├── apps/
│   ├── web/          # Next.js (공개 위키 + 운영 어드민)
│   └── cms/          # Strapi (콘텐츠 CMS)
├── packages/
│   └── shared/       # 공유 타입/유틸
├── docker/           # Docker 설정
├── docker-compose.yml
├── docker-compose.dev.yml
└── CLAUDE.md
```

## DB 호환성 규칙
- Full-text 검색은 DB가 아닌 Meilisearch로 통일
- JSON 컬럼은 보조용만 (핵심 필터/정렬은 컬럼 분리)
- 트리거/저장프로시저/DB 특수 문법 사용 금지
- PostgreSQL과 MariaDB 모두 지원 가능하도록 표준 SQL만 사용

## 개발 단계
### v0 (프로토타입)
1. Strapi에 Term/Category/Tag/Download 모델 생성
2. Draft/Publish + RBAC 구성
3. Next.js 공개 페이지 (용어/카테고리/태그/초성/A-Z)
4. Meilisearch 검색/자동완성 연결
5. 로그인 모드 1개 (LOCAL)
6. /admin 유저/레벨 최소 기능

### v1 (사내 운영 강화)
- OIDC(사내 SSO) 추가
- 감사 로그/승인 흐름 강화
- 예약 발행 고도화
- 통계/랭킹

## 코딩 컨벤션
- TypeScript 필수
- ESLint + Prettier 적용
- 컴포넌트: PascalCase
- 파일명: kebab-case
- API 라우트: RESTful 네이밍
- 커밋 메시지: Conventional Commits (한글 설명 허용)
