// 인증 페이지 공통 레이아웃 (로그인, 회원가입)
// 중앙 정렬 카드 형태

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
