// 사용자 관리 페이지

import type { Metadata } from "next";
import { UsersTable } from "@/components/admin/users-table";

export const metadata: Metadata = {
  title: "사용자 관리 - WikiBoard",
  description: "WikiBoard 사용자 관리",
};

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">사용자 관리</h1>
      <UsersTable />
    </div>
  );
}
