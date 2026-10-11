"use client";

import { useEffect, useRef, useState } from "react";
import { shearAt, shearX } from "@/lib/shear";

export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsedRef = useRef(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = 0;
    let visible = true;
    let width = 1;
    let height = 1;
    let columns = 140;
    const rows = 37;
    const shades = ".:+=xX#@";

    function draw(shear: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const cellWidth = width / columns;
      const cellHeight = height / rows;
      ctx.font = `${Math.min(cellHeight * 0.87, cellWidth * 1.55)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let row = 2; row < rows - 2; row++) {
        for (let col = 0; col < columns; col++) {
          const x = (col - columns / 2) / (columns * 0.25);
          const y = (row - (rows - 1) / 2) / (rows * 0.43);
          const radius = Math.sqrt(x * x + y * y);
          const ring = radius > 0.73 && radius < 1;
          const bar = Math.abs(y) < 0.11 && Math.abs(x) < 0.73;
          if (!ring && !bar) continue;
          const lighting = 0.5 + 0.5 * Math.cos(x * 2.4 - y * 1.5);
          const index = Math.min(7, Math.floor(lighting * 5 + ((col * 7 + row * 3) % 3)));
          ctx.fillStyle = `rgba(84, 133, 0, ${0.44 + lighting * 0.56})`;
          const target = shearX(col, row - 18, shear, columns);
          const px = (target + 0.5) * cellWidth;
          const py = (row + 0.5) * cellHeight;
          ctx.fillText(shades[index], px, py);
          // Draw the wrapped edge too, so a character never gets clipped out of the torus.
          if (target > columns - 1) ctx.fillText(shades[index], px - width, py);
        }
      }
    }

    function resize() {
      if (!canvas || !ctx) return;
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      columns = width < 600 ? 80 : 160;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(reducedMotion.matches ? 0 : shearAt(elapsedRef.current, columns));
    }

    function tick(now: number) {
      if (visible && !document.hidden && !paused && !reducedMotion.matches) {
        if (last) elapsedRef.current += Math.min(now - last, 100);
        draw(shearAt(elapsedRef.current, columns));
      }
      last = now;
      frame = requestAnimationFrame(tick);
    }

    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    const onMotionChange = () => { elapsedRef.current = 0; draw(0); };
    observer.observe(canvas);
    intersection.observe(canvas);
    reducedMotion.addEventListener("change", onMotionChange);
    resize();
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, [paused]);

  return (
    <figure className="theta-figure" aria-label="A green ASCII Theta undergoing a periodic horizontal shear with wraparound, returning to its original form.">
      <div className="figure-top mono"><span><span className="status-dot" /> THE SHAPE OF AN IDEA</span><span>FIG. 01 / PERIODIC SHEAR</span></div>
      <div className="canvas-wrap">
        <span className="axis-label axis-left mono">y</span>
        <canvas ref={canvasRef} aria-hidden="true" />
        <span className="axis-label axis-right mono">x →</span>
        <noscript><div className="theta-fallback">Θ</div></noscript>
      </div>
      <figcaption className="figure-bottom mono">
        <span>x′ = (x + s·y) mod L <span className="formula-note">/ structure, transformed.</span></span>
        <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Play Theta animation" : "Pause Theta animation"}>{paused ? "▶ RESUME" : "Ⅱ PAUSE"}</button>
      </figcaption>
    </figure>
  );
}
