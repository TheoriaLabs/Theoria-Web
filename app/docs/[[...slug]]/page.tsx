import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocks } from "@/components/docs-content";
import { DocsToc } from "@/components/docs-client";
import { docsUpdated, findPage, outline, pageHref, pages, relatedPages } from "@/lib/docs";

type Params = { params: Promise<{ slug?: string[] }> };

export const dynamicParams = false;
export function generateStaticParams() { return pages.map(page => ({ slug: page.slug ? [page.slug] : [] })); }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = findPage((await params).slug?.join("/"));
  if (!page) return {};
  const title = page.slug ? `${page.title} · Theoria-CLI docs` : "Theoria-CLI docs";
  return { title, description: page.description, alternates: { canonical: pageHref(page), types: { "text/markdown": `${pageHref(page)}.md` } },
    openGraph: { title, description: page.description, type: "article" } };
}

export default async function DocPage({ params }: Params) {
  const page = findPage((await params).slug?.join("/"));
  if (!page) notFound();
  const index = pages.indexOf(page);
  const previous = pages[index - 1], next = pages[index + 1];
  return (
    <>
      <article id="docs-main" className="docs-article">
        <header>
          <p className="mono" style={{ color: "var(--green-dark)" }}>{page.group.toUpperCase()}</p>
          <h1>{page.title}</h1>
          <p className="docs-lead">{page.description}</p>
        </header>
        <Blocks blocks={page.blocks} />
        {relatedPages(page).length > 0 && (
          <section className="docs-related" aria-labelledby="related">
            <h2 id="related">Related</h2>
            <ul>{relatedPages(page).map(other => <li key={other.slug}><Link href={pageHref(other)}><strong>{other.title}</strong><span>{other.description}</span></Link></li>)}</ul>
          </section>
        )}
        <nav className="docs-pager" aria-label="Previous and next pages">
          {previous && <Link href={pageHref(previous)}><span>Previous</span>{previous.title}</Link>}
          {next && <Link className="next" href={pageHref(next)}><span>Next</span>{next.title}</Link>}
        </nav>
        <div className="docs-meta"><span>Last updated {docsUpdated}</span><a href={`${pageHref(page)}.md`}>View as Markdown</a></div>
      </article>
      <DocsToc items={outline(page)} />
    </>
  );
}
