import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { readSeedCatalog } from "../lib/problem-seed.ts";
import { defaultQuery, parseProblem, problemAreas, searchSeed, type OpenProblem } from "../lib/open-problems.ts";

test("PostgreSQL migration, ranked search and public read-only policies", async () => {
  const db = new PGlite();
  try {
    await db.exec("create role anon; create role authenticated; create role service_role; grant usage on schema public to anon, authenticated, service_role;");
    await db.exec(await readFile(new URL("../supabase/migrations/202611070001_open_problems.sql", import.meta.url), "utf8"));
    const records = await readSeedCatalog();
    for (const document of records) await db.query("insert into public.open_problems (id,document,published) values ($1,$2,true)", [document.id, JSON.stringify(document)]);
    // Include unpublished and held records in the database: neither may affect counts, results or direct reads.
    for (const [id, published, status] of [["private-draft", false, "provisionally_open"], ["held-riemann", true, "review_hold"]] as const) {
      await db.query("insert into public.open_problems (id,document,published) values ($1,$2,$3)", [id, JSON.stringify({ ...records[0], id, title: "Riemann private entry", status }), published]);
    }
    const search = async (q = "", area: string[] = [], kind: string[] = [], sort = "relevance", offset = 0, review: string[] = []) => {
      const result = await db.query<{ result: { items: OpenProblem[]; total: number; total_all: number } }>("select public.search_open_problems($1,$2,$3,$4,$5,12,$6) as result", [q, area, kind, sort, offset, review]);
      return result.rows[0].result;
    };
    for (const role of ["anon", "authenticated"]) {
      await db.exec(`set role ${role}`);
      const all = await search();
      assert.equal(all.total_all, records.length);
      assert.equal(all.total, records.length);
      assert.equal((await db.query("select id from public.open_problems where id in ('private-draft','held-riemann')")).rows.length, 0);
      const riemann = await search("Riemann zeros", ["quantum_chaos"]);
      assert(riemann.items.some(record => record.id === "chaos-hilbert-polya-riemann-zeros"));
      assert(!riemann.items.some(record => record.id === "held-riemann"));
      for (const record of riemann.items) parseProblem(record);
      const filtered = await search("", ["quantum_chaos"], ["conjecture"]);
      assert.equal(filtered.total, records.filter(record => record.primary_area === "quantum_chaos" && record.kind === "conjecture").length);
      const qcd = await search("Yang Mills", ["qcd"]);
      assert.equal(qcd.items.filter(record => record.id === "qft-yang-mills-existence-mass-gap").length, 1);
      assert.equal((await search("", ["qcd"])).total, records.filter(record => problemAreas(record).includes("qcd")).length);
      for (const review of ["editorial", "imported"]) {
        const { rows } = await db.query<{ result: { total: number } }>("select public.search_open_problems(review_filter => $1) as result", [[review]]);
        assert.equal(rows[0].result.total, records.filter(record => (record.review_level === "source_import") === (review === "imported")).length);
      }
      const page1 = await search("", [], [], "title"), page2 = await search("", [], [], "title", 12);
      assert(page1.items.every(record => !page2.items.some(other => other.id === record.id)));
      assert.equal((await search("'; DROP TABLE open_problems; --")).total, 0);
      const selected = { ...defaultQuery, area: ["qcd", "quantum_field_theory"], kind: ["conjecture", "construction_problem"], review: ["editorial"], sort: "title" as const };
      const combined = await search("", selected.area, selected.kind, selected.sort, 0, selected.review);
      assert.equal(combined.total, searchSeed(records, selected).total);
      assert.deepEqual(new Set(combined.items.map(item => item.id)), new Set(searchSeed(records, selected).items.map(item => item.id)));
      assert.equal(combined.items.filter(item => item.id === "qft-yang-mills-existence-mass-gap").length, 1);
      assert.equal((await search("", [], [], "relevance", 0, ["editorial", "imported"])).total, records.length);
      await assert.rejects(search("", [], ["invalid"]), /Invalid catalog query/);
      await assert.rejects(db.query("delete from public.open_problems where id = $1", [records[0].id]), /permission denied/);
      await assert.rejects(db.query("update public.open_problems set published=false where id=$1", [records[0].id]), /permission denied/);
      await assert.rejects(db.query("insert into public.open_problems (id,document) values ($1,$2)", ["public-write", JSON.stringify({ ...records[0], id: "public-write" })]), /permission denied/);
      await assert.rejects(search("x".repeat(201)), /Invalid catalog query/);
      await db.exec("reset role");
    }
    await db.exec("set role service_role");
    // Supabase's service role has BYPASSRLS; simulate its attribute rather than relaxing any public policy.
    await db.exec("reset role; alter role service_role bypassrls; set role service_role;");
    const document = { ...records[0], title: "Preserved editorial title" };
    await db.query("update public.open_problems set document=$1 where id=$2", [JSON.stringify(document), document.id]);
    await db.query("insert into public.open_problems (id,document,published) values ($1,$2,true) on conflict (id) do nothing", [records[0].id, JSON.stringify(records[0])]);
    assert.equal((await db.query<{ title: string }>("select title from public.open_problems where id=$1", [document.id])).rows[0].title, document.title);
  } finally { await db.close(); }
});
