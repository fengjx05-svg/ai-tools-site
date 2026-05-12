import Link from "next/link";
import type { TutorialFrontmatter } from "@/lib/types";

const difficultyLabel: Record<string, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高级",
};

const difficultyColor: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-rose-100 text-rose-700",
};

export default function ArticleCard({
  tutorial,
}: {
  tutorial: TutorialFrontmatter;
}) {
  return (
    <Link
      href={`/tutorials/${tutorial.slug}`}
      className="group block p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/20 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            difficultyColor[tutorial.difficulty] ?? "bg-slate-100 text-slate-600"
          }`}
        >
          {difficultyLabel[tutorial.difficulty] ?? tutorial.difficulty}
        </span>
        <span className="text-xs text-slate-400">{tutorial.updated}</span>
      </div>
      <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
        {tutorial.title}
      </h3>
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{tutorial.description}</p>
      <div className="flex gap-1 flex-wrap">
        {tutorial.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
