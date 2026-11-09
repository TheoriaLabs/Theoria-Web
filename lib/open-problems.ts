/** Shared catalog types, validation and URL parameters. No database credentials reach the browser. */
export const domainLabels = { theoretical_physics: "Theoretical Physics", quantitative_finance: "Quantitative Finance" } as const;
export type ProblemDomain = keyof typeof domainLabels;
export const financeAreaLabels: Record<string, string> = {
  volatility_models: "Volatility models", martingale_transport: "Martingales & transport",
  market_microstructure: "Market microstructure", stochastic_control: "Stochastic control",
  financial_networks: "Financial networks", portfolio_optimization: "Portfolio optimization",
};
export const areaLabels: Record<string, string> = {
  quantum_chaos: "Quantum chaos",
  quantum_physics: "Quantum physics", quantum_computing: "Quantum computing",
  quantum_field_theory: "Quantum field theory", qed: "QED", qcd: "QCD",
  condensed_matter: "Condensed matter", gravity: "Gravity", quantum_gravity: "Quantum gravity",
  string_theory: "String theory", integrable_systems: "Integrable systems",
  mathematical_physics: "Mathematical physics", statistical_physics: "Statistical physics",
  atomic_molecular_optical: "Atomic, molecular & optical", nuclear_physics: "Nuclear physics",
  particle_physics: "Particle physics", cosmology: "Cosmology",
  ...financeAreaLabels,
};
export const areaDomain = (area: string): ProblemDomain => Object.hasOwn(financeAreaLabels, area) ? "quantitative_finance" : "theoretical_physics";
export const kindLabels = { conjecture: "Conjecture", open_question: "Open question", construction_problem: "Construction problem" } as const;
export const reviewLabels = { editorial: "Editorially scoped", imported: "Source imported" } as const;
export const sortLabels = { relevance: "Relevance", title: "Title: A–Z", newest: "Recently compiled", area: "Subject area" } as const;
export const reviewLabel = (problem: OpenProblem) => problem.review_level === "source_import" ? "Source imported" : "Editorially scoped";
export type ProblemKind = keyof typeof kindLabels;
export type ProblemSort = keyof typeof sortLabels;
export type GraphLayout = "spring" | "grid";
export interface OpenProblem {
  schema_version: number; id: string; title: string; aliases: string[];
  domain?: ProblemDomain;
  kind: ProblemKind; primary_area: string; tags: string[]; statement: string; assumptions: string[];
  secondary_areas?: string[];
  physics_motivation: string; resolution_target: string;
  formulation: "specified_model" | "needs_framework"; status: "provisionally_open";
  status_note: string; review_level: string; compiled_on: string;
  sources: { title: string; url: string; role: string; locator?: string; checked_on?: string; note?: string }[];
  relations: { id: string; type: string; note: string }[];
  source_status?: "open" | "partially-resolved";
  imported_from?: { provider: string; url: string; revision: number; record_hash: string; retrieved_at: string; origin: string; license: string };
}
export interface ProblemQuery { domain: ProblemDomain; q: string; area: string[]; kind: string[]; review: string[]; sort: ProblemSort; page: number; view: "list" | "graph"; layout: GraphLayout }
export interface ProblemResult {
  items: OpenProblem[]; total: number; total_all: number;
  areas: { value: string; count: number }[];
  source: "seed" | "supabase"; page: number; page_size: number;
}
export const defaultQuery: ProblemQuery = { domain: "theoretical_physics", q: "", area: [], kind: [], review: [], sort: "relevance", page: 1, view: "list", layout: "spring" };
export const pageSize = (view: ProblemQuery["view"]) => view === "graph" ? 250 : 12;
export const problemIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const problemAreas = (problem: OpenProblem) => [problem.primary_area, ...(problem.secondary_areas ?? [])];
/** Version-one physics records predate the domain field. */
export const problemDomain = (problem: OpenProblem): ProblemDomain => problem.domain ?? "theoretical_physics";

