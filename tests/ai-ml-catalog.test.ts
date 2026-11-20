import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import katex from "katex";
import { aiMlProblems } from "../data/open-problems/ai-ml-curation.ts";
import { parseCatalog, problemAreas } from "../lib/open-problems.ts";

test("AI/ML generated records match scoped curation and render their mathematical statements", async () => {
  const records = parseCatalog(await readFile(new URL("../data/open-problems/ai-ml.preliminary.jsonl", import.meta.url), "utf8"));
  assert.deepEqual(records, aiMlProblems);
  assert.equal(records.length, 119);
  for (const record of records) {
    assert.equal(record.kind, "open_question");
    assert.equal(record.status, "provisionally_open");
    assert.equal(record.review_level, "preliminary_source_check");
    assert(record.sources.length >= 2 && record.sources.every(source => source.checked_on && source.note));
    assert.match(record.status_note, record.sources.some(source => source.role === "problem_statement")
      ? /editorial reformulation of a published open problem/
      : /editorial, source-motivated research target/);
    assert(record.assumptions.length >= 3 && problemAreas(record).length > 0);
    const fields = [record.title, record.statement, record.resolution_target, record.status_note, record.physics_motivation, ...record.assumptions];
    // Template literals normalize a stray "\r" (e.g. "\rm" in a non-raw string) to "\n", so single-line fields reject both.
    for (const field of fields) assert.doesNotMatch(field, /[\x00-\x1f]/);
    const text = fields.join(" ");
    for (const match of text.matchAll(/\$([^$]+)\$/g)) assert.doesNotThrow(() => katex.renderToString(match[1], { throwOnError: true }));
  }
});
