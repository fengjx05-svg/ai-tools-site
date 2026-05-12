import { Metadata } from "next";
import Container from "@/components/layout/Container";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "关于我们",
  description: "AI 工具导航是一个面向 AI 初学者的工具推荐和教程平台。",
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "首页", url: "/" }, { name: "关于", url: "/about" }]} />
      <Container>
        <div className="py-10 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">关于 AI 工具导航</h1>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>AI 工具导航是一个面向 AI 初学者的工具推荐和教程平台。我们精选 2026 年最值得使用的 AI 编程工具，提供深度评测、使用技巧和入门教程。</p>
            <h2 className="text-xl font-semibold mt-6 mb-3">我们的目标</h2>
            <p>帮助每一位 AI 初学者找到最适合自己的工具，学会高效使用 AI 辅助编程。</p>
            <h2 className="text-xl font-semibold mt-6 mb-3">内容原则</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>所有工具评测基于真实使用经验</li>
              <li>教程内容注重实战，拒绝空泛</li>
              <li>保持更新，信息准确</li>
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}
