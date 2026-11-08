import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from "d3-force";
import { areaLabels, problemAreas, type GraphLayout, type OpenProblem } from "./open-problems.ts";

export const graphWidth = 1200, graphHeight = 900;
const palette = ["#4b7600", "#31788a", "#6551a3", "#a44a50", "#a26928", "#24846e", "#5475b0", "#955986", "#7f6b37", "#4b8088", "#73608e", "#867444", "#398170", "#875381", "#a0643e", "#60789a", "#788242"];
export const areaColor = (area: string) => palette[Math.max(0, Object.keys(areaLabels).indexOf(area)) % palette.length];
export interface GraphNode { id: string; title: string; area: string; x: number; y: number; radius: number }
export interface GraphEdge { source: string; target: string; note: string }
export interface TopicEdge extends GraphEdge { score: number }
export interface GraphCluster { area: string; count: number; x: number; y: number; radius: number }
interface GroupLink { source: string; target: string; recorded: number; topicWeight: number; sharedSubjects: number; score: number }
interface GroupParticle extends SimulationNodeDatum { id: string; count: number; radius: number; paddingRadius: number }
const pairKey = (a: string, b: string) => [a, b].sort().join(":");
const stopWords = new Set("a an and are as at be by can case class conjecture construction dimension dimensional do does existence for from general generic how in is it its model no of on one open or problem proof question quantum system that the their theory three to two under value what when which with without yes cm qi qft grav stat amo nuc hep cosmo mathph classification identification mechanism".split(" "));
const tokens = (text: string) => (text.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").replace(/\\[a-z]+/g, " ").match(/[a-z][a-z0-9]+/g) ?? [])
  .map(word => word === "matrices" ? "matrix" : word.length > 5 && word.endsWith("s") ? word.slice(0, -1) : word)
  .filter(word => word.length > 2 && !stopWords.has(word));

/** IDF-weighted title/tag affinity. Broad subjects add a small bonus; source/type labels are ignored. */
function topicEdges(problems: OpenProblem[], recorded: Set<string>): TopicEdge[] {
  const frequency = new Map<string, number>();
  const features = problems.map(problem => {
    const features = new Map<string, number>();
    for (const token of tokens(problem.title)) features.set(token, 1);
    for (const token of tokens(problem.tags.join(" "))) features.set(token, 3);
    for (const token of features.keys()) frequency.set(token, (frequency.get(token) ?? 0) + 1);
    return features;
  });
  const norms = features.map(features => {
    for (const [token, weight] of features) features.set(token, weight * (1 + Math.log((problems.length + 1) / ((frequency.get(token) ?? 0) + 1))));
    return Math.sqrt([...features.values()].reduce((sum, weight) => sum + weight * weight, 0));
  });
  const candidates: { index: number; score: number; shared: string[] }[][] = problems.map(() => []);
  for (let a = 0; a < problems.length; a++) for (let b = a + 1; b < problems.length; b++) {
    let dot = 0;
    const shared: string[] = [];
    for (const [token, weight] of features[a]) if (features[b].has(token)) { dot += weight * features[b].get(token)!; shared.push(token); }
    if (!shared.length || !norms[a] || !norms[b]) continue;
    const sameSubject = problemAreas(problems[a]).some(area => problemAreas(problems[b]).includes(area));
    const score = Math.min(1, dot / (norms[a] * norms[b]) + (sameSubject ? 0.08 : 0));
    if (score < 0.18 || recorded.has(pairKey(problems[a].id, problems[b].id))) continue;
    candidates[a].push({ index: b, score, shared }); candidates[b].push({ index: a, score, shared });
  }
  const edges = new Map<string, TopicEdge>();
  candidates.forEach((neighbors, index) => {
    // A sparse nearest-neighbor graph avoids connecting every pair in a broad subject.
    for (const neighbor of neighbors.sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 4)) {
      const [source, target] = [problems[index].id, problems[neighbor.index].id].sort();
      edges.set(pairKey(source, target), { source, target, score: neighbor.score, note: `Inferred topic affinity: ${neighbor.shared.slice(0, 4).join(", ")}. Based on shared title/tag terms.` });
    }
  });
  return [...edges.entries()].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([, edge]) => edge);
}

/** Aggregate only cross-subject links. Individual problems never participate in the force simulation. */
function groupLinks(problems: OpenProblem[], groups: GroupParticle[], edges: GraphEdge[], affinities: TopicEdge[]): GroupLink[] {
  const areas = new Map(problems.map(problem => [problem.id, problem.primary_area]));
  const sizes = new Map(groups.map(group => [group.id, group.count]));
  const links = new Map<string, GroupLink>();
  const add = (a: string, b: string, field: "recorded" | "topicWeight" | "sharedSubjects", weight: number) => {
    if (a === b || !sizes.has(a) || !sizes.has(b)) return;
    const [source, target] = [a, b].sort(), key = pairKey(source, target);
    const link = links.get(key) ?? { source, target, recorded: 0, topicWeight: 0, sharedSubjects: 0, score: 0 };
    link[field] += weight; links.set(key, link);
  };
  for (const edge of edges) add(areas.get(edge.source)!, areas.get(edge.target)!, "recorded", 1);
  for (const edge of affinities) add(areas.get(edge.source)!, areas.get(edge.target)!, "topicWeight", edge.score);
  for (const problem of problems) for (const area of problem.secondary_areas ?? []) add(problem.primary_area, area, "sharedSubjects", 1);
  return [...links.entries()].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([, link]) => ({ ...link,
    score: (2 * link.recorded + 0.35 * link.topicWeight + 0.75 * link.sharedSubjects) / Math.sqrt(sizes.get(link.source)! * sizes.get(link.target)!) }));
}

