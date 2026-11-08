/** Snapshot the full relevant public collection. Refresh is explicit; every source record remains auditable. */
import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { join } from "node:path";

const fields = ["cm", "qi", "mathph", "qft", "grav", "stat", "amo", "nuc", "hep", "cosmo"];
const directory = join(process.cwd(), "data/open-problems/sources");
const file = join(directory, "pubphys.snapshot.json");
const args = process.argv.slice(2);
if (args.some(arg => arg !== "--refresh")) throw new Error("Usage: node --experimental-strip-types scripts/collect-pubphys.ts [--refresh]");
type Summary = { slug: string; record_hash: string; field: string };
type SourceProblem = Summary & Record<string, unknown>;
type Snapshot = { retrieved_at: string; fields: string[]; problems: SourceProblem[] };
let previous: Snapshot | undefined;
try { previous = JSON.parse(await readFile(file, "utf8")); }
catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
if (previous && !args.includes("--refresh")) {
  console.log(`Using existing snapshot of ${previous.problems.length} records (${previous.retrieved_at}). Pass --refresh for current source data.`);
} else {
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  async function get<T>(path: string): Promise<T> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const response = await fetch(`https://pubphys.com/api/v1${path}`, { signal: AbortSignal.timeout(45000), headers: { "User-Agent": "Theoria-Web source catalog (+https://www.theoria.sh)" } });
      if (response.ok) return await response.json() as T;
      if (![429, 500, 502, 503, 504].includes(response.status)) throw new Error(`${path}: HTTP ${response.status}`);
      const retry = response.headers.get("retry-after");
      const seconds = retry && /^\d+$/.test(retry) ? Number(retry) : retry ? Math.max(1, (Date.parse(retry) - Date.now()) / 1000) : 5 * 2 ** attempt;
      console.log(`${path}: HTTP ${response.status}; waiting ${seconds}s`);
      await wait(Math.min(300, Number.isFinite(seconds) ? seconds : 30) * 1000);
    }
    throw new Error(`Repeated failure: ${path}`);
  }
  const summaries: Summary[] = [];
  for (const field of fields) {
    for (let page = 1; ; page++) {
      const data = await get<{ problems: Summary[]; pagination: { pages: number; total: number } }>(`/problems?field=${field}&per=100&page=${page}`);
      summaries.push(...data.problems);
      if (page >= data.pagination.pages) { console.log(`${field}: ${data.pagination.total} source records`); break; }
    }
  }
  if (new Set(summaries.map(item => item.slug)).size !== summaries.length) throw new Error("Duplicate source identity in paginated collection.");
  const cache = new Map(previous?.problems.map(item => [item.record_hash, item]) ?? []);
  const problems: SourceProblem[] = [];
  let cursor = 0;
  // Two workers keep requests bounded. No search API or undocumented bulk endpoint is needed.
  await Promise.all([0, 1].map(async () => {
    while (cursor < summaries.length) {
      const item = summaries[cursor++];
      const problem = cache.get(item.record_hash) ?? (await get<{ problem: SourceProblem }>(`/problems/${item.slug}`)).problem;
      if (problem.slug !== item.slug || problem.record_hash !== item.record_hash) throw new Error(`Source changed during collection: ${item.slug}; refresh again.`);
      problems.push(problem);
      if (problems.length % 100 === 0) console.log(`Collected ${problems.length}/${summaries.length}`);
      await wait(100);
    }
  }));
  problems.sort((a, b) => a.slug.localeCompare(b.slug));
  await mkdir(directory, { recursive: true });
  const snapshot = { source: "https://pubphys.com/api/v1", terms: "https://pubphys.com/docs/terms", license: "CC-BY-4.0", seed_provenance: "https://pubphys.com/docs/seed", retrieved_at: new Date().toISOString(), fields, problems };
  await writeFile(`${file}.tmp`, JSON.stringify(snapshot, null, 2) + "\n");
  await rename(`${file}.tmp`, file);
  console.log(`Saved all ${problems.length} candidates to data/open-problems/sources/pubphys.snapshot.json`);
}
