import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-6 text-sm">
          <Link href="/about" className="text-slate-500 hover:text-blue-600 transition-colors">
            关于
          </Link>
          <Link href="/contact" className="text-slate-500 hover:text-blue-600 transition-colors">
            联系
          </Link>
          <Link href="/sitemap.xml" className="text-slate-500 hover:text-blue-600 transition-colors">
            Sitemap
          </Link>
        </div>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} AI 工具导航 — 为 AI 初学者推荐最好用的工具和教程
        </p>
      </div>
    </footer>
  );
}
