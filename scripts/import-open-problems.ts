/** One-time, idempotent seed import. Never import status-review-holds.jsonl or expose the secret to the browser. */
import { createClient } from "@supabase/supabase-js";
import { readSeedCatalog } from "../lib/problem-seed.ts";

const args = process.argv.slice(2);
if (args.some(arg => !["--dry-run", "--replace-existing"].includes(arg))) throw new Error("Usage: npm run problems:import -- [--dry-run] [--replace-existing]");
const records = await readSeedCatalog();
console.log(`Validated ${records.length} provisional problems. Review-hold records are excluded.`);
if (!args.includes("--dry-run")) {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local or the environment.");
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const replace = args.includes("--replace-existing");
  for (let at = 0; at < records.length; at += 100) {
    const { error } = await db.from("open_problems").upsert(records.slice(at, at + 100).map(document => ({ id: document.id, document, published: true })),
      { onConflict: "id", ignoreDuplicates: !replace });
    if (error) throw new Error(`Import failed: ${error.message}`);
  }
  console.log(replace ? "Imported; matching IDs replaced. Other database rows were not deleted." : "Imported; existing database records preserved. Use --replace-existing only to intentionally restore seed records.");
}
