import { Link } from "@tanstack/react-router";

interface BreadcrumbItem {
 label: string;
 href?: string;
}

interface BreadcrumbProps {
 items: BreadcrumbItem[];
}

/** Breadcrumb con schema BreadcrumbList JSON-LD per SEO. */
export function Breadcrumb({ items }: BreadcrumbProps) {
 const schemaItems = items.map((item, i) => ({
 "@type": "ListItem" as const,
 position: i + 1,
 name: item.label,
 ...(item.href ? { item: `https://www.masseriadongianvito.it${item.href}` } : {}),
 }));

 return (
 <>
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{
 __html: JSON.stringify({
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 itemListElement: schemaItems,
 }),
 }}
 />
 <nav aria-label="Breadcrumb" className="mx-auto max-w-[1400px] px-5 md:px-10 pt-4 pb-2">
 <ol className="flex flex-wrap items-center gap-1 text-[11px] tracking-[0.18em] uppercase font-eyebrow text-[color:var(--carbone)]/50">
 {items.map((item, i) => (
 <li key={i} className="flex items-center gap-1">
 {i > 0 && <span aria-hidden="true" className="text-[color:var(--oro-antico)]">/</span>}
 {item.href ? (
 <Link to={item.href} className="transition-colors hover:text-[color:var(--terra-cotta)]">
 {item.label}
 </Link>
 ) : (
 <span className="text-[color:var(--carbone)]">{item.label}</span>
 )}
 </li>
 ))}
 </ol>
 </nav>
 </>
 );
}