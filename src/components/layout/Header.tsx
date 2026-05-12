import Link from "next/link";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/tools", label: "AI 工具" },
  { href: "/tutorials", label: "教程" },
  { href: "/about", label: "关于" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200/80 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-slate-900 tracking-tight hover:text-blue-600 transition-colors">
          AI 工具导航
        </Link>
        <nav>
          <ul className="flex gap-1 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
