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

Open **http://localhost:3000/open-problems** or use **Open Problems** in the navigation. The bundled catalog has **467 open problems and research targets**: **339 in Theoretical Physics** (110 editorially scoped records and 229 filtered PubPhys imports), **119 editorially scoped Foundations of AI/ML research targets** and **9 editorially scoped Quantitative Finance entries**. Physics includes 24 quantum-chaos entries and both Riemann-zero questions. Independent formulations use named-author IQOQI problem pages, selected Prove2Me mission goals, primary literature and Shao-Jiang Wang's 100-problem discovery catalogue; see `/open-problems/sources` for the source directory. The PubPhys expansion screens all 1,026 source candidates in 10 relevant fields; source-imported statements and statuses are not individually expert-verified. All three domains support search, subject/type/review filters, sorting, pagination, typeset mathematics, source-linked detail pages and a pannable/zoomable relationship graph. Subject filters include explicit secondary areas: Yang–Mills appears under QFT and QCD as one record. URL parameters preserve the current filters. `/open_problems` redirects to `/open-problems`.

The **Quantitative Finance** tab is directly accessible at `/open-problems?domain=quantitative_finance`. Its nine entries cover rough Heston uniqueness, unregularized stochastic local volatility, multidimensional martingale mimicking and optimal transport, nonlinear market impact, high-dimensional HJB solvers, financial-network equilibrium selection, Epstein–Zin optimization and **Endogenous Market Efficiency Under Long-Memory Order Flow**. They use the physics catalog's statement/assumptions/resolution/status/source format, with 26 literature references and explicit qualifications for restricted results, counterexamples, withdrawn claims and 2026 preprints. The long-memory entry is an exploratory research program: first audit/formalize known results, then investigate endogenous equilibrium, emergent impact, a Brownian functional limit, robustness and no manipulation. Switching domains clears search and filters while keeping the selected list/graph layout. Counts and subject options are domain-specific; links without `domain` retain the physics view.

The **Foundations of AI/ML** tab is at `/open-problems?domain=ai_ml`. Its **119 challenges**, compiled on 2026-11-19–20 and supported by **316 references**, span 28 primary subjects, including AI safety, transformer learning, world models, generalization, optimization, time-series and tabular learning, privacy/encrypted learning, symbolic regression, RL and verified reasoning. Short challenge-style titles lead to precise statements, assumptions and resolution criteria; earlier descriptive titles remain searchable as aliases. The **Transformer theory** filter includes seven primary targets plus five cross-listed topics. Its ICL training-and-transfer target distinguishes exact query-conditioned RoPE gradient-step identities from guarantees that pretraining learns a useful algorithm.

Six additional subject filters cover **RMT & weight spectra**, **Optimization & optimizers** (AdamW, Adafactor and Muon), **Memory & capacity**, **Kernel learning**, **Statistical inference** (including inverse Ising models) and **Information retrieval**. Their targets account for existing short-step spectral laws, practical Muon convergence, empirical knowledge-capacity scaling, recursive-feature-machine results, fully observed Ising learning and counterfactual ranking methods.

Further filters cover **JEPA & world models**, **RNNs & sequence learning**, **Bayesian learning**, **Data-efficient learning**, **RL foundations**, **Inverse RL & imitation** and **Control & robotics**. They include predictive control sufficiency, representation-collapse dynamics, recurrent trainability and credit assignment, prior learning, posterior reliability, active data acquisition, exploration, offline RL, transferable rewards, dual control and adaptive stability certificates. Existing JEPA planning/alignment theorems, RNN learning results, empirical-Bayes guarantees, IRL identifiability/fast rates and nonlinear-control regret are stated as baselines.

The **AI safety & alignment** filter is at `/open-problems?domain=ai_ml&area=alignment`. It shows twelve primary challenges in reward hacking, weak-to-strong learning, backdoor detectability, debate, safety under fine-tuning, safe exploration, reliable abstention, certified unlearning, prompt injection, control of untrusted agents, jailbreak certification and finite-audit multi-turn safety, plus six cross-listed questions in privacy, verifier audits, correlated judges, synthetic-world transfer, reward identification and robotic certificates. Safety targets specify threat, observation and feedback assumptions, with known impossibility results and positive guarantees recorded.

Sixteen entries reformulate published challenges: three from **COLT 2026**, two from **COLT 2025**, linear sample compression, two **Lokhov-line** directions, stochastic rounding with reused data, and seven explicit bound questions in teaching dimension, agnostic multiclass PAC learning, identity testing, sequential calibration, shallow-network encoding size, strategic collaboration and fixed-step self-play. Bound questions are searchable with `q=bound_gap` (full-text search may also return related records). Each states the mathematical model, established baseline and exact improvement sought. Subsequent literature matters: the SQ variant has a negative resolution, realizable multiclass PAC bounds are now sharp, and October work claims an unrestricted ReLU depth-two collapse. Those solved targets are excluded. The other 103 entries are source-motivated targets. See the [literature audit](data/open-problems/ai-ml-literature-audit.md). Provisional status does not certify novelty or openness.

