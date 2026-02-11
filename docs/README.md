# WikiBoard 문서

WikiBoard 프로젝트의 모든 문서를 **PDCA 사이클** 형식으로 체계화했습니다.

---

## 📚 문서 구조 (PDCA)

```
docs/
├── 01-plan/     ← 계획 (Plan)
├── 02-do/       ← 실행 (Do)
├── 03-check/    ← 검증 (Check)
└── 04-act/      ← 개선 (Act)
```

---

## 🔄 PDCA 사이클이란?

**Plan-Do-Check-Act**는 지속적 개선을 위한 반복적 프로세스입니다:

```
    Plan (계획)
       ↓
    Do (실행)
       ↓
   Check (검증)
       ↓
    Act (개선)
       ↓
   (반복...)
```

---

## 📋 단계별 문서

### [01. Plan (계획)](./01-plan/)

프로젝트 설계, 아키텍처, 요구사항 정의

**핵심 문서**:
- [architecture.md](./01-plan/architecture.md) - 시스템 아키텍처 설계
- [tech-stack.md](./01-plan/tech-stack.md) - 기술 스택 선정
- [content-model.md](./01-plan/content-model.md) - Strapi 콘텐츠 모델
- [database.md](./01-plan/database.md) - DB 스키마 설계
- [roadmap.md](./01-plan/roadmap.md) - 개발 로드맵
- [workflow.md](./01-plan/workflow.md) - 발행 워크플로우
- [conventions.md](./01-plan/conventions.md) - 코딩 컨벤션

---

### [02. Do (실행)](./02-do/)

계획된 설계를 바탕으로 실제 구현

**핵심 문서**:
- [monorepo.md](./02-do/monorepo.md) - 모노레포 구조
- [auth.md](./02-do/auth.md) - Auth.js 인증 구현
- [user-level.md](./02-do/user-level.md) - 유저/레벨 시스템
- [admin.md](./02-do/admin.md) - 관리자 페이지
- [search.md](./02-do/search.md) - Meilisearch 검색

**개발 환경 시작**:
```bash
npm run docker:dev  # DB + Meilisearch
npm run dev:cms     # Strapi
npm run dev:web     # Next.js
```

---

### [03. Check (검증)](./03-check/)

구현된 기능의 정상 작동 여부 검증

**핵심 문서**:
- [testing.md](./03-check/testing.md) - 테스트 전략
- [verification.md](./03-check/verification.md) - 자동 검증 스크립트

**자동 검증 실행**:
```bash
npm run verify              # 전체 자동 검증
npm run verify:health       # 서비스 헬스체크
npm run verify:auth         # 인증 API 테스트
npm run verify:admin        # 관리자 API 테스트
npm run verify:strapi       # Strapi 연동 테스트
npm run verify:external     # 외부 API 테스트
```

---

### [04. Act (개선)](./04-act/)

검증 결과를 바탕으로 배포, 모니터링, 개선

**핵심 문서**:
- [deploy.md](./04-act/deploy.md) - 배포 가이드
- [troubleshooting.md](./04-act/troubleshooting.md) - 문제 해결
- [maintenance.md](./04-act/maintenance.md) - 유지보수

**배포 실행**:
```bash
docker compose up -d
```

---

## 🚀 빠른 시작 가이드

### 1. 프로젝트 이해 (Plan)

```bash
# 아키텍처 확인
cat docs/01-plan/architecture.md

# 기술 스택 확인
cat docs/01-plan/tech-stack.md
```

---

### 2. 개발 환경 구축 (Do)

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env
# .env 편집

# 3. DB + Meilisearch 시작
npm run docker:dev

# 4. DB 테이블 생성
npm run db:push

# 5. 샘플 데이터 생성
npm run db:seed

# 6. Strapi 시작 (터미널 1)
npm run dev:cms

# 7. Next.js 시작 (터미널 2)
npm run dev:web
```

**접속**:
- Next.js: http://localhost:3050
- Strapi Admin: http://localhost:1337/admin

---

### 3. 기능 검증 (Check)

```bash
# 자동 검증 실행
npm run verify

# 수동 테스트
# - 회원가입: http://localhost:3050/register
# - 로그인: http://localhost:3050/login
# - 관리자: http://localhost:3050/admin
```

---

### 4. 배포 및 운영 (Act)

```bash
# 프로덕션 배포
docker compose up -d

# 헬스체크
npm run verify:health

# 로그 모니터링
docker compose logs -f
```

---

## 📖 학습 경로

### 초심자 (WikiBoard 처음 접하는 경우)

1. **[CLAUDE.md](../CLAUDE.md)** - 프로젝트 개요 (5분)
2. **[01-plan/architecture.md](./01-plan/architecture.md)** - 전체 구조 이해 (10분)
3. **[02-do/monorepo.md](./02-do/monorepo.md)** - 폴더 구조 파악 (5분)
4. **빠른 시작 가이드** (위 섹션) - 실행 (20분)

**총 소요 시간**: 약 40분

---

### 개발자 (기능 추가/수정)

1. **[01-plan](./01-plan/)** - 설계 문서 읽기
2. **[02-do](./02-do/)** - 해당 기능 구현 가이드 읽기
3. **코드 작성**
4. **[03-check/verification.md](./03-check/verification.md)** - 검증 실행

---

### 운영자 (배포/유지보수)

1. **[04-act/deploy.md](./04-act/deploy.md)** - 배포 절차
2. **[04-act/maintenance.md](./04-act/maintenance.md)** - 정기 점검
3. **[04-act/troubleshooting.md](./04-act/troubleshooting.md)** - 문제 발생 시

---

## 🔍 문서 검색 팁

### 키워드로 찾기

```bash
# 전체 문서에서 검색
grep -r "JWT" docs/

# 특정 폴더에서 검색
grep -r "Strapi" docs/02-do/
```

---

### 파일명으로 찾기

```bash
# architecture 관련 문서 찾기
find docs -name "*architecture*"

# auth 관련 문서 찾기
find docs -name "*auth*"
```

---

## 📝 문서 작성 가이드

### 새 문서 추가 시

1. **적절한 PDCA 폴더 선택**:
   - 설계 문서 → `01-plan/`
   - 구현 가이드 → `02-do/`
   - 테스트 가이드 → `03-check/`
   - 운영 가이드 → `04-act/`

2. **파일명 규칙**:
   - kebab-case 사용 (`my-document.md`)
   - 명확하고 간결한 이름

3. **문서 구조**:
   ```markdown
   # 제목

   간단한 설명 (1-2줄)

   ---

   ## 주요 섹션

   내용...

   ---

   **다음**: [관련-문서.md](./관련-문서.md)
   ```

---

### 문서 업데이트 시

- 변경 사항은 Git 커밋 메시지에 명시
- 파일 상단에 "최종 수정일" 추가 (선택사항)

---

## 🎯 문서화 목표

- **명확성**: 누구나 쉽게 이해할 수 있도록
- **완전성**: 필요한 정보를 모두 포함
- **최신성**: 코드 변경 시 문서도 함께 업데이트
- **실용성**: 실제 작업에 바로 활용 가능

---

## 📞 문서 개선 제안

문서 개선 아이디어가 있으시면:
- [GitHub Issues](https://github.com/yourusername/WikiBoard/issues)에 등록
- 또는 직접 PR 제출

---

**프로젝트 루트로 돌아가기**: [../CLAUDE.md](../CLAUDE.md)
