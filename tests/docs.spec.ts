import { test, expect } from "@playwright/test";

test("products menu opens, shows the CLI and a locked IDE, and closes with Escape or a click outside", async ({ page, isMobile }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /Products/ });
  await expect(button).toHaveAttribute("aria-expanded", "false");
  if (!isMobile) { await button.hover(); await expect(button).toHaveAttribute("aria-expanded", "true", { timeout: 2000 }); await page.mouse.move(5, 600); await expect(button).toHaveAttribute("aria-expanded", "false"); }
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  const panel = page.locator("#products-menu");
  await expect(panel.getByRole("link", { name: /Theoria-CLI/ })).toHaveAttribute("href", "/#install");
  const ide = panel.locator(".nav-menu-disabled");
  await expect(ide).toContainText("Theoria-IDE");
  await expect(ide).toContainText("Coming soon");
  await expect(ide).toHaveAttribute("aria-disabled", "true");
  await expect(panel.getByRole("link", { name: /Theoria-IDE/ })).toHaveCount(0);
  await button.focus();
  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(button).toBeFocused();
  await button.click();
  await page.mouse.click(5, 400);
  await expect(button).toHaveAttribute("aria-expanded", "false");
  if (!isMobile) {
    await button.click();
    await panel.getByRole("link", { name: /Theoria-CLI/ }).click();
    await expect(page).toHaveURL(/\/#install$/);
  }
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
});

test("docs pages render with sidebar, tabs, sections and no overflow", async ({ page, isMobile }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const [path, title] of [["/docs", "Theoria-CLI"], ["/docs/quickstart", "Quickstart"], ["/docs/commands", "Slash commands"], ["/docs/autoresearch", "Autoresearch"], ["/docs/lean-environments", "Lean environments"], ["/docs/configuration", "Configuration"], ["/docs/changelog", "Changelog"]]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), path).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`docs${path.replace(/\//g, "-")}.png`), fullPage: false });
  }
  await page.goto("/docs/commands");
  await expect(page.locator("#next-steps")).toContainText("/next-steps");
  await expect(page.getByRole("list", { name: "/next-steps forms" })).toContainText("--focus theory|numerics|formalization");
  await expect(page.locator("#compare-skills, #pi-header")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Documentation sections" }).getByRole("link", { name: "Slash commands" })).toHaveAttribute("aria-current", "page");
  if (!isMobile) {
    await expect(page.getByRole("navigation", { name: "Documentation pages" }).getByRole("link", { name: "Slash commands" })).toHaveAttribute("aria-current", "page");
    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link", { name: "/next-steps" })).toBeVisible();
    await toc.getByRole("link", { name: "/benchmark" }).click();
    await expect(page).toHaveURL(/#benchmark$/);
    await expect(page.locator("#benchmark")).toBeInViewport();
  } else {
    await page.locator("#docs-page-picker").selectOption("/docs/changelog");
    await expect(page).toHaveURL(/\/docs\/changelog$/);
  }
  await page.goto("/docs/changelog");
  await expect(page.locator("#v0-1-0-beta-1")).toContainText("0.1.0-beta.1");
  expect(errors).toEqual([]);
});

test("agents get an llms.txt index and Markdown pages on the public domain", async ({ request }) => {
  const index = await request.get("/llms.txt");
  expect(index.headers()["content-type"]).toContain("text/plain");
  const text = await index.text();
  expect(text).toContain("https://www.theoria.sh/docs/commands.md");
  const commands = await request.get("/docs/commands.md");
  expect(commands.headers()["content-type"]).toContain("text/markdown");
  const markdown = await commands.text();
  expect(markdown).toContain("### /next-steps");
  expect(markdown).toContain("/next-steps paper.pdf 2312.04567 --n 5");
  expect(markdown).not.toContain("localhost");
  expect(markdown).toContain("](https://www.theoria.sh/docs/lean-environments.md)");
  expect(markdown).not.toMatch(/\]\(\/docs|\]\(#/);
  const autoresearch = await (await request.get("/docs/autoresearch.md")).text();
  expect(autoresearch).toContain("```mermaid");
  expect(autoresearch).toContain("## Related");
  const overview = await (await request.get("/docs.md")).text();
  expect(overview).toContain("](https://www.theoria.sh/docs/commands.md)");
});

test("diagrams render, related pages and every cross-link resolve", async ({ page }) => {
  for (const path of ["/docs/autoresearch", "/docs/lean-environments"]) {
    await page.goto(path);
    const diagram = page.locator(".docs-diagram svg").first();
    await expect(diagram).toBeVisible({ timeout: 15000 });
    await expect(page.locator(".docs-diagram figcaption").first()).not.toBeEmpty();
  }
  await page.goto("/docs/autoresearch");
  await expect(page.locator(".docs-diagram svg")).toContainText("report.json");
  await expect(page.locator(".docs-diagram svg")).toContainText("/claim new hypothesis");
  const related = page.getByRole("region", { name: "Related" });
  await expect(related.getByRole("link", { name: /Slash commands/ })).toHaveAttribute("href", "/docs/commands");
  // Every internal docs link on every page points at an existing page and, when it has one, an existing anchor.
  const pages = ["/docs", "/docs/quickstart", "/docs/commands", "/docs/autoresearch", "/docs/lean-environments", "/docs/configuration", "/docs/changelog"];
  for (const path of pages) {
    await page.goto(path);
    const hrefs = await page.locator(".docs-article a[href^='/docs']:not([href$='.md']), .docs-article a[href^='#']").evaluateAll(links => links.map(link => link.getAttribute("href")!));
    for (const href of new Set(hrefs)) {
      const [target, anchor] = href.startsWith("#") ? [path, href.slice(1)] : href.split("#");
      expect(pages, `${path} links to ${href}`).toContain(target);
      if (anchor) {
        if (target !== path) await page.goto(target!);
        expect(await page.locator(`[id="${anchor}"]`).count(), `${path} → ${href}`).toBe(1);
        if (target !== path) await page.goto(path);
      }
    }
  }
});

test("the landing page previews six commands, each linked to its docs", async ({ page }) => {
  await page.goto("/");
  const preview = page.locator(".slash-commands");
  for (const [name, href] of [["/formalize", "/docs/commands#formalize"], ["/prove", "/docs/commands#prove"], ["/next-steps", "/docs/commands#next-steps"],
    ["/autoresearch", "/docs/autoresearch"], ["/benchmark", "/docs/commands#benchmark"], ["/latex", "/docs/commands#latex"]])
    await expect(preview.getByRole("link", { name })).toHaveAttribute("href", href);
});

test("on a phone the docs sidebar is a page picker and nothing is wider than the screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/docs", "/docs/commands", "/docs/autoresearch", "/docs/lean-environments"]) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), path).toBeLessThanOrEqual(390);
    if (path === "/") continue;
    await expect(page.getByRole("navigation", { name: "Documentation pages" }), path).toBeHidden();
    await expect(page.locator("#docs-page-picker"), path).toBeVisible();
    // The article starts below the picker: nothing overlaps its first line.
    const picker = await page.locator(".docs-mobile-nav").boundingBox();
    const title = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(title!.y, path).toBeGreaterThan(picker!.y + picker!.height);
  }
  await expect(page.getByRole("link", { name: "Get Theoria" })).toBeVisible();
});
