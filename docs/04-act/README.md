# 04. Act (개선)

검증 결과를 바탕으로 배포, 모니터링, 유지보수, 개선 단계의 문서입니다.

## 📋 문서 목록

- **[deploy.md](./deploy.md)** - Docker Compose 배포 가이드
- **[troubleshooting.md](./troubleshooting.md)** - 문제 해결 가이드
- **[maintenance.md](./maintenance.md)** - 유지보수 및 운영 가이드

---

## 🎯 Act 단계의 목적

1. **배포** - 프로덕션 환경에 안전하게 배포
2. **모니터링** - 시스템 상태 지속 확인
3. **문제 해결** - 발생한 문제 신속 대응
4. **개선** - 사용자 피드백 반영 및 성능 개선

---

## 🚀 빠른 배포

### 개발 환경

```bash
# 1. DB + Meilisearch 시작
npm run docker:dev

# 2. Strapi 시작
npm run dev:cms

# 3. Next.js 시작
npm run dev:web
```

### 프로덕션 환경

```bash
# 1. 환경변수 설정
cp .env.example .env.production
# .env.production 편집 (DB 비밀번호, AUTH_SECRET 등)

# 2. Docker Compose로 전체 서비스 시작
docker compose up -d

# 3. 상태 확인
docker ps
```

**접속**:
- Next.js: `http://localhost:3050`
- Strapi Admin: `http://localhost:1337/admin`
- Meilisearch: `http://localhost:7700`

---

## 📊 모니터링

### 로그 확인

```bash
# 전체 로그
docker compose logs -f

# 특정 서비스 로그
docker compose logs -f web
docker compose logs -f cms
docker compose logs -f db
docker compose logs -f meilisearch
```

### 리소스 사용량

```bash
# 컨테이너 리소스 모니터링
docker stats

# 디스크 사용량
docker system df
```

---

## 🔧 유지보수 작업

### DB 백업

```bash
# MariaDB 덤프
docker exec wikiboard-mariadb mysqldump -u root -p wikiboard > backup.sql

# 복원
docker exec -i wikiboard-mariadb mysql -u root -p wikiboard < backup.sql
```

### Meilisearch 인덱스 재생성

```bash
# Strapi에서 전체 재인덱싱 (bootstrap.ts 참고)
# 또는 수동 스크립트 실행
node scripts/reindex-all.js
```

### 패키지 업데이트

```bash
# 보안 취약점 확인
npm audit

# 패키지 업데이트
npm update

# 주요 버전 업그레이드 (신중히)
npm outdated
npm install <package>@latest
```

---

## 🐛 일반적인 문제

### 1. Strapi 403 Forbidden

**증상**: Next.js에서 Strapi API 호출 시 403 에러

**해결**: [troubleshooting.md](./troubleshooting.md#strapi-403-forbidden) 참고

### 2. Meilisearch 인덱스 누락

**증상**: 검색 결과가 비어있음

**해결**: [troubleshooting.md](./troubleshooting.md#meilisearch-인덱스-누락) 참고

### 3. JWT 만료 시간 문제

**증상**: 로그인 후 즉시 만료됨

**해결**: [troubleshooting.md](./troubleshooting.md#jwt-만료-시간-문제) 참고

---

## 📈 개선 사이클

```
피드백 수집
    ↓
문제 분석
    ↓
개선 계획 (Plan)
    ↓
구현 (Do)
    ↓
검증 (Check)
    ↓
배포 (Act)
    ↓
(반복)
```

### v1 개선 계획

- [ ] SSO/OIDC 인증 추가
- [ ] 감사 로그 고도화
- [ ] 통계/랭킹 대시보드
- [ ] 이메일 알림
- [ ] 성능 최적화 (ISR → On-Demand Revalidation)

---

**이전 단계**: [03-check](../03-check/) - 검증 및 테스트
**다음 단계**: PDCA 사이클 반복 → [01-plan](../01-plan/)
