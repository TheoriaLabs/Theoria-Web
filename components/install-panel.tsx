"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { products } from "@/lib/site-config";

const subscribeToOrigin = () => () => {};
const readOrigin = () => window.location.origin;
const serverOrigin = () => "https://<your-domain>";

export function InstallPanel() {
  const [selected, setSelected] = useState<"cli" | "ide">("cli");
  const origin = useSyncExternalStore(subscribeToOrigin, readOrigin, serverOrigin);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const product = products[selected];
  const command = `curl -fsSL ${origin}${product.command} | bash`;

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setError(false);
    } catch { setError(true); }
  }

  return (
    <div className="install-panel">
      <div className="install-tabs" role="tablist" aria-label="Choose a product">
        {(["cli", "ide"] as const).map((key) => (
          <button key={key} id={`tab-${key}`} role="tab" aria-selected={selected === key} aria-controls="install-content" tabIndex={selected === key ? 0 : -1} onClick={() => { setSelected(key); setCopied(false); setError(false); }} onKeyDown={(event) => {
            if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
              event.preventDefault();
              const next = event.key === "Home" ? "cli" : event.key === "End" ? "ide" : selected === "cli" ? "ide" : "cli";
              setSelected(next);
              document.getElementById(`tab-${next}`)?.focus();
            }
          }}><span aria-hidden="true">{key === "cli" ? ">_" : "▤"}</span> {products[key].name}</button>
        ))}
        <span className="preview-badge mono">IN DEVELOPMENT</span>
      </div>
      <div id="install-content" role="tabpanel" aria-labelledby={`tab-${selected}`} tabIndex={0}>
        <div className="install-description"><h3>{product.description}</h3><p>{product.detail}</p></div>
        <div className="command-label mono">{product.available ? "INSTALL IN YOUR TERMINAL" : "PLANNED INSTALL COMMAND"}<span>{product.available ? "READY TO INSTALL" : "COMING SOON"}</span></div>
        <div className="command-box"><span className="prompt" aria-hidden="true">$</span><code>{command}</code><button onClick={copy} disabled={!product.available} aria-label="Copy install command">{copied ? "Copied ✓" : "Copy ↗"}</button></div>
        <p className="install-note">{product.requirement}</p>
        {product.available && <a className="text-link" href={product.command}>View installation script ↗</a>}
        <p className="copy-status" role="status">{error ? "Could not copy. Select the command to copy it manually." : copied ? "Command copied to clipboard." : product.available ? "Inspect the script above or paste the command into your terminal." : "Public downloads will appear here when releases are ready."}</p>
      </div>
    </div>
  );
}
