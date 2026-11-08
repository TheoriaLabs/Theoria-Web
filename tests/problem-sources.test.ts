import test from "node:test";
import assert from "node:assert/strict";
import { readSeedCatalog } from "../lib/problem-seed.ts";
import { enrichSourceReferences } from "../lib/problem-sources.ts";

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
