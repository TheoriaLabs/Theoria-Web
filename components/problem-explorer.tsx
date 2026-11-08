"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { areaLabels, defaultQuery, kindLabels, parseQuery, problemAreas, queryParams, reviewLabel, reviewLabels, sortLabels, type ProblemQuery, type ProblemResult } from "@/lib/open-problems";
import { MultiSelectFilter } from "@/components/multi-select-filter";
import { ProblemMath } from "@/components/problem-math";
import { areaColor } from "@/lib/problem-graph";
import { ProblemGraph } from "@/components/problem-graph";

export function ProblemExplorer({ initialQuery, initialResult, initialError }: { initialQuery: ProblemQuery; initialResult?: ProblemResult; initialError?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState(initialResult);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const [retry, setRetry] = useState(0);
  const first = useRef(true);
  useEffect(() => {
    const onBack = () => { try { setQuery(parseQuery(new URLSearchParams(window.location.search))); } catch { setQuery(defaultQuery); } };
    window.addEventListener("popstate", onBack);
    return () => window.removeEventListener("popstate", onBack);
  }, []);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const params = queryParams(query).toString();
      window.history.replaceState(null, "", `/open-problems${params ? `?${params}` : ""}`);
      setLoading(true); setError(undefined);
      try {
        const response = await fetch(`/api/open-problems?${params}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load the catalog.");
        if (!controller.signal.aborted) setResult(data);
      } catch (error) {
        if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Could not load the catalog.");
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, retry]);
  const change = (patch: Partial<ProblemQuery>) => { setLoading(true); setQuery(value => ({ ...value, ...patch, page: 1 })); };
  const areaCounts = new Map(result?.areas.map(area => [area.value, area.count]) ?? []);
  const pages = result ? Math.ceil(result.total / result.page_size) : 0;
  return (
    <>
      <div className="problem-domain-tabs" role="tablist" aria-label="Problem domains">
        {["Theoretical Physics", "Foundations of AI/ML", "Quantitative Finance"].map(domain => {
          const active = domain === "Theoretical Physics";
          return <button key={domain} type="button" role="tab" id={active ? "problem-domain-physics" : undefined}
            aria-selected={active} aria-controls={active ? "problem-domain-panel" : undefined} disabled={!active} tabIndex={active ? 0 : -1}
            onKeyDown={event => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) event.preventDefault(); }}>
            <span>{domain}</span>{!active && <> <span className="problem-domain-soon">Coming soon</span></>}
          </button>;
        })}
      </div>
      <div id="problem-domain-panel" role="tabpanel" aria-labelledby="problem-domain-physics">
      <header className="problems-intro">
        <div><p className="problem-kicker">THEORIA / RESEARCH CATALOG</p><h1>Open problems<br /><span>in theoretical physics.</span></h1>
          <p className="problems-lead">Find your next research direction. Explore conjectures and open questions through their models, mathematical targets and connections.</p>
          <div className="problem-scope-tags"><span>Theory & computation</span><span>No new experimental data required</span></div></div>
        <div className="problems-intro-stat"><strong>{result?.total_all ?? "—"}</strong><span>open problems</span><p className="problem-explore-commands"><Link href="/docs/commands#next-steps">Explore with /next-steps ↗</Link> or <Link href="/docs/commands#run">/run</Link> slash commands</p></div>
      </header>
      <div className="problem-provenance"><span className="problem-status-dot" /><p><strong>A source-linked collection of theoretical open problems.</strong> These preselected questions can, in principle, be resolved through mathematical proof, analytical reasoning or numerical computation, without requiring experimental verification. Includes expert-list and literature-based formulations alongside filtered PubPhys imports. Review levels describe the source-checking process; known review holds are excluded. <Link href="/open-problems/sources">Sources & methodology ↗</Link></p></div>
      {result?.source === "seed" && <p className="problem-source-note">Seed catalog · Browse the bundled collection. Search matches words; Supabase mode uses ranked full-text search.</p>}
      <section className="problem-browser" aria-label="Browse open problems">
        <div className="problem-toolbar">
          <div className="problem-search"><label htmlFor="problem-search">Search the collection</label><div><span aria-hidden="true">⌕</span>
            <input id="problem-search" type="search" placeholder="Search Yang-Mills, quantum chaos, Ising model" value={query.q} maxLength={200} onChange={event => change({ q: event.target.value })} /></div></div>
          <div className="problem-view-switch" role="group" aria-label="Catalog view">
            <button type="button" aria-pressed={query.view === "list"} onClick={() => change({ view: "list" })}>List</button>
            <button type="button" aria-pressed={query.view === "graph"} onClick={() => change({ view: "graph" })}>2D graph</button>
          </div>
        </div>
        <div className="problem-quick-filters" aria-label="Featured subjects"><span>START EXPLORING</span><button type="button" aria-pressed={query.area.length === 1 && query.area.includes("quantum_chaos") && !query.q} onClick={() => change({ area: ["quantum_chaos"], q: "", kind: [] })}>Quantum chaos ↗</button><button type="button" onClick={() => change({ area: [], q: "Riemann", kind: [] })}>Riemann zeros ↗</button><button type="button" onClick={() => change({ area: [], q: "entanglement", kind: [] })}>Entanglement ↗</button></div>
        <div className="problem-filters">
          <MultiSelectFilter label="Subject" placeholder="All subjects" values={query.area} options={Object.entries(areaLabels).map(([value, label]) => ({ value, label, count: areaCounts.get(value) }))} onChange={area => change({ area })} />
          <MultiSelectFilter label="Type" accessibleLabel="Problem type" placeholder="All types" values={query.kind} options={Object.entries(kindLabels).map(([value, label]) => ({ value, label }))} onChange={kind => change({ kind })} />
          <MultiSelectFilter label="Review" accessibleLabel="Review level" placeholder="All entries" values={query.review} options={Object.entries(reviewLabels).map(([value, label]) => ({ value, label }))} onChange={review => change({ review })} />
          <label>Sort<select aria-label="Sort problems" value={query.sort} onChange={event => change({ sort: event.target.value as ProblemQuery["sort"] })}>{Object.entries(sortLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <button type="button" className="problem-clear" disabled={!query.q && !query.area.length && !query.kind.length && !query.review.length && query.sort === "relevance"} onClick={() => setQuery({ ...defaultQuery, view: query.view })}>Reset filters</button>
        </div>
        <p className="problem-filter-hint">Choose multiple options. Results match any selected value within each filter.</p>
        <div className="problem-results" aria-busy={loading}>
          <p className="problem-result-count" role="status">{loading ? "Searching…" : result ? `${result.total} ${result.total === 1 ? "problem" : "problems"}${query.q ? ` matching “${query.q}”` : ""}` : "Catalog unavailable"}</p>
          {error ? <div className="problem-empty" role="alert"><h2>Unable to load the catalog</h2><p>{error}</p><button type="button" onClick={() => setRetry(value => value + 1)}>Try again</button></div>
            : !result ? null : result.items.length === 0 ? <div className="problem-empty"><h2>No problems found</h2><p>Try a broader term or reset the filters.</p><button type="button" onClick={() => setQuery({ ...defaultQuery, view: query.view })}>Show all problems</button></div>
              : query.view === "graph" ? <>
                {result.total > result.items.length && <p className="problem-source-note">Showing the first {result.items.length} of {result.total} matching problems. Narrow the filters to explore a smaller graph.</p>}
                <ProblemGraph key={result.items.map(problem => problem.id).join("|")} problems={result.items} layout={query.layout} onLayoutChange={layout => setQuery(value => ({ ...value, layout }))} />
              </> : <>
                <div className="problem-grid">{result.items.map(problem => <article className="problem-card" key={problem.id}>
                  <div className="problem-card-meta"><span><i style={{ background: areaColor(problem.primary_area) }} />{problemAreas(problem).map(area => areaLabels[area]).join(" · ")}</span><span>{kindLabels[problem.kind]}</span></div>
                  <h2><Link href={`/open-problems/${problem.id}`}><ProblemMath text={problem.title} /></Link></h2>
                  <p className="problem-card-motivation"><ProblemMath text={problem.physics_motivation} /></p>
                  <p className="problem-review-label">{reviewLabel(problem)}</p>
                  <div className="problem-card-tags">{problem.tags.slice(0, 3).map(tag => <button type="button" key={tag} onClick={() => change({ q: tag.replaceAll("_", " ") })}>{tag.replaceAll("_", " ")}</button>)}</div>
                  <div className="problem-card-bottom"><span>{problem.sources.length} sources · {problem.formulation === "specified_model" ? "Specified model" : "Framework needs definition"}</span><Link href={`/open-problems/${problem.id}`} aria-label={`Read ${problem.title}`}>Read <span aria-hidden="true">↗</span></Link></div>
                </article>)}</div>
                {pages > 1 && <nav className="problem-pagination" aria-label="Problem pages">
                  <button type="button" disabled={loading || result.page <= 1} onClick={() => setQuery(value => ({ ...value, page: value.page - 1 }))}>← Previous</button>
                  <span>Page {result.page} of {pages}</span>
                  <button type="button" disabled={loading || result.page >= pages} onClick={() => setQuery(value => ({ ...value, page: value.page + 1 }))}>Next →</button>
                </nav>}
              </>}
        </div>
      </section>
      <footer className="problem-catalog-footer"><p>Source imports: <a href="https://pubphys.com/docs/seed">PubPhys AI-assisted seed</a> · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Scope-filtered and cross-linked by Theoria; not independently reviewed.</p><Link href="/docs">Using Theoria ↗</Link></footer>
      </div>
    </>
  );
}
