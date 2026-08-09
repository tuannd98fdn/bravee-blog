'use client';

import Giscus from '@giscus/react';
import { useEffect, useState } from 'react';

export default function GiscusComments() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initial check
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'light' ? 'light' : 'dark');

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme');
          setTheme(newTheme === 'light' ? 'light' : 'dark');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="giscus-wrapper" style={{ marginTop: '4rem' }}>
      <Giscus
        id="comments"
        repo="tuannd98fdn/bravee-blog"
        repoId="R_kgDOTy4wsg"
        category="Announcements"
        categoryId="DIC_kwDOTy4wss4DC-o4"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
