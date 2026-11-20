import { test, expect, type Page } from "@playwright/test";

async function selectFilter(page: Page, name: string, choices: string[]) {
  await page.getByRole("button", { name, exact: true }).click();
  const panel = page.getByRole("group", { name: `${name} options`, exact: true });
  await panel.getByRole("button", { name: "Clear selection" }).click();
  for (const choice of choices) await panel.getByRole("checkbox", { name: choice, exact: true }).check();
  await panel.getByRole("button", { name: "Done", exact: true }).click();
}

test("navigation, filtering, pagination and Riemann detail work without overflow", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Open Problems" }).click();
  await expect(page).toHaveURL(/\/open-problems$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Open problems");
  await expect(page.getByRole("searchbox")).toHaveAttribute("placeholder", "Search Yang-Mills, quantum chaos, Ising model");
  expect(await page.locator(".skip-link").evaluate(link => ({ bottom: link.getBoundingClientRect().bottom, focused: document.activeElement === link, position: getComputedStyle(link).position, transform: getComputedStyle(link).transform }))).toMatchObject({ focused: false, position: "fixed" });
  expect(await page.locator(".skip-link").evaluate(link => link.getBoundingClientRect().bottom)).toBeLessThan(0);
  await expect(page.locator(".problem-card")).toHaveCount(12);
  await page.getByRole("button", { name: "Next →", exact: true }).click();
  await expect(page.locator(".problem-pagination")).toContainText("Page 2");
  await expect(page).toHaveURL(/page=2/);
  await page.getByRole("button", { name: "Quantum chaos ↗", exact: true }).click();
  await expect(page.getByRole("button", { name: "Subject", exact: true })).toContainText("Quantum chaos");
  await expect(page.locator(".problem-results")).toHaveAttribute("aria-busy", "false");
  await expect(page.locator(".problem-card-meta").first()).toContainText("Quantum chaos");
  await selectFilter(page, "Review level", ["Editorially scoped"]);
  await selectFilter(page, "Problem type", ["Construction problem"]);
  await expect(page.locator(".problem-card")).toHaveCount(1);
  await page.getByLabel("Sort problems").selectOption("newest");
  await expect(page).toHaveURL(/sort=newest/);
  await page.getByRole("button", { name: "Riemann zeros ↗", exact: true }).click();
  await expect(page.getByRole("link", { name: "Hilbert–Pólya: a quantum operator for the Riemann zeros", exact: true })).toBeVisible();
  await expect(page.locator(".problem-results")).toHaveAttribute("aria-busy", "false");
  await page.reload();
  await expect(page.getByRole("searchbox")).toHaveValue("Riemann");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("catalog.png"), fullPage: true });
  await page.getByRole("link", { name: "Hilbert–Pólya: a quantum operator for the Riemann zeros", exact: true }).click();
  await expect(page).toHaveURL(/\/open-problems\/chaos-hilbert-polya-riemann-zeros$/);
  await expect(page.getByRole("heading", { name: "What would settle it?" })).toBeVisible();
  await expect(page.locator(".problem-sources a").first()).toHaveAttribute("href", /^https:\/\//);
  await expect(page.locator(".problem-related")).toContainText("GUE pair correlation");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("problem-detail.png"), fullPage: true });
  await page.goBack();
  await expect(page.getByRole("searchbox")).toHaveValue("Riemann");
  expect(errors).toEqual([]);
});

