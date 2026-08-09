'use client';

import { useEffect, useState } from 'react';

export default function ViewCounter({ 
  slug, 
  trackView = false 
}: { 
  slug: string; 
  trackView?: boolean;
}) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchViews = async () => {
      try {
        const method = trackView ? 'POST' : 'GET';
        const res = await fetch(`/api/views/${slug}`, {
          method,
        });
        const data = await res.json();
        if (mounted && typeof data.views === 'number') {
          setViews(data.views);
        }
      } catch (error) {
        console.error('Error fetching views:', error);
      }
    };

    fetchViews();

    return () => {
      mounted = false;
    };
  }, [slug, trackView]);

  return (
    <span className="view-counter">
      {views !== null ? views.toLocaleString() : '---'} views
    </span>
  );
}
