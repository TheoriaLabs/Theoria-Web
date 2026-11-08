import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { ProblemExplorer } from "@/components/problem-explorer";
import { defaultQuery, parseQuery } from "@/lib/open-problems";
import { queryProblems } from "@/lib/problem-store";
import "./problems.css";

export const metadata: Metadata = {
  title: "Open problems in theoretical physics · Theoria Labs",
  description: "Explore physics conjectures and open questions by subject, search their proof targets and sources, and map their relationships.",
  alternates: { canonical: "/open-problems" },
};
export const dynamic = "force-dynamic";
export default async function OpenProblemsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") params.append(key, value);
    else if (Array.isArray(value)) for (const item of value) params.append(key, item);
  }
  let query = defaultQuery, result, error;
  try { query = parseQuery(params); }
  catch (problem) { error = problem instanceof Error ? problem.message : "Invalid filters."; }
  if (!error) try { result = await queryProblems(query); }
  catch (problem) { console.error("Catalog page:", problem); error = "The problem catalog is temporarily unavailable. Please try again."; }
  return <div className="problems-body"><a className="skip-link" href="#problems-main">Skip to content</a><SiteHeader />
    <main className="problems-shell" id="problems-main"><ProblemExplorer key={JSON.stringify(query)} initialQuery={query} initialResult={result} initialError={error} /></main></div>;
}
