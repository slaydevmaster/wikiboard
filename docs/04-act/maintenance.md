# 유지보수 및 운영 가이드

WikiBoard 프로덕션 환경 유지보수 및 운영 가이드입니다.

---

## 📅 정기 유지보수 체크리스트

### 일일 점검 (Daily)

- [ ] 서비스 헬스체크
  ```bash
  npm run verify:health
  ```
- [ ] 로그 확인 (에러 메시지 확인)
  ```bash
  docker compose logs --tail=100 | grep -i error
  ```
- [ ] 디스크 사용량 확인
  ```bash
  docker system df
  df -h
  ```

---

### 주간 점검 (Weekly)

- [ ] DB 백업
  ```bash
  npm run db:backup  # 자동 백업 스크립트
  ```
- [ ] Meilisearch 인덱스 건전성 확인
  ```bash
  curl http://localhost:7700/indexes/terms/stats
  ```
- [ ] 보안 취약점 스캔
  ```bash
  npm audit
  ```
- [ ] 불필요한 Docker 이미지/컨테이너 정리
  ```bash
  docker system prune -f
  ```

---

### 월간 점검 (Monthly)

- [ ] 패키지 업데이트 확인
  ```bash
  npm outdated
  ```
- [ ] SSL 인증서 만료일 확인 (프로덕션)
  ```bash
  openssl s_client -connect yourdomain.com:443 -servername yourdomain.com 2>/dev/null | openssl x509 -noout -dates
  ```
- [ ] 사용자 피드백 검토 및 개선 계획
- [ ] 성능 모니터링 리포트 작성

---

## 💾 백업 및 복구

### DB 백업

#### 자동 백업 (권장)

**cron 설정** (Linux):
```bash
# 매일 새벽 2시 백업
0 2 * * * cd /path/to/WikiBoard && npm run db:backup
```

**Windows 작업 스케줄러**:
1. 작업 스케줄러 열기
2. 기본 작업 만들기
3. 트리거: 매일 새벽 2시
4. 작업: `npm run db:backup` 실행

#### 수동 백업

```bash
# MariaDB 전체 덤프
docker exec wikiboard-mariadb mysqldump -u root -ptest00!@ wikiboard > backups/wikiboard_$(date +%Y%m%d).sql

# 압축
gzip backups/wikiboard_$(date +%Y%m%d).sql
```

**백업 파일 보관 정책**:
- 최근 7일: 일일 백업
- 최근 4주: 주간 백업
- 최근 12개월: 월간 백업

---

### DB 복구

```bash
# 압축 해제
gunzip backups/wikiboard_20260211.sql.gz

# 복원
docker exec -i wikiboard-mariadb mysql -u root -ptest00!@ wikiboard < backups/wikiboard_20260211.sql
```

**주의**: 복원 시 기존 데이터가 **덮어씌워집니다**. 반드시 현재 DB 백업 후 진행하세요.

---

### Meilisearch 인덱스 백업

Meilisearch는 DB 기반이므로 별도 백업 불필요. 필요 시 재인덱싱:

```bash
# Strapi 재시작으로 자동 재인덱싱
npm run dev:cms
```

또는 수동 재인덱싱 스크립트:
```bash
node scripts/reindex-all.js  # (향후 추가 예정)
```

---

## 🔄 업데이트 및 배포

### 패키지 업데이트

#### 보안 패치 (우선 적용)

```bash
# 취약점 확인
npm audit

# 자동 수정 (경미한 버전)
npm audit fix

# 주요 버전 업데이트 (신중히)
npm audit fix --force
```

#### 일반 패키지 업데이트

```bash
# 업데이트 가능한 패키지 확인
npm outdated

# 특정 패키지 업데이트
npm update <package-name>

# 주요 버전 업그레이드 (신중히)
npm install <package-name>@latest
```

**주의사항**:
- 메이저 버전 업데이트는 **스테이징 환경**에서 먼저 테스트
- 업데이트 후 반드시 `npm run verify` 실행
- 문제 발생 시 `package-lock.json` 롤백

---

### 배포 프로세스

#### 1. 준비 단계

```bash
# 1. 코드 최신화
git pull origin main

# 2. 의존성 설치
npm install

# 3. 환경변수 확인
cat .env.production

# 4. 빌드 테스트 (로컬)
npm run build:web
npm run build:cms
```

---

#### 2. 스테이징 배포

```bash
# 스테이징 환경으로 배포
docker compose -f docker-compose.staging.yml up -d

# 검증
npm run verify
```

---

#### 3. 프로덕션 배포

```bash
# DB 백업 (필수!)
npm run db:backup

# 현재 컨테이너 중지
docker compose down

# 최신 이미지로 재시작
docker compose pull
docker compose up -d

# 헬스체크
npm run verify:health

# 로그 확인
docker compose logs -f --tail=50
```

**롤백 절차** (문제 발생 시):
```bash
# 이전 버전으로 롤백
git checkout <previous-commit>
docker compose down
docker compose up -d

# DB 복원 (필요 시)
docker exec -i wikiboard-mariadb mysql -u root -p wikiboard < backups/latest.sql
```

---

## 📊 모니터링

### 서비스 헬스체크

```bash
# 전체 서비스 상태
docker ps

# CPU/메모리 사용량
docker stats

# 네트워크 상태
docker network ls
```

---

### 로그 모니터링

#### 실시간 로그

