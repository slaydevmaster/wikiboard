# 테스트 전략 및 방법론

WikiBoard 프로젝트의 테스트 접근 방식과 전략을 정의합니다.

## 테스트 피라미드

```
       /\
      /E2E\           ← 소수 (핵심 사용자 흐름)
     /------\
    /통합 테스트\      ← 중간 (API, DB 연동)
   /----------\
  /  단위 테스트  \    ← 다수 (함수, 컴포넌트)
 /--------------\
```

---

## v0 테스트 범위

### 1. 자동 검증 스크립트 (현재)

**커버리지**: 약 80%

| 테스트 종류 | 스크립트 | 대상 |
|------------|---------|------|
| 헬스체크 | `verify:health` | DB, Strapi, Meilisearch, Next.js 연결 |
| 인증 API | `verify:auth` | 회원가입, 로그인, JWT 검증 |
| 관리자 API | `verify:admin` | 유저 조회, 역할 변경, 검색 제한 |
| Strapi 연동 | `verify:strapi` | 용어 조회, 초성 필터, 발행 상태 |
| 외부 API | `verify:external` | Term 생성, Meilisearch 인덱싱 |

**장점**:
- 프레임워크 설치 불필요
- Node.js 스크립트로 즉시 실행 가능
- CI/CD 통합 가능

**단점**:
- 통합 테스트만 가능 (단위 테스트 불가)
- 커버리지 측정 어려움

### 2. 수동 테스트 체크리스트

**커버리지**: 약 20% (UX, 시각적 확인)

- 브라우저 UI/UX 검증
- 폼 검증 피드백
- 토스트 알림
- 스켈레톤 UI

---

## v1 테스트 계획 (향후)

### 단위 테스트 (Vitest)

**대상**:
- 유틸리티 함수 (`lib/level.ts`, `lib/seed.ts`)
- 컴포넌트 로직 (react-testing-library)
- DB 쿼리 (drizzle-orm)

**예시**:
```typescript
// apps/web/src/lib/level.test.ts
import { describe, it, expect } from 'vitest';
import { calculateLevel, getXpForLevel } from './level';

describe('calculateLevel', () => {
  it('레벨 1은 0 XP', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(99)).toBe(1);
  });

  it('레벨 2는 100 XP', () => {
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(199)).toBe(2);
  });
});
```

### 통합 테스트 (Vitest + DB)

**대상**:
- API 라우트 (`/api/auth/register`, `/api/admin/users`)
- DB 트랜잭션
- 인증 미들웨어

**예시**:
```typescript
// apps/web/src/app/api/auth/register/route.test.ts
import { describe, it, expect } from 'vitest';
import { POST } from './route';

describe('POST /api/auth/register', () => {
  it('정상 회원가입', async () => {
    const request = new Request('http://localhost:3050/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: '테스트',
        email: 'test@example.com',
        password: 'Test1234!',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });

  it('약한 비밀번호 거부', async () => {
    const request = new Request('http://localhost:3050/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: '테스트',
        email: 'test2@example.com',
        password: '12345678', // 영문+숫자 조합 없음
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

### E2E 테스트 (Playwright)

**대상**:
- 핵심 사용자 흐름 (회원가입 → 로그인 → 용어 조회)
- 관리자 워크플로우 (유저 관리 → 역할 변경)

**예시**:
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('회원가입 및 로그인 흐름', async ({ page }) => {
  // 회원가입 페이지 접속
  await page.goto('http://localhost:3050/register');

  // 폼 입력
  await page.fill('input[name="name"]', '테스트 유저');
  await page.fill('input[name="email"]', 'test-e2e@example.com');
  await page.fill('input[name="password"]', 'Test1234!');
  await page.fill('input[name="confirmPassword"]', 'Test1234!');

  // 회원가입 버튼 클릭
  await page.click('button[type="submit"]');

  // 성공 토스트 확인
  await expect(page.locator('text=회원가입이 완료되었습니다')).toBeVisible();

  // 홈 페이지로 리다이렉트 확인
  await expect(page).toHaveURL('http://localhost:3050/');
});
```

---

## 테스트 환경 설정 (v1)

### Vitest 설정

```bash
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom
```

**vitest.config.ts** (apps/web):
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
});
```

### Playwright 설정

```bash
npm install --save-dev @playwright/test
npx playwright install
```

**playwright.config.ts**:
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3050',
  },
  webServer: {
    command: 'npm run dev:web',
    port: 3050,
    reuseExistingServer: true,
  },
});
```

---

## 테스트 실행 (v1)

```bash
# 단위 테스트
npm run test               # 전체 테스트
npm run test:watch         # watch 모드
npm run test:coverage      # 커버리지

# E2E 테스트
npm run test:e2e           # 헤드리스 모드
npm run test:e2e:ui        # UI 모드
```

---

## CI/CD 통합

**GitHub Actions 예시**:
```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Start DB
        run: npm run docker:dev

      - name: Run verification
        run: npm run verify

      - name: Run unit tests
        run: npm run test

      - name: Run E2E tests
        run: npm run test:e2e
```

---

## 테스트 커버리지 목표

| 단계 | 목표 커버리지 | 현재 상태 |
|------|-------------|----------|
| v0 | 60% (자동 검증 스크립트) | ✅ 달성 |
| v1 | 80% (Vitest + Playwright) | ⏳ 계획 |
| v2 | 90% (완전 자동화) | 📋 향후 |

---

## 테스트 작성 가이드

### DO ✅
- 핵심 비즈니스 로직은 반드시 테스트
- 버그 수정 시 재발 방지 테스트 추가
- 테스트는 독립적이고 순서 무관하게 작성
- 의미 있는 테스트 이름 사용 (`it('약한 비밀번호 거부', ...)`)

### DON'T ❌
- Private 함수 테스트 (public API만 테스트)
- UI 디테일 테스트 (색상, 여백 등)
- 외부 서비스 직접 호출 (mock 사용)
- 테스트를 위한 코드 작성 (테스트가 코드를 따라감)

---

**다음**: [verification.md](./verification.md) - 자동 검증 스크립트 상세 가이드
