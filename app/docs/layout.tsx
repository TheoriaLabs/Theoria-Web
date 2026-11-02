import { DocsNav, DocsTabs, type NavGroup } from "@/components/docs-client";
import { SiteHeader } from "@/components/site-header";
import { pageHref, pages } from "@/lib/docs";

const tabs = [
  { href: "/docs", title: "Overview", match: ["/docs", "/docs/quickstart"] },
  { href: "/docs/commands", title: "Slash commands", match: ["/docs/commands"] },
  { href: "/docs/autoresearch", title: "Autoresearch", match: ["/docs/autoresearch"] },
  { href: "/docs/lean-environments", title: "Lean environments", match: ["/docs/lean-environments"] },
  { href: "/docs/configuration", title: "Configuration", match: ["/docs/configuration"] },
  { href: "/docs/changelog", title: "Changelog", match: ["/docs/changelog"] },
];

const groups: NavGroup[] = [...new Set(pages.map(page => page.group))].map(title => ({
  title, links: pages.filter(page => page.group === title).map(page => ({ href: pageHref(page), title: page.title })),
}));

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="docs-body">
      <a className="skip-link" href="#docs-main">Skip to content</a>
      <SiteHeader />
      <DocsTabs tabs={tabs} />
      <div className="docs">
        <DocsNav groups={groups} />
        {children}
      </div>
    </div>
  );
}
