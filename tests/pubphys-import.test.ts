import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { readEditorialCatalog, readSeedCatalog } from "../lib/problem-seed.ts";
import { defaultQuery, parseProblem, problemDomain, searchSeed } from "../lib/open-problems.ts";
import { screenPubPhys, type PubPhysProblem, type ImportDecision } from "../lib/pubphys-import.ts";

const snapshot = JSON.parse(await readFile(new URL("../data/open-problems/sources/pubphys.snapshot.json", import.meta.url), "utf8")) as { problems: PubPhysProblem[] };
const report = JSON.parse(await readFile(new URL("../data/open-problems/pubphys-import-report.json", import.meta.url), "utf8")) as { stats: { public_records: number }; decisions: ImportDecision[] };
const records = (await readSeedCatalog()).filter(record => problemDomain(record) === "theoretical_physics");

test("every collected source has a decision and published imports have verifiable provenance", () => {
  assert.equal(snapshot.problems.length, report.decisions.length);
  assert.equal(new Set(report.decisions.map(item => item.slug)).size, snapshot.problems.length);
  assert.equal(records.length, report.stats.public_records);
  const decisions = new Map(report.decisions.map(item => [item.slug, item]));
  const source = new Map(snapshot.problems.map(problem => [problem.slug, problem]));
  for (const record of records.filter(record => record.review_level === "source_import")) {
    const slug = record.id.replace(/^pubphys-/, "");
    assert.equal(decisions.get(slug)?.decision, "include");
    assert.equal(record.imported_from?.record_hash, source.get(slug)?.record_hash);
    assert.equal(record.statement, source.get(slug)?.precise);
    assert.equal(record.resolution_target, source.get(slug)?.settled_by);
    assert.equal(record.imported_from?.license, "CC-BY-4.0");
  }
});

test("physical validation targets and known overlapping resolution claims stay out", () => {
  const ids = new Set(records.map(record => record.id));
  for (const slug of ["mathph-quantum-spin-gaps-neel-spin-half", "mathph-quantum-spin-gaps-quantum-ferromagnet-3d", "qi-hamiltonian-complexity-area-law-2d", "qi-sic-mub-mub-dimension-six", "amo-anderson-localization-3d-matter-wave-critical-exponent", "cm-spin-ice-emergent-photon-evidence", "nuc-r-process-nuclear-fission-yields", "qi-quantum-thermo-clock-precision-entropy", "qi-causal-order-qrf-causal-inequality-realization"]) assert(!ids.has(`pubphys-${slug}`), slug);
  for (const slug of ["grav-evaporation-backreaction-black-to-white", "qi-measurement-problem-psi-epistemic-overlap", "qi-causal-order-qrf-qrf-general-frames", "qi-quantum-principles-higher-order-gpt", "qi-quantum-principles-quantum-set-principle"]) {
    assert(!ids.has(`pubphys-${slug}`), slug);
    assert.equal(report.decisions.find(item => item.slug === slug)?.decision, "exclude");
  }
  const example = snapshot.problems.find(problem => problem.slug === "mathph-anderson-delocalization-2d-localization")!;
  assert.equal(screenPubPhys(example).decision, "include");
  assert.equal(screenPubPhys({ ...example, settled_by: "A numerical computation followed by experimental confirmation." }).decision, "exclude");
  assert.equal(screenPubPhys({ ...example, settled_by: "New measurements matched by a theoretical calculation." }).decision, "exclude");
  assert.equal(screenPubPhys({ ...example, answer_type: "value", settled_by: "Numerical experiments with controlled convergence." }).decision, "include");
  assert.equal(screenPubPhys({ ...example, literature_status: "contested" }).decision, "review_hold");
});

test("imported and editorial filters partition results and invalid provenance is rejected", async () => {
  const editorial = searchSeed(records, { ...defaultQuery, review: ["editorial"] });
  const imported = searchSeed(records, { ...defaultQuery, review: ["imported"] });
  assert.equal(editorial.total, (await readEditorialCatalog()).filter(record => problemDomain(record) === "theoretical_physics").length);
  assert(imported.total > 200);
  assert.equal(editorial.total + imported.total, records.length);
  const entry = records.find(record => record.review_level === "source_import")!;
  assert.throws(() => parseProblem({ ...entry, imported_from: undefined }));
  assert.throws(() => parseProblem({ ...entry, source_status: "resolved" }));
});
