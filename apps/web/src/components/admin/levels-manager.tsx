// XP/레벨 관리 컴포넌트 (클라이언트)
// 사용자별 XP/레벨 현황 + XP 조정 기능

"use client";

import { useState, useEffect, useCallback } from "react";
import { XpAdjustModal } from "./xp-adjust-modal";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  xp: number;
  level: number;
}

// 레벨별 필요 XP (level.ts와 동일)
const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5000];

export function LevelsManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalUser, setModalUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users?limit=100");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      {/* 레벨 기준표 */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          레벨 기준표
        </h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {LEVEL_THRESHOLDS.map((_, i) => (
                  <th
                    key={i}
                    className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500"
                  >
                    Lv.{i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {LEVEL_THRESHOLDS.map((xp, i) => (
                  <td
                    key={i}
                    className="px-4 py-2 text-center text-sm text-gray-600"
                  >
                    {xp.toLocaleString()} XP
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 사용자 XP 목록 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          사용자 XP 현황
        </h2>
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
                  레벨
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  XP
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  다음 레벨까지
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  조작
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-gray-400"
                  >
                    불러오는 중...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-gray-400"
                  >
                    사용자가 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const nextThreshold = LEVEL_THRESHOLDS[user.level];
                  const remaining = nextThreshold
                    ? nextThreshold - user.xp
                    : null;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                          Lv.{user.level}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {user.xp.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-400">
                        {remaining !== null
                          ? `${remaining.toLocaleString()} XP`
                          : "최대 레벨"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <button
                          onClick={() => setModalUser(user)}
                          className="rounded border border-brand-300 px-3 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
                        >
                          XP 조정
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* XP 조정 모달 */}
      {modalUser && (
        <XpAdjustModal
          userId={modalUser.id}
          userName={modalUser.name}
          currentXp={modalUser.xp}
          onClose={() => setModalUser(null)}
          onSuccess={() => {
            setModalUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
