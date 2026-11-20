# Theoretical physics, foundations of AI/ML and quantitative finance: preliminary seed

The `*.preliminary.jsonl` files contain one independently readable JSON object per line. The original theory selection was compiled on 2026-11-07; the quantum-chaos expansion was compiled on 2026-11-08. These files seed the `/open-problems` website and its optional Supabase database.

The public seed has **467 entries**, grouped into **339 physics**, **119 AI/ML** and **9 finance** questions and research targets. Its **238 editorially scoped records** comprise 119 in `ai-ml.preliminary.jsonl`, 30 in `theory-open-problems.preliminary.jsonl`, 14 in `quantum-chaos.preliminary.jsonl`, 6 in `independent-sources.preliminary.jsonl`, 9 in `quant-finance.preliminary.jsonl`, 55 in `wang-2026.preliminary.jsonl` and 5 in `prove2me.preliminary.jsonl`. `pubphys.preliminary.jsonl` adds **229 source-imported physics records**, explicitly marked `review_level: source_import`. A separate `status-review-holds.jsonl` preserves 10 original held identities. The PubPhys and Wang decision reports retain every candidate's classification; their hold counts describe source occurrences and can overlap. A hold does not judge a claim correct: it means its scope and assessment need checking before an old open label is reused.

## Foundations of AI/ML

The AI/ML selection was compiled on **2026-11-19–20** from `ai-ml-curation.ts` (`npm run problems:build:ai`). It contains 119 `open_question` records with `aiml-` IDs and `domain: ai_ml`, supported by 316 distinct references, across 28 primary subjects. Thirty-two are `specified_model` and 87 `needs_framework`. The latest subjects include time-series, tabular learning, privacy/encrypted learning and symbolic regression/equation discovery. Secondary memberships are included in filter counts and never duplicate a record: alignment has 18, neural architectures 15, symbolic regression five, privacy five, time-series five and tabular learning four.

**Titles are short challenge headings; statements carry the precise mathematical scope.** The original 20 descriptive titles remain in `aliases`, with stable record IDs. 103 entries are original editorial research targets motivated by the literature. Sixteen reformulate published challenges, tagged `published_open_problem` and linked with source role `problem_statement`:

| Challenge | Exact target and status qualification |
|---|---|
| Deep Learning Beyond Linear Models | Feldman–Kamath–Srebro Question 1: dimension complexity versus standard ReLU SGD size/time. Patel's September 2026 separation negatively resolves the separate SQ Question 2, which is not listed as open. |
| How Much Overparameterization Is Enough? | Arvanitakis–Srinivas–Vijayaraghavan: subquadratic rank or a superlinear lower bound for specified ALS-like dynamics on smoothed tensors; generic algebraic recovery is already possible. |
| The Price of Privacy | Nissim–Stemmer–Tsfadia Question 2: finite-class approximate-private PAC sample complexity near log-cardinality despite much smaller VC dimension. Moran–Yan's October claimed near-linear Littlestone bound supersedes the older fifth-power upper bound. |
| Can Every Learnable Rule Be Compressed? | Linear labeled compression, with retained examples and side bits charged. Cai et al.'s November 18 preprint claims near-quadratic compression, resolving the weaker polynomial-size version. |
| How Little Training Data Is Enough? | Hanneke et al.'s weighted regression selection profile. The exact vector recovery threshold and several scalar cells have later claimed resolutions; the target is the remaining intermediate profile. |
| How Hard Is Learning an Equilibrium? | Maiti's fixed-confidence, instance-dependent approximate Nash sample complexity. Strict-pure, expected-bias and regret results are distinct existing baselines. |
| How Many Correlations Are Enough? | Jayakumar et al.'s computationally sufficient Ising statistics: narrow the moment-order gap with precision, table size and observation costs explicit. Order-two statistical sufficiency alone does not give an efficient algorithm. |
| Can Neural Networks Recover Interaction Graphs? | The NeurISE paper explicitly requests structure guarantees. Target finite-data approximation, optimization and invariant structural decisions beyond fixed-basis GRISE and empirical neural recovery. |
| Teaching with Linearly Many Examples | Universal O(d) best-case teaching sets versus the known O(d²) upper bound. Greedy-algorithm lower bounds and graph-induced positive results leave this finite-VC-class conjecture distinct. |
| The Exact Sample Cost of Multiclass Learning | Remove polylogarithmic overhead from DS/epsilon + (Natarajan + log(1/delta))/epsilon² agnostic sample complexity. Realizable multiclass PAC is already sharp. |
| The True Sample Cost of Distribution Testing | A constant-factor, efficiently evaluable instance-optimal functional at the original epsilon; changing the trimming accuracy can create an unbounded sample gap. |
| How Fast Can Forecasts Become Calibrated? | Close the expected cumulative l1-calibration exponent gap between 0.54389 and 0.662942288 under non-anticipating adversarial play. |
| How Large Must a Shallow Network Be? | Polynomial total rational encoding size for exact MAX at two hidden layers. Unrestricted two-layer existence has a later claimed resolution; precision and size are the retained resources. |
| The Price of Strategic Collaboration | Close the n^(2/3) versus n^(3/4) approximation gap for private persuasive signaling on general weighted collaboration graphs, relative to the individually rational optimum. |
| Fast Self-Play at Every Step Size | Square-root total regret for every fixed positive step size in quadratic-FTRL self-play on unweighted n-action cycles. Sufficiently large steps are already covered; exact cumulative-payoff projection and almost-everywhere initialization are retained. |
| How Many Bits Does Reused Data Need? | Multi-pass random-feature SGD with independent forward/backward stochastic rounding. Fresh-data precision laws and exact-arithmetic reuse are established; the target fixes random reshuffling and charges precision, storage and passes. |

