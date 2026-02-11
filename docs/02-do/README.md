# 02. Do (실행)

계획된 설계를 바탕으로 실제 구현 및 개발 단계의 문서입니다.

## 📋 문서 목록

### 프로젝트 구조
- **[monorepo.md](./monorepo.md)** - 모노레포 구조 및 워크스페이스 설정

### 핵심 기능 구현
- **[auth.md](./auth.md)** - Auth.js 인증 시스템 구현 (LOCAL/SSO/TRUSTED)
- **[user-level.md](./user-level.md)** - 유저/레벨/XP 시스템 구현
- **[admin.md](./admin.md)** - 관리자 페이지 구현 (/admin)
- **[search.md](./search.md)** - Meilisearch 검색 기능 구현

---

## 🎯 Do 단계의 목적

1. **설계를 코드로 변환** - Plan의 설계를 실제 구현
2. **기능 개발** - 요구사항에 맞는 기능 작성
3. **통합** - 각 모듈을 하나의 시스템으로 통합

---

## 🛠️ 개발 환경 설정

```bash
# DB + Meilisearch 시작
npm run docker:dev

# Strapi 실행 (터미널 1)
npm run dev:cms

# Next.js 실행 (터미널 2)
npm run dev:web
```

---

**이전 단계**: [01-plan](../01-plan/) - 설계 및 계획
**다음 단계**: [03-check](../03-check/) - 검증 및 테스트
