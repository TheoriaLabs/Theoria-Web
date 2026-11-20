# AI/ML expansion: literature and scope audit

Updated through 2026-11-20. This log accompanies `ai-ml-curation.ts`; it is a preliminary source assessment, not a proof audit or exhaustive open-status determination. Historical sections preserve their intermediate catalogue counts; the current snapshot has 119 AI/ML records and 316 distinct references.

The 36-to-50 expansion used primary PMLR proceedings, arXiv searches and arXiv abstract/HTML pages. Undermind semantic search was unavailable during this pass due to its account quota. Canonical URLs and inspection notes are stored with the catalogue records; unindexed bibliographic leads are also preserved in the research notes.

## Published leads excluded or narrowed

| Lead | Evidence checked | Decision |
|---|---|---|
| Is interaction necessary for order-optimal one-bit mean estimation? | [COLT 2026 problem](https://proceedings.mlr.press/v336/lau26a.html), PDF Sections 2–4; [Lau–Scarlett follow-up](https://arxiv.org/abs/2609.08564) and [Miao construction](https://arxiv.org/abs/2607.24358), abstracts surfaced by primary search | Not added as open. Later papers claim non-adaptive protocols attain the adaptive minimax rate. The follow-up also claims the sample/interval-complexity trade-off. |
| Root anti-concentration for online algorithm design | [Balcan–Pegden–Sharma COLT problem](https://proceedings.mlr.press/v336/balcan26a.html), PDF Questions 1–2; [Wang et al.](https://arxiv.org/abs/2608.01670), primary-search abstract | Not added as open. The later paper claims sharp local characterizations and completed transition-to-regret applications. Broader online design questions need separate formulations. |
| Polynomial sample compression for all binary VC classes | [Cai et al.](https://arxiv.org/abs/2611.25011v1), full HTML definition, introduction and Theorem 1.1 | Only linear-size compression is retained. The preprint claims O(d² log² d) examples and O(d log² d) side bits; it discloses autonomous AI-assisted discovery. Neither its proof nor dependencies have been independently audited here. |
| Exact weighted vector-regression recovery threshold | [COLT 2025 problem](https://proceedings.mlr.press/v291/hanneke25e.html), PDF Sections 2–4; [vector](https://arxiv.org/abs/2608.30254) and [scalar](https://arxiv.org/abs/2608.28007) follow-up abstracts | Only the unresolved intermediate profile is retained. The threshold (m+1)d, near-threshold value and several scalar cells are claimed known. |
| General polylogarithmic Nash regret | [Zhang](https://arxiv.org/abs/2609.34812), primary-search abstract; [Maiti COLT problem](https://proceedings.mlr.press/v291/maiti25b.html), PDF Sections 2–3 | Do not reuse the regret question as open. Retain tight instance-dependent, fixed-confidence approximate-equilibrium identification, accounting also for [general-dimensional expected-bias bounds](https://arxiv.org/abs/2602.12513). |

The earlier pass also excluded the SQ formulation of Feldman–Kamath–Srebro after [Patel's negative resolution](https://arxiv.org/abs/2609.19780v1), retaining only the standard-network SGD formulation.

## Safety targets and their existing baselines

| Target | Baseline that must not be relabelled as open |
|---|---|
| Can Hidden Backdoors Be Ruled Out? | [Cryptographically undetectable backdoors](https://arxiv.org/abs/2204.06974v2), including white-box cases; [empirical persistence through safety training](https://arxiv.org/abs/2401.05566v3). Positive detection needs real structural/access restrictions. |
| When Can Debate Reveal the Truth? | [Doubly-efficient protocols](https://arxiv.org/abs/2311.14125), [instance-optimal dominant-strategy protocols](https://arxiv.org/abs/2610.02557), and [online learnability with judge-error limitations](https://arxiv.org/abs/2611.17303). Target noisy-judge strategy learning, not protocol existence alone. |
| Safety That Survives Fine-Tuning | [TAR](https://arxiv.org/abs/2408.00761), [pretraining suppression](https://arxiv.org/abs/2611.15479) and [information-only certification limits](https://arxiv.org/abs/2610.09004). State the allowed updates and account for reparameterization. |
| Learning Without Catastrophic Experiments | [Safe reachable-set exploration](https://arxiv.org/abs/1606.04753) and [offline stochastic action-model learning](https://proceedings.mlr.press/v336/deng26a.html). Target a costed online trajectory-risk frontier with explicit safe access. |
| Knowing When Not to Answer | [Conditional-coverage impossibility](https://arxiv.org/abs/1903.04684v2), [adaptive coverage](https://arxiv.org/abs/2106.00170v3), [adaptive-logging coverage](https://arxiv.org/abs/2609.30811v2), [adversarial abstention](https://arxiv.org/abs/2506.14067v6) and [query-only feedback](https://arxiv.org/abs/2608.07139v2). Target stronger joint subgroup/window guarantees with useful answering rates. |
| Can a Model Truly Forget? | [Memory lower bounds](https://proceedings.mlr.press/v291/cherapanamjeri25b.html), [retain sensitivity](https://arxiv.org/abs/2603.03172) and [continual-learning certificates](https://arxiv.org/abs/2606.29832). Define the adaptive deletion experiment and future-release guarantee; past outputs cannot be retracted. |
| Can Agents Resist Prompt Injection? | [CaMeL](https://arxiv.org/abs/2503.18813) and [LLMbda](https://arxiv.org/abs/2602.20064v2), whose abstract reports a Lean-verified interpreter and termination-insensitive probabilistic noninterference. Target richer concurrent/termination-sensitive observations and controlled information release; the Lean sources were not checked here. |
| Controlling an Untrusted AI | [Control evaluations](https://arxiv.org/abs/2312.06942v5), [formal control games](https://arxiv.org/abs/2409.07985) and [diffuse-control evaluations](https://arxiv.org/abs/2606.08892). Target finite-data uncertainty and adversarial long-horizon risk, not the first control-game formulation. |

Safety-source checks above were abstract-level. They motivate and constrain the proposed extensions; they do not establish that each extension is unresolved.

## Further additions

- **Why Tiny Updates Unlock New Capabilities:** multi-layer adapter rank allocation with training and retention guarantees. Existing [rank-one SGD dynamics](https://proceedings.mlr.press/v291/dayi25a.html), [expressivity](https://arxiv.org/abs/2310.17513) and [one-layer knowledge extraction](https://arxiv.org/abs/2508.00901) are baselines.
- **The Memory Required to Reason:** generation-aware structured KV compression. [Worst-case barriers](https://proceedings.mlr.press/v291/haris25a.html) rule out universal sublinear memory; [SubGen](https://arxiv.org/abs/2402.06082) provides a structured approximation baseline.
- **When Does Denoising Learn a Distribution?:** joint finite-dataset neural optimization, generalization and sampling error. Existing [score/density reductions](https://proceedings.mlr.press/v336/chewi26a.html), [mixture learning](https://proceedings.mlr.press/v291/chen25e.html), [population transformer training](https://arxiv.org/abs/2604.10074), [reverse-Fisher convergence](https://arxiv.org/abs/2606.19876) and [empirical-score memorization](https://arxiv.org/abs/2501.15785v2) define the starting point.

These three additions were checked from primary abstracts and targeted title/topic searches. A theorem-level citation audit is the next step before treating any catalogue item as a novelty-qualified Lean benchmark.

## RMT, optimizers, memory, kernels, inverse Ising and retrieval

The subsequent 50-to-61 expansion adds eleven source-motivated targets and 23 references. Checks used primary abstracts and targeted arXiv searches; these are proposed extensions, not claims that the entire topic is unexplained. A few searches returned HTTP 429, so absence of a result is not treated as evidence of openness.

| Topic and target | Established baseline and remaining scope |
|---|---|
| The Random Matrix Theory of Learning | [Guionnet–Piccolo](https://arxiv.org/abs/2502.18428v2) analyze independent heavy-tailed weights; [Moniri–Hassani](https://arxiv.org/abs/2605.17767v2) characterize two learned steps; [Park et al.](https://arxiv.org/abs/2606.28486) give solvable spectral dynamics. Target sustained nonlinear training with data reuse and controlled finite-size errors. |
| Can Weight Spectra Predict Generalization? | [Heavy-tailed ensemble models](https://arxiv.org/abs/2506.03470) and [SETOL](https://arxiv.org/abs/2507.17912v2) already propose performance diagnostics. Target calibrated task-aware prediction; eigenvalues alone cannot determine arbitrary task risk. |
| How Much Optimizer Memory Is Necessary? | [Adafactor](https://arxiv.org/abs/1804.04235) already factors second-moment accumulators; [SMMF](https://arxiv.org/abs/2412.08894) has regret theory. Target a sharp Adafactor/full-accumulator comparison under nonseparability and changing gradients. |
| When Does Muon Beat Adam? | [Practical finite-step Muon convergence and counterexamples](https://arxiv.org/abs/2610.34158v2) and [staged transformer training](https://arxiv.org/abs/2611.04465) already exist. Target a matched-resource geometry-dependent comparison under simultaneous nonlinear training. The prior AdamW edge-of-stability entry is cross-listed in the optimizer subject. |
| How Much Can a Neural Network Remember? | [Knowledge-capacity experiments](https://arxiv.org/abs/2404.05405) and [attention tensor-rank analysis](https://arxiv.org/abs/2502.05076) are known. Target learnable, retrievable finite-precision information. Two bits per parameter is an empirical finding in the studied recipes, not a universal upper bound. |
| How Many Memories Can Coexist? | [Modern Hopfield retrieval](https://arxiv.org/abs/2008.02217v3) and [asymmetric noise-robust cycle constructions](https://arxiv.org/abs/2605.24611) already demonstrate large attractor counts. Target learning a prescribed correlated memory family, charging weights, patterns and precision; attractor count is not independent-information capacity. |
| Learning the Right Kernel | [Linear RFM trajectories](https://arxiv.org/abs/2610.09196), [AGOP subspace recovery](https://arxiv.org/abs/2605.15082) and [empirical symmetry effects](https://arxiv.org/abs/2604.00316v2) are known. Target finite-data nonlinear recursive kernel learning with reuse, noise and prediction-risk guarantees. |
| Learning Interactions from Fluctuations | [Bresler's independent-sample Ising learning](https://arxiv.org/abs/1411.6156v2) and [Gaitonde et al.'s continuous-time evolution learning](https://proceedings.mlr.press/v336/gaitonde26a.html) already handle important regimes. Target sparsely observed/noisy trajectories and the observation-time frontier, not mere temporal dependence. |
| Revealing Hidden Interactions | [Latent kinetic Ising inference](https://arxiv.org/abs/2609.17213) already provides a variational model and empirical recovery. Target explicit identifiability and finite-trajectory bounds; arbitrary hidden-spin models can be observationally equivalent. |
| The Geometry of Search | [Embedding-based retrieval limitations](https://arxiv.org/abs/2508.21038) and [SQ-hard query encoders](https://arxiv.org/abs/2610.02749) separate geometry from learnability. Target structured capacity/precision/training/search trade-offs. |
| Learning Relevance from Biased Feedback | [Counterfactual ranking](https://arxiv.org/abs/1608.04468), [Bayesian inspection models](https://arxiv.org/abs/2605.24233) and adaptive-logging coverage are existing methods. Target joint unknown exposure/preferences and a charged intervention budget. |

The new URL subject keys are `random_matrix_theory`, `optimization_theory`, `neural_memory`, `kernel_learning`, `statistical_inference` and `information_retrieval`. They remain within `domain=ai_ml`; inverse Ising questions are not counted again in the physics catalogue.

## Embeddings, JEPA, RNNs, Bayesian learning and data efficiency

Nine further targets expand the catalogue from 61 to 70, with 15 additional sources. The following primary abstracts were checked:

- **Shared embedding geometry:** [Balestriero–LeCun's October alignment theorem](https://arxiv.org/abs/2610.39302v1) already addresses good views and departures from them. The new target concerns finite-data optimization, incomplete modalities and costed alignment, not the broad existence of common representations.
- **JEPA control sufficiency:** [Cui et al.](https://arxiv.org/abs/2606.27014v2) already connect prediction error to planning regret. [Pendharkar](https://arxiv.org/abs/2606.30068) demonstrates the difference between predictability and decision relevance. Target partial observation and the cost of preserving task-relevant information.
- **JEPA collapse dynamics:** [Drive vs. Decay](https://arxiv.org/abs/2610.02344) gives early linearized stability; [LeJEPA](https://arxiv.org/abs/2511.08544v3) supplies an existing regularized alternative. Target finite-batch nonlinear trajectories and useful-rank persistence.
- **RNN trainability:** [Allen-Zhu–Li](https://arxiv.org/abs/1902.01028) already prove efficient sequence learning; [Wang et al.](https://arxiv.org/abs/2211.10582v2) cover stable linear systems. Target compact nonlinear state discovery with simultaneous memory and stability control.
- **Recurrent credit assignment:** [Adaptive TBPTT](https://arxiv.org/abs/1905.07473) and [Kronecker-factored RTRL](https://arxiv.org/abs/1805.10842) are established baselines. Target slowly or nonuniformly decaying sensitivities with sharp memory/bias/variance accounting.
- **Bayesian predictive reliability:** [Misspecified VB](https://arxiv.org/abs/1905.10859v2), [generalized Bayes](https://arxiv.org/abs/2210.06921v3) and [brittleness](https://arxiv.org/abs/1304.6772v3) already have theory. Target finite-data, computation-aware predictive guarantees under specified misspecification and stability conditions.
- **Learned priors:** [Cannella et al.](https://proceedings.mlr.press/v336/cannella26a.html) prove universal-prior Poisson empirical-Bayes guarantees while explicitly omitting architecture/training analysis. Target approximate learned inference with finite pretraining and task shift.
- **Active representation learning:** [Black et al.](https://proceedings.mlr.press/v336/black26a.html) settle important no-synthesis halfspace and decision-stump cases. Target joint nonlinear representation discovery and labelled-query costs.
- **Adaptive data acquisition:** [Harding et al.](https://proceedings.mlr.press/v336/harding26a.html) give known-source-geometry minimax allocations. Target learning unknown source composition or bias while spending the same acquisition budget.

These are editorial extensions, not new theorem claims. The new subject keys are `world_models`, `recurrent_learning`, `bayesian_learning` and `data_efficient_learning`; the existing representation subject is labelled **Embeddings & representations**.

## RL, inverse RL and robotics/control

Six further targets expand the catalogue to 76 entries and 190 references. Their motivation is field-level importance, not a published ranking of research difficulty. Primary abstract checks identify these baselines:

- **Exploration:** [Mhammedi](https://proceedings.mlr.press/v291/mhammedi25b.html) gives all-policy-linear sample/oracle efficiency; [Foster et al.](https://proceedings.mlr.press/v291/foster25a.html) characterize coverage-driven computational costs in a foundation-model oracle framework. Target unknown-representation learning with real oracle/computation costs.
- **Offline RL:** [Foster et al.'s barriers](https://arxiv.org/abs/2111.10919v2) already show that realizability plus concentrability can be insufficient. Target an achievable structural frontier and robust improvement evidence in a declared family.
- **Reward identification:** [Skalse–Abate](https://arxiv.org/abs/2411.15951) characterize standard behavioral ambiguity and misspecification; [Schlaginhaufen–Kamgarpour](https://arxiv.org/abs/2605.14599v2) give fast rates for specified reward classes. Target partial observations and uncertain demonstrator models with explicit reward equivalence classes.
- **Active transferable intentions:** [Cao–Cohen–Szpruch](https://arxiv.org/abs/2106.03498) already identify rewards using sufficiently different environments or discounts. Target cost-optimal adaptive demonstration design, not basic multi-environment identification.
- **Nonlinear dual control:** [Wang et al.](https://arxiv.org/abs/2501.10261v2) already establish logarithmic regret under optimal-policy excitation and square-root bounds otherwise; [Luo et al.](https://arxiv.org/abs/2207.14419) give safe learning/control guarantees. Target constrained, partially observed excitation and planning.
- **Robotic certificates:** [Wang et al.](https://arxiv.org/abs/2602.05311) handle bounded dynamics perturbations and [Liu et al.](https://arxiv.org/abs/2403.10007) handle compositional verification. Target maintaining certificates during coupled learning and hybrid/sampled execution.

The [COLT 2024 kernel-RL regret question](https://arxiv.org/abs/2406.15250) was also checked as a lead. [Hu–Simchi-Levi's November revision](https://arxiv.org/abs/2610.34045v2) claims a minimax expected-regret exponent for Sobolev kernels and explicitly describes it as a partial resolution. That Sobolev subcase is not added as open; other kernels and parameter dependencies would require a separate statement-level audit.

## Lokhov's interaction-screening line

The next pass adds two explicitly posed directions, bringing the catalogue to 78 targets, and strengthens the existing sparse-observation Ising target. Eight references trace this line; a separate RoPE paper below brings the overall reference count to 199. Search/lookup quota remained unavailable, so these checks used primary arXiv pages and locally extracted PDFs.

| Source | Checked scope and catalogue consequence |
|---|---|
| [Interaction Screening](https://arxiv.org/abs/1605.07252v3) and [Optimal Structure and Parameter Learning](https://arxiv.org/abs/1612.05024v2) | Primary abstracts, plus the latter PDF p.2 and Discussion p.9. Convex local estimators and independent-sample recovery are established. Sample complexity's precise temperature exponent is not determined by the phrase “optimal regime.” |
| [Efficient Learning of Discrete Graphical Models](https://arxiv.org/abs/1902.00600v3) | Primary abstract: generalized screening, discrete alphabets and multi-body interactions under identifiability. Enumeration of a high-order basis can be expensive. |
| [Neural interaction screening](https://arxiv.org/abs/2006.11937v2) | PDF Sections 3–5 and p.10: neural structure guarantees are explicitly left unanswered. Function-space/global-optimum arguments and empirical first-layer thresholding do not prove finite-SGD graph recovery. Added **Can Neural Networks Recover Interaction Graphs?**, with invariant structure tests and explicit approximation/optimization assumptions. |
| [Learning Ising Model Dynamics](https://arxiv.org/abs/2104.00995v2) | Primary abstract: dynamical observations can improve sample requirements exponentially in the studied regimes. Dynamics itself is not an unaddressed setting. |
| [Metastable samples](https://arxiv.org/abs/2410.13800v4) | PDF Definitions 1–2, Condition 1 and Theorem 1: strong metastability controls a detailed-balance defect and average single-site conditional discrepancy. Learning uses independent draws from that law. This is not a theorem for arbitrary correlated, coarsened or noisy trajectories. |
| [Computationally sufficient statistics](https://arxiv.org/abs/2602.12449v2) | PDF Sections 2.1–2.4, Theorem 1 and Conclusion p.10: moments of order O(gamma + log(1/epsilon)) suffice with runtime polynomial in table size. Lower orders and restricted families are explicit directions. Added **How Many Correlations Are Enough?**, charging precision, table size and measurement protocol. Known-neighborhood priors are already covered. |
| [NeurISE discrete diffusion](https://arxiv.org/abs/2602.20293v3) | Primary abstract: a later application with round-robin conditionals, not a checked resolution of neural graph-recovery theory. |

Related leads include [autoregressive variable ordering](https://arxiv.org/abs/2602.20394v2), [finite-sample score matching](https://arxiv.org/abs/2605.14168), and the separate [low-temperature SK-learning line](https://arxiv.org/abs/2411.11174). They are not extra catalogue entries or evidence that all dense-model questions remain open. The residual noisy/coarsened trajectory and latent-variable entries remain editorial extensions. This targeted follow-up check is not exhaustive certification of the two explicit directions' current openness.

## Does arXiv:2609.06685 settle in-context learning?

Read the full [HTML of Huang, Chlon and Chlon, *RoPE Attention Is an Exact Forward-Pass Gradient Step with Softmax Intact*](https://arxiv.org/html/2609.06685v1), including all proofs and Section 5. Compared the claims with the catalogue's four ICL-related formulations and the [von Oswald et al. primary abstract](https://proceedings.mlr.press/v202/von-oswald23a.html).

- **Theorem 1 and Corollary 2:** exact effective matrix and unit gradient step on a weighted quadratic with softmax and rotary positions retained, for arbitrary projection weights. Crucially, the coefficients, effective matrix and objective depend on the query. The proof uses centered values and the exact identity exp(s) - 1 = s rho(s); differentiating the quadratic at zero gives the matrix. This answers the narrow representation question, not whether useful task learning occurs.
- **Proposition 3:** a nonconstant softmax head with a fixed finite bank and fixed query position cannot equal one fixed affine function on all real query inputs. The proof contrasts a bounded convex average with an unbounded nonconstant affine map. It does not exclude nonlinear shared learners, approximate reuse, finite-query interpolation or restricted-domain guarantees.
- **Equation 13:** exactly decomposes the error from reusing an anchor query's matrix. This is an identity, not a distributional guarantee that reuse error is small. The matrices also depend on the score-shift convention (Section 4.1).
- **Section 5:** one Qwen2.5-0.5B layer, 16 contexts and 32 alternative continuations. Reconstruction checks support the algebraic identity. Combined projected frozen reuse is worse than the constant-anchor baseline (all-anchor relative RMSE 2.795); this gauge/protocol-specific experiment is not a general ICL accuracy or causal-learning result.

| Existing target | Resolution by this paper? |
|---|---|
| How Transformers Learn to Learn | No. No finite-data pretraining convergence, task-risk or shifted-task guarantee. Add the exact representation as `partial_theory`, preserving the target. |
| From Memorization to In-Context Learning | No. No task-diversity threshold or held-out-task learning analysis. |
| How Induction Heads Emerge | No. No dynamics or sample/step bound for the emergence of a trained circuit. |
| Why Transformers Generalize to Longer Sequences | No. Fixed-content RoPE derivative/finite-difference identities do not establish extrapolation performance. |

Modern Hopfield networks already provide an exact softmax correspondence in another formulation; the paper itself acknowledges this. Do not call this the first attention/optimization connection or the resolution of a named general ICL conjecture. A useful next question is when a shared learned state or query-conditioned update provably reduces held-out task risk, with approximation and training errors controlled. That remains within the existing training-and-transfer entry rather than creating a duplicate grand challenge.

## Scope and mathematical-definition revision

In response to review of vague “declared family” wording, the statements now select explicit benchmark classes rather than leaving the family entirely to a future solver. This is an editorial scope revision, not a new literature audit of every selected special case. The 78 IDs, source roles and provisional review labels remain unchanged; 46 statements contain mathematical definitions and formulas.

| Topic | Selected scope / quantitative target |
|---|---|
| ICL and task diversity | Gaussian inputs, two unknown shared orthonormal ReLU features, bounded task coefficients and Gaussian noise. Fresh-task squared risk; transfer restricted by a density-ratio bound. Architecture/training details still need freezing. |
| Sequence learning | Finite-state map/permutation composition; explicit state count, train/test horizons and error thresholds. RNNs use a stated gated recurrence and finite-bit hidden states. |
| Inference | Bounded-degree Ising heat-bath dynamics with fixed observation spacing and known bit-flip noise; kinetic hidden-spin models state their logistic update and observational equivalences. Moment learning specifies order and additive oracle precision. |
| Optimization and spectra | Matrix factorization with a rank-bounded target; Adafactor's factorization residual is defined. Proportional-dimension noisy tanh teacher–student models for spectral evolution/diagnostics. |
| Learning and representations | Explicit Gaussian teacher–student models, polynomial multi-index kernel tasks, linear-Gaussian multiview observations and Gaussian mixtures for denoising/self-training. Approximation, optimization and population error remain distinct. |
| Safety and verification | Bounded-coordinate triggers, circuit-evaluation debates, restricted gradient-step tampering, trace-based agent information flow, and a probability bound on any hazardous visit. |
| RL/control | Finite block MDPs with a decoder class and charged search; linear rewards with stated observation/rationality uncertainty; a parametric nonlinear plant and disturbance-aware local Lyapunov inequalities. |

Scope parameters are not fixed to favorable numerical values after observing a result. A theorem should report how its bound depends on them, or identify the restricted parameter range it resolves. Existing assumptions continue to list algorithmic choices; `needs_framework` is not promoted merely because the prose now contains equations. The displayed formulas are checked by the catalogue's KaTeX test; this verifies rendering, not mathematical truth.

## Quantization research leads

Scholarly search is available again. Fifteen papers were indexed in the research folder and compared with primary model/conclusion text for the two strongest explicit directions:

1. **Precision versus depth:** [Every Bit Counts](https://arxiv.org/abs/2602.02707v1), Section 4, explicitly leaves fine-grained multi-layer precision/expressivity trade-offs open. Its one-layer equality construction has a particular encoding and arithmetic convention; it is not a universal INT4 threshold. [Low-precision softmax CoT simulation](https://arxiv.org/abs/2605.18079) and [padded-transformer circuit characterizations](https://arxiv.org/abs/2605.30523) already cover broader simulation questions. A benchmark must fix depth, heads, dimensions, input encoding, padding/CoT access and rounding semantics before asking for the minimum precision.
2. **Stochastic rounding with reused data:** [Wang–Mahoney](https://arxiv.org/abs/2610.41074v1), Sections 2, 5 and 6, proves fresh-Gaussian-sample laws and explicitly leaves finite-dataset reuse to future work. Keep its fixed random first layer, Gaussian regression and independent forward/backward feature rounding, then replace fresh draws by repeated shuffled epochs of one dataset. Ask for population risk and precision/compute trade-offs jointly in dataset size and epoch count. Its bits are mantissa precision with an unbounded exponent, and other arithmetic is exact; do not rebrand this as a fully low-bit hardware theorem.

Existing baselines include [tight ReLU approximation regimes](https://arxiv.org/abs/2405.01952), [finite-sample STE](https://arxiv.org/abs/2505.18113), [OPTQ/Qronos error bounds](https://arxiv.org/abs/2508.04853), [end-to-end adaptive-rounding bounds](https://arxiv.org/abs/2505.22988), and [reasoning-stability bounds](https://arxiv.org/abs/2610.06404). Those broad questions must not be added as though no theory exists. These two leads are recorded in research notes rather than added to the public catalogue before their complete benchmark conventions and follow-up status are checked.

## Explicit bounds, PAC learning, architectures and agent systems

The 78-to-86 pass adds 20 distinct sources, for 219 references and 24 primary subjects. Six additions are source-stated bound questions and two are editorial agent-system extensions. Seven have specified models; the hidden-state training target retains `needs_framework` for its exact adapter/optimizer conventions. All eight include mathematical definitions; the catalogue now has 54 statements with formulas, 25 specified-model records and 14 published-question reformulations.

| Addition | Definition/bound checked | Remaining target |
|---|---|---|
| Linear teaching dimension | [Compton et al.](https://arxiv.org/abs/2505.03223v1), HTML introduction/table, and [Hu et al.](https://arxiv.org/abs/1702.05677), abstract: universal O(d²) upper bound; binary cube gives an Omega(d) example. | O(d) best-case teaching for every finite VC-d class, or a superlinear optimal-teaching lower bound. Greedy-method failures and graph-induced positive results are not a resolution. |
| Agnostic multiclass PAC | [Pabbaraju v5](https://arxiv.org/abs/2604.24749v5), Corollaries 1.1–1.2 and definitions; [Li et al.](https://arxiv.org/abs/2608.10869v1), Sections 2, 3 and 6. | Remove polylogs from DS/epsilon + (Natarajan + log(1/delta))/epsilon². Realizable PAC, the old sqrt(DS) gap and optimistic rates up to logs already have results. |
| Instance-optimal identity testing | [Canonne](https://proceedings.mlr.press/v247/canonne24a.html), all five PDF pages. | Constant-factor sample complexity at the identical epsilon. We specialize “succinct” to a polynomial-time functional of explicit finite rational q and epsilon. Tail trimming at epsilon and epsilon/16 can produce unbounded gaps; near-point-mass lower-bound proof issues are retained. |
| Sequential calibration | [Dagan et al.](https://arxiv.org/abs/2406.13668v4), PDF pp.1–3; [Dai–Fishelson](https://arxiv.org/abs/2610.07623v2), Theorem 1.1 and Section 2.1. | Close the 0.54389 to 0.662942288 exponent gap for expected cumulative l1 calibration with non-anticipating adversaries. Other calibration metrics or calibeating results do not settle it. |
| Shallow model encoding | [Two ReLU Layers Is All You Need](https://arxiv.org/abs/2610.28587v1), primary abstract; [Myrisiotis v2](https://arxiv.org/abs/2610.38281v2), Section 1.4, Open Problem 2 and Appendix E scope. | Polynomial total rational encoding length for exact MAX at depth two. Earlier MAX_13 and unrestricted depth-existence leads were superseded by October claims; no greater-than-two unrestricted depth conjecture is imported. |
| Strategic collaboration | [Haghtalab–Qiao–Yang](https://arxiv.org/abs/2402.15169v2), Sections 2 and 4 and Theorem 1.2. | Close the n^(2/3) to n^(3/4) approximation gap for private persuasive signaling on arbitrary weighted graphs, relative to OPT^IR. Conditional expected feasibility, rational effort minimization and a uniform hidden permutation are explicit. |

The primary bound statements above were inspected, but their full proofs and dependency chains are not independently certified. The model-size claim in the newest architecture paper is especially version-sensitive: its abstract does not contain the later depth-two-collapse discussion present in the body. Reading only the older abstract would have produced a stale open problem.

### Agent communication and topology

- **Learning to Communicate in Hidden States:** Gaussian private observations of a common latent vector, frozen heterogeneous state encoders, a finite-bit message and finite paired training data. Target task-risk preservation with sample/adapter/transport costs. [Beyond Tokens](https://arxiv.org/abs/2606.05711v3) provides the taxonomy and agenda; [dense heterogeneous cache transfer](https://arxiv.org/abs/2606.13594v2), [Thought Communication](https://arxiv.org/abs/2510.20733) and [Latent Cache Flow](https://arxiv.org/abs/2605.22863) supply existing methods/partial theory. The latter three were checked at abstract level. The new finite-training specialization is editorial, not a published closed-form conjecture.
- **Reliable Teams with Fewer Connections:** finite weighted-coverage games, explicitly defined local utilities, directed link costs, up to f static edge failures, and worst coarse correlated equilibrium welfare. Exhaustive graph enumeration plus finite CCE linear programs gives a baseline. Target an efficient cost approximation or conditional hardness. [Collins et al.](https://arxiv.org/abs/2609.26670v1) already study minimal communication preserving full-information performance; [Singh–Brown](https://arxiv.org/abs/2609.12077) already study optimal local utilities on arbitrary information graphs. Their pure-Nash results do not automatically apply to this CCE/failure extension; abstract checks do not certify novelty of the new optimization problem.
- **Additional architecture leads:** [Kawata et al.](https://arxiv.org/abs/2506.01656) already prove SGD recovery of latent cluster structure for MoE, and [He et al.](https://arxiv.org/abs/2609.03501) give localized-aggregation oracle bounds with evolving experts. These were indexed as baselines, not relabelled as unanswered “does sparse routing help?” questions.
- **Additional topology baseline:** *The Price of Strategic Information* (DOI 10.1145/3805651) reports a sharp degree-based inefficiency law and topology-design results in a different reciprocal-transfer game. It does not resolve the private-persuasion weighted-graph gap or justify a universal topology rule for LLM agents.

### Leads excluded after follow-up checks

The old unrestricted ReLU depth conjecture and exact realizable multiclass PAC gaps are excluded as above. The COLT 2025 zonotope fixed-parameter tractability questions have subsequent parameterized-hardness resolution claims (Froese et al., September 2025; multiple August 2026 norm-maximization follow-ups). The blanket agnostic direct-sum rate claim has an August 2026 separation, and the Gaussian best-arm gap-entropy conjecture has a September 2026 positive-resolution claim. These leads were checked at abstract level and were not added as open. Results about no-clash teaching or a resolved batch-teaching variant do not settle recursive teaching dimension.

## Fast and furious symmetric learning

The supplied attachment could not be read directly. Its filename was resolved through the [COLT proceedings](https://proceedings.mlr.press/v291/lazarsfeld25a.html), and the [arXiv HTML](https://arxiv.org/abs/2506.13086v1) was inspected at Definition 3, the FTRL/primal-dual recurrences, Theorem 17, Sections 5.2–6 and Theorem 24. One additional source-stated target brings the catalogue to 87 entries, 221 references and 55 statements with formulas.

**Added: Fast Self-Play at Every Step Size.** Fix the unweighted n-action skew cycle, identical player initialization and exact payoff feedback. Use precisely the quadratic-FTRL update: add eta times the current payoff vector to the dual state, then project that accumulated dual state onto the simplex. Ask for O(sqrt(T)) total regret for every fixed eta>0 and almost every initial strategy. The constant may depend on the fixed game, eta and initialization, but not T. The paper proves the large-step regime and explicitly leaves the arbitrary-fixed-step case open; boundary invariance alone does not give the regret rate.

**Known results not re-added:** the same paper proves O(1) regret for unweighted cycles with a vertex initialization and its tournament tiebreaking rule (Theorem 24). [Optimism Without Regularization](https://arxiv.org/abs/2506.16736) gives constant regret for optimistic FP in two-strategy games. [Algorithmic Asymmetry](https://arxiv.org/abs/2608.09780) modifies one player's update to recover a fast rate. [Scalar-to-network transfer](https://arxiv.org/abs/2610.42087) concerns unconstrained network games; it does not directly transfer through simplex projection. These follow-ups were checked at abstract level.

Further inspired research directions in the notes concern symmetry-breaking initial conditions, finite-precision payoff communication and constrained polymatrix interaction graphs. They are not additional public conjectures. A cycle among pure actions in a two-player game is different from a network connecting many agents. Regret bounds imply convergence of averaged strategies; persistent cycling of individual strategies is compatible with those bounds.

## Architecture efficiency, privacy and symbolic learning (87 → 118)

This pass adds **31 targets and 88 distinct sources**, for **118 records / 309 sources / 28 primary subjects**. There are **32 specified-model and 86 framework-dependent records**, **16 published-question reformulations and 102 editorial extensions**, **86 statements with formulas**, **43 explicit efficiency payoffs**, **19 `dynamical_systems` tags**, and the same **seven `bound_gap` tags**. Four new subject keys are `time_series_learning`, `tabular_learning`, `privacy_preserving_learning` and `symbolic_regression`.

### Sakana, DeepMind and lab agendas

- **AB-MCTS:** [Inoue et al. v5](https://arxiv.org/abs/2503.04412v5), Sections 3–5 and Appendices A, C.10 and D inspected in HTML. GEN permits repeated expansion of a nonleaf; AB-MCTS-A uses CONT aggregation and fractional Beta updates, and AB-MCTS-M fits mixed-effects models with MCMC. The source evaluates each generated answer directly, without an additional rollout. Progressive widening and multi-LLM GEN nodes already exist. The two new finite-type benchmarks ask for finite-budget overhead and cost-aware multi-episode regret; these mathematical specializations are ours. BRUE and VarDE have other tree-search guarantees, so generic MCTS convergence is not the gap.
- **Candidate selection:** Appendix D.3 reports 19.2% selected Pass@2 versus roughly 30% coverage at 250 generations. This motivates the verifier-audit cross-link but does not turn a training-audit problem into a solved inference certificate. Finding a correct answer somewhere in the search tree is different from selecting it.
- **PC-ALM:** [Seely–Gould v2](https://arxiv.org/abs/2605.31022v2), HTML model and Algorithm 1 inspected. The update is T−1 primal/dual cycles followed by a final primal step. Linear KKT/BP equivalence, stability and linear wavefront analysis already exist. The residual-tanh uniform gradient-error benchmark targets nonlinear finite inference and explicitly charges O(TLm²) work and activity/dual storage. Wavefront arrival is not complete settling.
- **CTM and recurrence:** [CTM](https://arxiv.org/abs/2505.05522), [fixed-point analysis](https://arxiv.org/abs/2610.19220v2) and [DeepMind recursive blocks](https://deepmind.google/research/publications/122290/) were checked from abstracts/primary overviews. Learned halting is specialized to a Gaussian random-SPD linear-system task. Non-normality requires transient analysis; spectral radius alone is not contraction. Explicit iterative solvers and residual-check cost are baselines.
- **Sparse experts and systems:** [clustered MoE learning](https://arxiv.org/abs/2506.01656v2), [statistical aggregation](https://arxiv.org/abs/2609.03501) and [TwELL](https://arxiv.org/abs/2603.23198v2) already provide positive theory or implementations. The new targets add batch capacity/starvation or a specified packing/bandwidth/fallback cost model. A sparse FLOP count is not measured hardware speed.
- **Lab agendas:** rendered [Flapping Airplanes](https://flappingairplanes.com/) and [Ineffable](https://www.ineffable.ai/) pages were read as company research agendas, explicitly labelled `research_agenda`. Their model/system and experience-only learning goals are not theorem evidence. Existing exploration/world-model records now cite DreamerV3; rewards, architecture and access assumptions remain present without human-data pretraining.
- **Enrichments:** MELODI and neural attention memory qualify the existing context-compression target; recursive LoRA qualifies adaptation; EmbeddingGemma 2 qualifies shared embeddings. These avoid duplicating existing memory/representation questions.

### Added architecture, time-series and tabular targets

| Stable ID suffix | Retained gap and established baseline |
|---|---|
| adaptive-branching-search-complexity | Exact Beta AB-MCTS-A finite-budget success on a finite-type depth-H tree; compare a kernel-informed oracle with the same sampling access. |
| cost-aware-multi-model-search | Paid generator/context/evaluator costs and repeated-episode regret; multi-LLM AB-MCTS itself is already implemented. |
| local-credit-propagation | Nonlinear local-step settling and gradient error; linear PC-ALM equilibrium/wave propagation are known. |
| continual-plasticity-frontier | Drifting tanh teacher, bounded student memory and charged resets; trapping-manifold mechanisms and rejuvenation methods exist. |
| adaptive-recurrent-thought | Joint finite-training prediction and learned-stopping cost; tied recurrence and early exits exist. |
| capacity-limited-expert-routing | Joint router/expert training with minibatch overflow; clustered MoE learning and oracle bounds exist. |
| hardware-aware-activation-sparsity | Risk versus an explicit packing/compute/bandwidth/fallback cost; TwELL provides a systems baseline. |
| quantized-data-reuse | Source-stated future direction, specialized to random reshuffling; fresh-data rounding and exact-arithmetic reuse laws are known. Mantissas have unbounded exponents and remaining arithmetic is exact. |
| learned-long-memory-states | Finite dependent-data learning of recurrent poles with precision/warm-up cost; the canonical square-log state requirement is already claimed solved. |
| sparse-cross-series-learning | Sparse dependent VAR windows and trained axial attention; sparse VAR estimation and single-location attention convergence are known. |
| multirate-dynamics-forecasting | Finite-training forecast transfer across supplied sampling intervals; anti-aliasing and spectral/DMD constructions alone do not identify the system. |
| tabular-prior-routing | A finite Fourier-prior mixture with charged neural routing; exact Bayes model averaging is a baseline. |
| sparse-tabular-feature-learning | Actual gated-ReLU training at a sparse-additive statistical rate; the minimax estimation rate itself is established. |
| compiled-tabular-predictors | Hypernetwork training, emitted model bits and query-count amortization; MotherNet and TabPFN distillation already exist. |

The long-memory model, PC-ALM algorithm and stochastic-rounding model were inspected beyond abstracts. Most remaining new comparisons are abstract/primary-overview checks. The precise editorial special cases have not received an exhaustive novelty audit.

### Privacy, jailbreaks and encrypted computation

Added `private-feature-learning-efficiency`, `private-adapter-rank-allocation`, `jailbreak-certification-cost`, `multi-turn-safety-audit`, `encrypted-autoregressive-inference` and `encrypted-neural-training`.

- DP-SGD, private feature-centric CNN analyses, DP-muP, private LoRA/SVD methods and low-rank trace-regression theory already exist. The two new targets fix a tanh teacher or bilinear softmax adapter and ask for a joint risk/privacy/compute frontier. DP is required for all neighboring datasets; private rank selection, initialization and raw-data-dependent projections must be composed.
- [Erase-and-check v4](https://arxiv.org/abs/2309.02705v4), Sections 3–7 and Theorem 4.1 inspected: its guarantee inherits harmful-prompt detection from a base filter. Benign utility is empirical, and general infusion enumerates deletion subsets. SmoothLLM, CluCERT and generative-output smoothing are existing baselines. The new target specifies token edits, a finite-state output predicate and nontrivial benign utility; it does not claim unrestricted semantic safety.
- [MTCR](https://arxiv.org/abs/2608.20820v1), Sections 2–3 inspected: formal scope is bounded perturbations, with conditional mode/persistence guarantees. Proposition 3.7 gives sufficient conditions; practical parameter estimates do not automatically certify uniform infima across all states. The new finite-audit benchmark states its unusually strong reset access and charges partition selection/within-cell variation.
- CryptoNets, CKKS, MOAI, HEAT and encrypted neural training already establish feasibility or implemented improvements. The new inference target fixes pure HE without intermediate decryption and requires whole-generation agreement under range/logit-gap promises. Training tracks the matched plaintext trajectory with accumulated approximation/refresh error. Hybrid HE/MPC, trusted-edge preprocessing, malicious correctness and model-output DP are different interfaces/properties.

These sources were checked from primary abstracts except the two jailbreak papers noted above. An abstract claiming security or convergence is not an independent cryptographic/proof audit.

### KANs and symbolic ODE/PDE/manifold learning

Added three KAN targets: `kan-compositional-learning`, `kan-grid-refinement-dynamics`, `kan-symbolic-identification`.

- [KAN v5](https://arxiv.org/abs/2404.19756v5), Sections 2.1–2.5 and Theorem 2.1 inspected. Smooth-edge approximation is conditional on a smooth representation; constants depend on that representation. Grid extension and knot insertion already exist. The new grid target concerns noisy-data training, conditioning and resolution selection, not preservation of a spline under exact knot insertion.
- [KAN or MLP](https://arxiv.org/abs/2407.16674v2) gives a matched-compute empirical counterweight. [Dimensionality barriers](https://arxiv.org/abs/2610.21480v1) and [tight CPWL region counts](https://arxiv.org/abs/2611.07973v1) were checked at abstract level; neither generic curse-of-dimensionality escape nor the old missing region-count lower bound is retained as open.
- KAN 2.0, context-aware symbolic replacement and PH-Symb already extract/compile expressions. The new finite-grammar question distinguishes functional equivalence, identifiability and computational search from a low empirical fit error.

Four further entries expand the dedicated `symbolic_regression` subject:

1. **Discovering ODEs Without a Supplied Library**: unknown projection/operator terms, noisy sampled trajectories, weak losses and charged search; SINDy, weak SINDy, weak-surrogate convergence and Higher-Order-KANDy are baselines.
2. **Which PDE Can Coarse Measurements Reveal?**: reaction–diffusion polynomial constitutive laws from noisy cell averages. Account for nonlinear averaging, temporal aliasing, excitation and a fixed-resolution error floor; PDE-FIND, WSINDy PDE and UNIDE are baselines.
3. **Finding Coordinates Where Dynamics Become Simple**: a low-dimensional invariant latent cube observed through a smooth bi-Lipschitz embedding, learned encoder/decoder and sparse dynamics. Identify predictions modulo coordinate conjugacy, not a unique arbitrary latent equation. The single-chart assumption excludes other manifold topologies; off-manifold behavior is not identified. SINDy autoencoders and WgLaSDI already combine representation and equation learning.
4. **Which Experiment Reveals the Equation?**: controlled polynomial ODEs, paid resets/samples/duration and fixed-confidence support/parameter identification. Active E-SINDy and active latent-model methods exist; the target is a costed sharp acquisition/algorithmic frontier.

All four are editorial research programs with explicit observation classes, not published closed-form conjectures. Source abstracts also surfaced TT-WSINDy polynomial tensor-train sparsification, Fourier weak test-function selection and observation-specific hidden-compartment reductions; these are additional existing methods, not extra records. FNO's resolution-transfer experiments are distinct from identifying a symbolic continuum PDE.

### Logistic regression and NTK: simple models, sharper questions

Added `online-logistic-computation-gap`, `logistic-critical-regularization`, `ntk-classification-validity-time` and `ntk-width-sample-complexity`.

- **Online logistic computation:** improper optimal-regret learning is already possible. Jézéquel et al. give fast per-round work with linear comparator-norm dependence; the [2026 sigmoid-mixture result](https://arxiv.org/abs/2604.02920) reports O(d log(BT)) regret with O(B³T⁵) total complexity. The retained target is near-linear T and only polylogarithmic B dependence simultaneously, not generic polynomial-time feasibility.
- **Vanishing ridge:** [Candès–Sur](https://arxiv.org/abs/1804.09753) establishes the separability threshold; fixed-regime regularized risk, finite-sample bounds and [max-margin implicit bias](https://arxiv.org/abs/1710.10345v7) are baselines. The new Gaussian-logistic critical-window program is editorial and needs a dedicated coupled-limit audit. The unregularized MLE is not a finite vector on separable samples.
- **NTK long time:** [classification divergence](https://arxiv.org/abs/2504.11130) and [regularized/nondegenerate-target lazy classification](https://arxiv.org/abs/2605.17606v2) address different regimes. The new target fixes empirical finite-width kernel drift and asks for its crossover timescale as label smoothing/regularization vanish. [Sharp squared-loss rescaling-time bounds](https://arxiv.org/abs/2305.13141) do not identify width with output scaling or cover hard-label classification automatically.
- **Width and samples:** [Zhou et al.](https://arxiv.org/abs/2606.06772v2) already claim minimax source/capacity rates with polynomial-width smooth GD/SGD networks. NTK sketching, leverage initialization and finite-width computation algorithms are established. The retained target is sharp necessary/sufficient width and total compute, with all sampling/kernel construction costs charged.

These latest checks used Undermind semantic search plus primary abstracts. Undermind resumed after its quota reset; nineteen core architecture/privacy/symbolic papers and fourteen logistic/NTK baselines were added to `/ai-foundations/`. Metadata lookup did not find the newest encrypted-training paper; its canonical primary link remains in the record. Other unindexed sources retain canonical URLs rather than fabricated cite keys.

## Kaplan–Chinchilla exponent reconciliation (118 → 119)

Added `aiml-kaplan-chinchilla-exponent-reconciliation`, **Reconciling Kaplan and Chinchilla Exponents**, as an editorial `needs_framework` target under learning dynamics and learning theory. The catalogue now has **119 records, 316 references, 32 specified-model / 87 framework-dependent entries, 16 published-question reformulations / 103 editorial extensions, 87 formula-bearing statements and 44 efficiency annotations**. Subject and bound-gap counts are unchanged.

The historical discrepancy is **already substantially reconciled**, not an untouched open question:

- [Kaplan et al.](https://arxiv.org/abs/2001.08361) and [Hoffmann et al.](https://arxiv.org/abs/2203.15556): primary abstracts checked; resource/counting conventions checked through the subsequent full-text analyses. Kaplan's commonly quoted 0.73 is a batch-adjusted allocation exponent; Porian et al. also discuss the unadjusted 0.88 fit. Chinchilla's approximately one-half allocation headline is not identical to each individual fitting procedure's estimate or to the loss exponents alpha and beta.
- [Pearce–Song v3](https://arxiv.org/abs/2406.12907v3), HTML Sections 2–5 inspected: assuming a Chinchilla loss surface and a fixed-aspect-ratio total/core parameter conversion already produces different local slopes. With N_total=N_core+omega N_core^(1/3), the overhead-dominated apparent exponent is beta/(alpha/3+beta), versus beta/(alpha+beta) at large scale. For equal loss exponents these are 3/4 and 1/2. This conditional algebra is a known baseline, not the new contribution sought.
- [Porian et al. v4](https://arxiv.org/abs/2406.19146v4), HTML Sections 2–4, Table 1 and adjusted-Kaplan discussion inspected: output-head FLOPs, excessive warmup and scale-dependent optimizer tuning explain the discrepancy on OpenWebText2 and RefinedWeb. Their tuned constant-rate experiments produce exponents about 0.518 and 0.497; matching cosine decay is not essential there. They count untied output-head parameters but exclude input embeddings, so their convention is not simply every stored parameter times six.
- [Replication](https://arxiv.org/abs/2404.10102), [robustness](https://arxiv.org/abs/2509.23963) and [2026 IsoFLOP fitting-bias analysis](https://arxiv.org/abs/2603.22339) were checked from scholarly abstracts. These already address fitting uncertainty, parameter ambiguity, parabola/grid bias and an improved variable-projection estimator. They constrain the residual question rather than establish universal exponents.

The new target fixes a bounded loss-surface class with shared capacity/data terms and bounded C² protocol residuals, an audited core/attention/head cost model, fresh noisy adaptive pilots and a finite log-spaced compute grid. It asks for calibrated confidence bands and matching pilot-cost or partial-identification limits for corrected optimal model sizes and finite-window exponents. All pilot/tuning compute is charged. The residual-error floor can make a difference unidentifiable even with many pilots; report that rather than forcing a point exponent. Application to real training additionally requires independent justification of the response-surface and residual assumptions. The target is neither a first-principles derivation of universal transformer exponents nor a relisting of the already explained historical mismatch.

## Native coding-agent access

`/llms.txt` links to `/open-problems/llms.txt`; `/llm.txt` redirects to the standard plural path. `/api/open-problems/meta` publishes the current taxonomy and query contract, and `/api/open-problems/{id}` supplies exact-ID JSON. Existing list filtering/pagination is reused. The guide explicitly distinguishes selected-domain counts, graph truncation, local exact-tag filtering, live-view consistency and source status. The CLI companion feature branch injects a short discovery section through `before_agent_start`, with no startup network request and no required skill load.
