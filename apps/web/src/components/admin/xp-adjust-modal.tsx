// XP 조정 모달 (클라이언트 컴포넌트)

"use client";

import { useState } from "react";

interface XpAdjustModalProps {
  userId: string;
  userName: string;
  currentXp: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function XpAdjustModal({
  userId,
  userName,
  currentXp,
  onClose,
  onSuccess,
}: XpAdjustModalProps) {
  const [xpAmount, setXpAmount] = useState(0);
  const [action, setAction] = useState("manual_adjust");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (xpAmount === 0) {
      setError("XP 변경량은 0이 될 수 없습니다.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/xp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, xpAmount, action, description }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "XP 조정에 실패했습니다.");
      return;
    }

    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-bold text-gray-900">XP 조정</h3>

        <p className="mb-4 text-sm text-gray-600">
          대상: <strong>{userName}</strong> (현재 XP: {currentXp.toLocaleString()})
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              변경량
            </label>
            <input
              type="number"
              value={xpAmount}
              onChange={(e) => setXpAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="양수: 추가, 음수: 차감"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              사유
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="manual_adjust">수동 조정</option>
              <option value="bonus">보너스</option>
              <option value="penalty">패널티</option>
              <option value="event">이벤트</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              설명 (선택)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="XP 조정 사유를 입력하세요"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {loading ? "처리 중..." : "적용"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
