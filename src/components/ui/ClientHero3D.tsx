'use client';

import dynamic from 'next/dynamic';

// Tắt SSR cho môi trường Client Component
const Hero3D = dynamic(() => import('./Hero3D'), { ssr: false });

export default function ClientHero3D() {
  return <Hero3D />;
}
