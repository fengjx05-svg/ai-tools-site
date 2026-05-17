import { Metadata } from "next";
import Container from "@/components/layout/Container";
import ToolCard from "@/components/content/ToolCard";
import AdSlot from "@/components/ads/AdSlot";
import { getAllTools } from "@/lib/content";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "2026 年最好用的 AI 编程工具推荐",
  description:
    "精选 2026 年最值得用的 AI 编程工具：Claude Code、Codex、Cursor 等。包含价格、功能对比、适用人群，帮你找到最适合的 AI 编程助手。",
  openGraph: {
    title: "2026 年最好用的 AI 编程工具推荐",
    description: "精选 2026 年最值得用的 AI 编程工具：Claude Code、Codex、Cursor 等。",
  },
};

export default function ToolsPage() {
  const tools = getAllTools();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "/" },
          { name: "AI 工具", url: "/tools" },
        ]}
      />
      <Container>
        <div className="py-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            2026 年最好用的 AI 编程工具
          </h1>
          <p className="text-slate-500 mb-10">
            精选推荐，持续更新。帮你找到最适合的 AI 编程助手。
          </p>
          <AdSlot slot="9176027335" format="horizontal" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(({ frontmatter }) => (
              <ToolCard key={frontmatter.slug} tool={frontmatter} />
            ))}
          </div>
          <AdSlot slot="9176027335" format="horizontal" />
        </div>
      </Container>
    </>
  );
}