function selectedParams(params: URLSearchParams, name: string, labels: Record<string, string>, error: string): string[] {
  // Repeated keys are canonical; comma-separated and existing single-value links work too.
  const values = [...new Set(params.getAll(name).flatMap(value => value.split(",")).map(value => value.trim()).filter(Boolean))];
  if (values.some(value => !Object.hasOwn(labels, value))) throw new Error(error);
  return values.sort();
}
export function parseQuery(params: URLSearchParams): ProblemQuery {
  const domain = params.get("domain") ?? defaultQuery.domain;
  if (!Object.hasOwn(domainLabels, domain)) throw new Error("Unknown problem domain.");
  const q = (params.get("q") ?? "").trim();
  const area = selectedParams(params, "area", areaLabels, "Unknown subject area.");
  if (area.some(value => areaDomain(value) !== domain)) throw new Error("Subject area does not belong to this domain.");
  const kind = selectedParams(params, "kind", kindLabels, "Unknown problem type.");
  const review = selectedParams(params, "review", reviewLabels, "Unknown review filter.");
  const sort = params.get("sort") ?? "relevance", view = params.get("view") ?? "list";
  const layout = params.get("layout") ?? "spring";
  const rawPage = params.get("page") ?? "1", page = Number(rawPage);
  if (q.length > 200) throw new Error("Search is limited to 200 characters.");
  if (!Object.hasOwn(sortLabels, sort)) throw new Error("Unknown sort order.");
  if (view !== "list" && view !== "graph") throw new Error("Unknown view.");
  if (layout !== "spring" && layout !== "grid") throw new Error("Unknown graph layout.");
  if (!/^\d+$/.test(rawPage) || !Number.isSafeInteger(page) || page < 1 || page > 500) throw new Error("Page must be between 1 and 500.");
  return { domain: domain as ProblemDomain, q, area, kind, review, sort: sort as ProblemSort, page: view === "graph" ? 1 : page, view, layout };
}
export function queryParams(query: ProblemQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.domain !== defaultQuery.domain) params.set("domain", query.domain);
  if (query.q) params.set("q", query.q);
  for (const key of ["area", "kind", "review"] as const) for (const value of [...new Set(query[key])].sort()) params.append(key, value);
  if (query.sort !== "relevance") params.set("sort", query.sort);
  if (query.view !== "list") params.set("view", query.view);
  if (query.layout !== "spring") params.set("layout", query.layout);
  if (query.page > 1 && query.view === "list") params.set("page", String(query.page));
  return params;
}

