# 배포 (Docker Compose)

## 서비스 구성

| 서비스 | 이미지 | 포트 | 역할 |
|--------|--------|------|------|
| web | Node.js + Next.js | 3000 | 공개 위키 + 운영 어드민 |
| cms | Node.js + Strapi | 1337 | 콘텐츠 CMS |
| db | postgres:16-alpine 또는 mariadb:11 | 5432/3306 | 데이터베이스 |
| search | getmeili/meilisearch:v1 | 7700 | 검색 엔진 |

### 선택적 서비스
| 서비스 | 이미지 | 용도 |
|--------|--------|------|
| storage | minio/minio | S3 호환 파일 스토리지 (다운로드/이미지) |
| proxy | nginx | 리버스 프록시 (TRUSTED 모드 헤더 주입) |

## 개발 환경 (docker-compose.dev.yml)

```bash
# PostgreSQL + Meilisearch 실행
docker compose -f docker-compose.dev.yml --profile postgres up -d

# MariaDB + Meilisearch 실행
docker compose -f docker-compose.dev.yml --profile mariadb up -d

# 중지
docker compose -f docker-compose.dev.yml down
```

### 프로필 선택
- `--profile postgres`: PostgreSQL 사용
- `--profile mariadb`: MariaDB 사용
- Meilisearch는 프로필 없이 항상 실행

## 프로덕션 환경 (docker-compose.yml)

추후 구성 예정. 다음 항목을 포함:
- 모든 서비스 컨테이너화 (web, cms, db, search)
- 볼륨 마운트 (DB 데이터, 업로드 파일, 검색 인덱스)
- 네트워크 분리 (프론트/백엔드)
- 헬스체크
- 재시작 정책

## 볼륨

| 볼륨 | 마운트 대상 | 용도 |
|------|------------|------|
| pgdata / mariadbdata | DB 데이터 디렉토리 | DB 영속 저장 |
| meilidata | /meili_data | 검색 인덱스 영속 저장 |

## 환경변수

Docker Compose에서 루트 `.env` 파일을 자동으로 로드합니다.
모든 서비스가 같은 환경변수를 공유합니다.
