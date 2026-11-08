import { HeroAnimation } from "@/components/hero-animation";
import { InstallPanel } from "@/components/install-panel";
import { ThetaLogo } from "@/components/theta-logo";
import { site } from "@/lib/site-config";
import Link from "next/link";
import { LockIcon } from "@/components/lock-icon";
import { SiteHeader } from "@/components/site-header";

const features = [
  { mark: "λ", title: "Lean, natively.", body: "Your toolchain is part of the agent. Work with Lean, Lake, and Mathlib, with real compiler feedback at every step.", tag: "NATIVE TOOLCHAIN" },
  { mark: "↻", title: "A thought. A theorem.", body: "Turn informal mathematics into formal statements. Let the agent propose, check, and refine proofs in a Lean-driven loop.", tag: "AUTOFORMALIZATION & PROOF LOOPS" },
  { mark: "⌕", title: "Research with context.", body: "Explore the literature, connect relevant results, and bring the mathematical context back into your research workflow.", tag: "LITERATURE SEARCH" },
  { mark: "∈", title: "The right lemma, found.", body: "Built-in Mathlib search engines and Lean language-server integration put existing definitions and useful lemmas within reach.", tag: "MATHLIB SEARCH & LSP" },
  { mark: "≡", title: "Measure what matters.", body: "Run integrated Lean mathematical benchmarks. Compare proof outcomes and research workflows in reproducible environments.", tag: "MATHEMATICAL BENCHMARKS" },
  { mark: "↗", title: "Stay in the loop.", body: "Follow long-running work and interact with supported research workflows from your phone through the Telegram connector.", tag: "TELEGRAM CONNECTOR" },
  { mark: "◉", title: "Your models. Your machine.", body: "Work with local models on your own hardware. Keep model inference close to your research and choose the setup that fits your workflow.", tag: "LOCAL MODEL SUPPORT" },
  { mark: "∥", title: "From your laptop to the cluster.", body: "Native integration with HPC resources connects your research to SLURM-managed systems and Ray compute clusters. Scale experiments and compute-intensive workflows on your own infrastructure.", tag: "HPC & DISTRIBUTED COMPUTE" },
];

/** The landing page's command preview: [command, docs link, one line]. Two rows of three on wide screens. */
const slashCommands: [string, string, string][] = [
  ["/formalize", "/docs/commands#formalize", "Turn an informal statement into precise Lean."],
  ["/prove", "/docs/commands#prove", "Build a proof and refine it with Lean’s feedback."],
  ["/next-steps", "/docs/commands#next-steps", "Read a paper or a line of work and propose ranked next steps."],
  ["/autoresearch", "/docs/autoresearch", "Run bounded research campaigns that measure every result."],
  ["/benchmark", "/docs/commands#benchmark", "Run mathematical benchmarks and compare results."],
  ["/latex", "/docs/commands#latex", "Draft, update and compile the paper from your verified work."],
];

