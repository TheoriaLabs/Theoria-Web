import { docsOrigin, pageHref, pages } from "@/lib/docs";
import { problemIndexSection } from "@/lib/problem-agent-guide";

export const dynamic = "force-static";

/** Index the CLI documentation and the live research-catalogue interface for coding agents. */
export function GET() {
  const body = [
    "# Theoria-CLI",
    "",
    "> A Lean-native research agent for mathematics and theoretical sciences, in the terminal. Lean decides whether a proof is correct.",
    "",
    "Fetch the Markdown page that matches the question; each page links the related ones.",
    "",
    ...[...new Set(pages.map(page => page.group))].flatMap(group => [`## ${group}`, "",
      ...pages.filter(page => page.group === group).map(page => `- [${page.title}](${docsOrigin}${pageHref(page)}.md): ${page.description}`), ""]),
    problemIndexSection,
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, must-revalidate" } });
}