test("graph selection, zoom and the keyboard-equivalent picker", async ({ page }, testInfo) => {
  await page.goto("/open-problems?area=quantum_chaos&view=graph");
  await expect(page.getByRole("group", { name: "2D open-problem relationship graph" })).toBeVisible();
  await expect(page.locator(".problem-map-toolbar")).toContainText("spring layout");
  await expect(page.locator(".problem-subject-label")).toHaveText(["Quantum chaos"]);
  expect(await page.locator("[data-topic-link]").count()).toBeGreaterThan(0);
  const recordedLinks = await page.locator("[data-recorded-link]").count();
  await page.getByRole("checkbox", { name: "Show topic similarity" }).uncheck();
  await expect(page.locator("[data-topic-link]")).toHaveCount(0);
  await expect(page.locator("[data-recorded-link]")).toHaveCount(recordedLinks);
  await page.getByRole("checkbox", { name: "Show topic similarity" }).check();
  await page.getByLabel("Explore a problem").selectOption("chaos-hilbert-polya-riemann-zeros");
  const selection = page.getByRole("complementary", { name: "Selected graph problem" });
  await expect(selection.getByRole("heading")).toContainText("Hilbert–Pólya");
  await expect(selection.getByRole("link", { name: /Read statement/ })).toHaveAttribute("href", "/open-problems/chaos-hilbert-polya-riemann-zeros");
  const transform = await page.locator(".problem-map-svg > g").getAttribute("transform");
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  expect(await page.locator(".problem-map-svg > g").getAttribute("transform")).not.toBe(transform);
  await page.getByRole("button", { name: "Reset view", exact: true }).click();
  await expect(page.locator(".problem-map-svg > g")).toHaveAttribute("transform", transform!);
  const node = page.locator('[data-node="chaos-montgomery-riemann-pair-correlation"]');
  await node.focus(); await node.press("Enter");
  await expect(selection.getByRole("heading")).toContainText("GUE pair correlation");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("graph.png"), fullPage: true });
  await page.goto("/open-problems?view=graph");
  await expect(page.locator("[data-node]")).toHaveCount(250);
  await expect(page.locator(".problem-results")).toContainText("Showing the first 250");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator(".problem-graph-layout").screenshot({ path: testInfo.outputPath("graph-all.png") });
  const labels = await page.locator(".problem-subject-label").allTextContents();
  expect(labels.length).toBeGreaterThan(10);
  const oldX = await page.locator("[data-subject-group] circle").first().getAttribute("cx");
  await page.getByLabel("Explore a problem").selectOption("qft-yang-mills-existence-mass-gap");
  await page.getByRole("button", { name: "Grid", exact: true }).click();
  await expect(page.getByRole("button", { name: "Grid", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/layout=grid/);
  await expect(page.locator("[data-subject-group] circle").first()).not.toHaveAttribute("cx", oldX!);
  await expect(page.getByLabel("Explore a problem")).toHaveValue("qft-yang-mills-existence-mass-gap");
  await expect(page.locator(".problem-subject-label")).toHaveText(labels);
  await page.locator(".problem-graph-layout").screenshot({ path: testInfo.outputPath("graph-grid.png") });
  await page.reload();
  await expect(page.getByRole("button", { name: "Grid", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Spring groups", exact: true }).click();
  await expect(page.getByRole("button", { name: "Spring groups", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page).not.toHaveURL(/layout=grid/);
});

test("empty results, API errors and retry stay usable", async ({ page }) => {
  await page.goto("/open-problems");
  await page.getByRole("searchbox").fill("xyz-no-matching-problem-987");
  await expect(page.getByRole("heading", { name: "No problems found" })).toBeVisible();
  await page.route("**/api/open-problems?*", route => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Temporary test outage" }) }));
  await page.getByRole("button", { name: "Show all problems" }).click();
  await expect(page.locator(".problem-results").getByRole("alert")).toContainText("Temporary test outage");
  await page.unroute("**/api/open-problems?*");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.locator(".problem-card")).toHaveCount(12);
});

test("API validates input, withholds review records and redirects old spelling", async ({ request }) => {
  const qcd = await (await request.get("/api/open-problems?area=qcd&q=Yang+Mills")).json();
  expect(qcd.items.filter((item: { id: string }) => item.id === "qft-yang-mills-existence-mass-gap")).toHaveLength(1);
  const result = await request.get("/api/open-problems?area=quantum_chaos&q=Riemann");
  expect(result.status()).toBe(200);
  const body = await result.json();
  expect(body.items.some((item: { id: string }) => item.id === "chaos-hilbert-polya-riemann-zeros")).toBe(true);
  expect((await request.get("/api/open-problems?area=invalid")).status()).toBe(400);
  expect((await request.get("/open-problems/cm-neel-order-square-spin-half")).status()).toBe(404);
  expect((await request.get("/open-problems/pubphys-mathph-quantum-spin-gaps-neel-spin-half")).status()).toBe(404);
  expect((await request.get("/open-problems/pubphys-qi-hamiltonian-complexity-area-law-2d")).status()).toBe(404);
  expect((await request.get("/open-problems/pubphys-qi-quantum-thermo-clock-precision-entropy")).status()).toBe(404);
  expect((await request.get("/open-problems/pubphys-qi-causal-order-qrf-causal-inequality-realization")).status()).toBe(404);
  for (const id of ["pubphys-grav-evaporation-backreaction-black-to-white", "pubphys-qi-measurement-problem-psi-epistemic-overlap", "pubphys-qi-causal-order-qrf-qrf-general-frames", "pubphys-qi-quantum-principles-higher-order-gpt", "pubphys-qi-quantum-principles-quantum-set-principle"]) expect((await request.get(`/open-problems/${id}`)).status()).toBe(404);
  expect((await request.get("/open-problems/does-not-exist")).status()).toBe(404);
  const old = await request.get("/open_problems?area=quantum_chaos", { maxRedirects: 0 });
  expect(old.status()).toBe(308);
  expect(old.headers().location).toBe("/open-problems?area=quantum_chaos");
});

test("expanded imports have review filters, attribution and typeset mathematics", async ({ page, request }) => {
  const response = await request.get("/api/open-problems?review=imported");
  const data = await response.json();
  expect(data.total).toBeGreaterThan(200);
  await page.goto("/open-problems?review=imported");
  await expect(page.getByRole("button", { name: "Review level", exact: true })).toContainText("Source imported");
  await expect(page.locator(".problem-review-label").first()).toHaveText("Source imported");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/open-problems/pubphys-mathph-anderson-delocalization-2d-localization");
  await expect(page.getByRole("heading", { name: "Source and attribution" })).toBeVisible();
  await expect(page.locator(".problem-detail-badges")).toContainText("Source imported");
  await expect(page.locator(".problem-statement .katex").first()).toBeVisible();
  await expect(page.locator(".problem-statement .katex-error")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("multiple selections survive reload, narrow together and clear per filter", async ({ page, request }) => {
  await page.goto("/open-problems?page=2");
  await selectFilter(page, "Subject", ["QCD", "Quantum field theory"]);
  await selectFilter(page, "Problem type", ["Conjecture", "Construction problem"]);
  await selectFilter(page, "Review level", ["Editorially scoped", "Source imported"]);
  await expect(page.locator(".problem-results")).toHaveAttribute("aria-busy", "false");
  const params = new URL(page.url()).searchParams;
  expect(params.getAll("area")).toEqual(["qcd", "quantum_field_theory"]);
  expect(params.getAll("kind")).toEqual(["conjecture", "construction_problem"]);
  expect(params.getAll("review")).toEqual(["editorial", "imported"]);
  expect(params.has("page")).toBe(false);
  const result = await (await request.get(`/api/open-problems?${params}`)).json();
  expect(result.items.every((item: { kind: string; primary_area: string; secondary_areas?: string[] }) => ["conjecture", "construction_problem"].includes(item.kind) && [item.primary_area, ...item.secondary_areas ?? []].some(area => ["qcd", "quantum_field_theory"].includes(area)))).toBe(true);
  expect(result.items.filter((item: { id: string }) => item.id === "qft-yang-mills-existence-mass-gap")).toHaveLength(1);
  await page.reload();
  for (const name of ["Subject", "Problem type", "Review level"]) await expect(page.getByRole("button", { name, exact: true })).toContainText("2 selected");
  await page.getByRole("button", { name: "Subject", exact: true }).click();
  const panel = page.getByRole("group", { name: "Subject options", exact: true });
  await expect(panel.getByRole("checkbox", { name: "QCD", exact: true })).toBeChecked();
  await expect(panel.getByRole("checkbox", { name: "Quantum field theory", exact: true })).toBeChecked();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await panel.getByRole("button", { name: "Clear selection" }).click();
  await panel.getByRole("button", { name: "Done" }).click();
  await expect(page.getByRole("button", { name: "Subject", exact: true })).toContainText("All subjects");
  await expect(page.getByRole("button", { name: "Problem type", exact: true })).toContainText("2 selected");
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.getByRole("button", { name: "Review level", exact: true })).toContainText("All entries");
  await expect(page).toHaveURL(/\/open-problems$/);
});

test("multi-select works with keyboard and closes on Escape or outside click", async ({ page }) => {
  await page.goto("/open-problems");
  const trigger = page.getByRole("button", { name: "Problem type", exact: true });
  await trigger.focus(); await trigger.press("Enter");
  const panel = page.getByRole("group", { name: "Problem type options", exact: true });
  const first = panel.getByRole("checkbox", { name: "Conjecture", exact: true });
  await page.keyboard.press("Tab"); await expect(first).toBeFocused();
  await page.keyboard.press("Space"); await expect(first).toBeChecked();
  await page.keyboard.press("Tab"); await page.keyboard.press("Space");
  await expect(panel.getByRole("checkbox", { name: "Open question", exact: true })).toBeChecked();
  await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click(); await page.getByRole("heading", { level: 1 }).click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("source directory and independent expert statements are accessible", async ({ page }) => {
  await page.goto("/open-problems");
  await page.getByRole("link", { name: "Sources & methodology ↗" }).click();
  await expect(page).toHaveURL(/\/open-problems\/sources$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Independent sources.");
  await expect(page.getByRole("link", { name: /IQOQI Vienna/ })).toHaveAttribute("href", "https://oqp.iqoqi.oeaw.ac.at/open-quantum-problems");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/open-problems/quantum-gibbs-preserving-map-resource-cost");
  await expect(page.locator(".problem-sources")).toContainText("IQOQI Problem 46");
  await expect(page.locator(".problem-sources")).toContainText("Accounting for coherence and work resources");
});

test("Wang additions and mapped source occurrences are searchable with provenance", async ({ page, request }) => {
  const data = await (await request.get("/api/open-problems?q=SIGW&review=editorial")).json();
  expect(data.items.some((item: { id: string }) => item.id === "cosmology-sigw-spatial-curvature-correction")).toBe(true);
  await page.goto("/open-problems/cosmology-sigw-spatial-curvature-correction");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("spatial-curvature");
  await expect(page.locator(".problem-sources a").first()).toHaveAttribute("href", /wangshaojiang.*#op2026-problem-18$/);
  await expect(page.locator(".problem-sources")).toContainText("AI-assisted");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/open-problems/quantum-sic-all-dimensions");
  await expect(page.locator('.problem-sources a[href$="#op2026-problem-69"]')).toHaveCount(1);
  await page.goto("/open-problems/sources");
  await expect(page.getByRole("link", { name: /Shao-Jiang Wang/ })).toBeVisible();
});

test("selected Prove2Me targets are searchable, cross-listed and render precise mathematical scopes", async ({ page, request }) => {
  const thomson = await (await request.get("/api/open-problems?q=Thomson&area=mathematical_physics&review=editorial")).json();
  expect(thomson.items.map((item: { id: string }) => item.id).sort()).toEqual([
    "mathphys-thomson-nine-global-optimality", "mathphys-thomson-ten-global-optimality", "mathphys-thomson-thirty-two-global-optimality",
  ]);
  const ids = [...thomson.items.map((item: { id: string }) => item.id), "mathphys-pcr3bp-retrograde-global-section", "stat-ballistic-deposition-kpz-variance"];
  for (const id of ids) {
    await page.goto(`/open-problems/${id}`);
    await expect(page.locator(".problem-statement .katex").first()).toBeVisible();
    await expect(page.locator(".katex-error")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Assumptions and scope" })).toBeVisible();
    await expect(page.locator(".problem-sources a").first()).toHaveAttribute("href", /^https:\/\/prove2\.me\/missions\//);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  for (const area of ["mathematical_physics", "statistical_physics"]) {
    const result = await (await request.get(`/api/open-problems?q=ballistic+deposition&area=${area}`)).json();
    expect(result.total).toBe(1);
    expect(result.items[0].id).toBe("stat-ballistic-deposition-kpz-variance");
  }
  await page.goto("/open-problems/sources");
  await expect(page.getByRole("link", { name: /Prove2Me — selected mathematical-physics goals/ })).toBeVisible();
});

test("finance domain, sources, filters and graph work across reload and keyboard navigation", async ({ page, request }, testInfo) => {
  await page.goto("/open-problems?area=qcd&page=2");
  const financeTab = page.getByRole("tab", { name: "Quantitative Finance", exact: true });
  await financeTab.click();
  await expect(financeTab).toHaveAttribute("aria-selected", "true");
  await expect(page).toHaveURL(/\/open-problems\?domain=quantitative_finance$/);
  await expect(page.locator(".problem-card")).toHaveCount(9);
  await expect(page.locator(".problems-intro-stat strong")).toHaveText("9");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("quantitative finance");
  await expect(page.getByRole("tab", { name: /Foundations of AI/ })).toBeEnabled();
  await page.getByRole("button", { name: "Volatility models ↗", exact: true }).click();
  await expect(page.locator(".problem-card")).toHaveCount(2);
  await page.reload();
  await expect(financeTab).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Subject", exact: true }).click();
  const subjects = page.getByRole("group", { name: "Subject options", exact: true });
  await expect(subjects.getByRole("checkbox", { name: "Volatility models", exact: true })).toBeChecked();
  await expect(subjects.getByRole("checkbox", { name: "QCD", exact: true })).toHaveCount(0);
  await subjects.getByRole("button", { name: "Done", exact: true }).click();
  await page.getByRole("link", { name: "Pathwise uniqueness for rough Heston volatility", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Assumptions and scope" })).toBeVisible();
  await expect(page.locator(".problem-statement .katex").first()).toBeVisible();
  await expect(page.locator(".katex-error")).toHaveCount(0);
  await expect(page.locator(".problem-sources")).toContainText("withdrawn");
  await expect(page.locator(".problem-sources a").first()).toHaveAttribute("href", "https://doi.org/10.1214/19-AAP1477");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("finance-detail.png"), fullPage: true });
  await page.getByRole("link", { name: "← All quantitative finance open problems", exact: true }).click();
  await expect(page.locator(".problem-card")).toHaveCount(9);
  await page.getByRole("searchbox").fill("xyz-no-matching-problem-987");
  await expect(page.getByRole("heading", { name: "No problems found" })).toBeVisible();
  await page.getByRole("button", { name: "Show all problems" }).click();
  await expect(page.locator(".problem-card")).toHaveCount(9);
  await page.getByRole("button", { name: "Stochastic control ↗", exact: true }).click();
  await expect(page.locator(".problem-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  await expect(page.locator(".problem-card")).toHaveCount(9);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("finance-catalog.png"), fullPage: true });
  await page.getByRole("link", { name: "Endogenous Market Efficiency Under Long-Memory Order Flow", exact: true }).click();
  await expect(page.locator(".problem-detail-badges")).toContainText("Framework needs definition");
  await expect(page.locator(".problem-statement")).toContainText("Research program");
  await expect(page.locator(".problem-statement .katex").first()).toBeVisible();
  await expect(page.locator(".katex-error")).toHaveCount(0);
  await expect(page.locator(".problem-proof-target")).toContainText("First milestone (known mathematics)");
  await expect(page.locator(".problem-proof-target")).toContainText("T5");
  await expect(page.locator(".problem-sources a")).toHaveCount(5);
  await expect(page.locator('.problem-sources a[href="https://arxiv.org/abs/2502.17906v5"]')).toBeVisible();
  await expect(page.locator(".problem-related")).toContainText("Nonlinear market impact");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("long-memory-research-target.png"), fullPage: true });
  await page.getByRole("link", { name: "← All quantitative finance open problems", exact: true }).click();
  await page.getByRole("button", { name: "2D graph", exact: true }).click();
  await expect(page.locator("[data-node]")).toHaveCount(9);
  await page.getByLabel("Explore a problem").selectOption("qf-epstein-zin-incomplete-markets");
  await expect(page.getByRole("complementary", { name: "Selected graph problem" })).toContainText("Epstein–Zin");
  await expect(page.locator(".problem-results")).toHaveAttribute("aria-busy", "false");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("finance-graph.png"), fullPage: true });
  await financeTab.focus(); await financeTab.press("ArrowRight");
  const physicsTab = page.getByRole("tab", { name: "Theoretical Physics", exact: true });
  await expect(physicsTab).toBeFocused();
  await expect(physicsTab).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("[data-node]")).toHaveCount(250);
  await physicsTab.press("End");
  await expect(financeTab).toBeFocused();
  await expect(page.locator("[data-node]")).toHaveCount(9);
  const response = await request.get("/api/open-problems?domain=quantitative_finance");
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.total).toBe(9);
  expect(data.items.every((item: { domain: string }) => item.domain === "quantitative_finance")).toBe(true);
  for (const query of ["domain=unknown", "domain=quantitative_finance&area=qcd"]) expect((await request.get(`/api/open-problems?${query}`)).status()).toBe(400);
});

test("AI/ML challenges support transformer filters, legacy-title search and scoped COLT details", async ({ page, request }, testInfo) => {
  await page.goto("/open-problems?domain=ai_ml");
  const aiTab = page.getByRole("tab", { name: "Foundations of AI/ML", exact: true });
  await expect(aiTab).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".problems-intro-stat strong")).toHaveText("119");
  await page.getByRole("button", { name: "Subject", exact: true }).click();
  const subjects = page.getByRole("group", { name: "Subject options", exact: true });
  await subjects.getByRole("checkbox", { name: "Transformer theory", exact: true }).check();
  await subjects.getByRole("button", { name: "Done", exact: true }).click();
  // Both unfiltered and filtered first pages can contain 12 cards; wait for navigation, not that count.
  await expect(page).toHaveURL(/area=transformer_theory/);
  await expect(page.locator(".problem-card")).toHaveCount(12);
  await page.reload();
  await expect(page.getByRole("link", { name: "Why Transformers Generalize to Longer Sequences", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Why Neural Networks Grok", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("transformer-challenges.png"), fullPage: true });
  await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  await page.getByRole("searchbox").fill("Joint allocation of rollout, update and verification compute");
  await page.getByRole("link", { name: "Compute-Optimal Reinforcement Learning", exact: true }).click();
  await expect(page.locator(".problem-statement .katex").first()).toBeVisible();
  await expect(page.locator(".katex-error")).toHaveCount(0);
  await page.goto("/open-problems/aiml-distribution-independent-deep-learning");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Deep Learning Beyond Linear Models");
  await expect(page.locator(".problem-detail")).toContainText("negatively resolves");
  await expect(page.locator('.problem-sources a[href="https://arxiv.org/abs/2609.19780v1"]')).toBeVisible();
  await expect(page.locator(".katex-error")).toHaveCount(0);
  for (const id of ["tensor-overparameterization", "private-pac-sample-complexity", "linear-sample-compression", "optimal-regression-data-selection"]) {
    await page.goto(`/open-problems/aiml-${id}`);
    await expect(page.locator(".problem-statement .katex").first()).toBeVisible();
    await expect(page.locator(".katex-error")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.goto("/open-problems?domain=ai_ml&view=graph");
  await expect(page.locator("[data-node]")).toHaveCount(119);
  await page.getByLabel("Explore a problem").selectOption("aiml-transformer-graph-search");
  await expect(page.getByRole("complementary", { name: "Selected graph problem" })).toContainText("Can Transformers Learn to Search?");
  await aiTab.focus(); await aiTab.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Quantitative Finance", exact: true })).toBeFocused();
  await expect(page.locator("[data-node]")).toHaveCount(9);
  const response = await request.get("/api/open-problems?domain=ai_ml&area=alignment");
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.total_all).toBe(119);
  expect(data.total).toBe(18);
  await page.goto("/open-problems?domain=ai_ml&view=graph");
  await page.getByRole("button", { name: "Subject", exact: true }).click();
  await subjects.getByRole("checkbox", { name: "AI safety & alignment", exact: true }).check();
  await subjects.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.locator("[data-node]")).toHaveCount(18);
  await page.reload();
  await expect(page.locator("[data-node]")).toHaveCount(18);
  await page.getByLabel("Explore a problem").selectOption("aiml-untrusted-agent-control");
  await expect(page.getByRole("complementary", { name: "Selected graph problem" })).toContainText("Controlling an Untrusted AI");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("ai-safety-challenges.png"), fullPage: true });
  await page.goto("/open-problems/aiml-agent-information-flow");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Can Agents Resist Prompt Injection?");
  await expect(page.locator(".problem-detail")).toContainText("termination-insensitive");
  await expect(page.locator('.problem-sources a[href="https://arxiv.org/abs/2602.20064v2"]')).toBeVisible();
  await page.goto("/open-problems?domain=ai_ml");
  await page.getByRole("button", { name: "Subject", exact: true }).click();
  for (const name of ["RMT & weight spectra", "Optimization & optimizers", "Memory & capacity", "Kernel learning", "Statistical inference", "Information retrieval", "JEPA & world models", "RNNs & sequence learning", "Bayesian learning", "Data-efficient learning", "RL foundations", "Inverse RL & imitation", "Control & robotics"])
    await expect(subjects.getByRole("checkbox", { name, exact: true })).toBeAttached();
  await subjects.getByRole("checkbox", { name: "Information retrieval", exact: true }).check();
  await subjects.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.locator(".problem-card")).toHaveCount(2);
  await page.getByRole("link", { name: "The Geometry of Search", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The Geometry of Search");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/open-problems?domain=ai_ml");
  await page.getByRole("button", { name: "JEPA & world models ↗", exact: true }).click();
  await expect(page).toHaveURL(/area=world_models/);
  await expect(page.locator(".problem-card")).toHaveCount(3);
  await page.getByRole("link", { name: "Learning a World Model Worth Planning With", exact: true }).click();
  await expect(page.locator(".problem-detail")).toContainText("planning regret");
  await page.goto("/open-problems/aiml-robot-controller-certificates");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Robots with Provable Stability");
  await expect(page.locator('.problem-sources a[href="https://arxiv.org/abs/2602.05311"]')).toBeVisible();
});

test("coding agents discover filters, paginate records and retrieve stable IDs", async ({ request }) => {
  const alias = await request.get("/llm.txt", { maxRedirects: 0 });
  expect(alias.status()).toBe(308);
  expect(new URL(alias.headers().location).pathname).toBe("/llms.txt");
  const index = await request.get("/llms.txt");
  expect(index.headers()["content-type"]).toContain("text/plain");
  const indexText = await index.text();
  expect(indexText).toContain("/open-problems/llms.txt");
  expect(indexText).toContain("https://www.theoria.sh/docs/commands.md");
  expect(indexText).toContain("https://www.theoria.sh/docs/quickstart.md");
  const guide = await request.get("/open-problems/llms.txt");
  expect(await guide.text()).toContain("NOT an unlimited export");
  const metadata = await (await request.get("/api/open-problems/meta")).json();
  expect(metadata.query.view.page_sizes).toEqual({ list: 12, graph: 250 });
  const ai = metadata.domains.find((domain: { value: string }) => domain.value === "ai_ml");
  for (const value of ["symbolic_regression", "privacy_preserving_learning", "time_series_learning", "tabular_learning"])
    expect(ai.areas.some((area: { value: string }) => area.value === value)).toBe(true);

  const first = await (await request.get("/api/open-problems?domain=ai_ml&sort=title")).json();
  const items = [...first.items];
  for (let page = 2; page <= Math.ceil(first.total / first.page_size); page++) {
    const result = await (await request.get(`/api/open-problems?domain=ai_ml&sort=title&page=${page}`)).json();
    items.push(...result.items);
  }
  expect(new Set(items.map(item => item.id)).size).toBe(first.total);
  const expected = items.find(item => item.id === "aiml-adaptive-branching-search-complexity");
  const detail = await request.get(`/api/open-problems/${expected.id}`);
  expect(detail.status()).toBe(200);
  expect((await detail.json()).problem).toEqual(expected);
  expect((await request.get("/api/open-problems/not-a-catalogue-id")).status()).toBe(404);
  expect((await request.get("/api/open-problems/INVALID_ID")).status()).toBe(400);
  expect((await request.get("/api/open-problems?domain=theoretical_physics&area=symbolic_regression")).status()).toBe(400);
});

test("new research subjects and equation-heavy targets render on mobile and desktop", async ({ page, request }) => {
  for (const [area, count] of [["symbolic_regression", 5], ["privacy_preserving_learning", 5], ["time_series_learning", 5], ["tabular_learning", 4]] as const) {
    const result = await (await request.get(`/api/open-problems?domain=ai_ml&area=${area}`)).json();
    expect(result.total).toBe(count);
    await page.goto(`/open-problems?domain=ai_ml&area=${area}`);
    await expect(page.locator(".problem-card")).toHaveCount(count);
  }
  for (const id of ["adaptive-branching-search-complexity", "local-credit-propagation", "quantized-data-reuse", "encrypted-autoregressive-inference", "kan-grid-refinement-dynamics", "coarse-observation-pde-discovery", "manifold-symbolic-dynamics", "private-feature-learning-efficiency", "kaplan-chinchilla-exponent-reconciliation"]) {
    await page.goto(`/open-problems/aiml-${id}`);
    await expect(page.locator(".problem-statement .katex").first()).toBeVisible();
    await expect(page.locator(".katex-error")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
