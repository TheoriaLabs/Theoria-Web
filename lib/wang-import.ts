import { parseCatalog, parseProblem, problemDomain, type OpenProblem } from "./open-problems.ts";
import { enrichSourceReferences } from "./problem-sources.ts";
import { wangSource, type WangDecision } from "../data/open-problems/wang-2026-curation.ts";

const normalized = (value: string) => value.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const occurrence = (entry: WangDecision): OpenProblem["sources"][number] => ({
  title: `${wangSource.author}: ${entry.source_title}`,
  url: `${wangSource.url}#op2026-problem-${entry.number}`,
  role: "discovery_catalog", locator: `Detailed catalogue, problem ${entry.number}`,
  checked_on: wangSource.checked_on,
  note: `${wangSource.assessment} Source status date: ${wangSource.status_as_of}. ${entry.reason}`,
});

/** Decisions are editorial input, not inferred from title similarity. Fail closed on incomplete or stale mappings. */
export function buildWangCatalog(baseline: OpenProblem[], entries: WangDecision[]) {
  if (entries.length !== 100 || new Set(entries.map(e => e.number)).size !== 100 || entries.some(e => !Number.isInteger(e.number) || e.number < 1 || e.number > 100)) {
    throw new Error("The Wang review must account for each source number 1–100 exactly once.");
  }
  for (const e of entries) {
    if (!e.source_title.trim() || !e.reason.trim()) throw new Error(`Missing review for Wang ${e.number}.`);
    if (e.decision === "include" ? !e.proposal || e.canonical_id : e.proposal !== undefined) throw new Error(`Inconsistent Wang proposal ${e.number}.`);
    if (e.decision === "duplicate" ? !e.canonical_id : e.canonical_id !== undefined) throw new Error(`Inconsistent Wang mapping ${e.number}.`);
    if (!["include", "duplicate", "review_hold"].includes(e.decision)) throw new Error(`Unknown Wang decision ${e.number}.`);
  }
  const records = entries.filter(e => e.decision === "include").map(e => parseProblem({
    ...e.proposal,
    sources: [occurrence(e), ...(e.reference_leads ?? []).map(url => ({
      title: `Source-listed background lead: arXiv:${url.split("/abs/")[1]}`,
      url, role: "background",
      note: `Listed by Wang in item ${e.number}; retained as a bibliography lead. Its metadata, applicability and proof have not been independently verified in this import.`,
    }))],
  }));
  const combined = parseCatalog([...baseline, ...records].map(r => JSON.stringify(r)).join("\n"));
  const ids = new Set(combined.map(r => r.id));
  for (const field of ["title", "statement"] as const) {
    const known = new Map(baseline.map(r => [normalized(r[field]), r.id]));
    for (const r of records) {
      const match = known.get(normalized(r[field]));
      if (match) throw new Error(`Duplicate Wang ${field}: ${r.id} matches ${match}.`);
      known.set(normalized(r[field]), r.id);
    }
  }
  for (const r of records) for (const relation of r.relations) if (!ids.has(relation.id)) throw new Error(`Unknown Wang related record: ${relation.id}`);
  const enrichment: Record<string, OpenProblem["sources"]> = {};
  for (const e of entries.filter(e => e.decision === "duplicate")) {
    if (!ids.has(e.canonical_id!)) throw new Error(`Unknown or withheld Wang mapping: ${e.canonical_id}`);
    (enrichment[e.canonical_id!] ??= []).push(occurrence(e));
  }
  // Validate sources on merged records as well as new records. Existing statements/statuses stay intact.
  enrichSourceReferences(combined, enrichment);
  const report = {
    source: wangSource,
    stats: {
      source_entries: entries.length, include: records.length,
      duplicate: entries.filter(e => e.decision === "duplicate").length,
      review_hold: entries.filter(e => e.decision === "review_hold").length,
      baseline_records: baseline.length, public_records: combined.length,
      physics_records: combined.filter(r => problemDomain(r) === "theoretical_physics").length,
      finance_records: combined.filter(r => problemDomain(r) === "quantitative_finance").length,
      existing_records_enriched: Object.keys(enrichment).filter(id => baseline.some(r => r.id === id)).length,
      within_source_duplicates: entries.filter(e => e.decision === "duplicate" && records.some(r => r.id === e.canonical_id)).length,
    },
    decisions: entries.toSorted((a, b) => a.number - b.number).map(e => ({
      number: e.number, title: e.source_title, url: occurrence(e).url, decision: e.decision,
      canonical_id: e.proposal?.id ?? e.canonical_id ?? null, reason: e.reason,
      evidence_urls: e.evidence_urls ?? [],
    })),
  };
  return { records, enrichment, report };
}
