import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { sourceDirectory } from "@/lib/problem-sources";
import "../problems.css";

export const metadata: Metadata = { title: "Open-problem sources · Theoria Labs", description: "Expert problem lists, original papers and source catalogs used by Theoria's open-problem collection.", alternates: { canonical: "/open-problems/sources" } };
export default function ProblemSourcesPage() {
  return <div className="problems-body"><a className="skip-link" href="#sources-main">Skip to content</a><SiteHeader />
    <main className="problem-detail" id="sources-main"><Link className="problem-back" href="/open-problems">← All open problems</Link>
      <header><p className="problem-kicker">THEORIA / CATALOG SOURCES</p><h1>Expert questions.<br />Independent sources.</h1><p className="problem-detail-motivation">The collection combines original papers, named-author problem lists and structured source imports. References attach to one canonical question wherever the scope matches.</p></header>
      {sourceDirectory.map(source => <section key={source.name}><p className="problem-kicker">{source.status}</p><h2><a href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a></h2><p>{source.description}</p><p className="problem-small">{source.use}</p></section>)}
      <section className="problem-proof-target"><h2>How to read the labels</h2><p>“Editorially scoped” means the statement and assumptions were formulated for this catalog using cited sources. “Source imported” preserves a screened source record. Neither label means expert-verified open status. A reference check records what was read, not an audit of all subsequent literature.</p><p className="problem-small">Source publications keep their own licenses. PubPhys source text is attributed under CC BY 4.0; independently sourced entries are editorial formulations with links, not bulk copies of third-party text.</p></section>
    </main></div>;
}
