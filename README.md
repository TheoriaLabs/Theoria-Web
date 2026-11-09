# Theoria Web

The Theoria Labs landing page: Next.js App Router, TypeScript, a green Theta identity, and an original periodic ASCII shear animation.

## Development

Use Node.js 22.19+ and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Page copy is in `app/page.tsx`, design tokens in `app/globals.css`, product configuration in `lib/site-config.ts`, and the animation in `components/hero-animation.tsx`.

## Open Problems

Open **http://localhost:3000/open-problems** or use **Open Problems** in the navigation. The bundled catalog has **294 open problems**: **286 in Theoretical Physics** (50 editorially scoped records and 236 filtered PubPhys imports) and **8 editorially scoped Quantitative Finance questions**. Physics includes 23 quantum-chaos entries and both Riemann-zero questions. Independent formulations use named-author IQOQI problem pages and primary literature; see `/open-problems/sources` for the source directory. The PubPhys expansion screens all 1,026 source candidates in 10 relevant fields; source-imported statements and statuses are not individually expert-verified. Both active domains support search, subject/type/review filters, sorting, pagination, typeset mathematics, source-linked detail pages and a pannable/zoomable relationship graph. Subject filters include explicit secondary areas: Yang–Mills appears under QFT and QCD as one record. URL parameters preserve the current filters. `/open_problems` redirects to `/open-problems`.

The **Quantitative Finance** tab is directly accessible at `/open-problems?domain=quantitative_finance`. Its eight entries cover rough Heston uniqueness, unregularized stochastic local volatility, multidimensional martingale mimicking and optimal transport, nonlinear market impact, high-dimensional HJB solvers, financial-network equilibrium selection and Epstein–Zin optimization. They use the physics catalog's statement/assumptions/resolution/status/source format, with 21 literature references and explicit qualifications for restricted results, counterexamples, withdrawn claims and 2026 preprints. Switching domains clears search and filters while keeping the selected list/graph layout. Counts and subject options are domain-specific; links without `domain` retain the physics view.

Selection targets theoretical or computational resolution without new physical measurements. Numerical evidence is distinguished from a proof; the [data notes](data/open-problems/README.md) explain scope, source quality and withheld status-review records.

Subject, Type and Review accept multiple selections: OR within a filter, AND across filters; an empty selection includes all values. Shared URLs use repeated keys, for example `/open-problems?area=qcd&area=quantum_field_theory&kind=conjecture&kind=construction_problem`. Existing single-value links and comma-separated values also work. Selections are preserved on reload and reset pagination when changed.

The graph offers **Spring groups** and **Grid** layout buttons, preserved in the URL (`view=graph&layout=grid`; spring is the default). Every problem stays inside a labelled primary-subject cluster with deterministic local dot packing. In Spring groups, a D3 force simulation, analogous to NetworkX's `spring_layout`, acts **only on subject groups**. Cross-subject recorded relationships, IDF-weighted title/tag affinities and cross-listings are aggregated into group springs; group repulsion and size-aware collision forces separate the clusters. Grid places the same groups in rows. Solid lines indicate recorded problem relationships; dashed lines indicate inferred topic affinity and can be hidden. Layout changes preserve the selected problem and reset the camera. Proximity is a reading heuristic, not an assertion of equivalence or proof dependency.

To reproduce the source screening or refresh the public snapshot:

```sh
npm run problems:collect             # reuse the downloaded snapshot
npm run problems:collect -- --refresh # explicitly refresh source records
npm run problems:build               # regenerate filtered JSONL and decision report
npm run problems:import -- --dry-run
```

Every candidate has a recorded decision in `data/open-problems/pubphys-import-report.json`. Explicit aliases, scope-related links, exclusions and recent-claim holds are in `pubphys-overrides.json`. Raw source text and source-derived statements retain CC BY 4.0 attribution (see `NOTICE`). Screening is conservative: uncertain, contested and unverified-resolution cases stay out until their remaining scope is reviewed; the full candidate snapshot is retained for that work.

