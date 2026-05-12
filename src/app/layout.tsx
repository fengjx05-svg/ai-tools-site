import type { Metadata, Viewport } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI 工具导航 - 最好用的 AI 编程工具推荐与教程",
    template: "%s | AI 工具导航",
  },
  description:
    "面向 AI 初学者的工具导航与教程站。推荐 2026 年最好用的 AI 编程工具，提供 Claude Code、Codex 等工具的深度评测和使用技巧。",
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "-_HZKOvExC14gUxwATiDE2GGUacI8aFsSv3CaUNoXAE",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-white text-gray-900 antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
