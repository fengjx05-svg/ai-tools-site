import Link from "next/link";
import Container from "@/components/layout/Container";
import ToolCard from "@/components/content/ToolCard";
import ArticleCard from "@/components/content/ArticleCard";
import AdSlot from "@/components/ads/AdSlot";
import { getAllTools, getAllTutorials } from "@/lib/content";

export default function HomePage() {
  const tools = getAllTools().slice(0, 3);
  const tutorials = getAllTutorials().slice(0, 3);

  return (
    <Container>
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          找到最适合你的 AI 编程工具
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
          精选 2026 年最值得用的 AI 编程工具和实战教程。
          从 Claude Code 到 Codex，从零基础到高效使用，帮你快速上手 AI 编程。
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/tools"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            浏览 AI 工具
          </Link>
          <Link
            href="/tutorials"
            className="border border-slate-300 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            查看教程
          </Link>
        </div>
      </section>

      <AdSlot slot="home-top" format="horizontal" />

      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🔥 热门 AI 工具</h2>
          <Link href="/tools" className="text-blue-600 hover:underline text-sm">
            查看全部 →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ frontmatter }) => (
            <ToolCard key={frontmatter.slug} tool={frontmatter} />
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">📝 最新教程</h2>
          <Link href="/tutorials" className="text-blue-600 hover:underline text-sm">
            查看全部 →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutorials.map(({ frontmatter }) => (
            <ArticleCard key={frontmatter.slug} tutorial={frontmatter} />
          ))}
        </div>
      </section>

      <section className="py-12 text-center bg-slate-800 rounded-2xl my-8">
        <h2 className="text-2xl font-bold mb-3 text-white">不知道选哪个？</h2>
        <p className="text-slate-300 mb-6">
          看看 Claude Code vs Codex 的详细对比，帮你做出最适合的选择。
        </p>
        <Link
          href="/compare/claude-code-vs-codex"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          查看对比 →
        </Link>
      </section>

      <AdSlot slot="home-bottom" format="horizontal" />
    </Container>
  );
}
