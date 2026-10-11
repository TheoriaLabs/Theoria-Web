export const site = {
  name: "Theoria Labs",
  description: "A Lean-native coding agent for mathematics and theoretical sciences. From informal ideas to machine-checked proofs.",
  repository: "https://github.com/yourball/Theoria-Web",
  url: process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
};

// Enable a download only after its script and public release artifacts exist.
export const products = {
  cli: {
    name: "Theoria-CLI",
    command: "/install/cli.sh",
    available: false,
    description: "Your terminal. A deeper way to think.",
    detail: "The Lean-native research agent, right where you work. Formalize statements, discover lemmas, and iterate on proofs with feedback from Lean.",
    requirement: "Current source requires Node.js 22.19+. Public installer coming soon.",
  },
  ide: {
    name: "Theoria-IDE",
    command: "/install/ide.sh",
    available: false,
    description: "One workspace. Shared discovery.",
    detail: "A graphical home for your research. Bring conversations, proofs, papers, and your team into one connected workspace.",
    requirement: "macOS-first desktop application. Public installer coming soon.",
  },
} as const;