The ICL entry incorporates the exact RoPE-softmax representation in arXiv:2609.06685 as `partial_theory`. Its quadratic objective depends on the query, and the identity holds for arbitrary weights. It does not resolve finite-data pretraining, induction-head emergence, task-diversity thresholds or length/shift generalization. The paper's affine no-go proposition assumes a fixed finite cache, fixed position and all real query inputs; it does not exclude approximate or nonlinear shared learners.

Each `status_note` names existing results the target must go beyond. These include fixed-policy Neyman rollout allocation, inverse-success group sizes, compositional RLVR learnability, fixed-verifier and frozen-feature gradient-flow analyses, and fixed-depth pass@k nonidentifiability. Transformer entries account for restricted positive training results and general length-bound impossibility. Nonlinear grokking, weak-to-strong gains, no-collapse conditions and neural scaling exponents already have theory in restricted settings. Sonoda et al.'s value-learning/provability bounds are a baseline for reusable-lemma allocation. Sigmoidal or power-law fits are recorded as `empirical_motivation`; reproducing a fit does not resolve a target.

Source roles extend the general list with `empirical_motivation`, `partial_theory`, `related_algorithm`, `related_result` and `research_agenda`. Lab mission pages are agenda evidence, not proofs. Most sources were checked from publisher or arXiv abstracts; theorem statements of a few primary papers were inspected in full text. `preliminary_source_check` does not certify that a target is open, novel or correctly posed. Records marked `needs_framework` require their remaining architecture, algorithm or computational choices to be fixed before use as theorem-proving benchmarks.

### Model families and mathematical targets

The scope pass replaces unnamed “declared/specified family” placeholders in statements with explicit benchmark classes and parameter ranges. Examples include orthonormal two-feature regression with Gaussian noise and bounded density-ratio shift; bounded-degree Ising heat-bath trajectories observed at fixed spacing with bit-flip noise; and block MDPs with a finite decoder class and charged decoder search. Statements identify what varies, what data the learner sees, the permitted methods and the measured outcome.

Eighty-seven statements now include mathematical definitions. Examples are fresh-task squared risk for ICL, KL excess prediction risk for induction heads, mean-square policy-gradient estimation error, moment-oracle precision, a horizon-wide hazard probability, and practical Lyapunov inequalities with disturbance margins. Error metrics are part of the target: fitting training data, predicting observations, recovering parameters and preserving trajectory distributions are not interchangeable.

The new subject keys are `neural_architectures` and `multi_agent_systems`. Seven source-stated bound additions use tag `bound_gap`; the two additional agent records are explicitly editorial extensions. Hidden-state communication charges finite message precision and learned alignment; the graph-design target fixes local coverage utilities, failed links and coarse correlated equilibrium rather than importing a pure-Nash theorem into a different game. The cyclic-game payoff graph describes actions of two players, not an n-agent communication network.

The **architecture-efficiency expansion** first added 14 targets and 36 sources, including **two AB-MCTS targets**, **three time-series** targets under `time_series_learning`, and **three tabular** targets under `tabular_learning`. The other six cover local credit, continual plasticity, adaptive recurrence, expert routing, hardware-aware sparsity and quantized data reuse. The following additions bring this pass to 32 targets and 95 sources: two DP, two jailbreak, two homomorphic-computation, three KAN, four further symbolic ODE/PDE/manifold/experiment-design, two logistic-regression, two NTK and one Kaplan–Chinchilla reconciliation target. All 32 have formulas and an explicit efficiency payoff; twelve existing entries gain a payoff annotation too, giving 44 `architecture_efficiency` records. Nineteen records are tagged `dynamical_systems`.

The Kaplan–Chinchilla record is an editorial finite-budget confidence/identifiability extension. Pearce–Song and Porian et al. already substantially reconcile the historical exponents through parameter/FLOP accounting and training protocols. The new model fixes total/core counting, full-compute costs, smooth bounded protocol residuals and noisy paid pilots; its assumptions require independent validation before application to real training. It is not a claim that 0.73 versus approximately 0.50 remains unexplained or that either exponent is universal.

