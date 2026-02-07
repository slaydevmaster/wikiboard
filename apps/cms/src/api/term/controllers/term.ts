// 용어(Term) 컨트롤러
// 기본 CRUD 컨트롤러를 확장하여 커스텀 로직을 추가할 수 있습니다.

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::term.term");
