// XP/레벨 관리 페이지

import type { Metadata } from "next";
import { LevelsManager } from "@/components/admin/levels-manager";

export const metadata: Metadata = {
  title: "레벨/XP 관리 - WikiBoard",
  description: "WikiBoard XP/레벨 관리",
};

export default function AdminLevelsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">레벨/XP 관리</h1>
      <LevelsManager />
    </div>
  );
}
