import { problemIdPattern } from "@/lib/open-problems";
import { getProblem } from "@/lib/problem-store";

export const dynamic = "force-dynamic";
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!problemIdPattern.test(id)) return Response.json({ error: "Invalid problem ID." }, { status: 400 });
  try {
    const result = await getProblem(id);
    return result
      ? Response.json(result, { headers: { "Cache-Control": "no-store" } })
      : Response.json({ error: "Problem not found." }, { status: 404 });
  } catch (error) {
    console.error("Open-problem lookup unavailable:", error instanceof Error ? error.message : error);
    return Response.json({ error: "The problem catalog is temporarily unavailable. Please try again." }, { status: 503 });
  }
}
