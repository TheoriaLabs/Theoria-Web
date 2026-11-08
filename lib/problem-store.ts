/** Server-only data access: imported by route handlers and server pages, never by client components. */
import { createClient } from "@supabase/supabase-js";
import { pageSize, parseProblem, problemIdPattern, searchSeed, type OpenProblem, type ProblemQuery, type ProblemResult } from "./open-problems.ts";
import { readSeedCatalog } from "./problem-seed.ts";

function database() {
  const mode = process.env.OPEN_PROBLEMS_SOURCE ?? "auto";
  if (!["auto", "seed", "supabase"].includes(mode)) throw new Error("OPEN_PROBLEMS_SOURCE must be auto, seed or supabase.");
  if (mode === "seed") return undefined;
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url && !key && mode === "auto") return undefined;
  if (!url || !key) throw new Error("Configure SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: AbortSignal.timeout(10000) }) } });
}
export async function queryProblems(query: ProblemQuery): Promise<ProblemResult> {
  const db = database();
  if (!db) return searchSeed(await readSeedCatalog(), query);
  const { data, error } = await db.rpc("search_open_problems", {
    search_query: query.q, area_filter: query.area, kind_filter: query.kind, sort_order: query.sort,
    offset_rows: (query.page - 1) * pageSize(query.view), page_size: pageSize(query.view),
    review_filter: query.review,
  });
  if (error) throw new Error(`Problem database query failed: ${error.message}`);
  if (!data || !Array.isArray(data.items) || !Array.isArray(data.areas) || !Number.isSafeInteger(data.total) || !Number.isSafeInteger(data.total_all)) throw new Error("Invalid problem database response.");
  return { items: data.items.map(parseProblem), total: data.total, total_all: data.total_all,
    areas: data.areas, page: query.page, page_size: pageSize(query.view), source: "supabase" };
}
export async function getProblem(id: string): Promise<{ problem: OpenProblem; source: "seed" | "supabase" } | undefined> {
  if (!problemIdPattern.test(id)) return undefined;
  const db = database();
  if (!db) { const problem = (await readSeedCatalog()).find(record => record.id === id); return problem ? { problem, source: "seed" } : undefined; }
  const { data, error } = await db.from("open_problems").select("document").eq("id", id).eq("published", true).eq("status", "provisionally_open").maybeSingle();
  if (error) throw new Error(`Problem database lookup failed: ${error.message}`);
  return data ? { problem: parseProblem(data.document), source: "supabase" } : undefined;
}
