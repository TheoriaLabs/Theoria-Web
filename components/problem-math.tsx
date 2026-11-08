import katex from "katex";

/** Plain source text stays escaped by React. Only delimited math is rendered, with KaTeX trust disabled. */
export function ProblemMath({ text }: { text: string }) {
  return <>{text.split(/(\$\$[\s\S]*?\$\$|\$(?:\\.|[^$\n])+\$)/g).map((part, index) => {
    if (!part.startsWith("$") || !part.endsWith("$") || part.length < 3) return part;
    const displayMode = part.startsWith("$$");
    const expression = part.slice(displayMode ? 2 : 1, displayMode ? -2 : -1);
    return <span key={index} className="problem-math" dangerouslySetInnerHTML={{ __html: katex.renderToString(expression, { displayMode, throwOnError: false, trust: false, strict: "ignore", maxExpand: 500, maxSize: 20 }) }} />;
  })}</>;
}
