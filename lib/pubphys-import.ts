/** Reproducible, conservative screening of source statements. This is not an expert status review. */
export interface PubPhysProblem {
  slug: string; field: string; topic: string; title: string; plain: string; precise: string; settled_by: string;
  kind: string; answer_type: string; literature_status: string; status: string; status_note: string; status_note_verified: boolean;
  revision: number; record_hash: string; url: string; origin: string;
  references: { topic_review?: { cite: string; link: string; verified: boolean } };
  parents: { slug: string; relation: string; note?: string }[];
  children: { slug: string; relation: string }[];
  links: { slug: string; kind: string; type: string; reason: string }[];
}
export interface ImportDecision { slug: string; decision: "include" | "exclude" | "review_hold" | "duplicate"; reason: string; canonical_id?: string }

export function screenPubPhys(problem: PubPhysProblem): ImportDecision {
  const decision = (value: ImportDecision["decision"], reason: string): ImportDecision => ({ slug: problem.slug, decision: value, reason });
  if (problem.topic === "stat-learning-inference") return decision("exclude", "General learning/algorithm problem without a specific physics target");
  if (problem.status !== "open") return decision("review_hold", `Source site status: ${problem.status}`);
  if (!["open", "partially-resolved"].includes(problem.literature_status)) return decision("review_hold", `Source literature status: ${problem.literature_status}`);
  if (!problem.precise?.trim() || !problem.settled_by?.trim()) return decision("review_hold", "Missing mathematical statement or resolution criterion");
  // A numerical experiment is permitted; a physical experiment/measurement is not a required resolution step.
  const target = problem.settled_by.replace(/(?:numerical|computational|in.silico) experiments?/gi, "computation").replace(/numerically measured/gi, "computed");
  if (/experiment|observations?|measur(?:ed|ement|ing)|detection|detector|telescope|collider|spectroscop|laborator|apparatus|\bdevices?\b|imaging|photometry|microscope|thermometry|calibration|in.situ|on hardware|hardware anneals|quantum.simulator data|(?:in|on) (?:a |one )?quantum simulator|later confirmed|confirmed at|(?:CMB|BAO|Gaia|JWST|Planck|cluster|exclusive|drip.line|photon and dilepton|femtoscopy) (?:data|spectra|distances|lensing)|cosmic shear|independent data|\b(?:clock.ratio time series|transport at|sample series|neutron spectrum|spatially resolved probes|upper limits on R|surface treatments|heterostructure changes|high.statistics)\b/i.test(target)) {
    return decision("exclude", "Source resolution criterion requires physical data, measurement or experimental validation");
  }
  if (!problem.status_note_verified && /\b(?:prov(?:ed|en)|proof|solved|resolved|settled|established|claimed)\b/i.test(problem.status_note ?? "")) {
    return decision("review_hold", "Unverified source note contains a result or resolution claim; remaining scope needs review");
  }
  if (problem.answer_type === "proof" || /\b(?:proof|prove|theorem|counterexample|no.go|rigorous|mathematic)/i.test(target)) return decision("include", "Explicit mathematical proof or counterexample target");
  if (/\b(?:comput|numeri|simulat|analytic|deriv|construct|algorithm|theor|calculat|scaling|kinetic|tensor|diagonaliz|monte carlo|lattice|bootstrap|model|bound|asymptotic|classification|formulation|solution)/i.test(target)) return decision("include", "Explicit theoretical or computational resolution target; no physical-data requirement found");
  return decision("review_hold", "Resolution criterion needs manual theory/computation scope review");
}

export function pubPhysArea(problem: PubPhysProblem): string {
  if (/quantum-chaos|cm-eth-|cm-syk-|cm-mbl-|scars-fragmentation|scrambl|quantum-information-dynamics|lyapunov-entropy/.test(problem.slug)) return "quantum_chaos";
  if (/integrab|generalized-hydrodynamics/.test(problem.topic)) return "integrable_systems";
  if (/bound-state-qed/.test(problem.topic)) return "qed";
  if (/swampland|string|ads-cft|holograph/.test(problem.topic)) return "string_theory";
  if (/quantum-gravity|loop-quantum|causal-set|asymptotic-safety|problem-of-time/.test(problem.topic)) return "quantum_gravity";
  return ({ cm: "condensed_matter", qi: "quantum_computing", mathph: "mathematical_physics", qft: "quantum_field_theory", grav: "gravity", stat: "statistical_physics", amo: "atomic_molecular_optical", nuc: "nuclear_physics", hep: "particle_physics", cosmo: "cosmology" } as Record<string, string>)[problem.field];
}
