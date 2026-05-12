import Link from "next/link";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/tools", label: "AI 工具" },
  { href: "/tutorials", label: "教程" },
  { href: "/about", label: "关于" },
];

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          AI 工具导航
        </Link>
        <nav>
          <ul className="flex gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-slate-600 hover:text-blue-600 transition-colors"
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
