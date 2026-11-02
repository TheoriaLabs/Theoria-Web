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
  const overview = await (await request.get("/docs.md")).text();
  expect(overview).toContain("](https://www.theoria.sh/docs/commands.md)");
});
