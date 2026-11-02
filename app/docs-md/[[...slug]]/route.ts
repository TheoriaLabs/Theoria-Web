import { docsOrigin, findPage, pageMarkdown, pages } from "@/lib/docs";

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return pages.map(page => ({ slug: page.slug ? [page.slug] : [] })); }

/** `/docs/<page>.md` (rewritten here by next.config.ts): the page as Markdown, for agents and "View as Markdown". */
export async function GET(_request: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const page = findPage((await params).slug?.join("/"));
  if (!page) return new Response("Not found", { status: 404 });
  return new Response(pageMarkdown(page, docsOrigin), { headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=0, must-revalidate" } });
}
