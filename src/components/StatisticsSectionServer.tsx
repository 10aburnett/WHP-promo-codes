// src/components/StatisticsSectionServer.tsx
import Link from 'next/link';
import type { StatisticsData } from '@/data/statistics';
import { formatUserCount } from '@/config/platformMetrics';

interface StatisticsServerProps {
  stats: StatisticsData;
}

// SVG Icons for each stat card
const UsersIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const OffersIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const TicketIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" />
    <path d="M13 17v2" />
    <path d="M13 11v2" />
  </svg>
);

const TrophyIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default function StatisticsSectionServer({ stats }: StatisticsServerProps) {
  const StatCard = ({
    label,
    value,
    caption,
    link = null,
    icon,
    showLogo = false,
    logoUrl,
  }: {
    label: string;
    value: number | string;
    caption: string;
    link?: string | null;
    icon: React.ReactElement;
    showLogo?: boolean;
    logoUrl?: string;
  }) => {
    const displayValue = typeof value === 'number' ? formatUserCount(value) : value;

    const content = (
      <div
        className="flex flex-col gap-2 rounded-2xl border px-4 py-4 sm:px-6 sm:py-5 shadow-theme-promo transition-all hover:shadow-lg hover:-translate-y-0.5"
        style={{
          borderColor: 'var(--border-color)',
          backgroundColor: 'var(--background-color)',
        }}
      >
        {/* Icon + label row */}
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              backgroundColor: 'rgba(5,150,105,0.08)',
              color: 'var(--accent-color)',
            }}
          >
            {showLogo && logoUrl ? (
              <img
                src={
                  logoUrl.startsWith('http')
                    ? `/api/img?src=${encodeURIComponent(logoUrl)}`
                    : logoUrl
                }
                alt={`${value} logo`}
                width={20}
                height={20}
                className="h-5 w-5 rounded object-cover"
                loading="lazy"
              />
            ) : (
              icon
            )}
          </div>
          <span
            className="text-xs uppercase tracking-wide font-semibold"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
          </span>
        </div>

        {/* Number + caption */}
        <div className="mt-1">
          <p
            className="text-2xl sm:text-3xl font-semibold"
            style={{ color: 'var(--text-color)' }}
          >
            {displayValue}
          </p>
          <p
            className="text-sm mt-0.5 line-clamp-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            {caption}
          </p>
        </div>
      </div>
    );

    if (link) {
      return (
        <Link href={link} className="block">
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
            className="text-2xl font-bold sm:text-3xl"
            style={{ color: 'var(--text-color)' }}
          >
            Real-time platform stats
          </h2>
          <p
            className="mt-2 text-sm sm:text-base max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            How the DigitalPromoCodes community saves on digital products and memberships.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-5 lg:gap-6">
          <StatCard
            label="Active visitors"
            value={stats?.totalUsers || 0}
            caption="Visitors browsing offers this month"
            icon={<UsersIcon />}
          />
          <StatCard
            label="Curated offers"
            value={stats?.totalOffersAvailable || 0}
            caption="Hand-picked offers currently live"
            icon={<OffersIcon />}
          />
          <StatCard
            label="Codes used"
            value={stats?.promoCodesClaimed || 0}
            caption="Discount codes applied successfully"
            icon={<TicketIcon />}
          />
          <StatCard
            label="Trending offer"
            value={stats?.mostClaimedOffer?.name || 'N/A'}
            caption="Most popular this week"
            icon={<TrophyIcon />}
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
