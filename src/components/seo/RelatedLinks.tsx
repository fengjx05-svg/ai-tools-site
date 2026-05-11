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
    <section className="mt-12 border-t pt-8">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <h3 className="font-medium text-blue-600">{link.title}</h3>
            {link.description && (
              <p className="text-sm text-gray-500 mt-1">{link.description}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
