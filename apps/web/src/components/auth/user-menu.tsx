// 유저 메뉴 (헤더 우측)
// 로그인 상태: 이름 + 레벨 + 관리(admin만) + 로그아웃
// 비로그인 상태: 로그인 + 회원가입 버튼

"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          로그인
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          회원가입
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">
        {session.user.name}
        <span className="ml-1 text-xs font-medium text-brand-600">
          Lv.{session.user.level}
        </span>
      </span>
      {session.user.role === "admin" && (
        <Link
          href="/admin"
          className="text-sm font-medium text-brand-600 hover:text-brand-800"
        >
          관리
        </Link>
      )}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm text-gray-400 hover:text-gray-600"
      >
        로그아웃
      </button>
    </div>
  );
}
