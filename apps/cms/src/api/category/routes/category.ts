// 카테고리(Category) 라우트
// 기본 REST API 라우트를 생성합니다.
// GET /api/categories, GET /api/categories/:id, POST /api/categories, PUT /api/categories/:id, DELETE /api/categories/:id

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::category.category");
