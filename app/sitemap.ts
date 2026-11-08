import type { MetadataRoute } from "next";
import { pageHref, pages } from "@/lib/docs";
import { site } from "@/lib/site-config";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/open-problems`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/open-problems/sources`, changeFrequency: "monthly", priority: 0.5 },
    ...pages.map(page => ({ url: `${site.url}${pageHref(page)}`, changeFrequency: "weekly" as const, priority: page.slug ? 0.6 : 0.8 })),
  ];
}
