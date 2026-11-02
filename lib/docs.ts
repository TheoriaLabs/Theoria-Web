/**
 * The Theoria-CLI documentation, as data. Each page is a list of blocks; the same data renders the HTML page, its
 * "On this page" column, and a plain Markdown version (`/docs/<page>.md`) that agents can fetch, indexed by
 * `/llms.txt`. Keep it in step with Theoria-CLI's `/help` catalog (`packages/theoria-core/src/help.ts`).
 */

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h2" | "h3"; text: string; id?: string }
  | { kind: "code"; code: string; label?: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  | { kind: "note"; text: string }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "command"; name: string; summary: string; forms: string[]; examples: string[]; notes?: string[] }
  | { kind: "release"; version: string; date: string; items: string[] };

export interface DocPage { slug: string; title: string; description: string; group: string; blocks: Block[] }

export const docsUpdated = "2026-11-02";
/** Links agents follow must name the public domain, whatever host built the site (preview, localhost). */
export const docsOrigin = "https://www.theoria.sh";
export const installCommand = "curl -fsSL https://www.theoria.sh/install/cli.sh | bash";

const command = (name: string, summary: string, forms: string[], examples: string[], notes?: string[]): Block =>
  ({ kind: "command", name, summary, forms, examples, notes });

export const pages: DocPage[] = [
  {
    slug: "",
    title: "Theoria-CLI",
    group: "Get started",
    description: "A Lean-native research agent for mathematics and theoretical sciences, in your terminal.",
    blocks: [
      { kind: "p", text: "Theoria-CLI is a research agent that works with Lean and Mathlib. It formalizes statements, proves theorems, shortens proofs, searches Mathlib, keeps track of research runs and claims, and drafts papers. Lean, not the agent, decides whether a proof is correct." },
      { kind: "h2", text: "Install" },
      { kind: "code", label: "Terminal", code: installCommand },
      { kind: "p", text: "The installer verifies the release checksum, installs into `~/.theoria-cli/app`, and links `~/.local/bin/theoria`. Run it again to upgrade. It requires Node.js 22.19 or later." },
      { kind: "note", text: "Theoria-CLI is in beta. macOS is fully supported. On Linux the interactive agent, Lean, the proof workflows and Mathlib search work; subagents, benchmarks, autoresearch, LeanHammer and the Telegram bot need macOS for now." },
      { kind: "h2", text: "What you can do" },
      { kind: "table", head: ["Goal", "Command"], rows: [
        ["Choose and install Lean and Mathlib", "`/lean`"],
        ["Turn an idea into a Lean statement", "`/formalize`"],
        ["Prove a theorem, checked by Lean", "`/prove`"],
        ["Shorten a verified proof", "`/compress`"],
        ["Find next steps for a paper or topic", "`/next-steps`"],
        ["Track a research effort and its claims", "`/run`, `/claim`"],
        ["Run unattended research campaigns", "`/autoresearch`"],
        ["Draft and compile a paper", "`/latex`"],
        ["See every command", "`/help`"],
      ] },
      { kind: "h2", text: "Where to go next" },
      { kind: "list", items: [
        "[Quickstart](/docs/quickstart): from install to a first verified proof.",
        "[Slash commands](/docs/commands): every command, with examples.",
        "[Autoresearch](/docs/autoresearch): unattended research campaigns and how their results are measured.",
        "[Lean environments](/docs/lean-environments): how Lean and Mathlib are shared to save disk space.",
        "[Configuration](/docs/configuration): settings, harness profiles and the interface.",
        "[Changelog](/docs/changelog): what changed in each release.",
      ] },
    ],
  },
  {
    slug: "quickstart",
    title: "Quickstart",
    group: "Get started",
    description: "Install Theoria-CLI, set up Lean and Mathlib, and prove a first theorem.",
    blocks: [
      { kind: "h2", text: "1. Install" },
      { kind: "code", label: "Terminal", code: `${installCommand}\ntheoria version` },
      { kind: "p", text: "If `~/.local/bin` is not on your `PATH`, the installer prints the line to add to your shell profile." },
      { kind: "h2", text: "2. Start Theoria and create a project" },
      { kind: "code", label: "Terminal", code: "mkdir -p ~/research && cd ~/research\ntheoria" },
      { kind: "code", label: "Theoria", code: "/new-project \"Goldbach conjecture\"" },
      { kind: "p", text: "A project's type (mathematics, theoretical physics, AI/ML, quantitative finance, other) decides which commands it gets. Mathematics and physics projects get the Lean workflows." },
      { kind: "h2", text: "3. Set up Lean and Mathlib" },
      { kind: "code", label: "Theoria", code: "/lean install          # clone a Mathlib release and fetch its build cache (about 7 GB)\n/lean config           # choose the Mathlib version for this project\n/lean search install   # Mathlib search: Loogle, Lean Finder and local search" },
      { kind: "p", text: "Lean comes from [elan](https://github.com/leanprover/elan); install it first if `lean --version` does not work." },
      { kind: "h2", text: "4. Connect a model" },
      { kind: "p", text: "Theoria runs on the [Pi coding agent](https://www.npmjs.com/package/@earendil-works/pi-coding-agent). With AWS credentials it starts on Amazon Bedrock; otherwise use `/login` for a provider account, or set an API key, then `/model` to choose." },
      { kind: "h2", text: "5. Formalize and prove" },
      { kind: "code", label: "Theoria", code: "/formalize every finite group of prime order is cyclic --name prime_order_cyclic\n/prove formal/PrimeOrder.lean prime_order_cyclic" },
      { kind: "p", text: "Each workflow ends with a verdict from Lean: the statement unchanged, no `sorry`, only standard axioms. Ask in plain language too, and the agent starts the right workflow." },
      { kind: "h2", text: "6. Explore what is next" },
      { kind: "code", label: "Theoria", code: "/next-steps 2401.01234 --n 5\n/help" },
    ],
  },
  {
    slug: "commands",
    title: "Slash commands",
    group: "Reference",
    description: "Every Theoria-CLI slash command, with its forms and examples.",
    blocks: [
      { kind: "p", text: "Type `/` in Theoria to see the commands, or `/help` for this list in the terminal and `/help <command>` for one command. In the forms below, `<value>` is required, `[value]` is optional, and `a|b` means one of them." },
      { kind: "note", text: "You can also ask in plain language, for example \"shorten the proof of `sum_squares`\", and the agent runs the matching command." },
      { kind: "h2", text: "Lean and proofs", id: "lean-and-proofs" },
      command("lean", "Choose, install and check the Lean and Mathlib this project uses.",
        ["/lean", "/lean config", "/lean status", "/lean install", "/lean remove", "/lean search <status|install|remove>", "/lean extras <status|install|on|off|remove> [hammer]"],
        ["/lean config", "/lean install", "/lean search install", "/lean extras install hammer"],
        ["Without arguments it opens a menu. A folder that is a Lean project of its own keeps its own toolchain and dependencies."]),
      command("formalize", "Turn an informal statement into a Lean statement, with `sorry` as its proof, checked by Lean.",
        ["/formalize <statement | file with one> [--name <theorem_name>]"],
        ["/formalize the sum of the first n odd numbers is n^2 --name sum_odd", "/formalize notes/conjecture.md"]),
      command("prove", "Prove a theorem. Lean decides whether the proof is complete.",
        ["/prove <file.lean> [theorem]", "/prove <theorem name>", "/prove <description of the result>"],
        ["/prove formal/Basics.lean sum_odd", "/prove sum_odd", "/prove the theorem about odd sums in Basics.lean"]),
      command("compress", "Shorten verified proofs and lower their heartbeats, keeping every statement.",
        ["/compress <file.lean> [declaration] [rounds] [skill=<path>|none] [--emphasis loc|clarity|balanced]", "/compress <theorem name> [rounds]"],
        ["/compress formal/Basics.lean", "/compress formal/Basics.lean sum_odd 3", "/compress sum_odd --emphasis clarity"],
        ["The score combines proof-token reduction, heartbeat reduction and measured compatibility; a candidate is kept only if Lean accepts it with the statement unchanged."]),
      command("workflow-cancel", "Cancel the running `/formalize`, `/prove` or `/compress`, including its Lean check.", ["/workflow-cancel"], ["/workflow-cancel"],
        ["In the terminal interface, Esc does the same."]),
      { kind: "h2", text: "Research", id: "research" },
      command("next-steps", "Suggest ranked next research steps for papers or a line of research.",
        ["/next-steps <arxiv-id | url | file | topic> [more papers…] [--n <1-10>] [--focus theory|numerics|formalization]"],
        ["/next-steps 2401.01234", "/next-steps paper.pdf 2312.04567 --n 5", "/next-steps \"sphere packing in dimension 8\" --focus formalization"],
        ["The agent gathers the papers and related or citing work, gauges recent momentum, distills the open questions, and proposes ranked extensions with a first step, difficulty and risk.",
          "`--n` sets how many ideas (default 5–8); `--focus` biases them toward one kind of work. Nothing is recorded unless you ask."]),
      command("run", "Research runs: a bounded effort with a persistent goal.",
        ["/run status", "/run new <objective>", "/run fork [objective]", "/run resume [run-id]", "/run pause", "/run complete", "/run update focus <text> | note <text> | ready [summary]"],
        ["/run new prove the Collatz bound for n < 2^20", "/run update focus reduce to the odd case", "/run resume run-003"],
        ["While a session is in a run, its goal and the relevant claims and artifacts are added to the agent's instructions. `/runs` lists the project's runs."]),
      command("claim", "One claim: create, change, link evidence, verify. `/claims [status]` lists them.",
        ["/claim <id>", "/claim new [hypothesis|supported] <statement>", "/claim set <id> <hypothesis|supported|refuted> [why]", "/claim link <id> <supports|refutes|verifies|derived-from> <artifact|path>[:<theorem>]", "/claim verify <id>", "/claim test <id> <data> <test>"],
        ["/claim new hypothesis every Keller map in dimension 2 is invertible", "/claim link claim-004 verifies formal/Keller.lean:keller_dim2", "/claim verify claim-004", "/claims verified"],
        ["A claim becomes verified only by Theoria: formally, when a linked Lean theorem is proved without `sorry` and with standard axioms, or statistically, from a linked data file."]),
      command("artifact", "Record or show an artifact (a file the project's results rest on). `/artifacts` lists them.",
        ["/artifact <id>", "/artifact add <path> [kind] [description]"], ["/artifact add data/runs.csv dataset \"benchmark timings\"", "/artifacts"]),
      command("plan", "The proof or research plan of this run or project.", ["/plan [show]", "/plan check"], ["/plan", "/plan check"],
        ["`check` asks Lean whether the plan is a valid proof skeleton: the objective is open only through its lemmas."]),
      command("autoresearch", "Unattended, bounded research campaigns that improve a benchmark result.",
        ["/autoresearch start <benchmark> [objective=\"…\"] [corpus=<manifest>] [skill=<path>,…|none] [budget=<USD>] [minutes=<n>] [workers=<n>]", "/autoresearch status [campaign-id]", "/autoresearch pause [campaign-id]", "/autoresearch resume [campaign-id]", "/autoresearch cancel [campaign-id]"],
        ["/autoresearch start putnam2025 corpus=corpus.json budget=100 minutes=180", "/autoresearch status", "/autoresearch pause campaign-002"],
        ["The start confirmation shows exactly what is authorized; omitted limits are unlimited. See [Autoresearch](/docs/autoresearch). macOS only for now."]),
      command("latex", "The project's paper: create, update, compile.",
        ["/latex", "/latex status", "/latex pdf", "/latex paper create [brief]", "/latex paper update [request]"],
        ["/latex paper create a short note on the dimension-32 counterexample", "/latex paper update add the Lean statement of the main theorem", "/latex pdf"]),
      command("subagent", "Independent child tasks with their own limits.", ["/subagent start <task>", "/subagent list", "/subagent status|result|wait|cancel <id>"],
        ["/subagent start survey Mathlib for results on Sidon sets", "/subagent result task-002"], ["macOS only for now."]),
      { kind: "h2", text: "Benchmarks", id: "benchmarks" },
      command("benchmark", "Install benchmark suites, run trials judged by Comparator, and compare runs.",
        ["/benchmark list", "/benchmark install <id>", "/benchmark run <id> [train|val|test] [N | task,task] [cost=<USD>] [repeat=<k>] [concurrency=<c>] [timeout=<min>]", "/benchmark run <id> mode=compress [corpus=<manifest>] [skill=<path>|none] [rounds=<n>]", "/benchmark status [run]", "/benchmark compare <run> <run>", "/benchmark resume [run]", "/benchmark cancel [run]"],
        ["/benchmark install minif2f", "/benchmark run minif2f val 10 cost=2", "/benchmark compare run-004 run-007"],
        ["A run costs money and asks first; the test split asks again. macOS only for now."]),
      { kind: "h2", text: "Project and interface", id: "project-and-interface" },
      command("project", "Projects: list and switch, status, type, MCP servers.",
        ["/project", "/project list", "/project status [refresh]", "/project type [type]", "/project new [name]", "/project servers"],
        ["/project status", "/project type theoretical-physics", "/project list"], ["`/new-project [name]` is a shortcut for `/project new`."]),
      command("connect-bot", "Connect Theoria to Telegram: pair your phone by QR code.", ["/connect-bot", "/connect-bot status", "/connect-bot pair", "/connect-bot remove"],
        ["/connect-bot"], ["Then `theoria bot start` runs the bot. macOS only for now."]),
      command("tui", "Interface settings: footer, editor, telemetry, thinking peek, icons.", ["/tui"], ["/tui"]),
      command("help", "Theoria's commands, or one command in detail.", ["/help [command]"], ["/help", "/help compress"]),
      { kind: "h2", text: "Pi's own commands", id: "pi-commands" },
      { kind: "p", text: "Theoria runs on Pi, so Pi's commands work too: `/model`, `/login`, `/settings`, `/resume`, `/new`, `/compact`, `/mcp` and others." },
    ],
  },
  {
    slug: "autoresearch",
    title: "Autoresearch",
    group: "Reference",
    description: "Unattended, bounded research campaigns: the agent runs experiments, reads the evidence and improves a result.",
    blocks: [
      { kind: "p", text: "`/autoresearch` hands a research question to the agent for a whole campaign. The agent plans experiments, runs them on a benchmark, reads the results and the agents' transcripts, searches arXiv, revises its approach, and runs the next batch, until the goal is met or a limit is reached. Every result is measured by Theoria: proofs are checked by Lean and judged by Comparator, never taken from the agent's word." },
      { kind: "note", text: "Today campaigns improve a compression skill: the instructions that guide `/compress`, scored on a benchmark's proofs. Autoresearch needs macOS for now." },
      { kind: "h2", text: "Start a campaign" },
      { kind: "code", label: "Theoria", code: "/autoresearch start putnam2025 corpus=corpus.json budget=100 minutes=180\n/autoresearch start putnam2025 objective=\"Shorten proofs without raising heartbeats\" skill=v1.md,v2.md workers=4\n/autoresearch start minif2f corpus=corpus.json models=amazon-bedrock/claude-opus,openai/gpt-6 budget=50" },
      { kind: "table", head: ["Option", "Meaning"], rows: [
        ["`<benchmark>`", "The benchmark whose tasks the experiments run on (required)"],
        ["`corpus=<manifest>`", "The proofs to work on, unless the benchmark supplies a default corpus"],
        ["`objective=\"…\"`", "The research goal, in your words"],
        ["`skill=<path>,…` or `skill=none`", "Starting skills, snapshotted as `v001`, `v002`, …; the first is the reference. Omitted: the bundled skill"],
        ["`models=<provider/id>,…`", "Models the campaign may compare; default: the current model"],
        ["`workers=<n>`", "Parallel trials across the campaign (default 6)"],
        ["`budget=<USD>`", "Total spending cap, for trials and the supervising agent"],
        ["`minutes=<n>`", "Wall-clock limit"],
        ["`experiments=<n>`, `decisions=<n>`", "Caps on experiments run and research decisions made"],
        ["`cost=<USD>`, `timeout=<min>`, `turns=<n>`", "Limits per trial"],
      ] },
      { kind: "p", text: "Starting asks for one confirmation that shows exactly what is authorized. **Omitted limits are unlimited**, and the confirmation says so; set `budget` and `minutes` to bound a campaign." },
      { kind: "h2", text: "Follow and control it" },
      { kind: "code", label: "Theoria", code: "/autoresearch status                 # the latest campaign\n/autoresearch status campaign-002\n/autoresearch pause                  # finish the experiments in flight, start no new ones\n/autoresearch resume campaign-002\n/autoresearch cancel campaign-002     # interrupt what is running" },
      { kind: "p", text: "Keep Theoria open while a campaign runs. Esc or closing the session interrupts it and saves a checkpoint; `/autoresearch resume` continues from there without repeating finished work or duplicating live workers." },
      { kind: "h2", text: "How a campaign works" },
      { kind: "list", ordered: true, items: [
        "**Frozen setup.** The corpus, starting skills, methodology, models and limits are recorded when the campaign starts, so later edits to files do not change it.",
        "**Experiments.** The supervising agent stages a skill, and submits a batch of trials that changes one factor at a time against a matched control.",
        "**Measurement.** Each trial is a separate, sandboxed agent session. Theoria verifies its proofs with Lean and Comparator and computes the score.",
        "**Evidence.** The agent reads compact summaries of every development trial, and opens raw transcripts and candidate proofs when a result needs explaining.",
        "**Literature.** It can retrieve arXiv abstracts and HTML pages to inform the next revision.",
        "**Decision.** It revises the skill, runs the next batch, and repeats until it finishes or a limit is reached.",
      ] },
      { kind: "h2", text: "Results you can trust" },
      { kind: "list", items: [
        "**Held-out tasks stay held out.** Test-split tasks are never shown to the research loop.",
        "**Matched comparisons.** The final choice compares skills on complete, matched validation runs (training when there is no validation split), weighting the authorized models and tasks equally. A skill chosen without that evidence is labelled provisional.",
        "**Honest statistics.** Reports give per-task means, standard deviations and best-of-k separately.",
        "**Nothing is promoted automatically.** A winning skill stays in the campaign folder; adopting it is your decision.",
      ] },
      { kind: "h2", text: "Where results are kept" },
      { kind: "p", text: "Each campaign lives in `.theoria/autoresearch/campaign-NNN/`: the frozen manifest and methodology, a journal of every decision, the versioned skills (`skills/v001.md`, …), the literature consulted, the development evidence and a final `report.json`. Its experiments are ordinary benchmark runs, readable with `/benchmark status`." },
      { kind: "p", text: "Campaign defaults are under `autoresearch` in the [configuration](/docs/configuration). The methodology the agent follows is a Markdown prompt you can edit." },
    ],
  },
  {
    slug: "lean-environments",
    title: "Lean environments",
    group: "Reference",
    description: "How Theoria finds, installs and shares Lean and Mathlib, and keeps long Lean runs light on disk.",
    blocks: [
      { kind: "p", text: "A built Mathlib takes about 7 GB, and a long research or benchmark run may need several versions at once. Theoria keeps one built copy per Mathlib version and has every project, run and trial share it, instead of giving each its own." },
      { kind: "h2", text: "One build per Mathlib version" },
      { kind: "list", items: [
        "**Found, not duplicated.** Theoria uses the Lean toolchains elan has installed and the built Mathlib checkouts it finds up to three folders below your home directory (`lean.discovery.homeScanDepth`), keeping one per version. A checkout you built yourself is used as it is.",
        "**Installed from the cache.** `/lean install` makes a shallow clone of a Mathlib release into `~/.theoria-cli/lean/mathlib/<version>` and runs `lake exe cache get`, which downloads Mathlib's prebuilt files instead of compiling them. A quick check then compiles only what the cache missed, normally nothing.",
        "**Chosen per project.** `/lean config` records the version in the project's `.theoria/lean.json`, with a global default for the rest. A folder that is a Lean project of its own (a `lean-toolchain` and a lakefile) keeps its own toolchain and dependencies.",
        "**Removed when no longer needed.** `/lean remove` deletes a Mathlib that Theoria installed; checkouts you built yourself are never deleted.",
      ] },
      { kind: "code", label: "Theoria", code: "/lean status     # the Lean and Mathlib this project uses\n/lean install    # add a Mathlib version (about 7 GB)\n/lean remove     # delete one Theoria installed" },
      { kind: "h2", text: "Shared, not copied, in long runs" },
      { kind: "list", items: [
        "**Pinned environments are copy-on-write clones.** A benchmark pins an exact Mathlib commit. Theoria prepares that environment once as an APFS copy-on-write clone of the matching built checkout. The clone shares every file with the original until one changes, so it costs almost no extra space, and Lake can write its own caches there without touching your checkout. Every later run and trial on that commit reuses it.",
        "**Each trial is a small project.** A trial or compression attempt gets its own Lake project holding only its proof files; Mathlib and its dependencies are linked in read-only, not copied. Parallel trials therefore add kilobytes, not gigabytes, and none of them can modify the shared build.",
        "**Add-ons reuse the build too.** LeanHammer (`/lean extras install hammer`) is built in a copy-on-write clone of the matching Mathlib, so only Hammer's own dependencies take extra space.",
      ] },
      { kind: "h2", text: "Temporary files are cleaned up" },
      { kind: "p", text: "Each Lean and Lake command gets a fresh temporary folder, removed when it exits, whether it succeeded, failed, timed out or was cancelled; parallel checks never share one. When a benchmark run completes or is cancelled, Theoria also removes the Lake metadata its workers left behind. Proofs, logs, transcripts and results are kept." },
      { kind: "h2", text: "Verified checkpoints" },
      { kind: "p", text: "Long workflows keep their progress as small Lean files rather than environments. `/compress` and compression benchmarks record each round's best proof that Lean verified as a checkpoint; the next round starts from it, and a run that hits its time, turn or cost limit keeps that last verified checkpoint. A restored checkpoint is checked by Lean again before it is used." },
      { kind: "note", text: "Copy-on-write clones need APFS, so benchmark environments and Lean add-ons are macOS-only for now. `/lean`, `lean_check` and the proof workflows use your Mathlib directly and work on Linux too." },
    ],
  },
  {
    slug: "configuration",
    title: "Configuration",
    group: "Reference",
    description: "Settings, harness profiles, the interface and where Theoria keeps its files.",
    blocks: [
      { kind: "h2", text: "Settings file" },
      { kind: "p", text: "Every setting has a default in Theoria's `theoria.config.json`. To change one, put just that key in `~/.theoria-cli/config.json`. Objects merge into the defaults and lists replace them. A misspelt key, a wrong type or an out-of-range value stops Theoria with the key named." },
      { kind: "code", label: "~/.theoria-cli/config.json", code: "{\n  \"workflows\": { \"defaults\": { \"maxAttempts\": 5 } },\n  \"tui\": { \"logo\": { \"shearMs\": 3500 } }\n}" },
      { kind: "h2", text: "Harness profiles" },
      { kind: "p", text: "A profile chooses which of Theoria's components a session loads, so you can compare Theoria with plain Pi." },
      { kind: "code", label: "Terminal", code: "theoria harness                 # list the profiles\ntheoria --harness lean          # Lean checking only\ntheoria --harness bare          # Pi as it ships" },
      { kind: "h2", text: "Interface" },
      { kind: "p", text: "`/tui` changes the footer, editor, telemetry, thinking peek and icons. At startup the Θ logo shears apart and re-assembles; `tui.logo.intro` (`shear` or `sweep`), `holdMs`, `shearMs` and `animate` control it." },
      { kind: "h2", text: "Workflow prompts" },
      { kind: "p", text: "`/formalize`, `/prove`, `/compress` and `/next-steps` read their prompts from Markdown files. Copy a default into `.theoria/commands/<name>.md` (this project) or `~/.theoria-cli/agent/commands/<name>.md` (all projects) and edit it." },
      { kind: "h2", text: "Where files live" },
      { kind: "table", head: ["Path", "Contents"], rows: [
        ["`~/.theoria-cli/app`", "Installed versions; `current` points at the active one"],
        ["`~/.theoria-cli/agent`", "Pi settings, sessions and credentials, apart from a personal `~/.pi`"],
        ["`~/.theoria-cli/lean`", "Mathlib installs from `/lean install`"],
        ["`<project>/.theoria`", "Project type, Lean choice, runs, claims, artifacts and benchmark results"],
      ] },
      { kind: "h2", text: "Uninstall" },
      { kind: "code", label: "Terminal", code: "rm -rf ~/.theoria-cli/app ~/.local/bin/theoria   # the program\nrm -rf ~/.theoria-cli                             # also settings, sessions and Lean installs" },
    ],
  },
  {
    slug: "changelog",
    title: "Changelog",
    group: "Reference",
    description: "Theoria-CLI releases.",
    blocks: [
      { kind: "p", text: "Releases are published on [GitHub](https://github.com/TheoriaLabs/theoria-cli-releases/releases). Run the installer again to upgrade; `theoria version` shows the version you have." },
      { kind: "release", version: "0.1.0-beta.1", date: "2026-11", items: [
        "First public beta, installed with `curl -fsSL https://www.theoria.sh/install/cli.sh | bash`.",
        "Lean and Mathlib: `/lean` selection, install and Mathlib search; `/formalize`, `/prove` and `/compress`, each judged by Lean.",
        "Research: runs, claims and artifacts, proof plans, `/next-steps` for papers and lines of research, and `/latex` papers.",
        "Benchmarks judged by Comparator and `/autoresearch` campaigns (macOS).",
        "`/help` with every command's forms; the Θ logo now shears apart and re-assembles at startup.",
        "Licensed under Apache-2.0.",
      ] },
    ],
  },
];

