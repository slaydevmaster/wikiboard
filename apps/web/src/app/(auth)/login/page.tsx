// 로그인 페이지

import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "로그인 - WikiBoard",
  description: "WikiBoard 로그인",
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
        로그인
      </h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <Suspense fallback={<div className="text-center text-sm text-gray-400">로딩 중...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
