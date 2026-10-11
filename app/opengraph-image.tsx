import { ImageResponse } from "next/og";
export const alt = "Theoria Labs — Ideas into proofs. A Lean-native coding agent for mathematics and theoretical sciences.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", background: "#f1f4e9", padding: "64px 76px", display: "flex", flexDirection: "column", color: "#20251d", fontFamily: "sans-serif" }}><div style={{ display: "flex", alignItems: "center", gap: 15, fontSize: 30 }}><span style={{ color: "#76b900", fontSize: 52 }}>Θ</span>theoria labs.</div><div style={{ display: "flex", marginTop: 53, fontSize: 100, lineHeight: 1.02, letterSpacing: -6, flexDirection: "column" }}><span>Ideas into</span><span style={{ color: "#4b7600" }}>proofs.</span></div><div style={{ display: "flex", marginTop: 32, fontSize: 25, color: "#70756b" }}>A Lean-native agent for mathematics & theoretical sciences.</div></div>, size);
}
