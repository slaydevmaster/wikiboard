// 태그(Tag) 라우트
// 기본 REST API 라우트를 생성합니다.
// GET /api/tags, GET /api/tags/:id, POST /api/tags, PUT /api/tags/:id, DELETE /api/tags/:id

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::tag.tag");
