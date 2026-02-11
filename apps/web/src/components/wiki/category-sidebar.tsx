/**
 * 카테고리 사이드바
 * - 서버 컴포넌트: Strapi에서 카테고리 목록을 가져옴
 * - 클라이언트 컴포넌트: URL에서 활성 카테고리 감지
 */

import { getCategories } from "@/lib/strapi";
import { CategorySidebarNav } from "./category-sidebar-nav";

interface Category {
  name: string;
  slug: string;
  description: string | null;
}

export async function CategorySidebar() {
  let categories: { id: number; name: string; slug: string }[] = [];

  try {
    const response = await getCategories();
    categories = (response.data || []).map(
      (cat: { id: number; attributes: Category }) => ({
        id: cat.id,
        name: cat.attributes.name,
        slug: cat.attributes.slug,
      })
    );
  } catch (error) {
    console.error("카테고리 조회 실패:", error);
  }

  return <CategorySidebarNav categories={categories} />;
}
