import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { areaLabels, defaultQuery, kindLabels, problemAreas, problemDomain, queryParams, reviewLabel } from "@/lib/open-problems";
import { ProblemMath } from "@/components/problem-math";
import { getProblem } from "@/lib/problem-store";
import "../problems.css";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const result = await getProblem(id);
    return result ? { title: `${result.problem.title} · Theoria open problems`, description: result.problem.physics_motivation, alternates: { canonical: `/open-problems/${id}` } } : { title: "Problem not found" };
  } catch { return { title: "Open problems · Theoria Labs" }; }
}
export default async function ProblemPage({ params }: Props) {
  const { id } = await params;
  const result = await getProblem(id);
  if (!result) notFound();
  const { problem, source } = result;
  const finance = problemDomain(problem) === "quantitative_finance";
  const backParams = queryParams({ ...defaultQuery, domain: problemDomain(problem) }).toString();
  const related = (await Promise.all(problem.relations.map(async relation => {
    const target = await getProblem(relation.id);
    return target ? { ...relation, title: target.problem.title } : undefined;
  }))).filter(item => !!item);
  return <div className="problems-body"><a className="skip-link" href="#problem-main">Skip to content</a><SiteHeader />
    <main className="problem-detail" id="problem-main">
      <Link className="problem-back" href={`/open-problems${backParams ? `?${backParams}` : ""}`}>← All {finance ? "quantitative finance " : ""}open problems</Link>
      <header><p className="problem-kicker">{problemAreas(problem).map(area => areaLabels[area]).join(" · ")} / {kindLabels[problem.kind]}</p><h1><ProblemMath text={problem.title} /></h1>
        <p className="problem-detail-motivation"><ProblemMath text={problem.physics_motivation} /></p>
        <div className="problem-detail-badges"><span>Open</span><span>{reviewLabel(problem)}</span><span>{problem.formulation === "specified_model" ? "Specified model" : "Framework needs definition"}</span><span>Compiled {problem.compiled_on}</span></div>
      </header>
      {source === "seed" && <p className="problem-source-note">Seed catalog · Showing the bundled record.</p>}
      <section aria-labelledby="statement"><h2 id="statement">Problem statement</h2><p className="problem-statement"><ProblemMath text={problem.statement} /></p></section>
      <section aria-labelledby="assumptions"><h2 id="assumptions">Assumptions and scope</h2><ul>{problem.assumptions.map(assumption => <li key={assumption}><ProblemMath text={assumption} /></li>)}</ul></section>
      <section className="problem-proof-target" aria-labelledby="resolution"><h2 id="resolution">What would settle it?</h2><p><ProblemMath text={problem.resolution_target} /></p><p className="problem-small">Selected for a theoretical or computational target. {finance ? "A successful calibration or numerical benchmark alone does not establish the stated mathematical guarantee." : "Numerical evidence alone does not prove an infinite-volume or continuum conjecture."}</p></section>
      <section aria-labelledby="status"><h2 id="status">Status and evidence</h2><p><ProblemMath text={problem.status_note} /></p><p className="problem-small">{problem.review_level === "source_import" ? "Source-imported statement, screened for theory/computation scope. Neither the statement nor its literature status has received an independent specialist review." : "Preliminary source check; not an expert-verified open status or an independent audit of proposed proofs."} The compilation date is not a literature-review cutoff.</p></section>
      {problem.imported_from && <section aria-labelledby="provenance"><h2 id="provenance">Source and attribution</h2><p>Imported from <a href={problem.imported_from.url}>PubPhys, revision {problem.imported_from.revision}</a>, under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. PubPhys identifies its seed as AI-compiled and not individually reviewed. Theoria filters and cross-links the records; source statements and resolution criteria are retained.</p><p className="problem-small">Retrieved {problem.imported_from.retrieved_at} · Record hash: {problem.imported_from.record_hash}</p></section>}
      <section aria-labelledby="sources"><h2 id="sources">Sources and further reading</h2><ol className="problem-sources">{problem.sources.map(reference => <li key={reference.url}><a href={reference.url} target="_blank" rel="noreferrer">{reference.title} ↗</a><span>{reference.role.replaceAll("_", " ")}{reference.checked_on ? ` · source checked ${reference.checked_on}` : ""}</span>{reference.locator && <p className="problem-small">{reference.locator}</p>}{reference.note && <p className="problem-small">{reference.note}</p>}</li>)}</ol></section>
      {related.length > 0 && <section aria-labelledby="related"><h2 id="related">Related problems</h2><ul className="problem-related">{related.map(relation => <li key={relation.id}><Link href={`/open-problems/${relation.id}`}>{relation.title}</Link><p>{relation.note}</p></li>)}</ul></section>}
      {problem.relations.length > related.length && <p className="problem-small">Some related records are withheld for status review and are not listed as open.</p>}
      <footer className="problem-detail-footer"><span>Record: {problem.id}</span><Link href="/docs/commands#next-steps">Investigate with /next-steps ↗</Link></footer>
    </main></div>;
}
