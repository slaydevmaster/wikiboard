"""
WikiBoard 용어 업로드 예시 (Python)

사용법:
  1. pip install requests
  2. 환경변수 설정:
     export STRAPI_URL=http://localhost:1337
     export STRAPI_API_TOKEN=your-token-here
  3. python upload-term.py
"""

import requests
import os
import sys

STRAPI_URL = os.getenv("STRAPI_URL", "http://localhost:1337")
API_TOKEN = os.getenv("STRAPI_API_TOKEN", "")


def upload_term(title: str, slug: str, body: str, status: str = "draft", **kwargs):
    """WikiBoard에 용어 업로드

    Args:
        title: 용어명 (필수)
        slug: URL 슬러그 (필수)
        body: 본문 (마크다운)
        status: 발행 상태 (draft/review/published)
        **kwargs: one_liner, summary, aliases, category, tags 등
    """
    if not API_TOKEN:
        print("STRAPI_API_TOKEN 환경변수를 설정하세요.")
        sys.exit(1)

    url = f"{STRAPI_URL}/api/terms"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_TOKEN}",
    }

    data = {
        "title": title,
        "slug": slug,
        "body": body,
        "status": status,
    }

    # 선택 필드 추가
    for key in ["one_liner", "summary", "aliases", "category", "tags"]:
        if key in kwargs:
            data[key] = kwargs[key]

    payload = {"data": data}

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200 or response.status_code == 201:
        result = response.json()
        doc_id = result.get("data", {}).get("documentId", "?")
        print(f"  용어 생성 성공: {title} (documentId: {doc_id})")
        return result
    else:
        print(f"  용어 생성 실패: {response.status_code}")
        print(f"  응답: {response.text}")
        return None


def upload_article(title: str, slug: str, body: str, status: str = "draft", **kwargs):
    """WikiBoard에 글/보고서 업로드"""
    if not API_TOKEN:
        print("STRAPI_API_TOKEN 환경변수를 설정하세요.")
        sys.exit(1)

    url = f"{STRAPI_URL}/api/articles"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_TOKEN}",
    }

    data = {
        "title": title,
        "slug": slug,
        "body": body,
        "status": status,
    }

    for key in ["excerpt", "category", "tags"]:
        if key in kwargs:
            data[key] = kwargs[key]

    payload = {"data": data}

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200 or response.status_code == 201:
        result = response.json()
        doc_id = result.get("data", {}).get("documentId", "?")
        print(f"  글 생성 성공: {title} (documentId: {doc_id})")
        return result
    else:
        print(f"  글 생성 실패: {response.status_code}")
        print(f"  응답: {response.text}")
        return None


# 사용 예시
if __name__ == "__main__":
    print("=== WikiBoard 용어 업로드 예시 ===\n")

    # 용어 업로드
    upload_term(
        title="REST API",
        slug="rest-api",
        one_liner="웹 서비스 API 아키텍처 스타일",
        summary="REpresentational State Transfer의 약자로, HTTP 기반 웹 서비스 설계 방식입니다.",
        body="# REST API\n\nREST(Representational State Transfer)는 HTTP 프로토콜을 활용한 API 아키텍처 스타일입니다.\n\n## 핵심 원칙\n- 클라이언트-서버 분리\n- 무상태(Stateless)\n- 캐시 가능\n- 균일한 인터페이스\n- 계층화 시스템",
        status="draft",
        aliases=["RESTful API", "REST 웹 서비스"],
    )

    # 보고서 업로드
    upload_article(
        title="2026년 1월 보고서",
        slug="2026-01-report",
        excerpt="1월 프로젝트 진행 현황 요약",
        body="# 2026년 1월 보고서\n\n## 주요 성과\n- WikiBoard v0 프로토타입 완성\n- 인증 시스템 구현\n- Strapi CMS 연동",
        status="draft",
    )
