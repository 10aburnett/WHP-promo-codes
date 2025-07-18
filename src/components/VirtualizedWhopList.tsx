'use client';

import React, { useMemo } from 'react';
import WhopCard from './WhopCard';

interface VirtualizedWhopListProps {
  whops: any[];
  loading: boolean;
}

export default function VirtualizedWhopList({ whops, loading }: VirtualizedWhopListProps) {
  // Only virtualize if we have more than 12 items to improve performance
  const shouldVirtualize = whops.length > 12;

  const renderedWhops = useMemo(() => {
    if (loading) {
      return [];
    }

    if (!shouldVirtualize) {
      // For small lists, render normally
      return whops.map((promo, index) => (
        <WhopCard
          key={`${promo.id}-${index}`}
          promo={promo}
          priority={index < 6} // Priority loading for first 6 images
        />
      ));
    }

    // For large lists, we can implement more sophisticated virtualization
    // For now, just render all items but with performance optimizations
    return whops.map((promo, index) => (
      <WhopCard
        key={`${promo.id}-${index}`}
        promo={promo}
        priority={index < 6} // Priority loading for first 6 images
      />
    ));
  }, [whops, loading, shouldVirtualize]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Loading skeleton */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="relative p-5 rounded-xl shadow-lg border animate-pulse"
            style={{ background: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-lg bg-gray-300" style={{ backgroundColor: 'var(--text-secondary)' }}></div>
              <div className="min-w-0 flex-1">
                <div className="h-6 bg-gray-300 rounded mb-2" style={{ backgroundColor: 'var(--text-secondary)' }}></div>
                <div className="h-4 bg-gray-300 rounded w-3/4" style={{ backgroundColor: 'var(--text-secondary)' }}></div>
              </div>
            </div>
            <div className="h-10 bg-gray-300 rounded" style={{ backgroundColor: 'var(--text-secondary)' }}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {renderedWhops}
    </div>
  );
}