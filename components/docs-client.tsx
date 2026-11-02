"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (!copied) return; const timer = setTimeout(() => setCopied(false), 1800); return () => clearTimeout(timer); }, [copied]);
  return <button type="button" onClick={() => navigator.clipboard.writeText(text).then(() => setCopied(true), () => {})} aria-label="Copy">{copied ? "Copied" : "Copy"}</button>;
}

export interface NavGroup { title: string; links: { href: string; title: string }[] }

/** The left column on wide screens; a page picker on narrow ones. */
export function DocsNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const current = pathname.replace(/\/$/, "") || "/docs";
  return (
    <>
      <nav className="docs-sidebar" aria-label="Documentation pages">
        {groups.map(group => (
          <div className="docs-sidebar-group" key={group.title}>
            <h2>{group.title}</h2>
            <ul>{group.links.map(link => <li key={link.href}><Link href={link.href} aria-current={current === link.href ? "page" : undefined}>{link.title}</Link></li>)}</ul>
          </div>
        ))}
      </nav>
      <div className="docs-mobile-nav">
        <label className="mono" htmlFor="docs-page-picker" style={{ display: "block", marginBottom: 6, color: "var(--muted)" }}>DOCUMENTATION</label>
        <select id="docs-page-picker" value={current} onChange={event => router.push(event.target.value)}>
          {groups.map(group => <optgroup key={group.title} label={group.title}>{group.links.map(link => <option key={link.href} value={link.href}>{link.title}</option>)}</optgroup>)}
        </select>
      </div>
    </>
  );
}

/** "On this page": the page's sections, with the one being read highlighted. */
export function DocsToc({ items }: { items: { id: string; text: string; depth: 2 | 3 }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const targets = items.map(item => document.getElementById(item.id)).filter((element): element is HTMLElement => !!element);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "0px 0px -70% 0px" });
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);
  if (items.length < 2) return <aside className="docs-toc" aria-hidden="true" />;
  return (
    <aside className="docs-toc" aria-label="On this page">
      <h2>On this page</h2>
      <ul>{items.map(item => <li key={item.id} className={`depth-${item.depth}`}><a href={`#${item.id}`} className={active === item.id ? "active" : undefined}>{item.text}</a></li>)}</ul>
    </aside>
  );
}

/** A second bar under the site header, as in the OpenAI and OpenAlex docs: one tab per docs section. */
export function DocsTabs({ tabs }: { tabs: { href: string; title: string; match: string[] }[] }) {
  const pathname = usePathname().replace(/\/$/, "") || "/docs";
  return (
    <nav className="docs-tabs" aria-label="Documentation sections">
      <div className="docs-tabs-inner">
        {tabs.map(tab => <Link key={tab.href} href={tab.href} aria-current={tab.match.includes(pathname) ? "page" : undefined}>{tab.title}</Link>)}
      </div>
    </nav>
  );
}

/**
 * A Mermaid diagram, rendered in the browser. Mermaid is loaded only on pages that have a diagram, themed with the
 * site's colours; until it renders (or if it cannot), the diagram source is shown as text.
 */
export function MermaidDiagram({ code, caption }: { code: string; caption: string }) {
  const [svg, setSvg] = useState<string>();
  const [failed, setFailed] = useState(false);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  useEffect(() => {
    let cancelled = false;
    // Mermaid sizes each box from the text it measures. Measure with the page's own font, after it has loaded,
    // or the labels overflow their boxes once DM Sans replaces the fallback.
    Promise.all([import("mermaid"), document.fonts?.ready]).then(async ([{ default: mermaid }]) => {
      mermaid.initialize({
        startOnLoad: false, securityLevel: "strict", theme: "base", fontFamily: "DM Sans, Arial, sans-serif",
        themeVariables: { primaryColor: "#f3f6ec", primaryBorderColor: "#9fbd6b", primaryTextColor: "#20251d", lineColor: "#8a9180",
          secondaryColor: "#ffffff", tertiaryColor: "#fafbf8", clusterBkg: "#fafbf8", clusterBorder: "#dfe3d8", fontSize: "13px" },
        // SVG text labels: the page's CSS (line height, paragraph styles) cannot change their size after Mermaid
        // measured them, which is what made HTML labels overflow their boxes.
        htmlLabels: false,
        flowchart: { curve: "basis", padding: 14, nodeSpacing: 36, rankSpacing: 44, htmlLabels: false, wrappingWidth: 240 },
      });
      const { svg } = await mermaid.render(`mermaid-${id}`, code);
      if (!cancelled) setSvg(svg);
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [code, id]);
  return (
    <figure className="docs-diagram">
      {svg ? <div className="docs-diagram-svg" dangerouslySetInnerHTML={{ __html: svg }} />
        : <pre className={failed ? "docs-diagram-source" : "docs-diagram-source loading"} aria-busy={!failed}>{code}</pre>}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
