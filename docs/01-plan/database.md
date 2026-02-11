# 데이터베이스

## DB 선택

| DB | 설정값 | 기본 포트 | 비고 |
|----|--------|-----------|------|
| PostgreSQL | DB_TYPE=postgres | 5432 | 기본 선택, Strapi 공식 추천 |
| MariaDB | DB_TYPE=mariadb | 3306 | MySQL 호환 환경용 |

환경변수 `DB_TYPE`으로 전환합니다.
Strapi의 `config/database.ts`에서 자동으로 드라이버와 연결 설정을 스위칭합니다.

## 호환성 규칙

두 DB 모두 지원하기 위해 다음 규칙을 반드시 준수합니다.

### 사용 금지
| 항목 | 이유 |
|------|------|
| Full-text Search (DB) | Meilisearch로 통일 |
| 트리거 (Trigger) | DB 종속, 디버깅 어려움 |
| 저장 프로시저 (Stored Procedure) | DB 종속 |
| DB 특수 문법 | 호환성 깨짐 |
| JSON 컬럼 필터/정렬 | DB별 문법 차이 |

### 사용 허용
| 항목 | 조건 |
|------|------|
| JSON 컬럼 | 보조 데이터 저장용만 (핵심 필터/정렬 조건은 컬럼 분리) |
| 표준 SQL | PostgreSQL/MariaDB 공통으로 지원하는 SQL만 |
| ORM/Knex | Strapi 기본 쿼리 빌더 사용 |

## 연결 설정

### 환경변수 (루트 .env)
```
DB_TYPE=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=wikiboard
DATABASE_USERNAME=wikiboard_user
DATABASE_PASSWORD=your_password
```

### 연결 풀
| 변수 | 기본값 | 설명 |
|------|--------|------|
| DATABASE_POOL_MIN | 2 | 최소 연결 수 |
| DATABASE_POOL_MAX | 10 | 최대 연결 수 |

### SSL 설정
| 변수 | 기본값 | 설명 |
|------|--------|------|
| DATABASE_SSL | false | SSL 사용 여부 |
| DATABASE_SSL_REJECT_UNAUTHORIZED | true | 자체 서명 인증서 허용 여부 |

## 초기 설정

### PostgreSQL
```sql
CREATE USER wikiboard_user WITH PASSWORD 'your_password';
CREATE DATABASE wikiboard OWNER wikiboard_user;
```

### MariaDB
```sql
CREATE USER 'wikiboard_user'@'localhost' IDENTIFIED BY 'your_password';
CREATE DATABASE wikiboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON wikiboard.* TO 'wikiboard_user'@'localhost';
FLUSH PRIVILEGES;
```
