"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

let idCounter = 0;

export default function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => {
      setTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const renderChart = async () => {
      if (!chart) return;
      try {
        const isLight = theme === "light";
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            primaryColor: isLight ? "#E8F1FF" : "#263449",
            primaryTextColor: isLight ? "#172033" : "#F3F4F6",
            primaryBorderColor: isLight ? "#42618F" : "#8293AA",
            lineColor: isLight ? "#58677D" : "#A6B1C2",
            secondaryColor: isLight ? "#E7F6ED" : "#293A32",
            secondaryTextColor: isLight ? "#172033" : "#F3F4F6",
            secondaryBorderColor: isLight ? "#4F8063" : "#789583",
            tertiaryColor: isLight ? "#FFF5DB" : "#3B3425",
            tertiaryTextColor: isLight ? "#172033" : "#F3F4F6",
            tertiaryBorderColor: isLight ? "#92733A" : "#A28C5E",
            clusterBkg: isLight ? "#F1F4F8" : "#20252D",
            clusterBorder: isLight ? "#A7B1BF" : "#667386",
            edgeLabelBackground: isLight ? "#FFFFFF" : "#16191F",
            fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)',
            fontSize: "16px",
          },
        });
        const id = `mermaid-${Date.now()}-${idCounter++}`;
        const { svg: rendered } = await mermaid.render(id, chart.trim());
        if (!cancelled) setSvg(rendered);
      } catch (err) {
        console.error("Mermaid render error:", err);
      }
    };
    setSvg("");
    renderChart();
    return () => {
      cancelled = true;
    };
  }, [chart, theme]);

  if (!svg) {
    return (
      <div
        ref={containerRef}
        style={{
          padding: "1rem",
          background: "var(--code-bg, #1e1e2e)",
          borderRadius: "8px",
          color: "var(--text-secondary)",
          fontSize: "0.875rem",
        }}
      >
        Loading diagram…
      </div>
    );
  }

  return (
    <div
      className="mermaid-diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "2rem 0",
        padding: "1.5rem",
        background: "var(--code-bg, #1e1e2e)",
        borderRadius: "12px",
        overflow: "auto",
      }}
    />
  );
}
