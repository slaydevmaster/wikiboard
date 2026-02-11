# 문제 해결 가이드

WikiBoard 운영 중 발생할 수 있는 일반적인 문제와 해결 방법을 정리합니다.

---

## 🔴 Strapi 관련 문제

### 1. Strapi 403 Forbidden

**증상**:
```
Strapi API 오류: 403 Forbidden - /terms
```

**원인**: Public role에 read 권한이 없음

**해결**:
1. Strapi Admin 접속: `http://localhost:1337/admin`
2. **Settings** → **Users & Permissions** → **Roles** → **Public**
3. 다음 항목 체크:
   - **Term**: `find`, `findOne`
   - **Article**: `find`, `findOne`
   - **Category**: `find`, `findOne`
   - **Tag**: `find`, `findOne`
   - **Download**: `find`, `findOne`
4. **Save** 클릭

**자동 설정** (bootstrap.ts):
```typescript
// apps/cms/src/bootstrap.ts의 setupPublicPermissions() 확인
// Strapi 재시작 시 자동 설정됨
```

---

### 2. Strapi Admin 비밀번호 분실

**증상**: 관리자 비밀번호를 잊어버림

**해결**:
```bash
# 자동 비밀번호 재설정 스크립트
npm run cms:reset-password
```

**수동 방법** (DB 직접 수정):
```bash
# MariaDB 접속
docker exec -it wikiboard-mariadb mysql -u root -p

# 관리자 조회
USE wikiboard;
SELECT id, email FROM admin_users;

# 비밀번호 해시 생성 (Python)
python -c "import bcrypt; print(bcrypt.hashpw(b'새비밀번호', bcrypt.gensalt()).decode())"

# 비밀번호 업데이트
UPDATE admin_users SET password = '생성된해시값' WHERE id = 1;
```

---

### 3. Strapi API Token 생성 불가

**증상**: Admin 패널에서 생성한 토큰을 다시 볼 수 없음

**해결**:
```bash
# 자동 API Token 생성 및 .env 저장
npm run cms:token
```

**수동 생성**:
1. Strapi Admin → **Settings** → **API Tokens** → **Create new API Token**
2. Name: `External API`
3. Token type: `Full access`
4. Duration: `Unlimited`
5. **Save** → 토큰 복사
6. `.env` 파일에 `STRAPI_API_TOKEN=복사한토큰` 저장

---

### 4. Strapi 포트 충돌 (1337)

**증상**:
```
[error] The port 1337 is already used by another application.
```

**해결**:

**Windows**:
```cmd
# 포트 사용 프로세스 확인
netstat -ano | findstr :1337

# PID로 프로세스 종료
taskkill /PID [PID] /F

# 또는 한 줄로
for /f "tokens=5" %a in ('netstat -ano ^| findstr :1337 ^| findstr LISTENING') do taskkill /PID %a /F
```

**Linux/Mac**:
```bash
# 포트 사용 프로세스 확인
lsof -i :1337

# 프로세스 종료
kill -9 [PID]
```

---

### 5. Strapi JSON 필드 제약 조건 위반

**증상**:
```
CONSTRAINT `terms.aliases` failed for `wikiboard`.`terms`
```

**원인**: JSON 필드에 빈 문자열(`''`) 삽입 시도

**해결**:
```json
// apps/cms/src/api/term/content-types/term/schema.json
{
  "aliases": {
    "type": "json",
    "default": null  // ← 이 줄 추가
  }
}
```

Strapi 재시작 후 정상 작동

---

## 🔴 Next.js 관련 문제

### 1. Tailwind CSS 색상 미적용

**증상**: `bg-brand-600` 같은 커스텀 색상이 투명하게 표시됨

**원인**: Tailwind CSS v4에서 `@theme` 디렉티브 필수

**해결**:
```css
/* apps/web/src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand-50: #eff6ff;
  --color-brand-100: #dbeafe;
  /* ... 나머지 색상 */
}
```

**참고**: `tailwind.config.ts`의 `extend.colors`만으로는 v4에서 작동하지 않음

---

### 2. ISR 캐싱으로 콘텐츠 미반영

**증상**: Strapi에서 콘텐츠 발행했는데 Next.js 페이지에 안 보임

**원인**:
1. Draft 상태로 저장 (Published 아님)
2. ISR 캐싱 (revalidate 시간 대기 필요)

**해결**:

**1. 발행 상태 확인**:
- Strapi Admin → Content Manager → Term
- 작성한 글 클릭 → 우측 상단 **Publish** 버튼 클릭

**2. ISR 캐시 시간 단축** (개발용):
```typescript
// apps/web/src/lib/strapi.ts
export async function getTerms(page = 1, pageSize = 25) {
  return strapiGet("/terms", {
    // ...
    revalidate: 5, // 5초마다 재검증 (개발용)
  });
}
```

**3. 강제 새로고침**:
- `Ctrl + Shift + R` (캐시 무시 새로고침)
- 또는 5초 대기 후 `F5`

---

### 3. JWT 세션 만료 시간 문제

**증상**: 로그인 후 즉시 만료되거나, 30일간 유지됨

**해결**:
```typescript
// apps/web/src/lib/auth.ts
export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7일 (604800초)
  },
  // ...
};
```

