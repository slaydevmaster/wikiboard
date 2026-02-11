# 03. Check (검증)

구현된 기능의 정상 작동 여부를 검증하고 테스트하는 단계의 문서입니다.

## 📋 문서 목록

- **[testing.md](./testing.md)** - 테스트 전략 및 방법론
- **[verification.md](./verification.md)** - 자동 검증 스크립트 사용법

---

## 🎯 Check 단계의 목적

1. **품질 보증** - 코드가 요구사항을 만족하는가?
2. **버그 발견** - 예상치 못한 오류는 없는가?
3. **성능 확인** - 성능 목표를 달성했는가?
4. **보안 검증** - 보안 취약점은 없는가?

---

## 🧪 검증 방법

### 1. 자동 검증 스크립트 (추천 ⭐)

```bash
# 전체 자동 검증 (서비스 헬스, 인증, 관리자, Strapi API)
npm run verify

# 개별 검증
npm run verify:health      # DB, Strapi, Meilisearch, Next.js 연결 확인
npm run verify:auth        # 인증 API 테스트
npm run verify:admin       # 관리자 API 테스트
npm run verify:strapi      # Strapi API 연동 테스트
npm run verify:external    # 외부 API 업로드 테스트
```

### 2. 수동 테스트 체크리스트

#### UI/UX 검증
- [ ] `/register` - 비밀번호 강도 게이지 표시
- [ ] `/login` - 로그인 성공/실패 토스트 알림
- [ ] `/admin/users` - 역할 변경 토스트, 테이블 스켈레톤
- [ ] `/terms` - 용어 목록, 카테고리 필터링, 초성 필터
- [ ] `/` - 최근 등록 용어 5개 표시

#### 보안 검증
- [ ] JWT 토큰 만료 시간 7일 확인 (F12 → Cookies → jwt.io)
- [ ] 약한 비밀번호 거부 ("12345678")
- [ ] 잘못된 이메일 형식 거부 ("test@test")
- [ ] 검색어 길이 제한 (2-100자)

#### Strapi 연동
- [ ] Strapi에서 Term 발행 → Next.js 페이지에 표시 (5초 후)
- [ ] Meilisearch 검색 결과 확인
- [ ] 카테고리별 필터링 동작

---

## 📊 검증 결과 예시

```
=== WikiBoard v0 자동 검증 시작 ===

[1/4] 서비스 헬스체크
✅ MariaDB 연결 성공
✅ Strapi API 응답 (200 OK)
✅ Meilisearch 응답 (200 OK)
✅ Next.js 응답 (200 OK)

[2/4] 인증 API 테스트
✅ 회원가입 성공
✅ 약한 비밀번호 거부
✅ 로그인 성공
✅ JWT 만료 시간 확인 (7일)

[3/4] 관리자 API 테스트
✅ 유저 목록 조회 (total: 6)
✅ 역할 변경 성공
✅ 상태 변경 성공

[4/4] Strapi API 연동 테스트
✅ 최근 용어 조회 (5개)
✅ 초성별 용어 ("ㄱ" → 3개)
✅ 용어 상세 조회

=== 검증 완료 ===
✅ 성공: 16/16
❌ 실패: 0/16
⏱️  소요 시간: 3.2초
```

---

**이전 단계**: [02-do](../02-do/) - 구현 및 개발
**다음 단계**: [04-act](../04-act/) - 배포 및 개선
