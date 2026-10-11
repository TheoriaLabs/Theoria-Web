import type { Metadata } from "next";
import { site } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Theoria Labs — Verifiable research loops",
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { title: "Theoria Labs — Verifiable research loops", description: site.description, type: "website", siteName: site.name, locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Theoria Labs — Verifiable research loops", description: site.description },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
