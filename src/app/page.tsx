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
      {/* Hero */}
      <section className="py-16 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-5 tracking-tight leading-tight">
          找到最适合你的
          <span className="text-blue-600"> AI 编程工具</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
          精选 2026 年最值得用的 AI 编程工具和实战教程。
          从 Claude Code 到 Codex，从零基础到高效使用，帮你快速上手 AI 编程。
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/tools"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200"
          >
            浏览 AI 工具
          </Link>
          <Link
            href="/tutorials"
            className="border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
          >
            查看教程
          </Link>
        </div>
      </section>

      <AdSlot slot="9176027335" format="horizontal" />

      {/* Tools */}
      <section className="py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">热门 AI 工具</h2>
            <p className="text-sm text-slate-500 mt-1">精选推荐，持续更新</p>
          </div>
          <Link href="/tools" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            查看全部 →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ frontmatter }) => (
            <ToolCard key={frontmatter.slug} tool={frontmatter} />
          ))}
        </div>
      </section>

      {/* Tutorials */}
      <section className="py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">最新教程</h2>
            <p className="text-sm text-slate-500 mt-1">从零开始的实战指南</p>
          </div>
          <Link href="/tutorials" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            查看全部 →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutorials.map(({ frontmatter }) => (
            <ArticleCard key={frontmatter.slug} tutorial={frontmatter} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 text-center my-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900">
        <h2 className="text-2xl font-bold mb-3 text-white">不知道选哪个？</h2>
        <p className="text-slate-300 mb-8 max-w-md mx-auto leading-relaxed">
          看看 Claude Code vs Codex 的详细对比，帮你做出最适合的选择。
        </p>
        <Link
          href="/compare/claude-code-vs-codex"
          className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 hover:shadow-lg"
        >
          查看对比
          <span className="text-lg leading-none">→</span>
        </Link>
      </section>

      <AdSlot slot="9176027335" format="horizontal" />
    </Container>
  );
}
