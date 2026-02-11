#!/bin/bash
# WikiBoard 용어 업로드 예시 (curl)
#
# 사용법:
#   1. 환경변수 설정:
#      export STRAPI_URL=http://localhost:1337
#      export STRAPI_API_TOKEN=your-token-here
#   2. bash examples/upload-term.sh

STRAPI_URL="${STRAPI_URL:-http://localhost:1337}"
API_TOKEN="${STRAPI_API_TOKEN}"

if [ -z "$API_TOKEN" ]; then
  echo "STRAPI_API_TOKEN 환경변수를 설정하세요."
  echo "  export STRAPI_API_TOKEN=your-token-here"
  exit 1
fi

echo "=== WikiBoard 용어 업로드 (curl) ==="
echo ""

# 용어 생성
echo "--- 용어 생성 ---"
curl -s -X POST "${STRAPI_URL}/api/terms" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -d '{
    "data": {
      "title": "Docker",
      "slug": "docker",
      "one_liner": "컨테이너 기반 가상화 플랫폼",
      "summary": "애플리케이션을 컨테이너로 패키징하고 배포하는 오픈소스 플랫폼입니다.",
      "body": "# Docker\n\nDocker는 애플리케이션을 컨테이너로 패키징하여 어디서든 실행할 수 있게 합니다.\n\n## 핵심 개념\n- 이미지: 실행 환경 스냅샷\n- 컨테이너: 이미지의 실행 인스턴스\n- Dockerfile: 이미지 빌드 스크립트",
      "status": "draft",
      "aliases": ["도커", "Docker Engine"]
    }
  }' | python3 -m json.tool 2>/dev/null || cat

echo ""

# 글/보고서 생성
echo "--- 보고서 생성 ---"
curl -s -X POST "${STRAPI_URL}/api/articles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -d '{
    "data": {
      "title": "인프라 구성 보고서",
      "slug": "infra-report",
      "excerpt": "서버 인프라 구성 현황 보고서",
      "body": "# 인프라 구성 보고서\n\n## 서버 현황\n- 웹 서버: Nginx\n- DB: MariaDB\n- 검색: Meilisearch",
      "status": "draft"
    }
  }' | python3 -m json.tool 2>/dev/null || cat

echo ""
echo "=== 완료 ==="