The **Neural architecture & complexity** and **Multi-agent communication & games** subjects cover shallow-model description size, finite-data hidden-state message alignment, weighted incentive-aware collaboration, and sparse topology design robust to link failures and coarse correlated equilibria. Existing cross-model cache transfer and pure-Nash topology results are explicit baselines. Latent payload bits, adapter training and transport costs are charged; no universal same-budget superiority over text is assumed.

The architecture-efficiency pass adds **14 targets**: AB-MCTS branching and multi-model cost allocation; local predictive-coding credit, continual plasticity, adaptive thought, capacity-limited experts, hardware-aware sparsity and low-precision data reuse; three time-series and three tabular-learning targets. Subsequent privacy, KAN, equation-discovery, logistic-regression, NTK and scaling-reconciliation additions bring the expansion to **32 targets**. **44 records** now carry an explicit efficiency payoff and tag `architecture_efficiency`; **19** carry `dynamical_systems`. Search `q=MCTS` for the two dedicated search targets. The Sakana paper's final-selection gap also qualifies the verifier-audit entry: finding a correct candidate is different from selecting it.

Sakana's CTM, PC-ALM, TwELL and AB-MCTS, DeepMind's recursive blocks, MELODI and EmbeddingGemma 2 supply architectural baselines. Ineffable's experience-learning mission and Flapping Airplanes' model/system agenda are labelled `research_agenda`, not theorem evidence. Existing sparse-VAR/additive minimax results and long-memory representation laws are retained; the new targets charge actual training, state/parameter precision, communication or serving costs.

**Privacy & encrypted learning** (`privacy_preserving_learning`) includes the existing PAC privacy question and four targets on private feature learning, private adapter ranks, homomorphic autoregressive inference and encrypted training. Two further alignment targets cover utility-preserving jailbreak certificates and finite audits of adaptive conversations. DP controls changes under neighboring datasets; encryption protects computation from a specified evaluator. Neither automatically supplies the other's guarantee.

**KANs** have three targets on decomposition learning, stable spline refinement and symbolic extraction. **Symbolic regression & equation discovery** (`symbolic_regression`) includes that extraction target plus learned-library ODE discovery, PDE identification from coarse observations, manifold/latent-coordinate dynamics, and active experiment design. Existing SINDy, WSINDy, SINDy autoencoders, active discovery and KAN approximation results are explicitly retained as baselines.

Four **simple-model** targets cover optimal-regret online logistic prediction at low runtime, the vanishing-ridge separability crossover, long-time finite-width NTK classification, and sharp width/sample/compute requirements for kernel-like learning. Basic convex logistic optimization, separable max-margin limits, fixed-regime phase transitions, efficient NTK sketches and polynomial-width minimax results are already known and are not relabelled as open.

**Reconciling Kaplan and Chinchilla Exponents** is searchable with `q=Kaplan Chinchilla`. The historical discrepancy already has counting, warmup and optimizer explanations. The new editorial target asks for costed, finite-pilot confidence and identifiability bounds for corrected allocation exponents, using an explicit loss-surface class, audited compute and bounded protocol residuals. It distinguishes allocation exponents from loss exponents and includes replication and IsoFLOP fitting-bias baselines.

### Agent access

Coding agents can start with `/llms.txt` (`/llm.txt` redirects there) and read `/open-problems/llms.txt` for fetch/filter examples and provenance rules. `GET /api/open-problems/meta` exposes current domain/subject keys and query options; `GET /api/open-problems` returns paginated full records, and `GET /api/open-problems/{id}` retrieves one exact stable ID. No API key is required. Complete retrieval uses list pagination; graph mode is capped at 250 and is not a full export. Theoria-CLI's companion change adds this guide to native agent context without downloading the catalogue at startup.

Selection targets theoretical or computational resolution without new physical measurements. Numerical evidence is distinguished from a proof; the [data notes](data/open-problems/README.md) explain scope, source quality and withheld status-review records.

AI/ML statements now name their model/task families directly: shared-feature Gaussian regression for ICL, finite-state composition for sequence learning, bounded-degree heat-bath Ising dynamics for subsampled inference, and explicit latent/observation models for RL and control. Mathematical definitions specify risk, precision, covariance, moment access and success criteria; 87 statements contain typeset formulas. These benchmark specializations are editorial choices, not additional claims from the cited papers. `needs_framework` remains where architectural, algorithmic or numerical choices still need to be frozen; adding notation alone does not certify a new open theorem.

Subject, Type and Review accept multiple selections: OR within a filter, AND across filters; an empty selection includes all values. Shared URLs use repeated keys, for example `/open-problems?area=qcd&area=quantum_field_theory&kind=conjecture&kind=construction_problem`. Existing single-value links and comma-separated values also work. Selections are preserved on reload and reset pagination when changed.

