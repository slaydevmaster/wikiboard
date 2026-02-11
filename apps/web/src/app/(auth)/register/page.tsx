// 회원가입 페이지

import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "회원가입 - WikiBoard",
  description: "WikiBoard 회원가입",
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
        회원가입
      </h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
