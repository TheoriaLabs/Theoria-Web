"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LockIcon } from "@/components/lock-icon";
import { ThetaLogo } from "@/components/theta-logo";

/** Landing-page section links shown only on the home page, after the product and docs entries. */
export interface SectionLink { href: string; label: string }

/** The site's top bar: wordmark, a Products menu, Docs, any page sections, and the install call to action. */
export function SiteHeader({ sections = [] }: { sections?: SectionLink[] }) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menu.current?.querySelector<HTMLButtonElement>("button")?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);

  return (
    <header className="site-header shell">
      <Link className="wordmark" href="/" aria-label="Theoria Labs home"><ThetaLogo /><span>theoria<span className="wordmark-light">labs</span><span className="wordmark-period">.</span></span></Link>
      <nav aria-label="Main navigation">
        <div className="nav-menu" ref={menu} onPointerLeave={event => { if (event.pointerType === "mouse") setOpen(false); }}>
          <button type="button" className="nav-menu-button" aria-haspopup="true" aria-expanded={open} aria-controls="products-menu"
            // A mouse opens the menu on hover, so its click only keeps it open; touch and keyboard toggle it.
            onPointerEnter={event => { if (event.pointerType === "mouse") setOpen(true); }}
            onClick={event => setOpen(value => (event.nativeEvent instanceof PointerEvent && event.nativeEvent.pointerType === "mouse" ? true : !value))}>
            Products <span className="nav-caret" aria-hidden="true">▾</span>
          </button>
          <div id="products-menu" className="nav-menu-panel" hidden={!open}>
            <Link href="/#install" className="nav-menu-item" onClick={() => setOpen(false)}>
              <span className="nav-menu-title">Theoria-CLI</span>
              <span className="nav-menu-detail">The Lean-native research agent in your terminal.</span>
            </Link>
            <span className="nav-menu-item nav-menu-disabled" aria-disabled="true">
              <span className="nav-menu-title"><LockIcon />Theoria-IDE <span className="coming-soon-badge">Coming soon</span></span>
              <span className="nav-menu-detail">A graphical workspace for research.</span>
            </span>
          </div>
        </div>
        <Link href="/docs">Docs</Link>
        {sections.map(section => <a key={section.href} href={section.href} className="nav-section">{section.label}</a>)}
        <Link href="/#install" className="nav-cta" aria-label="Get Theoria">Get<span className="nav-cta-long"> Theoria</span> <span aria-hidden="true">↗</span></Link>
      </nav>
    </header>
  );
}