AB-MCTS is an existing adaptive-width algorithm, with existing multi-LLM generation in Appendix D. The new questions fix a finite-type answer-tree model and ask for finite-budget overhead or cost-aware multi-episode regret; they are editorial specializations. The paper's 19.2% selected Pass@2 versus roughly 30% coverage at 250 generations motivates the existing verifier-audit question. It does not justify treating candidate coverage as deployed success. See the audit for update conventions, established baselines and inspection depth.

`privacy_preserving_learning` cross-lists the prior PAC privacy question and adds private feature learning/adapter allocation plus encrypted inference/training. Encryption confidentiality, DP under neighboring datasets, correct computation and jailbreak robustness are separate properties. KAN approximation, dimensionality barriers and tight region-count results are baselines, not unresolved existence claims. `symbolic_regression` includes KAN formula identification, learned-library ODEs, coarse-observation PDEs, latent-manifold dynamics and active experiment selection. Prediction, coefficient support, functional equivalence and latent-coordinate conjugacy are distinguished explicitly.

Agents discover the catalogue at `/llms.txt` and `/open-problems/llms.txt`. The metadata API `/api/open-problems/meta` derives taxonomy from `lib/open-problems.ts`; exact-ID JSON is at `/api/open-problems/{id}`. Use ordinary list pagination for complete retrieval, retain provenance fields, and filter exact tags/formulation locally. The guide does not promise novelty or a static snapshot.

These are editorial benchmark specializations of the research directions, not newly verified open problems or automatic consequences of the references. Existing IDs, review levels and formulation labels are preserved. A remaining `needs_framework` flag can now concern the exact architecture, initialization, optimizer or computational model even when the data family and error criterion are explicit. The historical research-note summaries describe the broader directions; the current statements in `ai-ml-curation.ts` define the selected scope. More restrictive positive subcases must identify their changed assumptions rather than claim resolution of the entire parameterized family.

The **AI safety & alignment** subject uses the stable URL key `alignment`. Eight new targets complement reward overoptimization and weak-to-strong learning: hidden backdoors, fallible-judge debate, tamper resistance, safe exploration, selective uncertainty, certified unlearning, prompt injection and control of untrusted agents. Their assumptions distinguish distributional risk from worst-case absence, expected costs from trajectory catastrophe probability, and information-flow enforcement from semantic correctness. Cryptographic backdoor impossibility, existing control games and LLMbda's Lean-verified noninterference theorem are explicitly acknowledged. See [the literature audit](ai-ml-literature-audit.md) for resolved leads and source-check depth.

For a Lean-native research program, formalizing an existing baseline is infrastructure work. A new result must establish a stronger scoped theorem or counterexample, with the statement assessed independently of its kernel-checked proof. Tensor ALS, nonlinear grokking and verifier-guided proof search offer concrete starting points; their inclusion does not assert that the required Lean library infrastructure is already available.

## Quantitative finance

The finance selection was compiled on **2026-11-09** in the same version-one JSONL format as physics: independently readable statements, explicit assumptions, financial motivation, mathematical resolution targets, provisional status notes, literature links and related-record IDs. It contains six open questions and three construction problems, supported by 26 references. `domain: quantitative_finance` selects the finance tab; legacy records without a domain default to `theoretical_physics`.

| Problem | Remaining target and important scope distinction |
|---|---|
| Rough Heston volatility | Same-noise pathwise uniqueness for the singular fractional square-root equation. Weak uniqueness is established; the 2019 Pannier–Jacquier strong-uniqueness claim was withdrawn. |
| Stochastic local volatility | Sharp well-posedness conditions for unregularized continuous variance factors, beyond regularized and finite-state results. |
| Multidimensional martingale mimicking | Conditions for exact Markov mimicking. The unrestricted extension is false; Gaussian-regularized existence is known. |
| Multidimensional martingale optimal transport | Further extremal geometry and certified computation, accounting for the 2026 multi-asset/multi-period dual-attainment preprint. |
| Nonlinear market impact | No-manipulation criteria for specified stochastic/endogenous-liquidity extensions beyond the deterministic-memory classifications claimed in 2026. |
| Fully nonlinear HJB equations | End-to-end efficient solvers under explicit input structure. The cited MLP lower bound is method-specific, not a barrier for every algorithm. |
| Financial networks | Dynamic selection among multiple static clearing equilibria under a specified adjustment mechanism. Computing extremal fixed points is already possible. |
| Epstein–Zin optimization | Well-posedness and verification beyond covered preference/market regimes, including the scope of two 2026 infinite-horizon preprints. |
| Endogenous market efficiency under long-memory order flow | Research program for adaptive liquidity and endogenous impact with a Brownian functional limit; existing propagator, nonlinear-impact, Hawkes and arbitrageur models already explain restricted cases. |

