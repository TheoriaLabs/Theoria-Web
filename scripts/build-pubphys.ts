import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseCatalog, parseProblem, type OpenProblem } from "../lib/open-problems.ts";
import { pubPhysArea, screenPubPhys, type PubPhysProblem, type ImportDecision } from "../lib/pubphys-import.ts";
import { readEditorialCatalog, readSourceEnrichment } from "../lib/problem-seed.ts";
import { enrichSourceReferences } from "../lib/problem-sources.ts";

const directory = join(process.cwd(), "data/open-problems");
const snapshot = JSON.parse(await readFile(join(directory, "sources/pubphys.snapshot.json"), "utf8")) as { retrieved_at: string; problems: PubPhysProblem[] };
const curated = await readEditorialCatalog();
const overrides = JSON.parse(await readFile(join(directory, "pubphys-overrides.json"), "utf8")) as { aliases: Record<string, string>; related: Record<string, string>; holds: Record<string, string>; exclude: Record<string, string> };
const holds = (await readFile(join(directory, "status-review-holds.jsonl"), "utf8")).trim().split("\n").map(line => JSON.parse(line) as { id: string; background_urls: string[] });
const sourceIds = new Set(snapshot.problems.map(problem => problem.slug));
const canonicalIds = new Set(curated.map(problem => problem.id));
for (const [slug, id] of Object.entries(overrides.aliases)) if (!sourceIds.has(slug) || !canonicalIds.has(id)) throw new Error(`Unknown explicit alias ${slug} → ${id}`);
for (const slug of [...Object.keys(overrides.holds), ...Object.keys(overrides.exclude), ...Object.keys(overrides.related)]) if (!sourceIds.has(slug)) throw new Error(`Unknown explicit decision ${slug}`);
const aliases = new Map(Object.entries(overrides.aliases));
for (const record of curated) for (const source of record.sources) {
  const url = new URL(source.url);
  if (url.hostname === "pubphys.com" && url.pathname.startsWith("/problems/")) aliases.set(url.pathname.split("/").at(-1)!, record.id);
}
for (const hold of holds) for (const url of hold.background_urls) if (url.startsWith("https://pubphys.com/problems/")) overrides.holds[url.split("/").at(-1)!] = `Held canonical record: ${hold.id}`;
const decisions: ImportDecision[] = [], included: PubPhysProblem[] = [];
const normalized = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const titles = new Map(curated.map(record => [normalized(record.title), record.id]));
const statements = new Map(curated.map(record => [normalized(record.statement), record.id]));
for (const problem of snapshot.problems) {
  const canonical = aliases.get(problem.slug) ?? titles.get(normalized(problem.title)) ?? statements.get(normalized(problem.precise));
  const decision: ImportDecision = overrides.exclude[problem.slug] ? { slug: problem.slug, decision: "exclude", reason: overrides.exclude[problem.slug] } : overrides.holds[problem.slug]
    ? { slug: problem.slug, decision: "review_hold", reason: overrides.holds[problem.slug] }
    : canonical ? { slug: problem.slug, decision: "duplicate", canonical_id: canonical, reason: "Already represented by this canonical problem or its explicit subtarget" }
    : screenPubPhys(problem);
  decisions.push(decision);
  if (decision.decision === "duplicate" && canonical) aliases.set(problem.slug, canonical);
  if (decision.decision === "include") {
    included.push(problem);
    aliases.set(problem.slug, `pubphys-${problem.slug}`);
    titles.set(normalized(problem.title), `pubphys-${problem.slug}`);
    statements.set(normalized(problem.precise), `pubphys-${problem.slug}`);
  }
}
const imported = included.map(problem => {
  const review = problem.references?.topic_review;
  const sources: OpenProblem["sources"] = [{ title: `PubPhys: ${problem.title}`, url: problem.url, role: "source_record" }];
  if (review?.link?.startsWith("https://")) sources.push({ title: review.cite, url: review.link, role: "review" });
  const id = aliases.get(problem.slug)!;
  const edges = [...problem.parents.map(item => ({ ...item, type: item.relation, note: item.note || "Source-listed parent or broader problem; not an equivalence claim." })),
    ...problem.children.map(item => ({ ...item, type: `has_${item.relation}`, note: "Source-listed subproblem or special case." })),
    ...problem.links.filter(item => item.kind === "problem").map(item => ({ ...item, note: item.reason || "Related by the source catalog; the relationship has not been independently reviewed." }))];
  const relations = new Map<string, OpenProblem["relations"][number]>();
  if (overrides.related[problem.slug]) relations.set(overrides.related[problem.slug], { id: overrides.related[problem.slug], type: "related_to", note: "Related editorially scoped problem. The scope or requested conclusion differs; these records are not treated as equivalent." });
  for (const edge of edges) { const target = aliases.get(edge.slug); if (target && target !== id) relations.set(target, { id: target, type: edge.type || "related_to", note: edge.note }); }
  return parseProblem({ schema_version: 1, id, title: problem.title, aliases: [problem.slug.replaceAll("-", " ")],
    kind: /conjecture/i.test(`${problem.title} ${problem.precise}`) ? "conjecture" : /\bconstruct/i.test(problem.settled_by) ? "construction_problem" : "open_question",
    primary_area: pubPhysArea(problem), tags: [...new Set([problem.topic.replace(/^[^-]+-/, "").replaceAll("-", "_"), problem.field, problem.answer_type])],
    statement: problem.precise, assumptions: ["Use the model, parameter regime and resolution criterion in the source statement. Additional unstated assumptions require review."],
    physics_motivation: problem.plain, resolution_target: problem.settled_by, formulation: problem.kind === "well-posed" ? "specified_model" : "needs_framework",
    status: "provisionally_open", status_note: `Source literature status: ${problem.literature_status}. ${problem.status_note || "No detailed literature-status note was supplied."} Source note marked verified by PubPhys: ${problem.status_note_verified ? "yes" : "no"}. Theoria has not independently verified this assessment.`,
    review_level: "source_import", compiled_on: snapshot.retrieved_at.slice(0, 10), sources, relations: [...relations.values()],
    source_status: problem.literature_status, imported_from: { provider: "PubPhys", url: problem.url, revision: problem.revision, record_hash: problem.record_hash, retrieved_at: snapshot.retrieved_at, origin: problem.origin, license: "CC-BY-4.0" },
  });
});
enrichSourceReferences(parseCatalog([...curated, ...imported].map(record => JSON.stringify(record)).join("\n")), await readSourceEnrichment());
const counts = Object.fromEntries(["include", "exclude", "review_hold", "duplicate"].map(key => [key, decisions.filter(decision => decision.decision === key).length]));
const stats = { source_records: snapshot.problems.length, ...counts, existing_editorial_records: curated.length, public_records: curated.length + imported.length };
await writeFile(join(directory, "pubphys.preliminary.jsonl"), imported.map(record => JSON.stringify(record)).join("\n") + "\n");
await writeFile(join(directory, "pubphys-import-report.json"), JSON.stringify({ retrieved_at: snapshot.retrieved_at, stats, decisions }, null, 2) + "\n");
await writeFile(join(directory, "sources/pubphys-screening-review.txt"), included.map(problem => `${problem.slug}\t${problem.answer_type}\t${problem.title}\t${problem.settled_by}`).join("\n") + "\n");
console.log(JSON.stringify(stats, null, 2));
console.log("Answer types:", Object.fromEntries([...new Set(snapshot.problems.map(problem => problem.answer_type))].map(type => [type, snapshot.problems.filter(problem => problem.answer_type === type).length])));
console.log("Public areas:", Object.fromEntries([...new Set([...curated, ...imported].map(problem => problem.primary_area))].map(area => [area, [...curated, ...imported].filter(problem => problem.primary_area === area).length])));
