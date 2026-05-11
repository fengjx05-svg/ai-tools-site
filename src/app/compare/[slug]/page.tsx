import { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import AdSlot from "@/components/ads/AdSlot";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { getCompare, getAllCompares, getAllTools } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const compare = getCompare(slug);
  if (!compare) return {};
  return {
    title: compare.frontmatter.title,
    description: compare.frontmatter.description,
    openGraph: {
      title: compare.frontmatter.title,
      description: compare.frontmatter.description,
    },
  };
}

export async function generateStaticParams() {
  return getAllCompares().map(({ frontmatter }) => ({
    slug: frontmatter.slug,
  }));
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const compare = getCompare(slug);
  if (!compare) notFound();

  const tools = getAllTools();
  const relatedLinks = tools
    .filter(
      (t) =>
        t.frontmatter.slug === compare.frontmatter.tool_a ||
        t.frontmatter.slug === compare.frontmatter.tool_b
    )
    .map((t) => ({
      title: t.frontmatter.title,
      href: `/tools/${t.frontmatter.slug}`,
      description: t.frontmatter.description,
    }));

  const faqMatch = compare.content.match(/## FAQ([\s\S]*?)$/);
  const faqContent = faqMatch?.[1] ?? "";
  const faqQuestions =
    faqContent.length > 0
      ? (faqContent.match(/### (.+?)\n\n(.+?)(?=\n###|\n$)/gs) ?? [])
          .map((block) => {
            const m = block.match(/### (.+?)\n\n(.+)/s);
            return m ? { question: m[1], answer: m[2].trim() } : null;
          })
          .filter(Boolean) as { question: string; answer: string }[]
      : [];

  return (
    <>
      <ArticleJsonLd
        title={compare.frontmatter.title}
        description={compare.frontmatter.description}
        url={`/compare/${slug}`}
        datePublished="2026-05-11"
      />
      {faqQuestions.length > 0 && <FaqJsonLd questions={faqQuestions} />}
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "/" },
          { name: "AI 工具", url: "/tools" },
          { name: compare.frontmatter.title, url: `/compare/${slug}` },
        ]}
      />
      <Container>
        <article className="py-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{compare.frontmatter.title}</h1>
          <p className="text-gray-500 mb-6">{compare.frontmatter.description}</p>

          <AdSlot slot="content-top" />

          <div className="prose prose-gray max-w-none mt-8">
            {compare.content
              .replace(/---[\s\S]*?---/, "")
              .split("\n")
              .map((line, i) => {
                if (line.startsWith("## ")) {
                  return <h2 key={i} className="text-xl font-bold mt-8 mb-4">{line.replace("## ", "")}</h2>;
                }
                if (line.startsWith("### ")) {
                  return <h3 key={i} className="text-lg font-semibold mt-6 mb-3">{line.replace("### ", "")}</h3>;
                }
                if (line.startsWith("```")) return null;
                if (line.startsWith("|")) {
                  return <p key={i} className="font-mono text-sm my-1 whitespace-pre-wrap">{line}</p>;
                }
                if (line.trim() === "") return <div key={i} className="h-3" />;
                return <p key={i} className="my-2 leading-relaxed">{line}</p>;
              })}
          </div>

          <AdSlot slot="content-bottom" />

          <RelatedLinks title="对比中的工具" links={relatedLinks} />
        </article>
      </Container>
    </>
  );
}
