import { areaDomain, areaLabels, domainLabels, kindLabels, pageSize, reviewLabels, sortLabels } from "@/lib/open-problems";

export function GET() {
  return Response.json({
    schema_version: 1,
    guide: "/open-problems/llms.txt",
    endpoints: { list: "/api/open-problems", detail: "/api/open-problems/{id}", page: "/open-problems/{id}" },
    domains: Object.entries(domainLabels).map(([value, label]) => ({ value, label,
      areas: Object.entries(areaLabels).filter(([area]) => areaDomain(area) === value).map(([value, label]) => ({ value, label })),
    })),
    query: {
      domain: { default: "theoretical_physics" }, q: { max_length: 200 },
      area: { multiple: true, operator: "OR", includes_secondary: true },
      kind: { values: kindLabels, multiple: true }, review: { values: reviewLabels, multiple: true },
      sort: { values: sortLabels, default: "relevance" }, page: { min: 1, max: 500, default: 1 },
      view: { default: "list", page_sizes: { list: pageSize("list"), graph: pageSize("graph") }, graph_page: 1 },
    },
    status: "provisionally_open",
    notes: ["No authentication required; GET only.", "Use list pagination for complete results; graph view is capped.", "Filter exact tags and formulation locally after retrieval.", "Inclusion is not novelty or open-status certification; retain assumptions and source notes."],
  });
}
