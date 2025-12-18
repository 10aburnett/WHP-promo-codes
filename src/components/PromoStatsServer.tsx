// src/components/PromoStatsServer.tsx
// Server component - renders in initial HTML for Googlebot

import type { PromoUsageStats } from '@/data/promo-stats';

interface Props {
  stats: PromoUsageStats;
}

export default function PromoStatsServer({ stats }: Props) {
  const { todayCount, totalCount, lastUsed, verifiedDate } = stats;

  // Format date helper
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--background-secondary)' }}
    >
      <h3 className="font-semibold mb-3" style={{ color: 'var(--text-color)' }}>
        Usage Statistics
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-color)' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Last Used
          </span>
          <span style={{ color: 'var(--text-color)' }}>{formatDate(lastUsed)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-color)' }}>
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
            Today
          </span>
          <span style={{ color: 'var(--text-color)' }}>{todayCount} uses</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-color)' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            Total
          </span>
          <span style={{ color: 'var(--text-color)' }}>{totalCount} uses</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-color)' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Verified
          </span>
          <span style={{ color: 'var(--text-color)' }}>{formatDate(verifiedDate)}</span>
        </div>
        {totalCount > 0 && (
          <div className="pt-2 mt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--accent-color)' }}>
              <span className="w-2 h-2 rounded-full bg-current"></span>
              Actively used by our community
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