const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(text);
/** Validate the seed and database documents at their boundary, including source URLs and public status. */
export function parseProblem(value: unknown): OpenProblem {
  if (!object(value) || value.schema_version !== 1 || !text(value.id) || !problemIdPattern.test(value.id)) throw new Error("Invalid problem identity.");
  const fail = () => { throw new Error(`Invalid problem record: ${value.id}`); };
  if (value.domain !== undefined && (!text(value.domain) || !Object.hasOwn(domainLabels, value.domain))) fail();
  for (const key of ["title", "statement", "physics_motivation", "resolution_target", "status_note", "review_level"]) if (!text(value[key])) fail();
  for (const key of ["aliases", "tags", "assumptions"]) if (!strings(value[key])) fail();
  if (!text(value.kind) || !Object.hasOwn(kindLabels, value.kind) || !text(value.primary_area) || !Object.hasOwn(areaLabels, value.primary_area)) fail();
  if (value.secondary_areas !== undefined && (!strings(value.secondary_areas) || value.secondary_areas.some(area => area === value.primary_area || !Object.hasOwn(areaLabels, area)) || new Set(value.secondary_areas).size !== value.secondary_areas.length)) fail();
  if ([value.primary_area as string, ...(value.secondary_areas as string[] | undefined ?? [])].some(area => areaDomain(area) !== (value.domain ?? "theoretical_physics"))) fail();
  if (value.status !== "provisionally_open" || !["specified_model", "needs_framework"].includes(String(value.formulation))) fail();
  if (value.review_level === "source_import") {
    if (!["open", "partially-resolved"].includes(String(value.source_status)) || !object(value.imported_from)) fail();
    const origin = value.imported_from as Record<string, unknown>;
    if (origin.provider !== "PubPhys" || origin.license !== "CC-BY-4.0" || !text(origin.url) || !origin.url.startsWith("https://pubphys.com/problems/") || !text(origin.record_hash) || !/^[a-f0-9]{64}$/.test(origin.record_hash) || !Number.isSafeInteger(origin.revision) || !text(origin.retrieved_at)) fail();
  }
  if (!text(value.compiled_on) || !/^\d{4}-\d{2}-\d{2}$/.test(value.compiled_on) || new Date(value.compiled_on).toISOString().slice(0, 10) !== value.compiled_on) fail();
  if (!Array.isArray(value.sources) || !value.sources.length) fail();
  for (const source of value.sources as unknown[]) {
    if (!object(source) || !text(source.title) || !text(source.role) || !text(source.url)) fail();
    const reference = source as Record<string, unknown>;
    if (reference.locator !== undefined && !text(reference.locator) || reference.note !== undefined && !text(reference.note)) fail();
    if (reference.checked_on !== undefined && (!text(reference.checked_on) || !/^\d{4}-\d{2}-\d{2}$/.test(reference.checked_on))) fail();
    const url = new URL((source as { url: string }).url);
    if (url.protocol !== "https:" || url.username || url.password) fail();
  }
  if (!Array.isArray(value.relations)) fail();
  for (const relation of value.relations as unknown[]) if (!object(relation) || !text(relation.id) || !problemIdPattern.test(relation.id) || relation.id === value.id || !text(relation.type) || !text(relation.note)) fail();
  return value as unknown as OpenProblem;
}
export function parseCatalog(jsonl: string): OpenProblem[] {
  const records = jsonl.split(/\r?\n/).filter(line => line.trim()).map(line => parseProblem(JSON.parse(line)));
  if (new Set(records.map(record => record.id)).size !== records.length) throw new Error("Duplicate problem IDs in catalog.");
  return records;
}

/** Local seed preview: AND word search. Production search uses PostgreSQL's English full-text index. */
export function searchSeed(records: OpenProblem[], query: ProblemQuery): ProblemResult {
  records = records.filter(record => problemDomain(record) === query.domain);
  const words = query.q.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  const matches = records.flatMap(record => {
    if (query.area.length && !query.area.some(area => problemAreas(record).includes(area)) || query.kind.length && !query.kind.includes(record.kind)) return [];
    if (query.review.length && !query.review.includes(record.review_level === "source_import" ? "imported" : "editorial")) return [];
    const title = `${record.title} ${record.aliases.join(" ")}`.toLowerCase();
    const haystack = `${title} ${record.tags.join(" ")} ${record.statement} ${record.resolution_target} ${record.assumptions.join(" ")} ${record.physics_motivation} ${problemAreas(record).map(area => areaLabels[area]).join(" ")}`.toLowerCase();
    if (!words.every(word => haystack.includes(word))) return [];
    return [{ record, score: words.reduce((score, word) => score + (title.includes(word) ? 5 : 1), 0) }];
  }).sort((a, b) => {
    if (query.sort === "relevance" && a.score !== b.score) return b.score - a.score;
    if (query.sort === "newest" && a.record.compiled_on !== b.record.compiled_on) return b.record.compiled_on.localeCompare(a.record.compiled_on);
    if (query.sort === "area" && a.record.primary_area !== b.record.primary_area) return a.record.primary_area.localeCompare(b.record.primary_area);
    return a.record.title.localeCompare(b.record.title) || a.record.id.localeCompare(b.record.id);
  });
  const size = pageSize(query.view);
  return { items: matches.slice((query.page - 1) * size, query.page * size).map(match => match.record), total: matches.length,
    total_all: records.length, areas: Object.keys(areaLabels).map(value => ({ value, count: records.filter(record => problemAreas(record).includes(value)).length })).filter(area => area.count),
    source: "seed", page: query.page, page_size: size };
}
