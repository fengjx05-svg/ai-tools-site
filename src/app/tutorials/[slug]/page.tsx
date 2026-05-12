import { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import AdSlot from "@/components/ads/AdSlot";
import RelatedLinks from "@/components/seo/RelatedLinks";
import MDXContent from "@/components/content/MDXContent";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { getTutorial, getAllTutorials } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = getTutorial(slug);
  if (!tutorial) return {};
  return {
    title: tutorial.frontmatter.title,
    description: tutorial.frontmatter.description,
    openGraph: {
      title: tutorial.frontmatter.title,
      description: tutorial.frontmatter.description,
    },
  };
}

export async function generateStaticParams() {
  return getAllTutorials().map(({ frontmatter }) => ({
    slug: frontmatter.slug,
  }));
}

const difficultyLabel: Record<string, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高级",
};

export default async function TutorialPage({ params }: Props) {
  const { slug } = await params;
  const tutorial = getTutorial(slug);
  if (!tutorial) notFound();

  const allTutorials = getAllTutorials();
  const related = allTutorials
    .filter((t) => t.frontmatter.slug !== slug)
    .slice(0, 3);

  // Extract FAQ sections from content
  const faqMatch = tutorial.content.match(/## FAQ([\s\S]*?)$/);
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
        title={tutorial.frontmatter.title}
        description={tutorial.frontmatter.description}
        url={`/tutorials/${slug}`}
        datePublished={tutorial.frontmatter.updated}
      />
      {faqQuestions.length > 0 && <FaqJsonLd questions={faqQuestions} />}
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "/" },
          { name: "教程", url: "/tutorials" },
          { name: tutorial.frontmatter.title, url: `/tutorials/${slug}` },
        ]}
      />
      <Container>
        <article className="py-8 max-w-3xl mx-auto">
          <div className="mb-2 text-sm text-slate-500">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
              {difficultyLabel[tutorial.frontmatter.difficulty]}
            </span>
            <span className="ml-2">{tutorial.frontmatter.updated}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{tutorial.frontmatter.title}</h1>
          <p className="text-slate-600 mb-4">{tutorial.frontmatter.description}</p>
          <div className="flex gap-2 mb-6">
            {tutorial.frontmatter.tags.map((tag) => (
              <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>

          <AdSlot slot="content-top" />

          <MDXContent source={tutorial.content} />

          <AdSlot slot="content-bottom" />

          <RelatedLinks
            title="相关教程"
            links={related.map((t) => ({
              title: t.frontmatter.title,
              href: `/tutorials/${t.frontmatter.slug}`,
              description: t.frontmatter.description,
            }))}
          />
        </article>
      </Container>
    </>
  );
}
