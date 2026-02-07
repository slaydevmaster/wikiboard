// 자료(Download) 라우트
// 기본 REST API 라우트를 생성합니다.
// GET /api/downloads, GET /api/downloads/:id, POST /api/downloads, PUT /api/downloads/:id, DELETE /api/downloads/:id

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::download.download");