The graph offers **Spring groups** and **Grid** layout buttons, preserved in the URL (`view=graph&layout=grid`; spring is the default). Every problem stays inside a labelled primary-subject cluster with deterministic local dot packing. In Spring groups, a D3 force simulation, analogous to NetworkX's `spring_layout`, acts **only on subject groups**. Cross-subject recorded relationships, IDF-weighted title/tag affinities and cross-listings are aggregated into group springs; group repulsion and size-aware collision forces separate the clusters. Grid places the same groups in rows. Solid lines indicate recorded problem relationships; dashed lines indicate inferred topic affinity and can be hidden. Layout changes preserve the selected problem and reset the camera. Proximity is a reading heuristic, not an assertion of equivalence or proof dependency.

To reproduce the source screening or refresh the public snapshot:

```sh
npm run problems:collect             # reuse the downloaded snapshot
npm run problems:collect -- --refresh # explicitly refresh source records
npm run problems:build:wang          # regenerate the reviewed 100-item Wang pass
npm run problems:build               # regenerate filtered JSONL and decision report
npm run problems:import -- --dry-run
```

Every candidate has a recorded decision in `data/open-problems/pubphys-import-report.json`. Explicit aliases, scope-related links, exclusions and recent-claim holds are in `pubphys-overrides.json`. Raw source text and source-derived statements retain CC BY 4.0 attribution (see `NOTICE`). Screening is conservative: uncertain, contested and unverified-resolution cases stay out until their remaining scope is reviewed; the full candidate snapshot is retained for that work.

`independent-sources.preliminary.jsonl` holds newly formulated expert-list questions. `source-enrichment.json` attaches additional references and checked section/equation locators to existing canonical IDs. These references survive PubPhys regeneration and are included in the database importer without changing imported statements or automatically promoting their review status. An unknown/withheld enrichment target fails validation rather than reintroducing it.

The Wang pass accounts for every numbered entry in `wang-2026-import-report.json`: **55 additions, 27 mapped occurrences (including two within-list consolidations), and 18 review holds**. Its editable decisions and original formulations are in `wang-2026-curation.ts`; the builder generates `wang-2026.preliminary.jsonl` and `wang-2026-source-enrichment.json`. References enrich 24 existing records without changing their IDs, statements or status notes. New targets preserve distinctions such as continuum versus fixed-spacing lattice confinement, bootstrap convergence versus the Ising scaling limit, and equilibration time versus ETH. This is a scope-and-deduplication pass, not an expert verification of current open status.

`prove2me.preliminary.jsonl` adds the requested **three topics as five independently resolvable records**: the PCR3BP retrograde global-section conjecture, Thomson global optimality for **N=9, N=10 and N=32**, and the **t^(2/3) variance law for one-dimensional ballistic deposition**. The three-body problem is distinct from the billiard Birkhoff conjecture; Thomson competitors are unrestricted; the KPZ target is distinct from our Heisenberg-chain and higher-dimensional entries. Each record links the exact mission scope and background/partial results. Prove2Me formalization status is not treated as an authoritative research-status assessment.

### Optional Supabase PostgreSQL storage

1. Apply the SQL files in `supabase/migrations/` in filename order on a fresh catalog database, or use your existing Supabase migration workflow. Existing catalog databases apply only pending migrations before deploying this version: `202611090001_problem_domains.sql` adds domain-scoped search; `202611090002_editorial_exclusions.sql` and `202611090003_additional_editorial_exclusions.sql` unpublish the seven retired physics entries and remove incoming catalog links.
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

The importer preserves existing rows on repeated runs. `--replace-existing` intentionally replaces matching seed IDs; it does not remove unrelated rows. Review holds are never imported. To withdraw a previously published record, set `published=false` in the database; removing it from a seed file does not unpublish it. The editorial-exclusions migrations handle this for the seven approved physics removals, listed in the [data notes](data/open-problems/README.md#deliberately-deferred-or-excluded); their explicit PubPhys exclusions also prevent regeneration/reimport.

`OPEN_PROBLEMS_SOURCE=auto` (default) uses Supabase when configured, otherwise the explicitly labelled seed catalog. `seed` forces a reproducible local preview. A configured database error produces an error/retry state rather than silently switching data sources. The public API is `GET /api/open-problems?domain=quantitative_finance&q=&area=&kind=&review=&sort=&page=&view=&layout=` (`domain=theoretical_physics|ai_ml|quantitative_finance`, default physics; `review=editorial|imported`; `layout=spring|grid`). Repeat `area`, `kind` and `review` for multi-select filters. `total_all` and subject counts cover the selected domain; `total` additionally applies the filters. Subjects from another domain are rejected. PostgreSQL uses ranked English full-text search; seed mode uses AND-word substring search. Public roles can read published provisional records only, with no write permissions.

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
