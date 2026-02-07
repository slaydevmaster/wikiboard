// 글(Article) 라우트
// 기본 REST API 라우트를 생성합니다.
// GET /api/articles, GET /api/articles/:id, POST /api/articles, PUT /api/articles/:id, DELETE /api/articles/:id

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::article.article");
