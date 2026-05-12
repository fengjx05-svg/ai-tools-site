import { Metadata } from "next";
import Container from "@/components/layout/Container";
import ArticleCard from "@/components/content/ArticleCard";
import AdSlot from "@/components/ads/AdSlot";
import { getAllTutorials } from "@/lib/content";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "AI 编程教程 - Claude Code、Codex、Agent 入门指南",
  description:
    "从零开始学 AI 编程。Claude Code 技巧、Codex 教程、Agent 入门指南，面向 AI 初学者的实战教程。",
};

export default function TutorialsPage() {
  const tutorials = getAllTutorials();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "/" },
          { name: "教程", url: "/tutorials" },
        ]}
      />
      <Container>
        <div className="py-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">AI 编程教程</h1>
          <p className="text-slate-500 mb-10">
            从零开始的 AI 编程实战教程，持续更新。
          </p>
          <AdSlot slot="tutorials-top" format="horizontal" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tutorials.map(({ frontmatter }) => (
              <ArticleCard key={frontmatter.slug} tutorial={frontmatter} />
            ))}
          </div>
          <AdSlot slot="tutorials-bottom" format="horizontal" />
        </div>
      </Container>
    </>
  );
}
