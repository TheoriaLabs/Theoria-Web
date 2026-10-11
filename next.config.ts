import type { NextConfig } from "next";

const config: NextConfig = {
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
