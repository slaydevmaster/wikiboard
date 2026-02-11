# 운영 어드민 (/admin)

## 개요

Next.js `/admin` 경로에 구현되는 **서비스 운영 관리자** 페이지입니다.
Strapi Admin(콘텐츠 관리)과는 분리된 별도 관리 영역입니다.

| 구분 | Strapi Admin (:1337/admin) | Next.js /admin (:3000/admin) |
|------|---------------------------|------------------------------|
| 대상 | 콘텐츠 운영자 | 서비스 관리자 |
| 기능 | 용어/글/자료 CRUD, 발행 | 유저/레벨/정지/로그/통계 |
| 인증 | Strapi 자체 로그인 | Auth.js (admin role 필요) |

## 메뉴 구성

### 대시보드
- 주요 통계 카드 (전체 사용자, 발행 용어, 오늘 조회수, 검수 대기)
- 빠른 액션 (Strapi CMS 열기, 검색 인덱스 동기화, 캐시 초기화)
- 최근 활동 로그
- 인기 용어 / 인기 검색어

### 사용자 관리
- 유저 목록/검색
- 상태 변경 (active/suspended/deactivated)
- 역할(role) 변경 (admin/editor/member)
- 사용자 상세 정보 조회

### 레벨/XP 관리
- 사용자별 XP/레벨 조회
- XP 수동 조정
- 레벨 정책 설정
- XP 이벤트 로그

### 감사 로그 (v1)
- 관리자 조작 이력
- 필터: 일자, 관리자, 대상, 액션
- 상세 내역 (변경 전/후)

### 통계 (v1)
- 조회수 (일별/주별/월별)
- 다운로드 수
- 인기 용어 랭킹 (기간별)
- 검색어 분석
- 신규 가입자 추이

## 접근 제어

```typescript
// admin layout에서 세션 확인
const session = await auth();
if (!session || session.user.role !== "admin") {
  redirect("/");
}
```

- `admin` role을 가진 사용자만 접근 가능
- Auth.js 세션으로 서버 사이드에서 검증
- 미인증/권한 없음 시 메인 페이지로 리다이렉트

## audit_logs 테이블 (v1)

| 필드 | 타입 | 설명 |
|------|------|------|
| id | integer | 고유 ID |
| admin_id | uuid (FK) | 조작한 관리자 ID |
| action | string | 액션 (user_suspend, xp_adjust, role_change 등) |
| target_type | string | 대상 종류 (user, term, article) |
| target_id | string | 대상 ID |
| details | text | 상세 내역 (JSON) |
| created_at | datetime | 발생 시각 |
