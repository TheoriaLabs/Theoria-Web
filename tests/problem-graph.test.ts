import test from "node:test";
import assert from "node:assert/strict";
import { readSeedCatalog } from "../lib/problem-seed.ts";
import { buildGraph, graphHeight, graphWidth } from "../lib/problem-graph.ts";

const records = await readSeedCatalog();

test("spring layout is finite, bounded, deterministic and does not mutate catalog records", () => {
  const input = records.slice(0, 250);
  const original = JSON.stringify(input);
  const graph = buildGraph(input);
  assert.equal(graph.nodes.length, input.length);
  assert.deepEqual(graph, buildGraph([...input].reverse()));
  assert.equal(JSON.stringify(input), original);
  for (const node of graph.nodes) {
    assert(Number.isFinite(node.x) && Number.isFinite(node.y));
    assert(node.x >= 0 && node.x <= graphWidth && node.y >= 0 && node.y <= graphHeight);
  }
  const recorded = new Set(graph.edges.map(edge => [edge.source, edge.target].sort().join(":")));
  const ids = new Set(input.map(problem => problem.id));
  assert(graph.similarityEdges.length > 0);
  assert(graph.similarityEdges.length <= 4 * input.length);
  for (const edge of graph.similarityEdges) {
    assert(ids.has(edge.source) && ids.has(edge.target));
    assert(!recorded.has([edge.source, edge.target].sort().join(":")));
    assert(edge.note.startsWith("Inferred topic affinity:"));
  }
  assert.equal(buildGraph([]).nodes.length, 0);
  const single = buildGraph([input[0]]);
  assert.equal(single.nodes[0].x, graphWidth / 2);
  assert.equal(single.nodes[0].y, graphHeight / 2);
});

test("shared topic features cluster questions without inventing recorded relationships", () => {
  const examples = ["one", "two", "three"].flatMap(suffix => [
    { ...records[0], id: `chaos-${suffix}`, title: `Scrambling OTOC ${suffix}`, primary_area: "quantum_chaos", tags: ["scrambling", "OTOC", "thermalization"], relations: [] },
    { ...records[0], id: `gauge-${suffix}`, title: `Gluon confinement ${suffix}`, primary_area: "qcd", tags: ["gluons", "confinement", "Yang_Mills"], relations: [] },
  ]);
  const graph = buildGraph(examples);
  assert.equal(graph.edges.length, 0);
  assert(graph.similarityEdges.length > 0);
  const within: number[] = [], between: number[] = [];
  for (let a = 0; a < graph.nodes.length; a++) for (let b = a + 1; b < graph.nodes.length; b++) {
    const x = graph.nodes[a], y = graph.nodes[b];
    (x.area === y.area ? within : between).push(Math.hypot(x.x - y.x, x.y - y.y));
  }
  const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
  assert(mean(within) < mean(between), "Shared topics should be closer on average than unrelated topics");
});

test("both layouts keep dots inside non-overlapping, labelled primary-subject groups", () => {
  const input = records.slice(0, 250);
  const spring = buildGraph(input, "spring"), grid = buildGraph(input, "grid");
  assert.notDeepEqual(spring.clusters.map(group => [group.x, group.y]), grid.clusters.map(group => [group.x, group.y]));
  for (const graph of [spring, grid]) {
    const groups = new Map(graph.clusters.map(group => [group.area, group]));
    assert.equal(groups.size, new Set(input.map(problem => problem.primary_area)).size);
    for (const node of graph.nodes) {
      const group = groups.get(node.area)!;
      assert(Math.hypot(node.x - group.x, node.y - group.y) + node.radius <= group.radius + 0.05, `${graph.layout}: ${node.id} outside ${node.area}`);
    }
    for (let a = 0; a < graph.clusters.length; a++) for (let b = a + 1; b < graph.clusters.length; b++) {
      const x = graph.clusters[a], y = graph.clusters[b];
      assert(Math.hypot(x.x - y.x, x.y - y.y) >= x.radius + y.radius - 0.05, `${graph.layout}: overlapping groups ${x.area}, ${y.area}`);
    }
    for (const edge of graph.groupEdges) {
      assert(groups.has(edge.source) && groups.has(edge.target));
      assert.notEqual(edge.source, edge.target);
    }
    assert(graph.groupEdges.some(edge => edge.recorded > 0));
  }
  const gridNodes = new Map(grid.nodes.map(node => [node.id, node]));
  for (const node of spring.nodes) {
    const a = spring.clusters.find(group => group.area === node.area)!;
    const other = gridNodes.get(node.id)!, b = grid.clusters.find(group => group.area === other.area)!;
    // Only group centers/scale move: local normalized packing is identical in both layouts.
    assert(Math.abs((node.x - a.x) / a.radius - (other.x - b.x) / b.radius) < 0.002);
    assert(Math.abs((node.y - a.y) / a.radius - (other.y - b.y) / b.radius) < 0.002);
  }
});
