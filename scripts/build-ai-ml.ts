import { writeFile } from "node:fs/promises";
import { aiMlProblems } from "../data/open-problems/ai-ml-curation.ts";
import { parseCatalog, parseProblem } from "../lib/open-problems.ts";

const records = aiMlProblems.map(parseProblem);
const text = records.map(record => JSON.stringify(record)).join("\n") + "\n";
parseCatalog(text);
const ids = new Set(records.map(record => record.id));
for (const record of records) for (const relation of record.relations) {
  if (!ids.has(relation.id)) throw new Error(`Unknown AI/ML relation: ${relation.id}`);
}
await writeFile(new URL("../data/open-problems/ai-ml.preliminary.jsonl", import.meta.url), text);
console.log(`Built ${records.length} editorial AI/ML research targets.`);
