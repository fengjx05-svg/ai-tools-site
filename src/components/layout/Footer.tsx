import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500">
        <div className="flex flex-wrap gap-6 mb-4">
          <Link href="/about" className="hover:text-blue-600">
            关于
          </Link>
          <Link href="/contact" className="hover:text-blue-600">
            联系
          </Link>
          <Link href="/sitemap.xml" className="hover:text-blue-600">
            Sitemap
          </Link>
        </div>
        <p>© {new Date().getFullYear()} AI 工具导航 - 为 AI 初学者推荐最好用的工具和教程</p>
      </div>
    </footer>
  );
}
