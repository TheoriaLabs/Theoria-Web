"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { areaLabels, kindLabels, type GraphLayout, type OpenProblem } from "@/lib/open-problems";
import { areaColor, buildGraph, graphHeight, graphWidth } from "@/lib/problem-graph";
import { ProblemMath } from "@/components/problem-math";

export function ProblemGraph({ problems, layout, onLayoutChange }: { problems: OpenProblem[]; layout: GraphLayout; onLayoutChange: (layout: GraphLayout) => void }) {
  const graph = useMemo(() => buildGraph(problems, layout), [problems, layout]);
  const [selectedId, setSelectedId] = useState<string>();
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 });
  const [showSimilarity, setShowSimilarity] = useState(true);
  const drag = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const selected = problems.find(problem => problem.id === selectedId);
  const coordinates = new Map(graph.nodes.map(node => [node.id, node]));
  const neighbours = new Set(graph.edges.flatMap(edge => edge.source === selectedId ? [edge.target] : edge.target === selectedId ? [edge.source] : []));
  const topicNeighbours = new Set(graph.similarityEdges.flatMap(edge => edge.source === selectedId ? [edge.target] : edge.target === selectedId ? [edge.source] : []));
  const zoom = (factor: number) => setCamera(value => ({ ...value, scale: Math.max(0.5, Math.min(8, value.scale * factor)) }));
  const changeLayout = (value: GraphLayout) => { if (value !== layout) { setCamera({ x: 0, y: 0, scale: 1 }); onLayoutChange(value); } };
  return (
    <div className="problem-graph-layout">
      <div className="problem-map">
        <div className="problem-map-toolbar">
          <span>{graph.nodes.length} nodes · {graph.clusters.length} subject groups · {layout === "spring" ? "spring" : "grid"} layout</span>
          <div className="problem-layout-switch" role="group" aria-label="Graph layout">
            <button type="button" aria-pressed={layout === "spring"} onClick={() => changeLayout("spring")}>Spring groups</button>
            <button type="button" aria-pressed={layout === "grid"} onClick={() => changeLayout("grid")}>Grid</button>
          </div>
          <div className="problem-map-controls" aria-label="Graph controls">
            <button type="button" aria-label="Zoom out" onClick={() => zoom(1 / 1.25)}>−</button>
            <button type="button" aria-label="Zoom in" onClick={() => zoom(1.25)}>+</button>
            <button type="button" onClick={() => setCamera({ x: 0, y: 0, scale: 1 })}>Reset view</button>
          </div>
        </div>
        <div className="problem-map-key"><span><i />Recorded relationship</span><label><input type="checkbox" checked={showSimilarity} onChange={event => setShowSimilarity(event.target.checked)} /><i />Show topic similarity</label></div>
        <svg className="problem-map-svg" viewBox={`0 0 ${graphWidth} ${graphHeight}`} role="group" aria-label="2D open-problem relationship graph"
          onPointerDown={event => {
            if ((event.target as Element).closest("[data-node]")) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = { x: event.clientX, y: event.clientY, offsetX: camera.x, offsetY: camera.y };
          }}
          onPointerMove={event => {
            if (!drag.current) return;
            const ratio = graphWidth / event.currentTarget.getBoundingClientRect().width;
            setCamera(value => ({ ...value, x: drag.current!.offsetX + (event.clientX - drag.current!.x) * ratio, y: drag.current!.offsetY + (event.clientY - drag.current!.y) * ratio }));
          }}
          onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
          <g transform={`translate(${camera.x} ${camera.y}) translate(${graphWidth / 2} ${graphHeight / 2}) scale(${camera.scale}) translate(${-graphWidth / 2} ${-graphHeight / 2})`}>
            {graph.clusters.map(cluster => <g key={cluster.area} data-subject-group={cluster.area} aria-hidden="true">
              <circle cx={cluster.x} cy={cluster.y} r={cluster.radius} fill={areaColor(cluster.area)} fillOpacity="0.065" stroke={areaColor(cluster.area)} strokeOpacity="0.25" strokeWidth="1" />
            </g>)}
            {showSimilarity && graph.similarityEdges.map(edge => {
              const a = coordinates.get(edge.source)!, b = coordinates.get(edge.target)!;
              const active = edge.source === selectedId || edge.target === selectedId;
              return <line key={`topic:${a.id}:${b.id}`} data-topic-link="true" x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#788c9c" strokeDasharray="3 5" strokeWidth={active ? 1.8 : 1} opacity={selected ? active ? 0.7 : 0.07 : 0.22}><title>{edge.note}</title></line>;
            })}
            {graph.edges.map(edge => {
              const a = coordinates.get(edge.source)!, b = coordinates.get(edge.target)!;
              const active = edge.source === selectedId || edge.target === selectedId;
              return <line key={`${a.id}:${b.id}`} data-recorded-link="true" x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={active ? "#4b7600" : "#a4b198"} strokeWidth={active ? 2.5 : 1.3} opacity={!selected || active ? 0.8 : 0.16}><title>{edge.note}</title></line>;
            })}
            {graph.clusters.map(cluster => <text key={`label:${cluster.area}`} x={cluster.x} y={cluster.y - cluster.radius - 12} textAnchor="middle" className="problem-subject-label" fill={areaColor(cluster.area)} aria-hidden="true">{areaLabels[cluster.area]}</text>)}
            {graph.nodes.map(node => <g key={node.id} data-node={node.id} data-subject={node.area} role="button" tabIndex={0} aria-label={node.title} aria-pressed={selectedId === node.id}
              onClick={() => setSelectedId(node.id)} onKeyDown={event => { if (["Enter", " "].includes(event.key)) { event.preventDefault(); setSelectedId(node.id); } }}
              className="problem-graph-node" opacity={!selected || selectedId === node.id || neighbours.has(node.id) || showSimilarity && topicNeighbours.has(node.id) ? 1 : 0.3}>
              <title>{node.title}</title>
              <circle cx={node.x} cy={node.y} r="14" fill="transparent" />
              <circle cx={node.x} cy={node.y} r={selectedId === node.id ? node.radius + 3 : node.radius} fill={areaColor(node.area)} stroke="#fff" strokeWidth="1.5" />
              {selectedId === node.id && <circle cx={node.x} cy={node.y} r={node.radius + 7} fill="none" stroke={areaColor(node.area)} />}
            </g>)}
          </g>
        </svg>
        <p className="problem-map-caption">{layout === "spring" ? "Springs and repulsion position whole subject groups using their aggregated relationships and topic affinity." : "Subject groups are arranged in a grid."} Dots stay inside their primary-subject group. Solid lines are recorded relationships; dashed lines are inferred topic affinity. Select a dot to explore; drag the background to pan.</p>
      </div>
      <aside className="problem-map-selection" aria-label="Selected graph problem" aria-live="polite">
        <label htmlFor="graph-problem-picker">Explore a problem</label>
        <select id="graph-problem-picker" value={selected?.id ?? ""} onChange={event => setSelectedId(event.target.value || undefined)}>
          <option value="">Select a node or choose here</option>
          {problems.map(problem => <option key={problem.id} value={problem.id}>{problem.title}</option>)}
        </select>
        {selected ? <>
          <span className="problem-kicker">{areaLabels[selected.primary_area]} · {kindLabels[selected.kind]}</span>
          <h3><ProblemMath text={selected.title} /></h3>
          <p><ProblemMath text={selected.physics_motivation} /></p>
          <p className="problem-selection-target"><strong>Resolution target</strong><ProblemMath text={selected.resolution_target} /></p>
          <Link href={`/open-problems/${selected.id}`} className="problem-read-link">Read statement and sources <span aria-hidden="true">↗</span></Link>
          <p className="problem-small">{neighbours.size} recorded neighbors · {topicNeighbours.size} inferred topic neighbors in this view.</p>
        </> : <>
          <h3>A map of open questions.</h3>
          <p>Each labelled group is a subject. In Spring groups, connections and shared topic features bring related subjects closer. Each problem keeps its place inside its subject; proximity is a reading lead, not a proof dependency.</p>
          <ul className="problem-map-legend">{graph.clusters.map(cluster => <li key={cluster.area}><i style={{ background: areaColor(cluster.area) }} />{areaLabels[cluster.area]} <span>{cluster.count}</span></li>)}</ul>
        </>}
      </aside>
    </div>
  );
}
