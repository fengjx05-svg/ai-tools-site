import { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import AdSlot from "@/components/ads/AdSlot";
import RelatedLinks from "@/components/seo/RelatedLinks";
import MDXContent from "@/components/content/MDXContent";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { getTool, getAllTools } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: `${tool.frontmatter.title} 评测 - 2026 最全使用指南`,
    description: tool.frontmatter.description,
    openGraph: {
      title: `${tool.frontmatter.title} 评测`,
      description: tool.frontmatter.description,
    },
  };
}

export async function generateStaticParams() {
  return getAllTools().map(({ frontmatter }) => ({
    slug: frontmatter.slug,
  }));
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const allTools = getAllTools();
  const relatedTools = allTools
    .filter((t) => t.frontmatter.slug !== slug)
    .slice(0, 3);

  // Extract FAQ sections from content
  const faqMatch = tool.content.match(/## FAQ([\s\S]*?)$/);
  const faqContent = faqMatch?.[1] ?? "";
  const faqMatches = faqContent.match(/### (.+?)\n\n(.+?)(?=\n###|\n$)/gs);
  const faqQuestions =
    faqMatches?.map((block: string) => {
      const [, q, a] = block.match(/### (.+?)\n\n(.+)/s) ?? [];
      if (!q || !a) return null;
      return { question: q, answer: a.trim() };
    }).filter((x): x is { question: string; answer: string } => x !== null) ?? [];

  return (
    <>
      <ArticleJsonLd
        title={`${tool.frontmatter.title} 评测`}
        description={tool.frontmatter.description}
        url={`/tools/${slug}`}
        datePublished={tool.frontmatter.updated}
      />
      {faqQuestions.length > 0 && <FaqJsonLd questions={faqQuestions} />}
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "/" },
          { name: "AI 工具", url: "/tools" },
          { name: tool.frontmatter.title, url: `/tools/${slug}` },
        ]}
      />
      <Container>
        <article className="py-8 max-w-3xl mx-auto">
          <div className="mb-2 text-sm text-slate-500">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
              {tool.frontmatter.category}
            </span>
            <span className="ml-2">
              评分：{"★".repeat(Math.floor(tool.frontmatter.rating))}
              {"☆".repeat(5 - Math.floor(tool.frontmatter.rating))}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{tool.frontmatter.title} 评测</h1>
          <p className="text-slate-600 mb-4">{tool.frontmatter.description}</p>
          <div className="flex gap-4 mb-6 text-sm">
            <span>💰 {tool.frontmatter.pricing}</span>
            <a
              href={tool.frontmatter.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              官网 →
            </a>
          </div>

          <AdSlot slot="content-top" />

          <MDXContent source={tool.content} />

          <AdSlot slot="content-bottom" />

          <RelatedLinks
            title="更多 AI 工具推荐"
            links={relatedTools.map((t) => ({
              title: t.frontmatter.title,
              href: `/tools/${t.frontmatter.slug}`,
              description: t.frontmatter.description,
            }))}
          />
        </article>
      </Container>
    </>
  );
}
