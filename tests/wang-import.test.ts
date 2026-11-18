import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { readSeedCatalog } from "../lib/problem-seed.ts";
import { problemDomain } from "../lib/open-problems.ts";
import { buildWangCatalog } from "../lib/wang-import.ts";
import { enrichSourceReferences } from "../lib/problem-sources.ts";
import { wangDecisions, wangSource } from "../data/open-problems/wang-2026-curation.ts";

const all = await readSeedCatalog();
const newIds = new Set(wangDecisions.flatMap(e => e.proposal ? [e.proposal.id] : []));
const baseline = all.filter(r => !newIds.has(r.id));
const built = buildWangCatalog(baseline, wangDecisions);

test("all 100 Wang items are accounted for and generated output matches the reviewed scopes", async () => {
  assert.deepEqual(built.report.stats, { source_entries: 100, include: 55, duplicate: 27, review_hold: 18,
    baseline_records: baseline.length, public_records: baseline.length + 55,
    physics_records: baseline.filter(r => problemDomain(r) === "theoretical_physics").length + 55,
    finance_records: baseline.filter(r => problemDomain(r) === "quantitative_finance").length,
    existing_records_enriched: 24, within_source_duplicates: 2 });
  const report = JSON.parse(await readFile(new URL("../data/open-problems/wang-2026-import-report.json", import.meta.url), "utf8"));
  const jsonl = await readFile(new URL("../data/open-problems/wang-2026.preliminary.jsonl", import.meta.url), "utf8");
  assert.deepEqual(report, built.report);
  assert.deepEqual(jsonl.trim().split("\n").map(l => JSON.parse(l)), built.records);
  for (const r of built.records) {
    assert.equal(all.filter(p => p.id === r.id).length, 1);
    assert.equal(r.status, "provisionally_open");
    assert.equal(r.review_level, "preliminary_source_check");
    assert(r.sources.some(s => s.url.startsWith(wangSource.url) && s.locator && s.checked_on));
    assert.equal(r.imported_from, undefined); // The WordPress material is not assigned PubPhys's reuse license.
  }
});

test("semantic mappings preserve canonical identities while distinct targets remain distinct", () => {
  const mapped = (n: number) => built.report.decisions.find(e => e.number === n)!;
  assert.equal(mapped(32).canonical_id, mapped(33).canonical_id);
  assert.equal(mapped(41).canonical_id, mapped(86).canonical_id);
  assert.equal(mapped(57).canonical_id, mapped(90).canonical_id);
  assert.equal(mapped(69).canonical_id, "quantum-sic-all-dimensions");
  assert.equal(mapped(87).canonical_id, "qft-yang-mills-existence-mass-gap");
  assert.equal(mapped(88).decision, "include");
  assert.notEqual(mapped(88).canonical_id, "qcd-wilson-area-law-weak-coupling");
  assert.notEqual(mapped(65).canonical_id, mapped(73).canonical_id);
  assert.notEqual(mapped(63).canonical_id, mapped(64).canonical_id);
  for (const n of [7, 26, 37, 45, 46, 51, 61, 62, 66, 67, 70, 71, 76, 79, 81, 83, 94, 96]) {
    assert.equal(mapped(n).decision, "review_hold");
    assert(!all.some(r => r.sources.some(s => s.url === `${wangSource.url}#op2026-problem-${n}`)));
  }
});

test("source enrichment is idempotent and does not replace existing statements or statuses", () => {
  const enriched = enrichSourceReferences(baseline, Object.fromEntries(Object.entries(built.enrichment).filter(([id]) => baseline.some(r => r.id === id))));
  for (const record of baseline) {
    const updated = enriched.find(r => r.id === record.id)!;
    assert.equal(updated.statement, record.statement);
    assert.equal(updated.status_note, record.status_note);
    assert.equal(updated.review_level, record.review_level);
  }
  assert.deepEqual(enrichSourceReferences(all, built.enrichment), all);
});

test("incomplete reviews, stale aliases, duplicate identities and dangling relations fail closed", () => {
  assert.throws(() => buildWangCatalog(baseline, wangDecisions.slice(1)), /1–100/);
  const stale = structuredClone(wangDecisions);
  stale.find(e => e.decision === "duplicate")!.canonical_id = "missing-canonical-id";
  assert.throws(() => buildWangCatalog(baseline, stale), /Unknown or withheld/);
  const repeated = structuredClone(wangDecisions);
  repeated[0].proposal!.id = baseline[0].id;
  assert.throws(() => buildWangCatalog(baseline, repeated), /Duplicate problem IDs/);
  const dangling = structuredClone(wangDecisions);
  dangling[0].proposal!.relations.push({ id: "missing-relation", type: "related_to", note: "Invalid target" });
  assert.throws(() => buildWangCatalog(baseline, dangling), /Unknown Wang related/);
});
