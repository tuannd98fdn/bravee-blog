import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Today I Learned',
  description: 'Short snippets of knowledge I pick up every day.',
};

export default function TilPage() {
  return (
    <div style={{ maxWidth: 'var(--content-width)', margin: '0 auto', padding: 'var(--space-16) var(--space-6)', textAlign: 'center' }}>
      <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 'var(--space-4)' }}>
        Today I Learned (TIL)
      </h1>
      <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', lineHeight: 'var(--leading-relaxed)' }}>
        Short notes and code snippets I learn day-to-day. A micro-blog of sorts.
      </p>
      <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>📝</div>
      <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>Coming in Phase 3</p>
    </div>
  );
}
