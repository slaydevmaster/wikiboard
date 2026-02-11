# 인증 시스템

## 인증 모드

Auth.js(NextAuth v5) 기반으로 3가지 모드를 환경변수(`AUTH_MODE`)로 전환합니다.

| 모드 | 용도 | 설명 |
|------|------|------|
| LOCAL | 개인/소규모 서비스 | 이메일+비밀번호 / 소셜 로그인 |
| SSO | 사내 운영 | OIDC(사내 IdP) 연동 |
| TRUSTED | 사내망 전용 | 프록시 뒤 헤더/JWT 신뢰 |

## LOCAL 모드

가장 기본적인 인증 방식. v0 프로토타입에서 먼저 구현합니다.

### 지원 방식
- **이메일 + 비밀번호**: Auth.js Credentials Provider
- **소셜 로그인**: Google, GitHub 등 OAuth Provider (추후)

### 흐름
```
사용자 → /login 페이지
       → 이메일/비밀번호 입력
       → Auth.js Credentials Provider 처리
       → DB에서 사용자 조회 + bcrypt 비밀번호 검증
       → JWT 세션 발급
```

## SSO 모드 (v1)

사내 IdP(OIDC)와 연동하여 통합 인증을 제공합니다.

### 흐름
```
사용자 → /login 페이지
       → "사내 계정으로 로그인" 버튼
       → 사내 IdP로 리다이렉트
       → OIDC 인증 완료 → 콜백 URL로 복귀
       → Auth.js가 ID 토큰 검증 → 세션 생성
       → 사내 계정 정보로 자동 회원가입/로그인
```

### 필요 환경변수
```
AUTH_MODE=SSO
OIDC_ISSUER=https://idp.company.com
OIDC_CLIENT_ID=wikiboard
OIDC_CLIENT_SECRET=...
```

## TRUSTED 모드 (v1)

리버스 프록시가 이미 인증을 처리한 환경에서 사용합니다.

### 핵심 원칙
- **반드시 사내망/리버스프록시 뒤에서만 허용**
- 외부에 직접 노출하면 헤더 위조로 인증 우회 가능
- 프록시가 서명한 JWT 또는 내부 게이트웨이 전용 헤더만 신뢰

### 흐름
```
사용자 → 리버스 프록시 (인증 처리 완료)
       → 프록시가 X-Auth-User / X-Auth-Email 헤더 추가
       → Next.js가 신뢰된 헤더에서 사용자 정보 추출
       → 세션 생성 (별도 로그인 화면 없음)
```

### 보안 설정
```
AUTH_MODE=TRUSTED
TRUSTED_HEADER_USER=X-Auth-User
TRUSTED_HEADER_EMAIL=X-Auth-Email
TRUSTED_PROXY_IPS=10.0.0.0/8,172.16.0.0/12
```

## 사용자 데이터

Auth.js 사용자는 Next.js 측 DB 테이블에 저장됩니다.
Strapi Admin 계정과는 완전히 분리됩니다.

| 구분 | Strapi Admin | Next.js 사용자 |
|------|-------------|---------------|
| 대상 | 콘텐츠 운영자 | 일반 회원/관리자 |
| 인증 | Strapi 자체 로그인 | Auth.js |
| 역할 | Author/Reviewer/Publisher | admin/editor/member |
| 레벨 | 없음 | XP/레벨 시스템 |
