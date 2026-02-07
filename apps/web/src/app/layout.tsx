import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WikiBoard - 사전형 위키보드",
  description:
    "용어, 가이드, 자료를 등록하고 검색하는 사전형 위키보드 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {/* 공통 헤더 */}
        <header className="border-b border-gray-200 bg-white">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <a href="/" className="text-xl font-bold text-brand-700">
              WikiBoard
            </a>
            <div className="flex items-center gap-4">
              <a
                href="/terms"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                용어 목록
              </a>
              <a
                href="/search"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                검색
              </a>
              <a
                href="/admin"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                관리
              </a>
            </div>
          </nav>
        </header>

        {/* 메인 콘텐츠 */}
        <main>{children}</main>

        {/* 공통 푸터 */}
        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} WikiBoard. 모든 권리 보유.
          </div>
        </footer>
      </body>
    </html>
  );
}
