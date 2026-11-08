# Theory-focused physics problems: preliminary seed

The `*.preliminary.jsonl` files contain one independently readable JSON object per line. The original theory selection was compiled on 2026-11-07; the quantum-chaos expansion was compiled on 2026-11-08. These files seed the `/open-problems` website and its optional Supabase database.

The public seed has **286 entries**. Its **50 editorially scoped records** (23 conjectures, 20 open questions and 7 construction problems) comprise 30 in `theory-open-problems.preliminary.jsonl`, 14 in `quantum-chaos.preliminary.jsonl` and 6 in `independent-sources.preliminary.jsonl`. `pubphys.preliminary.jsonl` adds **236 source-imported records**, explicitly marked `review_level: source_import`. A separate `status-review-holds.jsonl` preserves 10 original held identities. An additional decision report retains every imported candidate's classification. A hold does not judge a claim correct: it means its scope and assessment need checking before an old open label is reused.

## Independent sources

The source directory is published at `/open-problems/sources`. The independent-source pass uses named-author [IQOQI Open Quantum Problems](https://oqp.iqoqi.oeaw.ac.at/open-quantum-problems) and checks its separate solved list. Six new, editorially written questions cover f-routing entanglement, Gibbs-preserving channel resources, constant-gap separability testing, distillable key, absolute separability and composable decoherence functionals. They have no required physical-validation step. References record the numbered problem and sections inspected. The 2026 complete-absolute-separability result is explicitly distinguished from the remaining deterministic higher-dimensional classification.

Additional references attach to existing IDs through `source-enrichment.json`, including the original operator-growth hypothesis (section IV.3, equation 22), a quantum-chaotic-eigenstate review, and IQOQI's PPT-squared and single-prover verification questions. This enrichment leaves imported statements and review labels unchanged. `checked_on` is an access/check date, with `locator` and `note` specifying what was inspected; it is not a current-status certification.

The IAMP/Aizenman 1998–99 collection and the 84-item jgmcm catalog are listed as discovery sources, not wholesale imports. Historical labels require current follow-up. The IQOQI relative-entropy question also needs a closer comparison with the formula papers it cites before selecting a remaining scope; it was not added merely because it appears on the open list. Newly written formulations cite the source authors; papers and expert-list pages are not assigned PubPhys's reuse license.

## Full source collection and screening

The snapshot in `sources/pubphys.snapshot.json` contains **all 1,026 candidates** returned for `cm`, `qi`, `mathph`, `qft`, `grav`, `stat`, `amo`, `nuc`, `hep` and `cosmo`. Collection follows every API page and preserves source revision, record hash, literature status, statement, resolution criterion and references. The collector uses two workers, respects retry responses and reuses unchanged source hashes on refresh.

The current `pubphys-import-report.json` accounts for all 1,026:

| Decision | Records |
|---|---:|
| Added as source-imported | 236 |
| Excluded by theory/computation scope | 381 |
| Held for status or scope review | 381 |
| Mapped to an existing canonical entry | 28 |

The screening rules in `lib/pubphys-import.ts` inspect the source's resolution criterion, distinguish numerical experiments from physical ones, and retain explicit proof, analytic or computational targets. Physical validation requirements are excluded. Contested statuses, unverified result claims and unclear targets are held. Explicit exceptions and mappings are recorded in `pubphys-overrides.json`; source-to-source and canonical relationships remain reading leads, not equivalences. The pass checked the retained criteria for experimental false positives, but is **not a full-text or expert correctness/status audit**. Conservative screening can also hold an eligible theoretical problem; review the report before refining a decision.

Known overlapping claims (including Néel order, the 3D ferromagnet, MUB dimension six, 2D area laws, Haldane and qLTCs) are withheld even when the source still labels them open. Numerical evidence is not reclassified as proof. Broader/narrower scopes, such as full Yang–Mills existence/mass gap versus a lattice-continuum construction, remain separate and connected.

Imported `statement` and `resolution_target` text is retained from the source, including formulas. `source_status` records the source assessment. `imported_from` retains URL, revision, SHA-256 record identity, retrieval timestamp, origin and CC BY 4.0 license. No cryptographic signature verification or independent validation of a source claim is implied by storing its hash.

### Editorial subset by primary area

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

Graph positions use a seeded spring layout **between primary-subject groups**, aggregating cross-group recorded relationships, sparse title/tag affinities and secondary-subject memberships. Dots are packed deterministically within each labelled group; no force acts on individual problems. A Grid button arranges the same groups in rows. Inferred topic links are rendered as dashed lines and are never written into the catalog's `relations` field. They do not imply equivalence, causality or proof dependence. Filtering changes the visible groups and recomputes their layout.

## Scope

Include challenging conjectures, open questions and construction problems with a direct physical or quantum-computational interpretation, for which a proof, counterexample, no-go theorem, controlled analytic construction or well-defined computational result would constitute progress. Resolution targets do not require new laboratory experiments or astronomical observations. Establishing the empirical applicability of a model is a separate question. Coverage includes quantum chaos, quantum physics and computing, QFT (including QED and QCD), condensed matter, gravity, quantum gravity, string theory and integrable systems.

Exclude pure number theory, geometry, algebra and other pure-mathematics problems without a specific physics question, **with an explicit requested exception for Hilbert–Pólya and GUE pair correlation of the Riemann zeros**, connected to quantum-chaotic spectral theory. Quantum measurement design and Hamiltonian complexity remain in scope because they concern operational quantum tasks. Experimental anomalies without a well-defined theoretical target are excluded. Inclusion does not assert that a problem is absent from MathDB: physically meaningful overlap is possible, and no exhaustive MathDB comparison was performed.

## Status and provenance

All public records are **provisionally open**, not certified open as of the compilation date. Editorial selection used scholarly abstracts/metadata, specialist problem pages, reviews, and targeted web searches. The complete literature and proofs have not been independently audited. `review_level: preliminary_source_check` is deliberately weaker than a full-text, citation-traced or expert review; `source_import` is weaker still and does not assert individual source checking. `compiled_on` dates this catalog, not the last authoritative confirmation that each problem remains open.

Unauthenticated Semantic Scholar Graph API paper lookup and search were attempted during this pass; both returned HTTP 429. No Semantic Scholar citation expansion was completed. arXiv metadata/abstract queries and directly accessible source pages supplied the available checks.

Editorial statements are reformulations; imported statements are source text. `formulation: needs_framework` flags questions whose admissible theories, observables or convergence requirements need to be fixed before a formal theorem can be stated. For imports this flag follows the source's well-posed/phenomenon classification, not an independent scope certification. Even records marked `specified_model` need expert checking before becoming theorem-proving benchmarks. A source with role `background` explains the setting; it is not evidence of current open status. PubPhys is an explicitly AI-compiled seed, not independent specialist verification.

No numerical experiment, finite-size observation, citation count, AI verdict or formalization of only a supporting lemma is treated as a solution of an infinite-volume or continuum conjecture.

## Fields

- `schema_version`, `id`, `title`, `aliases`: stable catalog identity. IDs must not change when a title changes.
- `kind`: `conjecture`, `open_question`, or `construction_problem`.
- `primary_area`, optional `secondary_areas`, `tags`: one primary grouping plus subject-filter memberships and topical labels; a cross-listed problem is not duplicated.
- `statement`, `assumptions`: the target and its scope, including dimension, model, regime and limits.
- `physics_motivation`: why this belongs in a physics catalog.
- `resolution_target`: what a mathematical resolution would establish.
- `formulation`: `specified_model` or `needs_framework`.
- `status`, `status_note`, `review_level`, `compiled_on`: provisional assessment and qualifications.
- `sources`: title, stable URL and role (`problem_statement`, `review`, `partial_progress`, `background`, `discovery_catalog`). References are leads for the full literature review; exact page/theorem locators should be added after full-text inspection.
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

- **Spin-1 Heisenberg/Haldane gap:** a recent proof and specialist exposition surfaced during discovery; do not reuse the older open label without reviewing them. See [Hal Tasaki's exposition](https://haltasaki.github.io/writings/AI/OpenAI_Haldane.html).
- **Laughlin spectral gap:** recent claimed resolutions and new bounds require scope-by-scope assessment. See [the claimed spherical result](https://github.com/openai/math/tree/main/preprints/A-Fock-space-inequality-and-the-Laughlin-spectral-gap-September-24-2026) and [arXiv:2610.18854](https://arxiv.org/abs/2610.18854).
- **General spacetime Penrose inequality:** recent claims require assessment before selecting a remaining open formulation. See [arXiv:2512.04137](https://arxiv.org/abs/2512.04137).
- **Constant-parameter quantum locally testable codes:** rapidly changing results and claims need a current audit, including whether a construction is conditional. See [arXiv:2609.26735](https://arxiv.org/abs/2609.26735).
- **NLTS, existence of asymptotically good quantum LDPC codes, and AME(4,6):** the historical existence questions have known positive results; they are not listed as open.
- Generic pure-mathematics conjectures remain out of scope, except for the two explicitly selected Riemann-zero quantum-chaos questions.

## Suggested next pass

For each retained record, inspect full text, add exact locators, trace later citations and alternative names, identify restricted-case solutions, and obtain a dated expert assessment. In particular, scope-check recent proofs against the full stated regime before marking a problem solved or retaining an older open label. Track physical significance, likely tractable subcases and formalization readiness separately from open status.

The catalog text is editorially reformulated. PubPhys discovery records and their listed scholarly reviews are credited in each relevant entry; these formulations refine their scope and sometimes correct distinctions (for example, critical-line-only zeros versus all zeros, or pair correlation versus spacing statistics). PubPhys seed records originate from its [AI-assisted seed collection](https://pubphys.com/docs/seed), not a specialist review of every entry. Its [terms](https://pubphys.com/docs/terms) license contributed text under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); source material retains that license and attribution. External papers and datasets retain their own licenses; links do not imply that their full texts can be redistributed under this repository's license.
