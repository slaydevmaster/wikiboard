# 코딩 컨벤션

## 언어 규칙
- **모든 문서, 주석, 대화는 한글**로 작성
- 변수명/함수명은 **영문**
- UI 텍스트는 **한글**

## TypeScript
- TypeScript **필수** — `.ts` / `.tsx` 확장자만 사용
- `strict: true` 활성화
- `any` 사용 최소화 — 타입을 명시적으로 정의

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `TermDetail.tsx` |
| 파일명 | kebab-case | `term-detail.tsx` |
| 함수/변수 | camelCase | `getTermBySlug()` |
| 상수 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| 타입/인터페이스 | PascalCase | `interface Term {}` |
| API 라우트 | RESTful kebab-case | `/api/terms`, `/api/xp-events` |
| DB 테이블/컬럼 | snake_case | `xp_events`, `published_at` |

## 파일 구조 (Next.js)

```
src/
├── app/          # 페이지 (App Router)
├── components/   # 재사용 컴포넌트 (추후)
├── lib/          # 유틸리티/클라이언트
├── hooks/        # 커스텀 훅 (추후)
└── types/        # 로컬 타입 (추후)
```

## Git 컨벤션

### 커밋 메시지
**Conventional Commits** 형식을 따릅니다. 설명은 한글 허용.

```
<type>: <한글 설명>

[선택] 본문
```

### 타입
| 타입 | 용도 |
|------|------|
| feat | 새 기능 |
| fix | 버그 수정 |
| docs | 문서 변경 |
| style | 코드 스타일 (기능 변경 없음) |
| refactor | 리팩토링 |
| test | 테스트 |
| chore | 빌드/설정 변경 |

### 예시
```
feat: 용어 상세 페이지 구현
fix: 초성 인덱스 ㅎ 필터링 오류 수정
docs: 검색 연동 문서 추가
chore: Strapi v5 의존성 업데이트
```

## 코드 스타일

### ESLint + Prettier
- ESLint: Next.js 기본 설정 확장
- Prettier: 기본 설정 사용
- 탭 대신 스페이스 2칸
- 세미콜론 사용
- 싱글 쿼트

### 임포트 순서
```typescript
// 1. 외부 라이브러리
import { useState } from "react";
import type { Metadata } from "next";

// 2. 내부 모듈 (@/ 별칭)
import { strapiGet } from "@/lib/strapi";

// 3. 공유 패키지
import type { Term } from "@wikiboard/shared";

// 4. 상대 경로
import { TermCard } from "./term-card";
```
