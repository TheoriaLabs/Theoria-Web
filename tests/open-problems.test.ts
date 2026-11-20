import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { areaDomain, defaultQuery, parseCatalog, parseProblem, parseQuery, problemDomain, queryParams, searchSeed } from "../lib/open-problems.ts";
import { readSeedCatalog } from "../lib/problem-seed.ts";
import { buildGraph } from "../lib/problem-graph.ts";

const records = await readSeedCatalog();
const physics = records.filter(record => problemDomain(record) === "theoretical_physics");
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
  assert.equal(first.total, physics.length);
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
  assert.equal(searchSeed(records, { ...defaultQuery, review: ["editorial", "imported"] }).total, physics.length);
  assert.equal(searchSeed(records, { ...defaultQuery, review: [] }).total, physics.length);
});

test("finance URLs round-trip and domains isolate records, subject counts and graph results", () => {
  const query = parseQuery(new URLSearchParams("domain=quantitative_finance&area=volatility_models&sort=newest"));
  assert.deepEqual(parseQuery(queryParams(query)), query);
  assert.equal(queryParams(defaultQuery).has("domain"), false);
  for (const input of ["domain=__proto__", "domain=unknown", "domain=quantitative_finance&area=qcd", "area=volatility_models"]) assert.throws(() => parseQuery(new URLSearchParams(input)));
  const finance = searchSeed(records, { ...defaultQuery, domain: "quantitative_finance", view: "graph" });
  assert.equal(finance.total, 9);
  assert.equal(finance.total_all, 9);
  assert(finance.items.every(record => record.domain === "quantitative_finance"));
  assert(finance.areas.every(area => areaDomain(area.value) === "quantitative_finance"));
  assert.equal(finance.areas.find(area => area.value === "stochastic_control")?.count, 3);
  const graph = buildGraph(finance.items);
  assert.equal(graph.nodes.length, 9);
  assert(graph.edges.length > 0);
  const volatility = searchSeed(records, query);
  assert.equal(volatility.total, 2);
  assert.equal(volatility.total_all, 9);
  const microstructure = searchSeed(records, { ...defaultQuery, domain: "quantitative_finance", area: ["market_microstructure"] });
  assert.equal(microstructure.total, 2);
  const program = searchSeed(records, { ...defaultQuery, domain: "quantitative_finance", q: "long memory" });
  assert.equal(program.items[0].id, "qf-endogenous-efficiency-long-memory-order-flow");
  assert.equal(searchSeed(records, { ...defaultQuery, q: "Heston" }).total, 0);
  assert.equal(searchSeed(records, { ...defaultQuery, domain: "quantitative_finance", q: "Riemann" }).total, 0);
  assert.equal(searchSeed(records, defaultQuery).total_all, physics.length);
  const [entry] = finance.items;
  assert.throws(() => parseProblem({ ...entry, domain: undefined }));
  assert.throws(() => parseProblem({ ...entry, domain: "ai_ml" }));
  assert.throws(() => parseProblem({ ...entry, secondary_areas: ["qcd"] }));
});

