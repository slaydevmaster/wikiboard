# 모노레포 구조

## 디렉토리 구조

```
WikiBoard/
├── apps/
│   ├── web/                    # Next.js 15 (공개 위키 + 운영 어드민)
│   │   ├── src/
│   │   │   ├── app/            # App Router 페이지
│   │   │   │   ├── page.tsx              # 메인 (검색바 + 초성 색인)
│   │   │   │   ├── layout.tsx            # 루트 레이아웃
│   │   │   │   ├── globals.css           # Tailwind 임포트
│   │   │   │   ├── terms/
│   │   │   │   │   ├── page.tsx          # 용어 목록 (초성/A-Z)
│   │   │   │   │   └── [slug]/page.tsx   # 용어 상세
│   │   │   │   ├── search/page.tsx       # 검색 결과
│   │   │   │   └── admin/
│   │   │   │       ├── layout.tsx        # 어드민 사이드바
│   │   │   │       └── page.tsx          # 어드민 대시보드
│   │   │   └── lib/
│   │   │       ├── strapi.ts             # Strapi API 클라이언트
│   │   │       └── meilisearch.ts        # Meilisearch 클라이언트
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── .env.example
│   │
│   └── cms/                    # Strapi v5 (콘텐츠 CMS)
│       ├── config/
│       │   ├── database.ts     # DB 설정 (PostgreSQL/MariaDB 스위칭)
│       │   ├── server.ts       # 서버 설정 (포트, 보안 키)
│       │   ├── admin.ts        # 어드민 패널 설정
│       │   ├── middlewares.ts  # 미들웨어 체인
│       │   └── plugins.ts      # 플러그인 설정
│       ├── src/
│       │   ├── api/            # 콘텐츠 타입 (term/article/category/tag/download)
│       │   ├── admin/app.ts    # 어드민 UI 커스텀
│       │   ├── index.ts        # 라이프사이클 훅
│       │   └── bootstrap.ts    # 초기화 로직
│       ├── package.json
│       ├── tsconfig.json
│       └── .env.example
│
├── packages/
│   └── shared/                 # 공유 타입/유틸
│       └── src/
│           ├── index.ts
│           └── types/
│               ├── content.ts  # Term, Article, Category, Tag, Download
│               ├── user.ts     # User, XpEvent, AuditLog
│               └── search.ts   # SearchRequest, SearchResult
│
├── docs/                       # 프로젝트 문서
├── docker/                     # Docker 설정 (추후)
├── .env                        # 통합 환경변수 (Git 제외)
├── .env.example                # 환경변수 템플릿
├── package.json                # 루트 (npm workspaces)
├── docker-compose.dev.yml      # 개발용 Docker
└── docker-compose.yml          # 프로덕션용 Docker
```

## 환경변수 관리

### 구조
```
루트 .env (모든 설정을 여기서 관리)
    ↓ dotenv-cli로 process.env에 주입
    ├── apps/cms  →  config/*.ts에서 process.env 참조
    └── apps/web  →  src/lib/*.ts에서 process.env 참조
```

### 루트 .env 항목

| 변수 | 설명 | 기본값 |
|------|------|--------|
| WEB_PORT | Next.js 포트 | 3000 |
| CMS_PORT | Strapi 포트 | 1337 |
| DB_TYPE | DB 종류 (postgres/mariadb) | postgres |
| DATABASE_HOST | DB 호스트 | 127.0.0.1 |
| DATABASE_PORT | DB 포트 | 5432 |
| DATABASE_NAME | DB 이름 | wikiboard |
| DATABASE_USERNAME | DB 사용자 | - |
| DATABASE_PASSWORD | DB 비밀번호 | - |
| MEILI_HOST | Meilisearch URL | http://127.0.0.1:7700 |
| MEILI_MASTER_KEY | Meilisearch 관리 키 | - |
| MEILI_SEARCH_KEY | Meilisearch 검색 키 | - |
| STRAPI_APP_KEYS | Strapi 앱 키 | - |
| STRAPI_API_TOKEN | Strapi API 토큰 | - |
| AUTH_SECRET | Auth.js 시크릿 | - |
| AUTH_MODE | 인증 모드 (LOCAL/SSO/TRUSTED) | LOCAL |

### npm 스크립트
```bash
npm run dev:web     # dotenv -e .env -- Next.js 개발 서버
npm run dev:cms     # dotenv -e .env -- Strapi 개발 서버
npm run build:web   # dotenv -e .env -- Next.js 빌드
npm run build:cms   # dotenv -e .env -- Strapi 빌드
```
