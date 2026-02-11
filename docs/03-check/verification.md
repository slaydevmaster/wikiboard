# 자동 검증 스크립트 사용법

WikiBoard v0의 자동 검증 스크립트 상세 가이드입니다.

## 개요

Node.js 스크립트 기반 자동 검증 시스템으로, 테스트 프레임워크 설치 없이 즉시 사용 가능합니다.

**위치**: `scripts/verify-*.js`

**장점**:
- ✅ 프레임워크 설치 불필요
- ✅ 3-5초 내 전체 검증 완료
- ✅ CI/CD 통합 가능
- ✅ 사용자 최소 개입

---

## 전체 검증 실행

### 1. 서비스 시작

```bash
# DB + Meilisearch 시작
npm run docker:dev

# Strapi 시작 (터미널 1)
npm run dev:cms

# Next.js 시작 (터미널 2)
npm run dev:web
```

### 2. 전체 자동 검증

```bash
npm run verify
```

**예상 출력**:
```
=== WikiBoard v0 자동 검증 시작 ===

[1/4] 서비스 헬스체크
✅ MariaDB 연결 성공 (wikiboard)
✅ Strapi API 응답 (200 OK)
✅ Meilisearch 응답 (200 OK)
✅ Next.js 응답 (200 OK)

[2/4] 인증 API 테스트
✅ 회원가입 성공 (test-verify-1@example.com)
✅ 약한 비밀번호 거부 ("12345678")
✅ 잘못된 이메일 거부 ("test@test")
✅ 로그인 성공
✅ JWT 만료 시간 확인 (7일)

[3/4] 관리자 API 테스트
✅ 유저 목록 조회 (total: 6)
✅ 검색 길이 제한 (< 2자 거부)
✅ 역할 변경 성공 (member → admin)
✅ 상태 변경 성공 (active → suspended)

[4/4] Strapi API 연동 테스트
✅ 최근 용어 조회 (5개)
✅ 초성별 용어 ("ㄱ" → 3개)
✅ 용어 상세 조회 (test-term)
✅ 발행 상태 필터링 (draft 제외)

=== 검증 완료 ===
✅ 성공: 16/16
❌ 실패: 0/16
⏱️  소요 시간: 3.2초
```

---

## 개별 검증 스크립트

### 1. 서비스 헬스체크

```bash
npm run verify:health
```

**검증 항목**:
- MariaDB 연결 (drizzle-orm)
- Strapi API 응답 (`http://localhost:1337/_health`)
- Meilisearch 응답 (`http://localhost:7700/health`)
- Next.js 응답 (`http://localhost:3050`)

**스크립트**: `scripts/verify-health.js`

**주요 로직**:
```javascript
// MariaDB 연결 테스트
const connection = await mysql.createConnection({ ... });
await connection.ping();

// Strapi API 테스트
const strapiResponse = await fetch('http://localhost:1337/_health');
if (strapiResponse.ok) console.log('✅ Strapi API 응답');

// Meilisearch 테스트
const meiliResponse = await fetch('http://localhost:7700/health');
if (meiliResponse.ok) console.log('✅ Meilisearch 응답');
```

---

### 2. 인증 API 테스트

```bash
npm run verify:auth
```

**검증 항목**:
- 정상 회원가입 (이메일+비밀번호 검증 통과)
- 약한 비밀번호 거부 (`"12345678"`)
- 잘못된 이메일 거부 (`"test@test"`)
- 중복 이메일 거부
- 정상 로그인
- 잘못된 비밀번호 거부
- 정지된 계정 거부
- JWT 토큰 검증 (maxAge 7일, role/level/xp 포함)

**스크립트**: `scripts/verify-auth.js`

**주요 로직**:
```javascript
// 회원가입 API 호출
const response = await fetch('http://localhost:3050/api/auth/register', {
  method: 'POST',
  body: JSON.stringify({
    name: '테스트 유저',
    email: `test-${Date.now()}@example.com`,
    password: 'Test1234!',
  }),
});

if (response.ok) {
  console.log('✅ 회원가입 성공');
} else {
  console.error('❌ 회원가입 실패');
}

// JWT 토큰 디코딩 (jwt-decode)
const decoded = jwtDecode(sessionToken);
const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
const days = Math.floor(expiresIn / 86400);
if (days === 7) {
  console.log('✅ JWT 만료 시간 확인 (7일)');
}
```

---

### 3. 관리자 API 테스트

```bash
npm run verify:admin
```

**검증 항목**:
- 유저 목록 조회 (`GET /api/admin/users`)
- 페이지네이션 동작 확인
- 검색 길이 제한 (2-100자)
- 유저 역할 변경 (`PATCH /api/admin/users/:id`)
- 유저 상태 변경 (active ↔ suspended)

**스크립트**: `scripts/verify-admin.js`

**주요 로직**:
```javascript
// 관리자 로그인 후 JWT 토큰 획득
const adminToken = await getAdminToken();

// 유저 목록 조회
const usersResponse = await fetch('http://localhost:3050/api/admin/users?page=1&limit=10', {
  headers: {
    Cookie: `authjs.session-token=${adminToken}`,
  },
});

const usersData = await usersResponse.json();
console.log(`✅ 유저 목록 조회 (total: ${usersData.total})`);

// 역할 변경
const updateResponse = await fetch(`http://localhost:3050/api/admin/users/${userId}`, {
  method: 'PATCH',
  body: JSON.stringify({ role: 'admin' }),
  headers: {
    Cookie: `authjs.session-token=${adminToken}`,
  },
});

