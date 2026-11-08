import type { NextConfig } from "next";

const config: NextConfig = {
  outputFileTracingIncludes: {
    "/open-problems": ["./data/open-problems/*.preliminary.jsonl", "./data/open-problems/source-enrichment.json"],
    "/open-problems/*": ["./data/open-problems/*.preliminary.jsonl", "./data/open-problems/source-enrichment.json"],
    "/api/open-problems": ["./data/open-problems/*.preliminary.jsonl", "./data/open-problems/source-enrichment.json"],
  },
  async redirects() {
    return [{ source: "/open_problems/:path*", destination: "/open-problems/:path*", permanent: true }];
  },
  async rewrites() {
    // Each docs page has a Markdown twin for agents: /docs.md and /docs/<page>.md.
    return [
      { source: "/docs.md", destination: "/docs-md" },
      { source: "/docs/:slug.md", destination: "/docs-md/:slug" },
    ];
  },
  async headers() {
    return [{
      source: "/install/:path*.sh",
      headers: [
        { key: "Content-Type", value: "text/plain; charset=utf-8" },
        { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    }];
  },
};

export default config;
