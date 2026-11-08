import { parseQuery } from "@/lib/open-problems";
import { queryProblems } from "@/lib/problem-store";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  let query;
  try { query = parseQuery(new URL(request.url).searchParams); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Invalid query." }, { status: 400 }); }
  try { return Response.json(await queryProblems(query), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) {
    console.error("Open-problem catalog unavailable:", error instanceof Error ? error.message : error);
    return Response.json({ error: "The problem catalog is temporarily unavailable. Please try again." }, { status: 503 });
  }
}
