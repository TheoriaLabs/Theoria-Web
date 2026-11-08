"use client";

import Link from "next/link";

export default function CatalogError({ reset }: { reset: () => void }) {
  return <main className="shell" style={{ paddingBlock: 80 }}><h1 style={{ fontSize: 32 }}>Catalog temporarily unavailable</h1><p>Please try again in a moment.</p><button type="button" onClick={reset}>Try again</button><p><Link href="/open-problems">← All open problems</Link></p></main>;
}
