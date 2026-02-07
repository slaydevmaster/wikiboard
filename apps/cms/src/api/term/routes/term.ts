// 용어(Term) 라우트
// 기본 REST API 라우트를 생성합니다.
// GET /api/terms, GET /api/terms/:id, POST /api/terms, PUT /api/terms/:id, DELETE /api/terms/:id

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::term.term");
