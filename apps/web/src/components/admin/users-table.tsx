// 사용자 관리 테이블 (클라이언트 컴포넌트)
// 검색, 역할/상태 변경, 페이지네이션

"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  xp: number;
  level: number;
  authMode: string;
  createdAt: string;
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function UsersTable() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "20",
    });
    if (search) params.set("search", search);

    const res = await fetch(`/api/admin/users?${params}`);
    if (res.ok) {
      setData(await res.json());
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 역할 변경
  async function handleRoleChange(userId: string, newRole: string) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      toast.success("역할이 변경되었습니다.");
      fetchUsers();
    } else {
      toast.error("역할 변경에 실패했습니다.");
    }
  }

  // 상태 변경
  async function handleStatusChange(userId: string, newStatus: string) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      toast.success(
        newStatus === "active" ? "사용자가 활성화되었습니다." : "사용자가 정지되었습니다."
      );
      fetchUsers();
    } else {
      toast.error("상태 변경에 실패했습니다.");
    }
  }

  // 검색 핸들러 (Enter 키)
  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      setPage(1);
      fetchUsers();
    }
  }

  return (
    <div>
      {/* 검색 바 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="이름 또는 이메일 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                이름
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                이메일
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                역할
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                상태
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                레벨
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                XP
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                가입일
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              // 스켈레톤 로딩 (5행)
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="h-4 w-24 rounded bg-gray-200"></div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="h-4 w-40 rounded bg-gray-200"></div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="h-6 w-16 rounded bg-gray-200"></div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="h-6 w-16 rounded bg-gray-200"></div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="h-4 w-12 rounded bg-gray-200"></div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="h-4 w-16 rounded bg-gray-200"></div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="h-4 w-20 rounded bg-gray-200"></div>
                  </td>
                </tr>
              ))
            ) : data?.users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                  사용자가 없습니다.
                </td>
              </tr>
            ) : (
              data?.users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="rounded border border-gray-300 px-2 py-1 text-xs"
                    >
                      <option value="admin">관리자</option>
                      <option value="member">일반</option>
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleStatusChange(user.id, e.target.value)
                      }
                      className={`rounded border px-2 py-1 text-xs ${
                        user.status === "active"
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-red-300 bg-red-50 text-red-700"
                      }`}
                    >
                      <option value="active">활성</option>
                      <option value="suspended">정지</option>
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    Lv.{user.level}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {user.xp.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {data && data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            전체 {data.total}명 중 {(data.page - 1) * data.limit + 1}~
            {Math.min(data.page * data.limit, data.total)}명
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
            >
              이전
            </button>
            <span className="px-2 py-1">
              {data.page} / {data.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
