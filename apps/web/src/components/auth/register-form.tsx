// 회원가입 폼 컴포넌트 (react-hook-form + Zod + 비밀번호 강도 표시)

"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Zod 스키마 정의
const registerSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해주세요."),
    email: z.string().email("올바른 이메일 형식이 아닙니다."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "영문과 숫자를 포함해야 합니다."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// 비밀번호 강도 계산
function getPasswordStrength(password: string): {
  strength: "weak" | "medium" | "strong";
  label: string;
  color: string;
} {
  if (password.length < 8) {
    return { strength: "weak", label: "약함", color: "bg-red-500" };
  }

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLong = password.length >= 12;

  const score = [hasLetter, hasNumber, hasSpecial, isLong].filter(Boolean).length;

  if (score >= 3) {
    return { strength: "strong", label: "강함", color: "bg-green-500" };
  } else if (score >= 2) {
    return { strength: "medium", label: "보통", color: "bg-yellow-500" };
  } else {
    return { strength: "weak", label: "약함", color: "bg-red-500" };
  }
}

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");
  const passwordStrength = password ? getPasswordStrength(password) : null;

  async function onSubmit(data: RegisterFormData) {
    setLoading(true);

    // 회원가입 API 호출
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    if (!res.ok) {
      const resData = await res.json();
      toast.error(resData.error || "회원가입에 실패했습니다.");
      setLoading(false);
      return;
    }

    // 회원가입 성공 후 자동 로그인
    toast.success("회원가입이 완료되었습니다! 환영합니다.");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      // 가입은 성공했지만 자동 로그인 실패 → 로그인 페이지로 안내
      toast.info("로그인 페이지로 이동합니다.");
      router.push("/login");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          이름
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          {...register("name")}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
            errors.name
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-brand-500 focus:ring-brand-500"
          }`}
          placeholder="홍길동"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          이메일
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
            errors.email
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-brand-500 focus:ring-brand-500"
          }`}
          placeholder="example@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
            errors.password
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-brand-500 focus:ring-brand-500"
          }`}
          placeholder="영문+숫자 조합, 8자 이상"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
        {/* 비밀번호 강도 표시 */}
        {passwordStrength && (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full transition-all ${passwordStrength.color}`}
                  style={{
                    width:
                      passwordStrength.strength === "strong"
                        ? "100%"
                        : passwordStrength.strength === "medium"
                        ? "66%"
                        : "33%",
                  }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {passwordStrength.label}
              </span>
            </div>
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          비밀번호 확인
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
            errors.confirmPassword
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-brand-500 focus:ring-brand-500"
          }`}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "가입 중..." : "회원가입"}
      </button>

      <p className="text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-brand-600 hover:text-brand-800">
          로그인
        </Link>
      </p>
    </form>
  );
}
