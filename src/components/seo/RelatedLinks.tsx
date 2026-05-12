import Link from "next/link";

interface RelatedLink {
  title: string;
  href: string;
  description?: string;
}

export default function RelatedLinks({
  title,
  links,
}: {
  title: string;
  links: RelatedLink[];
}) {
  if (links.length === 0) return null;

  return (
    <section className="mt-14 border-t border-slate-200 pt-10">
      <h2 className="text-lg font-bold text-slate-900 mb-5">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group block p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              {link.title}
            </h3>
            {link.description && (
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{link.description}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