```bash
# 전체 서비스
docker compose logs -f

# 특정 서비스
docker compose logs -f web
docker compose logs -f cms

# 에러만 필터링
docker compose logs | grep -i error
```

---

#### 로그 로테이션 (프로덕션)

**docker-compose.yml** 수정:
```yaml
services:
  web:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

### 성능 모니터링

#### Next.js 성능

```bash
# Lighthouse 스코어 확인
npx lighthouse http://localhost:3050 --view

# 빌드 분석
npm run build:web -- --analyze
```

---

#### DB 성능

```bash
# Slow Query 확인
docker exec -it wikiboard-mariadb mysql -u root -p
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';
```

---

#### Meilisearch 성능

```bash
# 인덱스 통계
curl http://localhost:7700/indexes/terms/stats

# 검색 성능 측정
time curl "http://localhost:7700/indexes/terms/search?q=테스트"
```

---

## 🔐 보안 관리

### 환경변수 보안

**프로덕션 환경**:
- `.env` 파일은 **절대 Git에 커밋하지 않음**
- 민감 정보는 **환경변수 또는 Secret Manager** 사용
- `AUTH_SECRET`, `DATABASE_PASSWORD` 등은 **강력한 랜덤 값** 사용

**생성 예시**:
```bash
# AUTH_SECRET 생성 (32바이트)
openssl rand -base64 32

# DATABASE_PASSWORD 생성
openssl rand -hex 16
```

---

### SSL/TLS 인증서

**Let's Encrypt 자동 갱신** (프로덕션):
```bash
# Certbot 설치
sudo apt-get install certbot

# 인증서 발급
sudo certbot certonly --standalone -d yourdomain.com

# 자동 갱신 (cron)
0 0 1 * * certbot renew --quiet
```

---

### 방화벽 설정

**필요한 포트만 개방**:
```bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 22/tcp   # SSH
sudo ufw enable
```

---

### 보안 헤더 설정

**Next.js (next.config.ts)**:
```typescript
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 📈 성능 최적화

### Next.js ISR → On-Demand Revalidation (v1)

**현재** (v0):
```typescript
revalidate: 60  // 60초마다 재검증
```

**개선** (v1):
```typescript
// Strapi Webhook으로 On-Demand Revalidation
export async function POST(request: Request) {
  const { slug } = await request.json();
  await revalidatePath(`/terms/${slug}`);
  return Response.json({ revalidated: true });
}
```

---

### DB 쿼리 최적화

```sql
-- 인덱스 추가 (예시)
CREATE INDEX idx_terms_status ON terms(status);
CREATE INDEX idx_terms_published_at ON terms(published_at);

-- Slow Query 분석
EXPLAIN SELECT * FROM terms WHERE status = 'published' ORDER BY published_at DESC;
```

---

### Meilisearch 인덱스 최적화

```bash
# 인덱스 재생성
curl -X DELETE http://localhost:7700/indexes/terms
# Strapi 재시작으로 자동 재인덱싱
```

---

## 🚨 장애 대응

### 장애 발생 시 대응 절차

1. **알림 확인** (모니터링 시스템, 사용자 제보)
2. **로그 확인**
   ```bash
   docker compose logs --tail=100 | grep -i error
   ```
3. **헬스체크**
   ```bash
   npm run verify:health
   ```
4. **일시적 조치** (서비스 재시작)
   ```bash
   docker compose restart <service-name>
   ```
5. **근본 원인 분석**
6. **영구 수정** (코드 수정, 설정 변경)
7. **재배포**
8. **사후 보고서 작성**

---

### 긴급 연락망

- **시스템 관리자**: (연락처)
- **개발 팀**: (연락처)
- **호스팅 업체**: (지원 번호)

---

## 📝 변경 이력 관리

### Git 커밋 메시지 규칙

```
<type>(<scope>): <subject>

<body>

<footer>
```

**타입**:
- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 (포맷팅)
- `refactor`: 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드, 패키지 관리

**예시**:
```
feat(auth): SSO 로그인 추가

- OIDC 프로바이더 연동
- 사내 IdP 설정

Closes #123
```

---

### 릴리스 관리

**Semantic Versioning** (x.y.z):
- `x`: 메이저 (Breaking Changes)
- `y`: 마이너 (새 기능)
- `z`: 패치 (버그 수정)

**예시**:
- `v0.1.0`: 초기 프로토타입
- `v0.2.0`: 검증 스크립트 추가
- `v0.2.1`: JWT 만료 시간 수정
- `v1.0.0`: 프로덕션 릴리스 (SSO 추가)

---

## 🎯 운영 목표

### SLA (Service Level Agreement)

| 지표 | 목표 | 현재 |
|------|------|------|
| 가용성 | 99.9% | ⏳ 측정 중 |
| 응답 시간 (p95) | < 500ms | ⏳ 측정 중 |
| 에러율 | < 0.1% | ⏳ 측정 중 |

---

### KPI (Key Performance Indicators)

- **사용자 증가율**: 월별 신규 가입자
- **콘텐츠 증가율**: 월별 신규 용어/글
- **검색 품질**: 검색 결과 클릭률
- **페이지 로드 시간**: Lighthouse 스코어 > 90

---

**이전**: [troubleshooting.md](./troubleshooting.md) - 문제 해결 가이드
**다음**: PDCA 사이클 반복 → [01-plan](../01-plan/)