const domains = [
  { name: "Mathematical research", audience: "Mathematicians & formalizers", description: "Explore conjectures, discover useful lemmas, and develop machine-checked proofs." },
  { name: "Theoretical physics", audience: "Physicists & research groups", description: "Connect mathematical structures, formal reasoning, and computational experiments." },
  { name: "Computer Science", audience: "Theorists & verification teams", description: "Reason about algorithms, formal methods, and the foundations of computation." },
  { name: "Foundations of AI/ML", audience: "AI & machine learning researchers", description: "Investigate learning theory, test hypotheses, and build reproducible research loops." },
  { name: "Quant Finance", audience: "Quants & quantitative researchers", description: "Develop mathematical models and evaluate the assumptions behind quantitative strategies." },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader sections={[{ href: "#workflow", label: "How it works" }]} />
      <main id="main">
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="eyebrow mono"><span className="status-dot" /> TOOLS FOR THE NEXT DISCOVERY</div>
          <div className="hero-copy">
            <h1 id="hero-title">Verifiable <br /><span>research loops</span></h1>
            <div className="hero-description"><p>A Lean-native coding agent for<br className="desktop-break" /> mathematics and theoretical sciences.</p><p className="muted">Explore the unknown. Formalize your thinking.<br className="desktop-break" /> Build on results you can verify.</p><a className="button button-dark" href="#install">Meet Theoria-CLI <span aria-hidden="true">↗</span></a></div>
          </div>
          <HeroAnimation />
          <div className="hero-footnote mono"><span>BUILT FOR RIGOR. DESIGNED FOR DISCOVERY.</span><span>LEAN 4 <span className="footnote-plus">+</span> MATHLIB <span className="footnote-plus">+</span> YOUR CURIOSITY</span></div>
        </section>

        <section id="domains" className="domains-section section-pad shell" aria-labelledby="domains-title">
          <div className="section-heading">
            <div><p className="eyebrow mono">CORE DOMAINS / WHO IT’S FOR</p><h2 id="domains-title">Different fields.<br />The same rigor.</h2></div>
            <p className="section-intro">For researchers, builders, and teams<br />working at the edge of what we know.</p>
          </div>
          <div className="domain-grid">
            {domains.map((domain, index) => (
              <article className="domain-card" key={domain.name}>
                <span className="domain-index mono">0{index + 1} /</span>
                <h3>{domain.name}</h3>
                <p>{domain.description}</p>
                <span className="domain-audience mono">{domain.audience}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="features-section section-pad shell" aria-labelledby="features-title">
          <div className="section-heading"><div><p className="eyebrow mono">01 / THE RESEARCH TOOLKIT</p><h2 id="features-title">Go further.<br />Stay grounded.</h2></div><p className="section-intro">An agent that speaks mathematics.<br />A workflow that checks its work.</p></div>
          <div className="feature-grid">{features.map((feature, index) => <article className={`feature-card${feature.tag === "HPC & DISTRIBUTED COMPUTE" ? " feature-wide" : ""}`} key={feature.title}><div className="feature-top"><span className="feature-symbol" aria-hidden="true">{feature.mark}</span><span className="feature-index mono">0{index + 1}</span></div><h3>{feature.title}</h3><p>{feature.body}</p><span className="feature-tag mono">{feature.tag}</span></article>)}</div>
          <article className="team-feature"><div className="team-visual" aria-hidden="true"><span>α</span><span>β</span><span>γ</span><div className="team-line" /><span className="team-theta">Θ</span></div><div><p className="eyebrow mono">SHARED WORKSPACES / THEORIA-IDE</p><h3>Great ideas rarely happen alone.</h3><p>Bring your team into the same research workspace. Connect projects, conversations, and results—with shared context from the first question to the final proof.</p></div><a className="round-link" href="#workspace" aria-label="Explore team workspaces">↗</a></article>
        </section>

        <section id="workflow" className="workflow-section" aria-labelledby="workflow-title">
          <div className="shell section-pad">
            <div className="section-heading">
              <div><p className="eyebrow mono">02 / FROM INTUITION TO VERIFICATION</p><h2 id="workflow-title">Follow the idea.<br /><span className="muted">Check every step.</span></h2></div>
              <p className="section-intro">You bring the question.<br />Theoria helps you work through it.</p>
            </div>
            <div className="workflow-layout">
              <ol className="workflow-steps">
                <li><span className="step-number mono">01</span><div><h3>Start with a question</h3><p>A conjecture, a paper, an informal argument. Give your research a direction.</p>
                  <div className="workflow-command-examples" role="group" aria-label="Start with a question: example commands">
                    <Link href="/docs/commands#next-steps"><code>/next-steps paper.pdf</code><span aria-hidden="true">↗</span></Link>
                    <Link href="/docs/commands#run"><code>/run new study quantum chaos</code><span aria-hidden="true">↗</span></Link>
                  </div>
                </div></li>
                <li><span className="step-number mono">02</span><div><h3>Make it precise</h3><p>Search for useful results and turn your mathematical intent into Lean.</p>
                  <div className="workflow-command-examples" role="group" aria-label="Make it precise: example commands">
                    <Link href="/docs/commands#formalize"><code>/formalize the sum of two even natural numbers is even --name even_add</code><span aria-hidden="true">↗</span></Link>
                  </div>
                </div></li>
                <li><span className="step-number mono">03</span><div><h3>Close the loop</h3><p>Propose a proof. Read Lean’s feedback. Refine until the statement checks.</p>
                  <div className="workflow-command-examples" role="group" aria-label="Close the loop: example commands">
                    <Link href="/docs/commands#prove"><code>/prove even_add</code><span aria-hidden="true">↗</span></Link>
                  </div>
                </div></li>
              </ol>
              <div className="terminal">
                <div className="terminal-header"><span><i /><i /><i /></span><span className="mono">theoria / a small example</span><span>↗</span></div>
                <div className="terminal-body mono">
                  <p className="terminal-muted"># Every discovery starts somewhere.</p>
                  <p><span className="terminal-green">❯</span> Prove that the sum of two even<br />&nbsp; natural numbers is even.</p>
                  <div className="terminal-response"><span className="terminal-green">Θ</span><p>Let’s make that precise.</p></div>
                  <pre><code><span className="syntax-purple">import</span> Mathlib{"\n\n"}<span className="syntax-purple">theorem</span> <span className="syntax-yellow">even_add</span>{"\n"}    (a b : ℕ){"\n"}    (ha : Even a) (hb : Even b) :{"\n"}    Even (a + b) := <span className="syntax-purple">by</span>{"\n"}  <span className="syntax-purple">exact</span> ha.add hb</code></pre>
                  <div className="terminal-success"><span>✓</span> Lean check passed <span className="terminal-muted">· no sorry</span></div>
                  <p className="terminal-caption">ILLUSTRATIVE WORKFLOW / LEAN 4 + MATHLIB</p>
                </div>
              </div>
            </div>
            <div className="slash-preview" aria-labelledby="slash-preview-title">
              <h3 id="slash-preview-title" className="eyebrow mono">A FEW COMMANDS. A FULL RESEARCH LOOP.</h3>
              <dl className="slash-commands">
                {slashCommands.map(([name, href, text]) => (
                  <div key={name}><dt><Link href={href}><code>{name}</code></Link></dt><dd>{text}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="workspace" className="workspace-section section-pad shell" aria-labelledby="workspace-title"><div className="workspace-copy"><p className="eyebrow mono">03 / A HOME FOR YOUR RESEARCH</p><h2 id="workspace-title">The bigger<br />picture.</h2><p>The terminal is just the beginning. Theoria-IDE connects your research in a graphical workspace built for deep, collaborative work.</p><ul className="workspace-points"><li>Projects, papers, and proofs in context</li><li>A connected research graph</li><li>Multi-user team workspaces</li></ul><button className="ide-locked" disabled><LockIcon /> Theoria-IDE <span>Coming soon</span></button><span className="development-note mono">DESKTOP PREVIEW / IN DEVELOPMENT</span></div><div className="workspace-preview" role="img" aria-label="Conceptual research graph linking a conjecture, two lemmas, a reference, and a verified result"><div className="preview-header mono"><ThetaLogo /><span>research / a connected view</span><span className="preview-dot" /></div><div className="research-graph"><svg viewBox="0 0 500 340" fill="none" aria-hidden="true"><path d="M250 65L125 165M250 65L375 165M125 165L250 275M375 165L250 275M125 165L65 275" stroke="currentColor" strokeWidth="1.5" /><circle cx="250" cy="65" r="5" /><circle cx="125" cy="165" r="5" /><circle cx="375" cy="165" r="5" /><circle cx="250" cy="275" r="5" /></svg><div className="graph-node node-question"><span className="mono">QUESTION</span>A conjecture</div><div className="graph-node node-lemma-a"><span className="mono">LEAN / LEMMA 01</span>A useful structure</div><div className="graph-node node-lemma-b"><span className="mono">LEAN / LEMMA 02</span>The missing link</div><div className="graph-node node-paper"><span className="mono">LITERATURE</span>A prior result ↗</div><div className="graph-node node-result"><span className="mono">✓ VERIFIED</span>A step forward</div></div><div className="preview-footer mono"><span><span className="status-dot" /> SHARED CONTEXT</span><span>CONCEPTUAL PREVIEW</span></div></div></section>

        <section id="install" className="install-section" aria-labelledby="install-title"><div className="shell section-pad"><div className="section-heading"><div><p className="eyebrow mono">04 / YOUR NEXT QUESTION STARTS HERE</p><h2 id="install-title">Make room<br />for discovery.</h2></div><p className="section-intro">Autonomous research.<br />Grounded in formal verification.</p></div><InstallPanel /></div></section>
      </main>
      <footer className="site-footer shell"><div><Link className="wordmark" href="/" aria-label="Theoria Labs home"><ThetaLogo /><span>theoria<span className="wordmark-light">labs</span><span className="wordmark-period">.</span></span></Link><p>Tools for rigor. Built for discovery.</p><p>A product of DeepHedge Labs LLC (NY).</p></div><div className="footer-right"><a href={site.repository} target="_blank" rel="noreferrer">Website source ↗</a><span className="mono">© {new Date().getFullYear()} THEORIA LABS</span></div></footer>
    </>
  );
}
