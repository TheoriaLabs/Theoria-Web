import test from "node:test";
import assert from "node:assert/strict";
import { readSeedCatalog } from "../lib/problem-seed.ts";
import { enrichSourceReferences } from "../lib/problem-sources.ts";
import { defaultQuery, searchSeed } from "../lib/open-problems.ts";

test("independent expert-list questions are distinct records with source locators", async () => {
  const records = await readSeedCatalog();
  const ids = ["qc-f-routing-entanglement-lower-bounds", "quantum-gibbs-preserving-map-resource-cost", "qc-constant-error-separability-complexity", "quantum-key-from-all-entangled-states", "quantum-absolute-separability-higher-dimensions", "quantum-composable-decoherence-functionals"];
  for (const id of ids) {
    const matches = records.filter(record => record.id === id);
    assert.equal(matches.length, 1);
    assert(matches[0].sources.some(source => source.url.startsWith("https://oqp.iqoqi.oeaw.ac.at/") && source.locator && source.checked_on));
    assert.equal(matches[0].review_level, "preliminary_source_check");
  }
});

test("enrichment is deduplicated and preserves statement, identity and review status", async () => {
  const record = (await readSeedCatalog()).find(record => record.id === "pubphys-cm-chaos-scrambling-lanczos-one-dimension")!;
  const primary = record.sources.find(source => source.url.includes("1812.08657"))!;
  assert(primary.locator?.includes("(22)"));
  const [enriched] = enrichSourceReferences([record], { [record.id]: [primary, primary] });
  assert.equal(enriched.sources.filter(source => source.url === primary.url).length, 1);
  assert.equal(enriched.id, record.id);
  assert.equal(enriched.statement, record.statement);
  assert.equal(enriched.review_level, "source_import");
  assert.throws(() => enrichSourceReferences([record], { "held-or-unknown": [primary] }), /unknown or withheld/);
});

test("selected Prove2Me topics load as five distinct scoped records with source locators", async () => {
  const records = await readSeedCatalog();
  const ids = ["mathphys-pcr3bp-retrograde-global-section", "mathphys-thomson-nine-global-optimality", "mathphys-thomson-ten-global-optimality", "mathphys-thomson-thirty-two-global-optimality", "stat-ballistic-deposition-kpz-variance"];
  const selected = records.filter(record => ids.includes(record.id));
  assert.equal(selected.length, 5);
  for (const record of selected) {
    assert.equal(record.domain, "theoretical_physics");
    assert.equal(record.status, "provisionally_open");
    assert.equal(record.formulation, "specified_model");
    assert.equal(record.review_level, "preliminary_source_check");
    assert(record.sources.some(source => source.url.startsWith("https://prove2.me/missions/") && source.locator && source.checked_on));
    assert.equal(record.imported_from, undefined);
  }
  const thomson = searchSeed(records, { ...defaultQuery, q: "Thomson", area: ["mathematical_physics"] });
  assert.equal(thomson.total, 3);
  assert(thomson.items.every(record => record.assumptions.some(text => /no .*symmetry|without symmetry|need not.*symmetry/.test(text))));
  assert.equal(new Set(thomson.items.map(record => record.sources[0].url)).size, 1); // Three goals, one source mission.
  assert.equal(searchSeed(records, { ...defaultQuery, q: "retrograde" }).items[0].id, ids[0]);
  for (const area of ["mathematical_physics", "statistical_physics"]) {
    const found = searchSeed(records, { ...defaultQuery, q: "ballistic deposition", area: [area] });
    assert.equal(found.total, 1);
    assert.equal(found.items[0].id, "stat-ballistic-deposition-kpz-variance");
  }
  assert(records.some(record => record.id === "integrable-heisenberg-kpz-scaling"));
});
