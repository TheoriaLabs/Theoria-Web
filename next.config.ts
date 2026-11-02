import type { NextConfig } from "next";

const config: NextConfig = {
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