Scholarly search supplied primary-paper metadata and abstracts. Direct arXiv checks covered the withdrawal notice and recent preprint abstracts; the rough square-root boundary paper's introduction and stated results were also inspected. Each source's `locator`, `note` and `checked_on` record the level of inspection. These are preliminary source checks, not an independent proof audit or an exhaustive determination of open status as of 2026. Broad classification and solver questions are marked `needs_framework` so their admissible classes must be fixed before use as theorem-proving benchmarks. Source titles and stable DOI/arXiv links are attached to each record; new text is editorially formulated.

### Research run: Long-Memory Market Efficiency

`qf-endogenous-efficiency-long-memory-order-flow` is represented as a `construction_problem` with `formulation: needs_framework` and a `research_program` tag. It is an exploratory research target, not a claim that diffusive prices under persistent order flow remain unexplained in all models. Statistical physics and stochastic processes are cross-disciplinary tags within the finance domain.

1. **Known mathematics:** perform a theorem-level literature audit, then formalize the critical exponent balance in a restricted discrete-time propagator model. Bouchaud et al.'s sections 3.1–3.2 and equation (23) were inspected: `beta_c = (1 - gamma) / 2` is established. Account separately for their independent diffusive-noise term; a subdiffusive impact component does not force subdiffusive total prices.
2. **Model construction:** specify institutional order splitting, economically motivated quote/inventory strategies and transaction-price formation. Derive the impact response rather than prescribe its cancellation exponent.
3. **Potential original research:** T1, prove equilibrium/adaptation consistency and stationary relative-state dynamics; T2, derive impact scaling; T3, establish a nondegenerate Brownian functional limit; T4, prove robustness or locate failures; T5, prove no profitable impact-only round trips under explicit admissibility and accounting. Stationarity concerns returns and relative liquidity state, not absolute price levels. The functional limit, exact martingale efficiency and no manipulation are different conclusions.
4. **Verification and falsification:** Lean can certify specified claims; stochastic simulations generate conjectures and counterexamples. Order-book data can assess the realism of assumptions, but are not required to settle the mathematical targets.

All five supplied literature links were checked. Sato–Fujiwara–Kanazawa's November 5, 2026 revision, Muhle-Karbe et al.'s Hawkes model and Bonart's October 2026 microfoundation are substantial prior results, not evidence of an untouched problem. Recent sources are pinned to the inspected versions. The first milestone remains a full theorem-level comparison to locate genuinely new assumptions or stronger conclusions; the present source pass does not complete that audit.

## Independent sources

