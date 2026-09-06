'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#3B82F6',
    primaryTextColor: '#e2e8f0',
    primaryBorderColor: '#4B5563',
    lineColor: '#6B7280',
    secondaryColor: '#8B5CF6',
    tertiaryColor: '#1E293B',
    fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)',
    fontSize: '14px',
  },
});

let idCounter = 0;

export default function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;
      try {
        const id = `mermaid-${Date.now()}-${idCounter++}`;
        const { svg: rendered } = await mermaid.render(id, chart.trim());
        setSvg(rendered);
      } catch (err) {
        console.error('Mermaid render error:', err);
      }
    };
    renderChart();
  }, [chart]);

  if (!svg) {
    return (
      <div
        ref={containerRef}
        style={{
          padding: '1rem',
          background: 'var(--code-bg, #1e1e2e)',
          borderRadius: '8px',
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
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
        display: 'flex',
        justifyContent: 'center',
        margin: '2rem 0',
        padding: '1.5rem',
        background: 'var(--code-bg, #1e1e2e)',
        borderRadius: '12px',
        overflow: 'auto',
      }}
    />
  );
}
