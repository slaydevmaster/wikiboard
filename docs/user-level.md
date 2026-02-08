# 사용자 레벨/XP 시스템

## 설계 원칙

**권한(role)과 레벨(level/xp)은 완전히 분리**합니다.

| 구분 | 용도 | 예시 |
|------|------|------|
| 역할 (role) | 접근 제어/권한 | admin, editor, member |
| 레벨 (level/xp) | 활동 등급/혜택 | Lv.1 ~ Lv.50 |

관리자 권한은 **레벨이 아니라 role로만** 부여합니다.

## 데이터 모델

### users 테이블
| 필드 | 타입 | 설명 |
|------|------|------|
| id | uuid | 고유 ID |
| email | string | 이메일 |
| name | string | 이름 |
| role | enum | admin / editor / member |
| status | enum | active / suspended / deactivated |
| xp | integer | 누적 경험치 |
| level | integer | 현재 레벨 |
| auth_mode | enum | LOCAL / SSO / TRUSTED |
| created_at | datetime | 가입 시각 |
| updated_at | datetime | 수정 시각 |

### xp_events 테이블
| 필드 | 타입 | 설명 |
|------|------|------|
| id | integer | 고유 ID |
| user_id | uuid (FK) | 사용자 ID |
| action | string | 활동 종류 (term_view, download, edit_suggest 등) |
| xp_amount | integer | 획득 XP |
| description | string | 활동 설명 |
| created_at | datetime | 발생 시각 |

## XP 획득 기준 (예시)

| 활동 | XP | 일일 한도 |
|------|-----|-----------|
| 용어 조회 | +1 | 50회 |
| 자료 다운로드 | +5 | 10회 |
| 편집 제안 | +10 | 5회 |
| 편집 제안 승인됨 | +20 | - |
| 첫 로그인 (일일) | +3 | 1회 |
| 연속 로그인 보너스 | +5~20 | 1회 |

## 레벨 체계 (예시)

| 레벨 | 필요 XP | 혜택 |
|------|---------|------|
| 1-5 | 0~500 | 기본 조회 |
| 6-10 | 500~2000 | 편집 제안 5회/일 |
| 11-20 | 2000~8000 | 편집 제안 10회/일, 다운로드 무제한 |
| 21-30 | 8000~20000 | 배지 표시, 프로필 커스텀 |
| 31+ | 20000+ | 특별 배지, 우선 지원 |

## 관리자 기능 (Next.js /admin)

- 사용자별 XP/레벨 조회
- XP 수동 조정 (관리자 권한)
- 레벨 정책 변경
- XP 이벤트 로그 조회
