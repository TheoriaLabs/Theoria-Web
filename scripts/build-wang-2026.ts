/** Reproduce the reviewed Wang additions and deduplication ledger; no network or database writes. */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseCatalog } from "../lib/open-problems.ts";
import { seedFiles } from "../lib/problem-seed.ts";
import { wangDecisions } from "../data/open-problems/wang-2026-curation.ts";
import { buildWangCatalog } from "../lib/wang-import.ts";

if (process.argv.length > 2) throw new Error("Usage: npm run problems:build:wang");
const directory = join(process.cwd(), "data/open-problems");
const files = await Promise.all(seedFiles.filter(name => name !== "wang-2026.preliminary.jsonl").map(name => readFile(join(directory, name), "utf8")));
const { records, enrichment, report } = buildWangCatalog(parseCatalog(files.join("\n")), wangDecisions);
await writeFile(join(directory, "wang-2026.preliminary.jsonl"), records.map(r => JSON.stringify(r)).join("\n") + "\n");
await writeFile(join(directory, "wang-2026-source-enrichment.json"), JSON.stringify(enrichment, null, 2) + "\n");
await writeFile(join(directory, "wang-2026-import-report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report.stats, null, 2));