if (updateResponse.ok) {
  console.log('✅ 역할 변경 성공 (member → admin)');
}
```

---

### 4. Strapi API 연동 테스트

```bash
npm run verify:strapi
```

**검증 항목**:
- 최근 용어 조회 (`getRecentTerms`)
- 초성별 용어 목록 (`getTermsByInitial`)
- 용어 상세 조회 (`getTermBySlug`)
- 발행 상태 필터링 (published만)

**스크립트**: `scripts/verify-strapi.js`

**주요 로직**:
```javascript
// 최근 용어 조회
const recentResponse = await fetch(
  'http://localhost:1337/api/terms?sort[0]=publishedAt:desc&pagination[limit]=5',
  {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  }
);

const recentData = await recentResponse.json();
console.log(`✅ 최근 용어 조회 (${recentData.data.length}개)`);

// 초성별 용어
const initialResponse = await fetch(
  'http://localhost:1337/api/terms?filters[title][$startsWith]=ㄱ',
  { ... }
);

// published 상태만 조회되는지 확인
const allTerms = recentData.data;
const hasDraft = allTerms.some(term => term.attributes.status === 'draft');
if (!hasDraft) {
  console.log('✅ 발행 상태 필터링 (draft 제외)');
}
```

---

### 5. 외부 API 업로드 테스트

```bash
npm run verify:external
```

**검증 항목**:
- API Token 설정 확인
- Term 생성 (`POST /api/terms`)
- Term 수정 (`PUT /api/terms/:id`)
- Meilisearch 인덱스 확인
- Term 삭제 (`DELETE /api/terms/:id`)

**스크립트**: `scripts/verify-external-api.js`

**주요 로직**:
```javascript
// Term 생성
const createResponse = await fetch('http://localhost:1337/api/terms', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  },
  body: JSON.stringify({
    data: {
      title: '테스트 용어',
      slug: 'test-term-verify',
      body: '자동 검증 테스트',
      status: 'published',
    },
  }),
});

if (createResponse.ok) {
  console.log('✅ Term 생성 성공');
}

// Meilisearch 인덱스 확인 (5초 대기 후)
await new Promise(resolve => setTimeout(resolve, 5000));

const searchResponse = await fetch('http://localhost:7700/indexes/terms/search?q=테스트 용어');
const searchData = await searchResponse.json();

if (searchData.hits.length > 0) {
  console.log('✅ Meilisearch 인덱스 확인');
}
```

---

## 에러 발생 시 대응

### 1. DB 연결 실패 (`ECONNREFUSED`)

```
❌ DB 연결 실패
ECONNREFUSED
```

**해결**:
```bash
# MariaDB 시작
npm run docker:dev

# 상태 확인
docker ps | grep mariadb
```

---

### 2. Strapi API 오류 (`403 Forbidden`)

```
❌ Strapi API 오류: 403 Forbidden
```

**해결**:
1. **Public 권한 설정**:
   - Strapi Admin → Settings → Users & Permissions → Roles → Public
   - Term, Article, Category, Tag, Download의 `find`, `findOne` 체크
   - Save

2. **API Token 확인**:
   ```bash
   # .env 파일에서 STRAPI_API_TOKEN 값 확인
   cat .env | grep STRAPI_API_TOKEN
   ```

---

### 3. Meilisearch 응답 없음

```
❌ Meilisearch 응답 실패
```

**해결**:
```bash
# Meilisearch 재시작
docker restart wikiboard-meilisearch

# 로그 확인
docker logs wikiboard-meilisearch
```

---

### 4. JWT 만료 시간 불일치

```
❌ JWT 만료 시간 확인 실패 (30일)
```

**해결**:
- `apps/web/src/lib/auth.ts`에서 `maxAge: 7 * 24 * 60 * 60` 확인
- Next.js 재시작: `npm run dev:web`

---

## CI/CD 통합

### GitHub Actions 예시

```yaml
name: Verification

on: [push, pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    services:
      mariadb:
        image: mariadb:10.11
        env:
          MYSQL_ROOT_PASSWORD: test00!@
          MYSQL_DATABASE: wikiboard
        ports:
          - 3306:3306

      meilisearch:
        image: getmeili/meilisearch:latest
        ports:
          - 7700:7700

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Start Strapi
        run: npm run dev:cms &
        env:
          DATABASE_HOST: 127.0.0.1
          DATABASE_PORT: 3306
          DATABASE_NAME: wikiboard
          DATABASE_USERNAME: root
          DATABASE_PASSWORD: test00!@

      - name: Start Next.js
        run: npm run dev:web &

      - name: Wait for services
        run: sleep 10

      - name: Run verification
        run: npm run verify
```

---

## 커버리지

| 카테고리 | 자동 검증 | 수동 점검 |
|---------|----------|----------|
| **서비스 헬스** | ✅ DB, Strapi, Meilisearch, Next.js | - |
| **인증 보안** | ✅ 비밀번호 복잡도, 이메일 검증, JWT 만료 | - |
| **관리자 기능** | ✅ 유저 조회, 역할/상태 변경, 검색 제한 | - |
| **Strapi 연동** | ✅ 용어 조회, 초성 필터, 발행 상태 | - |
| **외부 API** | ✅ Term 생성, Meilisearch 인덱싱 | - |
| **UX 피드백** | - | ✅ 토스트, 에러 메시지, 스켈레톤 |

**전체 커버리지**: 약 80%

---

**다음**: [04-act](../../04-act/) - 배포 및 개선
