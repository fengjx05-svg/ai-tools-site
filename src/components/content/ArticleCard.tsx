import Link from "next/link";
import type { TutorialFrontmatter } from "@/lib/types";

const difficultyLabel: Record<string, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高级",
};

export default function ArticleCard({
  tutorial,
}: {
  tutorial: TutorialFrontmatter;
}) {
  return (
    <Link
      href={`/tutorials/${tutorial.slug}`}
      className="block p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
          {difficultyLabel[tutorial.difficulty] ?? tutorial.difficulty}
        </span>
        <span className="text-xs text-slate-400">{tutorial.updated}</span>
      </div>
      <h3 className="font-semibold text-lg text-blue-600 mb-2">
        {tutorial.title}
      </h3>
      <p className="text-sm text-slate-600 mb-3">{tutorial.description}</p>
      <div className="flex gap-1">
        {tutorial.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