**확인 방법**:
1. 로그인 후 F12 → Application → Cookies
2. `authjs.session-token` 쿠키 복사
3. [jwt.io](https://jwt.io)에서 디코딩
4. `exp` 필드 확인 → 현재시각 + 7일(604800초)

---

### 4. 회원가입 약한 비밀번호 허용

**증상**: "12345678" 같은 약한 비밀번호가 통과됨

**해결**:
```typescript
// apps/web/src/app/api/auth/register/route.ts
const password = data.get("password") as string;

// 비밀번호 복잡도 검증
if (password.length < 8) {
  return NextResponse.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
}

if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
  return NextResponse.json({ error: "영문과 숫자를 포함해야 합니다." }, { status: 400 });
}
```

---

## 🔴 DB 관련 문제

### 1. DB 연결 실패 (ECONNREFUSED)

**증상**:
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**해결**:
```bash
# MariaDB 컨테이너 상태 확인
docker ps | grep mariadb

# 없으면 시작
npm run docker:dev

# 로그 확인
docker logs wikiboard-mariadb
```

---

### 2. DB 비밀번호 특수문자 문제

**증상**: `.env`에서 `DATABASE_PASSWORD=test00!@`가 쉘에서 인식 안 됨

**원인**: `!`, `@` 같은 특수문자가 쉘에서 특수 의미를 가짐

**해결**:

**방법 1: 따옴표 사용** (권장):
```env
DATABASE_PASSWORD="test00!@"
```

**방법 2: 이스케이프**:
```bash
export DATABASE_PASSWORD='test00\!\@'
```

**방법 3: 특수문자 제거**:
```env
DATABASE_PASSWORD=test00pass
```

---

### 3. drizzle-kit 마이그레이션 오류

**증상**: `drizzle-kit push` 또는 `migrate` 실패

**해결**:

WikiBoard는 drizzle-kit 대신 **직접 SQL 생성** 방식 사용:
```bash
npm run db:push  # scripts/db-create-tables.js 실행
```

**이유**:
- drizzle-kit은 루트에 설치되어 있고
- drizzle-orm은 apps/web에 설치되어 있어
- 경로 문제로 충돌 발생

**참고**: `junction` 심링크로 해결했으나, 안전을 위해 직접 SQL 사용

---

## 🔴 Meilisearch 관련 문제

### 1. Meilisearch 인덱스 누락

**증상**: 검색 결과가 비어있음

**원인**: Strapi에서 콘텐츠 발행 시 Meilisearch 인덱싱 안 됨

**해결**:

**1. Lifecycle Hook 확인**:
```typescript
// apps/cms/src/bootstrap.ts
strapi.db.lifecycles.subscribe({
  models: ["api::term.term"],
  async afterCreate(event) {
    // Meilisearch 인덱싱 로직 확인
  },
});
```

**2. 수동 재인덱싱**:
```bash
# Strapi 재시작 (bootstrap.ts 재실행)
npm run dev:cms
```

**3. Meilisearch 인덱스 확인**:
```bash
curl http://localhost:7700/indexes/terms/documents
```

---

### 2. Meilisearch 연결 실패

**증상**:
```
MeiliSearchCommunicationError: connect ECONNREFUSED
```

**해결**:
```bash
# Meilisearch 컨테이너 재시작
docker restart wikiboard-meilisearch

# 로그 확인
docker logs wikiboard-meilisearch

# 헬스체크
curl http://localhost:7700/health
```

---

## 🔴 Docker 관련 문제

### 1. 컨테이너 포트 충돌

**증상**:
```
Error: bind: address already in use
```

**해결**:

**Windows**:
```cmd
netstat -ano | findstr :3306
taskkill /PID [PID] /F
```

**Linux/Mac**:
```bash
lsof -i :3306
kill -9 [PID]
```

---

### 2. 디스크 공간 부족

**증상**:
```
Error: no space left on device
```

**해결**:
```bash
# 사용하지 않는 이미지/컨테이너 정리
docker system prune -a

# 볼륨 정리
docker volume prune

# 빌드 캐시 정리
docker builder prune
```

---

### 3. 컨테이너 네트워크 충돌

**증상**: 컨테이너 간 통신 안 됨

**해결**:
```bash
# 네트워크 재생성
docker compose down
docker network prune
docker compose up -d
```

---

## 🔴 기타 문제

### 1. npm install 실패

**증상**: 패키지 설치 중 오류

**해결**:
```bash
# 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

---

### 2. 파일 권한 문제 (Linux/Mac)

**증상**:
```
EACCES: permission denied
```

**해결**:
```bash
# 소유권 변경
sudo chown -R $USER:$USER .

# 실행 권한 부여
chmod +x scripts/*.js
```

---

## 🛠️ 디버깅 팁

### 1. 로그 확인

```bash
# Next.js 로그 (터미널)
npm run dev:web

# Strapi 로그 (터미널)
npm run dev:cms

# Docker 로그
docker compose logs -f
```

---

### 2. 브라우저 개발자 도구

- **Console**: JavaScript 에러 확인
- **Network**: API 요청/응답 확인 (상태 코드, 페이로드)
- **Application**: Cookies, Local Storage 확인
- **Sources**: 브레이크포인트 디버깅

---

### 3. DB 쿼리 디버깅

```bash
# Drizzle Studio (GUI)
npm run db:studio

# 또는 직접 SQL 실행
docker exec -it wikiboard-mariadb mysql -u root -p wikiboard
```

---

### 4. 환경변수 확인

```bash
# .env 파일 내용 확인
cat .env

# 특정 변수만 확인
grep STRAPI_API_TOKEN .env
```

---

## 📞 지원

문제가 해결되지 않으면:
1. [GitHub Issues](https://github.com/yourusername/WikiBoard/issues) 등록
2. 오류 메시지 전문 복사
3. 재현 단계 상세 기록
4. 환경 정보 (OS, Node.js 버전, Docker 버전)

---

**다음**: [maintenance.md](./maintenance.md) - 유지보수 가이드
