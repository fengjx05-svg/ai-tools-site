import Link from "next/link";
import type { ToolFrontmatter } from "@/lib/types";

export default function ToolCard({ tool }: { tool: ToolFrontmatter }) {
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < Math.floor(tool.rating) ? "★" : "☆"
  ).join("");

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group block p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/20 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
          {tool.title}
        </h3>
        <span className="text-amber-500 text-sm whitespace-nowrap ml-2">{stars}</span>
      </div>
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{tool.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900">{tool.pricing}</span>
        <span className="flex gap-1">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
        </span>
      </div>
    </Link>
  );
}
