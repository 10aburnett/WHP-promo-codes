// src/components/StatisticsSectionServer.tsx
import Link from 'next/link';
import type { StatisticsData } from '@/data/statistics';

interface StatisticsServerProps {
  stats: StatisticsData;
}

export default function StatisticsSectionServer({ stats }: StatisticsServerProps) {
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + 'M';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const StatCard = ({
    title,
    value,
    suffix = '',
    link = null,
    icon,
    showLogo = false,
    logoUrl,
  }: {
    title: string;
    value: number | string;
    suffix?: string;
    link?: string | null;
    icon: string | React.ReactElement;
    showLogo?: boolean;
    logoUrl?: string;
  }) => {
    const displayValue = typeof value === 'number' ? formatNumber(value) : value;

    const content = (
      <div className="h-full">
        <div
          className="group relative h-full rounded-2xl border shadow-theme-promo bg-[color:var(--card-bg)] px-4 py-4 md:px-6 md:py-6 flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          {/* Thin fintech accent bar */}
          <div
            className="pointer-events-none absolute inset-x-4 top-0 h-0.5 rounded-full"
            style={{
              background:
                'linear-gradient(90deg, rgba(4,120,87,0.9), rgba(22,163,74,0.85))',
            }}
          />

          {showLogo && logoUrl ? (
            <div
              className="mb-2 flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <img
                src={
                  logoUrl.startsWith('http')
                    ? `/api/img?src=${encodeURIComponent(logoUrl)}`
                    : logoUrl
                }
                alt={`${value} logo`}
                width={32}
                height={32}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div
              className="mb-2 text-2xl md:text-3xl"
              style={{ color: 'var(--accent-color)' }}
            >
              {typeof icon === 'string' ? icon : icon}
            </div>
          )}

          <div
            className="text-2xl font-semibold leading-tight md:text-3xl"
            style={{ color: 'var(--text-color)' }}
          >
            {displayValue}
            {suffix}
          </div>
          <div
            className="mt-1 mb-1.5 text-xs leading-snug md:mb-4 md:text-sm line-clamp-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            {title}
          </div>
        </div>
      </div>
    );

    if (link) {
      return (
        <Link href={link} className="block h-full">
          {content}
        </Link>
      );
    }

    return content;
  };

  return (
    <section
      id="platform-stats"
      className="
        stats-section
        -mt-8 md:mt-0
        pt-6 md:pt-16
        pb-10 md:pb-16
        mb-2 md:mb-12
        border-t-0 md:border-t
      "
      style={{
        background:
          'linear-gradient(180deg, var(--background-secondary), var(--background-tertiary))',
        borderColor: 'rgba(15,23,42,0.08)',
      }}
    >
      <div className="container mx-auto max-w-6xl px-3 md:px-4">
        <div className="mb-8 text-center md:mb-12">
          <h2
            className="text-2xl font-semibold md:text-3xl lg:text-4xl"
            style={{ color: 'var(--text-color)' }}
          >
            Platform Statistics
          </h2>
          <p
            className="mt-3 max-w-2xl mx-auto text-sm md:text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            Real-time data from our growing community
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-5 lg:gap-6">
          <StatCard
            title="Active Users"
            value={stats?.totalUsers || 0}
            icon="👥"
          />
          <StatCard
            title="Available Offers"
            value={stats?.totalOffersAvailable || 0}
            icon="🎯"
          />
          <StatCard
            title="Promo Codes Claimed"
            value={stats?.promoCodesClaimed || 0}
            icon="🎉"
          />
          <StatCard
            title="Most Popular"
            value={stats?.mostClaimedOffer?.name || 'N/A'}
            icon="⭐"
            link={
              stats?.mostClaimedOffer?.slug
                ? `/offer/${stats.mostClaimedOffer.slug.toLowerCase()}`
                : undefined
            }
            logoUrl={stats?.mostClaimedOffer?.logoUrl}
            showLogo={true}
          />
        </div>
      </div>
    </section>
  );
}
