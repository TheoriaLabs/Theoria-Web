import type { MetadataRoute } from "next";
import { pageHref, pages } from "@/lib/docs";
import { site } from "@/lib/site-config";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...pages.map(page => ({ url: `${site.url}${pageHref(page)}`, changeFrequency: "weekly" as const, priority: page.slug ? 0.6 : 0.8 })),
  ];
}
