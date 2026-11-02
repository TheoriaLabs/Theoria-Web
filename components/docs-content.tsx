import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { CopyButton, MermaidDiagram } from "@/components/docs-client";
import { releaseId, slugify, type Block } from "@/lib/docs";

/** Inline Markdown subset used in the docs data: `code`, **bold** and [links](href). */
export function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index! > last) parts.push(text.slice(last, match.index));
    if (match[1] !== undefined) parts.push(<code key={match.index}>{match[1]}</code>);
    else if (match[2] !== undefined) parts.push(<strong key={match.index}>{match[2]}</strong>);
    else if (match[4]!.startsWith("/")) parts.push(<Link key={match.index} href={match[4]!}><Inline text={match[3]!} /></Link>);
    else parts.push(<a key={match.index} href={match[4]} target="_blank" rel="noreferrer">{match[3]}</a>);
    last = match.index! + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts.map((part, index) => <Fragment key={index}>{part}</Fragment>)}</>;
}

function Heading({ level, id, children }: { level: 2 | 3; id: string; children: ReactNode }) {
  const Tag = level === 2 ? "h2" : "h3";
  return <Tag id={id}>{children}<a className="anchor" href={`#${id}`} aria-label="Link to this section">#</a></Tag>;
}

function Code({ code, label }: { code: string; label?: string }) {
  // Comments after `#` are shown dimmed; the copy button copies the commands without them.
  const lines = code.split("\n");
  const plain = lines.map(line => line.replace(/\s+#\s.*$/, "")).join("\n");
  return (
    <div className="docs-code">
      {label && <div className="docs-code-label">{label}</div>}
      <pre><code>{lines.map((line, index) => {
        const at = line.search(/\s+#\s/);
        return <Fragment key={index}>{at < 0 ? line : <>{line.slice(0, at)}<span className="comment">{line.slice(at)}</span></>}{index < lines.length - 1 ? "\n" : ""}</Fragment>;
      })}</code></pre>
      <CopyButton text={plain} />
    </div>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((block, index) => {
    switch (block.kind) {
      case "p": return <p key={index}><Inline text={block.text} /></p>;
      case "h2": case "h3": return <Heading key={index} level={block.kind === "h2" ? 2 : 3} id={block.id ?? slugify(block.text)}>{block.text}</Heading>;
      case "code": return <Code key={index} code={block.code} label={block.label} />;
      case "list": { const List = block.ordered ? "ol" : "ul"; return <List key={index}>{block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}</List>; }
      case "note": return <div key={index} className="docs-note"><Inline text={block.text} /></div>;
      case "table": return (
        <table key={index} className="docs-table"><thead><tr>{block.head.map(cell => <th key={cell}>{cell}</th>)}</tr></thead>
          <tbody>{block.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}><Inline text={cell} /></td>)}</tr>)}</tbody></table>
      );
      case "command": return (
        <section key={index} className="docs-command" aria-labelledby={block.name}>
          <Heading level={3} id={block.name}><code>/{block.name}</code></Heading>
          <p><Inline text={block.summary} /></p>
          <div className="docs-forms-label" aria-hidden="true">Forms</div>
          <ul className="docs-forms" aria-label={`/${block.name} forms`}>{block.forms.map(form => <li key={form}>{form}</li>)}</ul>
          <Code label="Examples" code={block.examples.join("\n")} />
          {block.notes?.map((note, i) => <p key={i}><Inline text={note} /></p>)}
        </section>
      );
      case "mermaid": return <MermaidDiagram key={index} code={block.code} caption={block.caption} />;
      case "release": return (
        <section key={index} className="docs-release" aria-labelledby={releaseId(block.version)}>
          <Heading level={2} id={releaseId(block.version)}>{block.version} <time>{block.date}</time></Heading>
          <ul>{block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}</ul>
        </section>
      );
    }
  })}</>;
}
