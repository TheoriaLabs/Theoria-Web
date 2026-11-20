import { problemAgentGuide } from "@/lib/problem-agent-guide";

export function GET() {
  return new Response(problemAgentGuide, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
