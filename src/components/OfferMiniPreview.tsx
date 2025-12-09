import 'server-only';

interface OfferMiniPreviewProps {
  slug: string;
  name: string;
  logo?: string | null;
  description?: string | null;
  category?: string | null;
  rating?: number | null;
  ratingCount?: number;
  isExploreLink?: boolean;
}

export default function OfferMiniPreview({
  slug,
  name,
  logo,
  description,
  category,
  rating,
  ratingCount = 0,
  isExploreLink = false,
}: OfferMiniPreviewProps) {
  const href = `/offer/${encodeURIComponent(slug)}`;

  // Compute display values with safe fallbacks
  const badge = category && category.trim() ? category : 'Special access';
  // Clamp rating between 0-5 for display consistency
  const r = Math.min(5, Math.max(0, Number(rating) || 0));
  const rc =
    typeof ratingCount === 'number' && ratingCount >= 0 ? ratingCount : 0;

  return (
    <li
      className="group relative block rounded-2xl border shadow-theme-promo overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        borderColor: 'var(--card-border)',
        backgroundColor: 'var(--card-bg)',
      }}
    >
      {/* Thin fintech accent bar at the top */}
      <div
        className="pointer-events-none absolute inset-x-3 top-0 h-0.5 rounded-full"
        style={{
          background:
            'linear-gradient(90deg, rgba(4,120,87,0.9), rgba(22,163,74,0.8))',
        }}
      />

      <a
        href={href}
        className="flex gap-4 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        aria-label={isExploreLink ? `Explore another: ${name}` : name}
      >
        {/* Logo with subtle background */}
        <div className="flex-shrink-0">
          <img
            src={logo || '/logo.png'}
            alt={`${name} logo`}
            width={56}
            height={56}
            loading="lazy"
            decoding="async"
            className="h-14 w-14 rounded-xl object-contain p-1.5 border"
            style={{
              backgroundColor: 'var(--background-secondary)',
              borderColor: 'var(--border-color)',
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* Top row: Title + Rating */}
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <h3
              className="line-clamp-1 text-sm font-semibold md:text-base transition-colors duration-150 group-hover:text-theme-accent"
              style={{ color: 'var(--text-color)' }}
            >
              {isExploreLink ? <>Discover: {name}</> : name}
            </h3>

            {/* Compact rating badge */}
            <div
              className="flex flex-shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs"
              style={{ backgroundColor: 'var(--background-secondary)' }}
              aria-label={`${r.toFixed(1)} stars from ${rc} reviews`}
            >
              <span className="text-amber-500">★</span>
              <span style={{ color: 'var(--text-color)' }}>
                {r.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Category pill */}
          <span
            className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide"
            style={{
              backgroundColor: 'rgba(4,120,87,0.08)',
              color: 'var(--accent-color)',
              border: '1px solid rgba(4,120,87,0.25)',
            }}
          >
            {badge}
          </span>

          {/* Description */}
          {description && (
            <p
              className="line-clamp-2 text-xs md:text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Right arrow indicator */}
        <div className="flex-shrink-0 self-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <svg
            className="h-5 w-5"
            style={{ color: 'var(--accent-color)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </a>
    </li>
  );
}
