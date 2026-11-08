import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { defaultQuery, parseCatalog, parseProblem, parseQuery, queryParams, searchSeed } from "../lib/open-problems.ts";
import { readSeedCatalog } from "../lib/problem-seed.ts";
import { buildGraph } from "../lib/problem-graph.ts";

const records = await readSeedCatalog();
const holds = (await readFile(new URL("../data/open-problems/status-review-holds.jsonl", import.meta.url), "utf8")).trim().split("\n").map(line => JSON.parse(line) as { id: string });

test("the public catalog includes both Riemann-zero questions and excludes review holds", () => {
  assert(records.some(record => record.id === "chaos-hilbert-polya-riemann-zeros"));
  assert(records.some(record => record.id === "chaos-montgomery-riemann-pair-correlation"));
  assert.equal(new Set(records.map(record => record.title.toLowerCase())).size, records.length);
  assert.equal(new Set(records.map(record => record.statement)).size, records.length);
  assert(holds.length > 0);
  const publicIds = new Set(records.map(record => record.id));
  for (const hold of holds) assert(!publicIds.has(hold.id), `${hold.id} must stay withheld`);
  const knownIds = new Set([...publicIds, ...holds.map(hold => hold.id)]);
  for (const record of records) for (const relation of record.relations) assert(knownIds.has(relation.id), `Unknown relation ${record.id} → ${relation.id}`);
});

test("catalog boundary rejects private statuses, duplicate IDs and unsafe sources", () => {
  assert.throws(() => parseProblem({ ...records[0], status: "review_hold" }));
  assert.throws(() => parseProblem({ ...records[0], sources: [{ title: "Invalid", role: "background", url: "javascript:alert(1)" }] }));
  assert.throws(() => parseCatalog([records[0], records[0]].map(record => JSON.stringify(record)).join("\n")), /Duplicate/);
});

test("query parsing bounds input and round-trips shareable filters", () => {
  const query = parseQuery(new URLSearchParams("q=Riemann+zeros&area=quantum_chaos&kind=conjecture&sort=newest&page=2"));
  assert.deepEqual(parseQuery(queryParams(query)), query);
  for (const input of ["q=" + "x".repeat(201), "area=__proto__", "kind=constructor", "sort=invalid", "page=-1", "page=1.2", "page=501", "view=3d", "layout=invalid"]) assert.throws(() => parseQuery(new URLSearchParams(input)), input);
  assert.equal(parseQuery(new URLSearchParams("page=4&view=graph")).page, 1);
  const grid = parseQuery(new URLSearchParams("area=qcd&area=quantum_field_theory&view=graph&layout=grid"));
  assert.equal(grid.layout, "grid");
  assert.deepEqual(parseQuery(queryParams(grid)), grid);
});

test("seed search combines filters, searches targets, orders and paginates without overlap", () => {
  const riemann = searchSeed(records, { ...defaultQuery, q: "Riemann zeros", area: ["quantum_chaos"] });
  assert(riemann.items.some(record => record.id === "chaos-hilbert-polya-riemann-zeros"));
  assert(riemann.items.every(record => record.primary_area === "quantum_chaos"));
  const conjectures = searchSeed(records, { ...defaultQuery, area: ["quantum_chaos"], kind: ["conjecture"] });
  assert(conjectures.total > 0);
  assert(conjectures.items.every(record => record.kind === "conjecture"));
  const first = searchSeed(records, { ...defaultQuery, sort: "title" });
  const second = searchSeed(records, { ...defaultQuery, sort: "title", page: 2 });
  assert(first.items.length > 0 && second.items.length > 0);
  assert(first.items.every(record => !second.items.some(other => other.id === record.id)));
  assert.equal(first.total, records.length);
  assert.equal(searchSeed(records, { ...defaultQuery, q: "xyz-no-matching-problem-987" }).total, 0);
  assert.equal(searchSeed(records, { ...defaultQuery, page: 500 }).items.length, 0);
});

test("graph is deterministic and only connects visible recorded relationships", () => {
  const visible = records.filter(record => record.primary_area === "quantum_chaos");
  const graph = buildGraph(visible);
  assert.deepEqual(graph, buildGraph(visible));
  assert.equal(graph.nodes.length, visible.length);
  assert(graph.edges.length > 0);
  const ids = new Set(visible.map(record => record.id));
  const seen = new Set<string>();
  for (const edge of graph.edges) {
    assert(ids.has(edge.source) && ids.has(edge.target));
    const key = [edge.source, edge.target].sort().join(":");
    assert(!seen.has(key)); seen.add(key);
    assert(visible.some(record => record.id === edge.source && record.relations.some(relation => relation.id === edge.target)));
  }
  assert.equal(buildGraph([]).nodes.length, 0);
});

test("Yang–Mills appears in both QFT and QCD without duplicating its record", () => {
  const id = "qft-yang-mills-existence-mass-gap";
  for (const area of ["qcd", "quantum_field_theory"]) {
    const result = searchSeed(records, { ...defaultQuery, area: [area], q: "Yang Mills" });
    assert.equal(result.items.filter(record => record.id === id).length, 1);
  }
  assert.equal(records.filter(record => record.id === id).length, 1);
  assert.throws(() => parseProblem({ ...records[0], secondary_areas: ["not-a-subject"] }));
  assert.throws(() => parseProblem({ ...records[0], secondary_areas: [records[0].primary_area] }));
});

test("multi-select query links normalize repeated/comma-separated values and validate every value", () => {
  const query = parseQuery(new URLSearchParams("area=quantum_field_theory,qcd&area=qcd&kind=conjecture&kind=construction_problem&review=editorial&review=imported"));
  assert.deepEqual(query.area, ["qcd", "quantum_field_theory"]);
  assert.deepEqual(query.kind, ["conjecture", "construction_problem"]);
  assert.deepEqual(query.review, ["editorial", "imported"]);
  assert.deepEqual(parseQuery(queryParams(query)), query);
  assert.deepEqual(queryParams(query).getAll("area"), ["qcd", "quantum_field_theory"]);
  assert.deepEqual(parseQuery(new URLSearchParams("area=&kind=&review=")).area, []);
  for (const input of ["area=qcd&area=invalid", "kind=conjecture,bad", "review=editorial&review=__proto__"]) assert.throws(() => parseQuery(new URLSearchParams(input)));
});

test("multi-select uses OR within each field, AND across fields and counts cross-listed problems once", () => {
  const result = searchSeed(records, { ...defaultQuery, area: ["qcd", "quantum_field_theory"], kind: ["conjecture", "construction_problem"], review: ["editorial"], view: "graph" });
  const ids = result.items.map(record => record.id);
  assert(ids.includes("qft-yang-mills-existence-mass-gap"));
  assert(ids.includes("qcd-wilson-area-law-weak-coupling"));
  assert(ids.includes("qft-six-dimensional-2-0-construction"));
  assert(!ids.includes("qcd-su3-conformal-window")); // An open question, not a selected type.
  assert(!ids.includes("chaos-bgs-universality")); // A conjecture outside the selected subjects.
  assert(result.items.every(record => record.review_level !== "source_import"));
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(searchSeed(records, { ...defaultQuery, review: ["editorial", "imported"] }).total, records.length);
  assert.equal(searchSeed(records, { ...defaultQuery, review: [] }).total, records.length);
});