function positionGroups(groups: GroupParticle[], links: GroupLink[], layout: GraphLayout): { clusters: GraphCluster[]; scale: number } {
  if (!groups.length) return { clusters: [], scale: 1 };
  if (layout === "grid") {
    const columns = Math.min(groups.length, Math.ceil(Math.sqrt(groups.length * graphWidth / graphHeight)));
    const rows = Math.ceil(groups.length / columns), cellWidth = graphWidth / columns, cellHeight = graphHeight / rows;
    const radius = Math.max(...groups.map(group => group.paddingRadius));
    const scale = Math.min(3, (cellWidth - 30) / (2 * radius), (cellHeight - 30) / (2 * radius));
    return { scale, clusters: groups.map((group, index) => {
      const row = Math.floor(index / columns), countInRow = Math.min(columns, groups.length - row * columns);
      return { area: group.id, count: group.count, radius: group.radius * scale,
        x: (index % columns + 0.5 + (columns - countInRow) / 2) * cellWidth, y: (row + 0.5) * cellHeight };
    }) };
  }
  const byId = new Map(groups.map(group => [group.id, group]));
  const springs = links.map(link => ({ ...link,
    distance: byId.get(link.source)!.paddingRadius + byId.get(link.target)!.paddingRadius + 16 + 50 / (1 + 6 * link.score),
    strength: Math.min(0.6, 0.08 + 0.35 * link.score) }));
  let seed = 1;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
  forceSimulation(groups).stop().randomSource(random)
    .force("links", forceLink<GroupParticle, typeof springs[number]>(springs).id(group => group.id).distance(link => link.distance).strength(link => link.strength))
    .force("repulsion", forceManyBody<GroupParticle>().strength(-500))
    .force("group-collision", forceCollide<GroupParticle>(group => group.paddingRadius).iterations(5))
    .force("x", forceX<GroupParticle>(0).strength(0.02))
    .force("y", forceY<GroupParticle>(0).strength(0.02)).tick(400);
  const minX = Math.min(...groups.map(group => group.x! - group.paddingRadius)), maxX = Math.max(...groups.map(group => group.x! + group.paddingRadius));
  const minY = Math.min(...groups.map(group => group.y! - group.paddingRadius)), maxY = Math.max(...groups.map(group => group.y! + group.paddingRadius));
  const scale = Math.min(3, (graphWidth - 100) / (maxX - minX), (graphHeight - 100) / (maxY - minY));
  return { scale, clusters: groups.map(group => ({ area: group.id, count: group.count, radius: group.radius * scale,
    x: (group.x! - (minX + maxX) / 2) * scale + graphWidth / 2, y: (group.y! - (minY + maxY) / 2) * scale + graphHeight / 2 })) };
}

/** Springs move subject groups; deterministic local packing keeps each problem in its primary subject. */
export function buildGraph(problems: OpenProblem[], layout: GraphLayout = "spring") {
  const ordered = [...problems].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const visible = new Set(ordered.map(problem => problem.id));
  const seen = new Set<string>();
  const edges: GraphEdge[] = [];
  for (const problem of ordered) for (const relation of problem.relations) {
    if (!visible.has(relation.id) || relation.id === problem.id) continue;
    const key = pairKey(problem.id, relation.id);
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push({ source: problem.id, target: relation.id, note: relation.note });
  }
  const similarityEdges = topicEdges(ordered, seen);
  const groups: GroupParticle[] = Object.keys(areaLabels).flatMap(area => {
    const count = ordered.filter(problem => problem.primary_area === area).length;
    const radius = Math.max(28, 18 + 12 * Math.sqrt(Math.max(0, count - 1)));
    return count ? [{ id: area, count, radius, paddingRadius: Math.max(radius + 28, areaLabels[area].length * 4.2 + 12) }] : [];
  });
  const groupEdges = groupLinks(ordered, groups, edges, similarityEdges);
  const { clusters, scale } = positionGroups(groups, groupEdges, layout);
  const round = (value: number) => Math.round(value * 100) / 100;
  const nodes: GraphNode[] = clusters.flatMap(cluster => {
    const members = ordered.filter(problem => problem.primary_area === cluster.area);
    return members.map((problem, index) => {
      const angle = index * Math.PI * (3 - Math.sqrt(5));
      const radius = members.length < 2 ? 0 : Math.sqrt(index / (members.length - 1)) * (cluster.radius - 18 * scale);
      return { id: problem.id, title: problem.title, area: cluster.area, radius: round(Math.max(3, Math.min(7, 5 * scale))),
        x: round(cluster.x + radius * Math.cos(angle)), y: round(cluster.y + radius * Math.sin(angle)) };
    });
  });
  return { nodes, clusters: clusters.map(cluster => ({ ...cluster, x: round(cluster.x), y: round(cluster.y), radius: round(cluster.radius) })), edges, similarityEdges, groupEdges, layout };
}
