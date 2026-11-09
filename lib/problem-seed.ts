import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseCatalog } from "./open-problems.ts";
import type { OpenProblem } from "./open-problems.ts";
import { enrichSourceReferences } from "./problem-sources.ts";

/** Explicit allowlist: held-out records are never part of the public catalog or importer. */
export const editorialSeedFiles = ["theory-open-problems.preliminary.jsonl", "quantum-chaos.preliminary.jsonl", "independent-sources.preliminary.jsonl", "quant-finance.preliminary.jsonl"];
export const seedFiles = [...editorialSeedFiles, "pubphys.preliminary.jsonl"];
async function readFiles(names: string[]) {
  const files = await Promise.all(names.map(file => readFile(join(process.cwd(), "data/open-problems", file), "utf8")));
  return parseCatalog(files.join("\n"));
}
export const readEditorialCatalog = () => readFiles(editorialSeedFiles);
export async function readSourceEnrichment(): Promise<Record<string, OpenProblem["sources"]>> {
  return JSON.parse(await readFile(join(process.cwd(), "data/open-problems/source-enrichment.json"), "utf8"));
}
export async function readSeedCatalog() {
  return enrichSourceReferences(await readFiles(seedFiles), await readSourceEnrichment());
}