export const pageHref = (page: DocPage) => (page.slug ? `/docs/${page.slug}` : "/docs");
export const findPage = (slug: string | undefined) => pages.find(page => page.slug === (slug ?? ""));
/** Release anchors start with a letter (v0-1-0-beta-1), so they are valid CSS ids. */
export const releaseId = (version: string) => `v${slugify(version)}`;
export const slugify = (text: string) => text.toLowerCase().replace(/`/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** The page's headings and commands, for the "On this page" column. */
export function outline(page: DocPage): { id: string; text: string; depth: 2 | 3 }[] {
  return page.blocks.flatMap(block => {
    if (block.kind === "h2" || block.kind === "h3") return [{ id: block.id ?? slugify(block.text), text: block.text, depth: block.kind === "h2" ? 2 as const : 3 as const }];
    if (block.kind === "command") return [{ id: block.name, text: `/${block.name}`, depth: 3 as const }];
    if (block.kind === "release") return [{ id: releaseId(block.version), text: block.version, depth: 2 as const }];
    return [];
  });
}

/** The page as Markdown, for agents: absolute links, every form and example kept. */
export function pageMarkdown(page: DocPage, origin: string): string {
  const absolute = (text: string) => text.replace(/\]\((\/[^)]*)\)/g, (_m, path: string) => `](${origin}${path === "/docs" || path.startsWith("/docs/") ? `${path}.md` : path})`);
  const out = [`# ${page.title}`, "", `> ${page.description}`, ""];
  for (const block of page.blocks) {
    if (block.kind === "p") out.push(absolute(block.text), "");
    else if (block.kind === "h2") out.push(`## ${block.text}`, "");
    else if (block.kind === "h3") out.push(`### ${block.text}`, "");
    else if (block.kind === "code") out.push("```" + (block.label === "Terminal" ? "sh" : "text"), block.code, "```", "");
    else if (block.kind === "list") out.push(...block.items.map((item, index) => `${block.ordered ? `${index + 1}.` : "-"} ${absolute(item)}`), "");
    else if (block.kind === "note") out.push(`> ${absolute(block.text)}`, "");
    else if (block.kind === "table") out.push(`| ${block.head.join(" | ")} |`, `| ${block.head.map(() => "---").join(" | ")} |`, ...block.rows.map(row => `| ${row.join(" | ")} |`), "");
    else if (block.kind === "command") {
      out.push(`### /${block.name}`, "", block.summary, "", "Forms:", "", "```text", ...block.forms, "```", "", "Examples:", "", "```text", ...block.examples, "```", "");
      if (block.notes?.length) out.push(...block.notes.map(absolute), "");
    } else if (block.kind === "release") out.push(`## ${block.version} (${block.date})`, "", ...block.items.map(item => `- ${item}`), "");
  }
  out.push(`Last updated ${docsUpdated}. Web page: ${origin}${pageHref(page)}`);
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}