test("AI/ML domain isolates subjects and searches both primary and secondary areas", () => {
  const query = parseQuery(new URLSearchParams("domain=ai_ml&view=graph"));
  const all = searchSeed(records, query);
  assert.equal(all.total, 119);
  assert.equal(all.total_all, 119);
  assert(all.items.every(record => record.domain === "ai_ml"));
  assert(all.areas.every(area => areaDomain(area.value) === "ai_ml"));
  assert.deepEqual(parseQuery(queryParams(query)), query);
  for (const area of ["rl_post_training", "learning_theory"]) {
    const result = searchSeed(records, { ...query, area: [area], q: "adaptive GRPO" });
    assert(result.items.some(record => record.id === "aiml-adaptive-grpo-rollout-allocation"));
  }
  assert.equal(searchSeed(records, { ...defaultQuery, q: "GRPO" }).total, 0);
  assert.equal(searchSeed(records, { ...query, q: "Riemann zeros" }).total, 0);
  const transformers = searchSeed(records, { ...query, area: ["transformer_theory"] });
  assert.equal(transformers.total, 12);
  assert(transformers.items.some(record => record.id === "aiml-nonlinear-grokking"));
  const safety = searchSeed(records, { ...query, area: ["alignment"] });
  assert.equal(safety.total, 18);
  assert(safety.items.some(record => record.id === "aiml-agent-information-flow"));
  assert(safety.items.some(record => record.id === "aiml-private-pac-sample-complexity"));
  assert.equal(searchSeed(records, { ...query, area: ["generative_models"] }).items[0].id, "aiml-finite-data-diffusion-learning");
  for (const [area, term, id] of [
    ["random_matrix_theory", "RMT", "trained-weight-spectral-laws"],
    ["optimization_theory", "Adafactor", "adafactor-memory-accuracy"],
    ["neural_memory", "capacity", "neural-knowledge-capacity"],
    ["kernel_learning", "kernel", "adaptive-kernel-learning"],
    ["statistical_inference", "Ising", "ising-from-sparse-observations"],
    ["information_retrieval", "ranking", "ranking-from-feedback"],
    ["world_models", "JEPA", "jepa-control-sufficiency"],
    ["recurrent_learning", "RNN", "rnn-long-horizon-trainability"],
    ["bayesian_learning", "posterior", "bayesian-predictive-reliability"],
    ["data_efficient_learning", "labels", "active-representation-learning"],
    ["reinforcement_learning", "offline", "offline-rl-structural-frontier"],
    ["inverse_rl", "reward", "reward-identification-from-behavior"],
    ["control_robotics", "stability", "robot-controller-certificates"],
    ["neural_architectures", "shallow", "shallow-max-encoding-complexity"],
    ["multi_agent_systems", "hidden states", "latent-agent-communication"],
    ["time_series_learning", "long memory", "learned-long-memory-states"],
    ["tabular_learning", "MotherNet", "compiled-tabular-predictors"],
    ["verification_and_search", "AB-MCTS", "adaptive-branching-search-complexity"],
    ["multi_agent_systems", "AB-MCTS", "cost-aware-multi-model-search"],
    ["privacy_preserving_learning", "homomorphic", "encrypted-neural-training"],
    ["privacy_preserving_learning", "DP-LoRA", "private-adapter-rank-allocation"],
    ["alignment", "jailbreak", "jailbreak-certification-cost"],
    ["neural_architectures", "KAN", "kan-compositional-learning"],
    ["symbolic_regression", "PDE", "coarse-observation-pde-discovery"],
    ["symbolic_regression", "manifold", "manifold-symbolic-dynamics"],
    ["learning_theory", "logistic", "online-logistic-computation-gap"],
    ["kernel_learning", "NTK", "ntk-classification-validity-time"],
    ["learning_dynamics", "Kaplan Chinchilla", "kaplan-chinchilla-exponent-reconciliation"],
  ]) {
    const selected = parseQuery(new URLSearchParams({ domain: "ai_ml", area, q: term, view: "graph" }));
    assert.deepEqual(parseQuery(queryParams(selected)), selected);
    assert(searchSeed(records, selected).items.some(record => record.id === `aiml-${id}`));
    assert.throws(() => parseQuery(new URLSearchParams({ domain: "theoretical_physics", area })));
  }
  assert.equal(searchSeed(records, { ...query, q: "Joint allocation of rollout, update and verification compute" }).items[0].title, "Compute-Optimal Reinforcement Learning");
  for (const input of ["domain=ai_ml&area=qcd", "domain=quantitative_finance&area=rl_post_training", "area=learning_theory", "domain=theoretical_physics&area=transformer_theory", "domain=quantitative_finance&area=alignment"])
    assert.throws(() => parseQuery(new URLSearchParams(input)));
  assert.throws(() => parseProblem({ ...all.items[0], secondary_areas: ["qcd"] }));
  const graph = buildGraph(all.items);
  assert.equal(graph.nodes.length, 119);
  assert(graph.edges.length > 0);
});
