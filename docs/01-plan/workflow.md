# 발행 워크플로우 및 RBAC

## 발행 상태 흐름

```
Draft(초안) → Review(검수) → Scheduled(예약) → Published(발행) → Archived(보관)
    │              │              │                                     ▲
    │              │              └── publish_at 시각 도래 시 자동 발행 ──┘
    │              └── 반려 시 → Draft로 복귀
    └── 작성 중 언제든 수정 가능
```

### 상태 설명

| 상태 | 값 | 설명 |
|------|-----|------|
| 초안 | draft | 작성 중. 작성자만 볼 수 있음 |
| 검수 | review | 검수 요청됨. 검수자가 승인/반려 |
| 예약 | scheduled | 승인 완료. publish_at 시각에 자동 발행 |
| 발행 | published | 공개됨. 사용자에게 노출 |
| 보관 | archived | 비공개 처리. 검색에서 제외 |

### 주요 필드

| 필드 | 용도 |
|------|------|
| status | 현재 상태 (enum) |
| publish_at | 예약 발행 시각 (nullable) |
| published_at | 실제 발행 시각 (자동 기록) |
| created_at | 생성 시각 |
| updated_at | 수정 시각 |

## Strapi RBAC (콘텐츠 운영)

Strapi Admin 계정은 **콘텐츠 운영자** 전용입니다.
일반 회원(로그인/레벨)은 Next.js 쪽 사용자로 별도 관리합니다.

### 역할별 권한

| 역할 | 생성 | 수정 | 검수 승인 | 발행 | 예약 발행 | 보관 |
|------|------|------|-----------|------|-----------|------|
| Author | O | 본인만 | X | X | X | X |
| Reviewer | O | O | O | X | X | X |
| Publisher (Admin) | O | O | O | O | O | O |

### 워크플로우 예시

#### 일반 발행
```
1. Author가 초안 작성 (status: draft)
2. Author가 검수 요청 (status: review)
3. Reviewer가 검토 후 승인
4. Publisher가 발행 (status: published, published_at 자동 기록)
```

#### 예약 발행
```
1. Author가 초안 작성 + publish_at 설정
2. Reviewer 승인
3. Publisher가 예약 확정 (status: scheduled)
4. publish_at 시각 도래 → 자동으로 status: published로 전환
```

#### 보관 처리
```
1. Publisher가 보관 처리 (status: archived)
2. 공개 페이지와 검색에서 제외
3. Strapi Admin에서는 조회/복원 가능
```
