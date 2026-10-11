import { test, expect } from "@playwright/test";

test("landing page renders without overflow or runtime errors and installer tabs work", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Verifiable research loops");
  await expect(page.getByRole("button", { name: "Copy install command" })).toBeDisabled();
  await expect(page.getByRole("tab", { name: "Theoria-IDE Coming soon" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Theoria-IDE Coming soon" })).toBeDisabled();
  await page.getByRole("tab", { name: "Theoria-CLI" }).press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Theoria-CLI" })).toBeFocused();
  await expect(page.locator(".command-box code")).toContainText("/install/cli.sh");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(await page.locator(".skip-link").evaluate(link => link.getBoundingClientRect().bottom)).toBeLessThan(0);
  expect(errors).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("landing.png"), fullPage: true });
});

test("shear animates, pauses, resumes, and repeats", async ({ page }) => {
  // A controlled animation clock makes an entire period deterministic and fast.
  await page.clock.install({ time: new Date("2026-10-11T12:00:00Z") });
  await page.goto("/");
  const image = () => page.locator("canvas").evaluate(canvas => (canvas as HTMLCanvasElement).toDataURL());
  const original = await image();
  await page.clock.runFor(5500);
  const sheared = await image();
  expect(sheared).not.toEqual(original);
  await page.getByRole("button", { name: "Pause Theta animation" }).click();
  const paused = await image();
  await page.clock.runFor(1000);
  expect(await image()).toEqual(paused);
  await page.getByRole("button", { name: "Play Theta animation" }).click();
  await page.clock.runFor(13000);
  expect(await image()).toEqual(original);
});

test("reduced motion keeps Theta still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/");
  const before = await page.locator("canvas").evaluate(canvas => (canvas as HTMLCanvasElement).toDataURL());
  await page.clock.runFor(6000);
  expect(await page.locator("canvas").evaluate(canvas => (canvas as HTMLCanvasElement).toDataURL())).toEqual(before);
});
