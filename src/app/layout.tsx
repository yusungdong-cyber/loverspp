import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeExchange — 바이브코딩 거래소",
  description: "바이브코딩으로 만들고, 사고, 의뢰하세요. 홈페이지 제작 요청과 SaaS 거래를 한 곳에서.",
  keywords: ["바이브코딩", "vibe coding", "SaaS 거래소", "홈페이지 제작", "웹사이트 의뢰"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