The source directory is published at `/open-problems/sources`. The independent-source pass uses named-author [IQOQI Open Quantum Problems](https://oqp.iqoqi.oeaw.ac.at/open-quantum-problems) and checks its separate solved list. Six new, editorially written questions cover f-routing entanglement, Gibbs-preserving channel resources, constant-gap separability testing, distillable key, absolute separability and composable decoherence functionals. They have no required physical-validation step. References record the numbered problem and sections inspected. The 2026 complete-absolute-separability result is explicitly distinguished from the remaining deterministic higher-dimensional classification.

Additional references attach to existing IDs through `source-enrichment.json`, including the original operator-growth hypothesis (section IV.3, equation 22), a quantum-chaotic-eigenstate review, and IQOQI's PPT-squared and single-prover verification questions. This enrichment leaves imported statements and review labels unchanged. `checked_on` is an access/check date, with `locator` and `note` specifying what was inspected; it is not a current-status certification.

The IAMP/Aizenman 1998–99 collection and the 84-item jgmcm catalog are listed as discovery sources, not wholesale imports. Historical labels require current follow-up. The IQOQI relative-entropy question also needs a closer comparison with the formula papers it cites before selecting a remaining scope; it was not added merely because it appears on the open list. Newly written formulations cite the source authors; papers and expert-list pages are not assigned PubPhys's reuse license.

## Selected Prove2Me research goals

The November 18, 2026 source pass adds the three requested topics as **five records** in `prove2me.preliminary.jsonl`. Each is editorially formulated, `provisionally_open`, `preliminary_source_check` and `specified_model`, with a mission URL, source locator, mathematical target and explicit assumptions. All five are in the physics domain; this pass does not enable a general mathematics catalogue.

| Canonical ID | Scope and boundary of the claim |
|---|---|
| `mathphys-pcr3bp-retrograde-global-section` | All finite mass ratios and energies below the first Lagrange critical value; one suitable retrograde binding and a rational disk-like global section with two-sided returns in a labelled regularized component. This is celestial mechanics, not the integrable-billiard Birkhoff conjecture. |
| `mathphys-thomson-nine-global-optimality` | Some latitude in a tricapped trigonal-prism family is globally optimal for nine unit-sphere charges. Competitors have no imposed symmetry. |
| `mathphys-thomson-ten-global-optimality` | Some latitude in a capped square-antiprism family is globally optimal for ten charges. Neither antipodal poles nor symmetry may be assumed for competitors. |
| `mathphys-thomson-thirty-two-global-optimality` | The specified icosahedron plus its face-center/dual-dodecahedron directions, all on one unit sphere, is globally optimal for 32 charges. |
| `stat-ballistic-deposition-kpz-variance` | Positive two-sided variance bounds of order t^(2/3) for continuous-time nearest-neighbor ballistic deposition on Z with flat initial data and independent rate-one Poisson clocks. This does not assert a Tracy–Widom limit or general KPZ universality. |

The three Thomson instances have independent success criteria and share one Prove2Me mission; they are linked as related finite-N problems rather than duplicated under one broad parent entry. Their candidate latitude parameters are existentially quantified, and uniqueness of minimizers is not required. They remain different from crystallization of infinite planar or spatial particle systems. Ballistic deposition is a non-exactly-solvable classical stochastic model, distinct from the existing quantum Heisenberg-chain KPZ theorem and from the existing 2+1-dimensional KPZ targets. The three-body entry belongs to mathematical physics/celestial mechanics; global sections do not imply integrability of the flow.

**Source checks:** the natural-language and Lean headline goals were inspected for the three-body and KPZ missions and for the N=32 Thomson challenge. The N=9 and N=10 scopes come from the mission's explicit subsidiary-target description; the N=32 goal is not represented as proving them. The cited Liu–Salomão abstracts distinguish near-equal-mass finite-mass results from the Hill limiting problem. Sudijono's September 2026 abstract supplies a linear-in-time variance upper bound, not the desired t^(2/3) law. Other references retain source-reported locators where full text was not inspected. No proof or exhaustive current-literature audit is claimed.

Prove2Me's mission type, completion badge, theorem status and mathematical research status are separate. An unfinished research-paper/textbook formalization is not automatically an open research question, and a completed mission can prove a supporting result narrower than its title. Those metadata are not copied into the catalogue's `status`. In particular, no automatic status change is made to Anderson, Laughlin, ionization or other existing review records. The unselected Kerr–Newman no-hair and integrable-systems formalization missions are not imported in this pass.

The source is listed at `/open-problems/sources`. These five records use our existing seed loader and Supabase importer; there is no external Prove2Me API dependency. We link the source and write our own formulations rather than redistribute mission prose, proof code or papers. [Prove2Me's terms](https://prove2.me/terms) distinguish eligible public Apache-2.0 contributions from earlier or third-party material; no blanket license is assigned here.

After changing the editorial seed, run `npm run problems:build:wang`, `npm run problems:build` and `npm run problems:import -- --dry-run`. The generated reports' aggregate catalogue totals include these five entries; Wang's 100 source decisions and PubPhys's 1,026 source decisions keep their original scopes.

## Wang's 100 theoretical-physics problems

The [September 2, 2026 list](https://wangshaojiang.wordpress.com/2026/09/02/100-open-problems-in-theoretical-physics/) by **Shao-Jiang Wang** was reviewed on **November 18, 2026**. The author explicitly describes AI assistance and dates the literature assessment to **August 31, 2026**. The import records the fetched HTML hash for source identification; it does not imply authenticity or proof verification. The source prose and PDF are not redistributed. New statements, assumptions and resolution targets are editorial reformulations. Representative arXiv links are clearly marked as source-listed bibliography leads, not independently checked theorem evidence.

| Decision | Source entries |
|---|---:|
| New editorial research targets | 55 |
| Mapped to canonical entries | 27 |
| Held for status or formulation review | 18 |
| **Total** | **100** |

The 27 mapped occurrences comprise **25 references to existing targets** (24 distinct IDs) and **two within-list consolidations**. Items 41/86 become one AdS stability/collapse target; items 57/90 become one physical-mass QCD critical-endpoint target with Lee–Yang zeros as a diagnostic. BCJ, SIC-POVMs, ETH, the Ising scaling limit, finite-N AdS5/CFT4 and Yang–Mills existence retain existing identities. Relations and decision notes distinguish a selected subtarget from a claim of exact mathematical equivalence.

**Distinct scopes retained:** continuum SU(3) confinement versus the existing fixed-spacing weak-coupling Wilson-loop area law; radiative post-Minkowskian double copy versus an exact map for general vacuum metrics; a deterministic quantum diffusion limit versus an efficient diffusion-coefficient algorithm; equilibration-time estimates versus eigenstate thermalization; Ising bootstrap truncation convergence versus construction of the continuum Ising theory. Detector-defined SIGW observables, inverse Kerr spectroscopy and bubble-wall transport are theoretical calculations; they do not require new physical measurements.

**Review holds:** entries 7, 26, 37, 45, 46, 51, 61, 62, 66, 67, 70, 71, 76, 79, 81, 83, 94 and 96. These cover overlap with existing contested/claimed-resolution reviews (including Anderson, Euler, Penrose, kagome, MBL and asymptotic safety), or missing model choices needed to distinguish an open question from known results. Kerr vacuum stability is not conflated with nonlinear Kerr–Newman stability or sharp Price-law coefficients. Holds are recorded only in the Wang ledger and never become public seed rows. Existing editorial exclusions remain excluded.

The 55 new entries are **provisional research targets**, all marked `formulation: needs_framework`: each identifies the remaining model, parameter, norm or limit choices needed before formal work. `preliminary_source_check` records source reading and semantic scope review, not an exhaustive status audit. All 100 source titles, numbered URLs, decisions and reasons are in `wang-2026-import-report.json`; `wang-2026-curation.ts` is the editable input. To regenerate and validate:

```sh
npm run problems:build:wang
npm run problems:build
npm run problems:import -- --dry-run
```

The builder rejects incomplete numbering, duplicate new identities/titles/statements, unknown canonical mappings and dangling relations. `wang-2026-source-enrichment.json` supplies additional references without replacing existing statements or promoting review status. The standard importer preserves existing database rows; replacing already published documents is a separate explicit operation. At review time the live API reported `source: seed` and **279 physics entries**, with no Supabase configuration available locally. This catalogue change therefore needs deployment before it appears on the live site; it is not a claim of a completed remote database write.

## Full source collection and screening

The snapshot in `sources/pubphys.snapshot.json` contains **all 1,026 candidates** returned for `cm`, `qi`, `mathph`, `qft`, `grav`, `stat`, `amo`, `nuc`, `hep` and `cosmo`. Collection follows every API page and preserves source revision, record hash, literature status, statement, resolution criterion and references. The collector uses two workers, respects retry responses and reuses unchanged source hashes on refresh.

The current `pubphys-import-report.json` accounts for all 1,026:

| Decision | Records |
|---|---:|
| Added as source-imported | 229 |
| Excluded by scope or editorial selection | 388 |
| Held for status or scope review | 381 |
| Mapped to an existing canonical entry | 28 |

The screening rules in `lib/pubphys-import.ts` inspect the source's resolution criterion, distinguish numerical experiments from physical ones, and retain explicit proof, analytic or computational targets. Physical validation requirements are excluded. Contested statuses, unverified result claims and unclear targets are held. Explicit exceptions and mappings are recorded in `pubphys-overrides.json`; source-to-source and canonical relationships remain reading leads, not equivalences. The pass checked the retained criteria for experimental false positives, but is **not a full-text or expert correctness/status audit**. Conservative screening can also hold an eligible theoretical problem; review the report before refining a decision.

Known overlapping claims (including Néel order, the 3D ferromagnet, MUB dimension six, 2D area laws, Haldane and qLTCs) are withheld even when the source still labels them open. Numerical evidence is not reclassified as proof. Broader/narrower scopes, such as full Yang–Mills existence/mass gap versus a lattice-continuum construction, remain separate and connected.

Imported `statement` and `resolution_target` text is retained from the source, including formulas. `source_status` records the source assessment. `imported_from` retains URL, revision, SHA-256 record identity, retrieval timestamp, origin and CC BY 4.0 license. No cryptographic signature verification or independent validation of a source claim is implied by storing its hash.

### Physics editorial subset by primary area

The following table describes the original 50-record physics editorial subset before the 55 Wang and five Prove2Me additions. The current editorial physics total is 110; the Wang ledger and generated records specify those additions, while Prove2Me adds four primary mathematical-physics records and one statistical-physics record (also cross-listed under mathematical physics).

| Primary area | Records |
|---|---:|
| Quantum chaos | 14 |
| Quantum physics | 6 |
| Quantum computing | 5 |
| Quantum field theory | 6 |
| QED | 2 |
| QCD | 3 |
| Condensed matter | 2 |
| Gravity | 2 |
| Quantum gravity | 2 |
| String theory | 4 |
| Integrable systems | 4 |

Cross-field tags and explicit `secondary_areas` provide additional coverage without counting an entry twice. Subject filters and their counts include both primary and secondary areas, while the table above and graph colors use primary areas. Subject counts therefore need not sum to the unique catalog total. In particular, the Yang–Mills existence/mass-gap record is cross-listed under QCD for its pure SU(3) sector. Multi-select filters use OR across selected subjects/types/review levels and AND between those three groups.

Finance adds two primary records each in volatility models, martingales/transport and market microstructure, plus one each in stochastic control, financial networks and portfolio optimization. The transport and Epstein–Zin questions are also listed under stochastic control. Domains isolate search, counts, filters and graphs; resetting filters keeps the current domain.

Graph positions use a seeded spring layout **between primary-subject groups**, aggregating cross-group recorded relationships, sparse title/tag affinities and secondary-subject memberships. Dots are packed deterministically within each labelled group; no force acts on individual problems. A Grid button arranges the same groups in rows. Inferred topic links are rendered as dashed lines and are never written into the catalog's `relations` field. They do not imply equivalence, causality or proof dependence. Filtering changes the visible groups and recomputes their layout.

## Scope

The physics scope below applies to the physics domain. Quantitative finance adds mathematical modelling, probability, optimization and computational questions with an explicit financial interpretation. Mathematical guarantees, rather than empirical fit or profitability, are the resolution targets. Foundations of AI/ML adds learning-theoretic, optimization, statistical and algorithmic questions about training and evaluating learning systems; resolution targets are theorems, lower bounds, counterexamples or provable algorithms, not benchmark gains.

Include challenging conjectures, open questions and construction problems with a direct physical or quantum-computational interpretation, for which a proof, counterexample, no-go theorem, controlled analytic construction or well-defined computational result would constitute progress. Resolution targets do not require new laboratory experiments or astronomical observations. Establishing the empirical applicability of a model is a separate question. Coverage includes quantum chaos, quantum physics and computing, QFT (including QED and QCD), condensed matter, gravity, quantum gravity, string theory and integrable systems.

Exclude pure number theory, geometry, algebra and other pure-mathematics problems without a specific physics question, **with an explicit requested exception for Hilbert–Pólya and GUE pair correlation of the Riemann zeros**, connected to quantum-chaotic spectral theory. Quantum measurement design and Hamiltonian complexity remain in scope because they concern operational quantum tasks. Experimental anomalies without a well-defined theoretical target are excluded. Inclusion does not assert that a problem is absent from MathDB: physically meaningful overlap is possible, and no exhaustive MathDB comparison was performed.

## Status and provenance

All public records are **provisionally open**, not certified open as of the compilation date. Editorial selection used scholarly abstracts/metadata, specialist problem pages, reviews, and targeted web searches. The complete literature and proofs have not been independently audited. `review_level: preliminary_source_check` is deliberately weaker than a full-text, citation-traced or expert review; `source_import` is weaker still and does not assert individual source checking. `compiled_on` dates this catalog, not the last authoritative confirmation that each problem remains open.

Unauthenticated Semantic Scholar Graph API paper lookup and search were attempted during this pass; both returned HTTP 429. No Semantic Scholar citation expansion was completed. arXiv metadata/abstract queries and directly accessible source pages supplied the available checks.

Editorial statements are reformulations; imported statements are source text. `formulation: needs_framework` flags questions whose admissible theories, observables or convergence requirements need to be fixed before a formal theorem can be stated. For imports this flag follows the source's well-posed/phenomenon classification, not an independent scope certification. Even records marked `specified_model` need expert checking before becoming theorem-proving benchmarks. A source with role `background` explains the setting; it is not evidence of current open status. PubPhys is an explicitly AI-compiled seed, not independent specialist verification.

No numerical experiment, finite-size observation, citation count, AI verdict or formalization of only a supporting lemma is treated as a solution of an infinite-volume or continuum conjecture.

## Fields

- `schema_version`, `id`, `title`, `aliases`: stable catalog identity. IDs must not change when a title changes.
- `domain`: `theoretical_physics` (also the default when absent), `ai_ml` or `quantitative_finance`. Primary and secondary subjects belong to the declared domain.
- `kind`: `conjecture`, `open_question`, or `construction_problem`.
- `primary_area`, optional `secondary_areas`, `tags`: one primary grouping plus subject-filter memberships and topical labels; a cross-listed problem is not duplicated.
- `statement`, `assumptions`: the target and its scope, including dimension, model, regime and limits.
- `physics_motivation`: the domain motivation. This legacy version-one field also holds the AI/ML and financial interpretations; every domain renders it as the card/detail introduction.
- `resolution_target`: what a mathematical resolution would establish.
- `formulation`: `specified_model` or `needs_framework`.
- `status`, `status_note`, `review_level`, `compiled_on`: provisional assessment and qualifications.
- `sources`: title, stable URL and role (`problem_statement`, `review`, `partial_progress`, `background`, `discovery_catalog`, `status_context`). `status_context` can document a withdrawn claim. References are leads for the full literature review; exact page/theorem locators should be added after full-text inspection.
- `relations`: links to other IDs in the main seed **or the review-hold file**, with a relationship and explanation. Related models or conjectures are not assumed equivalent; a link to a withheld problem does not assert it is open.

The review-hold file has a smaller schema: `schema_version`, `id`, `title`, `status: review_hold`, `reason`, `claim_urls`, `background_urls`, and `compiled_on`. It records why an item was withheld without adding it to the open-problem count. URLs identify potentially overlapping work; no proof in those manuscripts has been audited in this pass.

## Deduplication policy

There is one record per chosen problem scope, with aliases and cross-field tags. Different settings are kept separate only when the model, assumptions or conclusion genuinely differ. For example:

- Yang-Mills existence/mass gap and a Wilson-loop area law are related but are not the same assertion.
- Weak and strong cosmic censorship ask different questions; strong censorship specifies extension regularity.
- The finite-N AdS/CFT correspondence and Lorentz invariance in the BFSS large-N limit concern different dualities and limits.
- Hydrodynamic limits for the quantum Lieb-Liniger gas, classical Toda chain and KdV soliton gas are distinct microscopic problems.
- BGS universality and a concrete billiard instance are linked as a family and special case. The weak-integrability-breaking crossover and its golden-rule subproblem are consolidated in one record.
- Hilbert–Pólya is an operator-construction problem; conditional Montgomery pair correlation is a different statistical assertion and does not prove the Riemann hypothesis.

This seed has been checked for duplicate IDs, titles and repeated statements. It has not undergone a comprehensive semantic-equivalence audit. Future source occurrences should attach to these records, not create a fresh problem merely because another paper restates one. Keep proposed merges reversible.

## Deliberately deferred or excluded

- **Quantum-clock precision per unit entropy** (`qi-quantum-thermo-clock-precision-entropy`) and **causal-inequality violation with superposed spacetime** (`qi-causal-order-qrf-causal-inequality-realization`): removed by editorial request on 2026-11-09 as outside the preferred research priorities. The clock statement also includes a physical demonstration. These are selection decisions, not solved-status claims. Explicit entries in `pubphys-overrides.json` prevent regeneration, and the source snapshot/decision report retain the audit trail. `202611090002_editorial_exclusions.sql` unpublishes existing Supabase rows and removes incoming relations.
- **Five additional approved editorial removals (2026-11-09):** black-hole-to-white-hole tunnelling (`grav-evaporation-backreaction-black-to-white`), epistemic-state overlap (`qi-measurement-problem-psi-epistemic-overlap`), general/imperfect quantum reference frames (`qi-causal-order-qrf-qrf-general-frames`), three-path interference in beyond-quantum theories (`qi-quantum-principles-higher-order-gpt`), and a principle selecting exactly quantum correlations (`qi-quantum-principles-quantum-set-principle`). The current formulations were deprioritized for model dependence, limited direct physical payoff or an overly open-ended target. Their specific reasons are recorded in `pubphys-overrides.json`; `202611090003_additional_editorial_exclusions.sql` unpublishes existing Supabase copies and removes incoming links. These remain editorial exclusions rather than solved-status claims.
- **Spin-1 Heisenberg/Haldane gap:** a recent proof and specialist exposition surfaced during discovery; do not reuse the older open label without reviewing them. See [Hal Tasaki's exposition](https://haltasaki.github.io/writings/AI/OpenAI_Haldane.html).
- **Laughlin spectral gap:** recent claimed resolutions and new bounds require scope-by-scope assessment. See [the claimed spherical result](https://github.com/openai/math/tree/main/preprints/A-Fock-space-inequality-and-the-Laughlin-spectral-gap-September-24-2026) and [arXiv:2610.18854](https://arxiv.org/abs/2610.18854).
- **General spacetime Penrose inequality:** recent claims require assessment before selecting a remaining open formulation. See [arXiv:2512.04137](https://arxiv.org/abs/2512.04137).
- **Constant-parameter quantum locally testable codes:** rapidly changing results and claims need a current audit, including whether a construction is conditional. See [arXiv:2609.26735](https://arxiv.org/abs/2609.26735).
- **NLTS, existence of asymptotically good quantum LDPC codes, and AME(4,6):** the historical existence questions have known positive results; they are not listed as open.
- Generic pure-mathematics conjectures remain out of scope, except for the two explicitly selected Riemann-zero quantum-chaos questions.

## Suggested next pass

For each retained record, inspect full text, add exact locators, trace later citations and alternative names, identify restricted-case solutions, and obtain a dated expert assessment. In particular, scope-check recent proofs against the full stated regime before marking a problem solved or retaining an older open label. Track physical significance, likely tractable subcases and formalization readiness separately from open status.

The catalog text is editorially reformulated. PubPhys discovery records and their listed scholarly reviews are credited in each relevant entry; these formulations refine their scope and sometimes correct distinctions (for example, critical-line-only zeros versus all zeros, or pair correlation versus spacing statistics). PubPhys seed records originate from its [AI-assisted seed collection](https://pubphys.com/docs/seed), not a specialist review of every entry. Its [terms](https://pubphys.com/docs/terms) license contributed text under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); source material retains that license and attribution. External papers and datasets retain their own licenses; links do not imply that their full texts can be redistributed under this repository's license.