`independent-sources.preliminary.jsonl` holds newly formulated expert-list questions. `source-enrichment.json` attaches additional references and checked section/equation locators to existing canonical IDs. These references survive PubPhys regeneration and are included in the database importer without changing imported statements or automatically promoting their review status. An unknown/withheld enrichment target fails validation rather than reintroducing it.

### Optional Supabase PostgreSQL storage

1. Apply `supabase/migrations/202611070001_open_problems.sql`, then `supabase/migrations/202611090001_problem_domains.sql` on a fresh catalog database, or use your existing Supabase migration workflow. Existing catalog databases need only the new domain migration before deploying this version. It retains legacy physics documents and adds domain-scoped search.
2. Add the following to `.env.local`:

   ```dotenv
   OPEN_PROBLEMS_SOURCE=supabase
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
   SUPABASE_SECRET_KEY=YOUR_SERVER_ONLY_IMPORT_KEY
   ```

3. Validate and import:

   ```sh
   npm run problems:import -- --dry-run
   npm run problems:import
   ```

4. Restart the dev server. Only the URL and publishable key are needed by the deployed website; remove the secret import key from deployment configuration. Legacy `anon` and `service_role` keys can be used in the corresponding variables.

The importer preserves existing rows on repeated runs. `--replace-existing` intentionally replaces matching seed IDs; it does not remove unrelated rows. Review holds are never imported. To withdraw a previously published record, set `published=false` in the database; removing it from a seed file does not unpublish it.

`OPEN_PROBLEMS_SOURCE=auto` (default) uses Supabase when configured, otherwise the explicitly labelled seed catalog. `seed` forces a reproducible local preview. A configured database error produces an error/retry state rather than silently switching data sources. The public API is `GET /api/open-problems?domain=quantitative_finance&q=&area=&kind=&review=&sort=&page=&view=&layout=` (`domain=theoretical_physics|quantitative_finance`, default physics; `review=editorial|imported`; `layout=spring|grid`). Repeat `area`, `kind` and `review` for multi-select filters. `total_all` and subject counts cover the selected domain; `total` additionally applies the filters. Subjects from another domain are rejected. PostgreSQL uses ranked English full-text search; seed mode uses AND-word substring search. Public roles can read published provisional records only, with no write permissions.

The SQL migration, full-text query and row-level policies are tested using embedded PostgreSQL (PGlite). Run browser checks against seed mode with `OPEN_PROBLEMS_SOURCE=seed npm run test:e2e` after building. Live Supabase credentials are not required for these checks.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Deployment

Import `TheoriaLabs/Theoria-Web` into Vercel using its Next.js preset. Use `main` for production and enable GitHub preview deployments. The bundled catalog needs no external database. For Supabase mode, set the runtime variables above in Vercel; the secret import key is not a runtime variable.

Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin when attaching a custom domain. On Vercel, the production deployment domain is used automatically when this is unset. Local development falls back to localhost.

Vercel serves files under `public/` directly. The CLI installer is `public/install/cli.sh` (`curl -fsSL https://www.theoria.sh/install/cli.sh | bash`); see `public/install/README.md` for how it works and how to test it. The IDE tab and call-to-action are locked and labeled Coming soon until a release is ready.

The site repository is initially private. The footer links to its GitHub source; access depends on repository permissions.

## Animation

Theta is drawn on a discrete character grid. Each row is horizontally sheared as `x' = (x + s*y) mod L`. Advancing `s` from zero to the grid width `L` restores every point because row coordinates are integers. The 18-second cycle holds the original for three seconds at each end and transforms for twelve seconds. It supports pause, reduced motion, resizing, and offscreen/background suspension. `tests/shear.test.ts` checks restoration, wraparound, row bijection, and periodic timing.

The IDE research graph and terminal are explicitly labeled illustrative/conceptual. Typography uses Google Fonts with local system fallbacks.

## License

Copyright 2026 DeepHedge Labs LLC. Theoria Web is licensed under the [Apache License, Version 2.0](LICENSE); see [NOTICE](NOTICE).
