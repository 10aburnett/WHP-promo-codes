# Homepage Fingerprint Reset - Files for ChatGPT

Below are all the homepage-related files that need copy/text fingerprint reset. These files contain user-facing text that should be reworded while preserving code structure, logic, imports, and props.

---

## File 1: `src/app/(public)/page.tsx` (Homepage main file)

```tsx
import HomePageServer from '@/components/HomePageServer';
import StatisticsSectionServer from '@/components/StatisticsSectionServer';
import CallToAction from '@/components/CallToAction';
import { prisma } from '@/lib/prisma';
import { getStatisticsCached } from '@/data/statistics'; // Server-side statistics
import { absoluteUrl, offerAbsoluteUrl } from '@/lib/urls';
import { SITE_BRAND, SITE_TAGLINE, SITE_DESCRIPTION } from '@/lib/brand';
import { formatUserCount } from '@/config/platformMetrics';
import type { Metadata } from 'next';

// Force dynamic rendering so ?page= works server-side (not statically cached)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;
export const runtime = 'nodejs'; // Required for Prisma

// Read marketing users from env (NEXT_PUBLIC_ so it's safe in the client if needed)
const getMarketingUsers = (dbCount: number) => {
  const fromEnv = Number(process.env.NEXT_PUBLIC_MARKETING_USERS);
  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : dbCount;
};

// Define the types for our data
interface PromoCode {
  id: string;
  title: string;
  description: string;
  code: string | null;
  type: string;
  value: string;
}

interface DealWithPromos {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string;
  rating: number;
  displayOrder: number;
  affiliateLink: string | null;
  price?: string | null;
  promoCodes: PromoCode[];
  priceText?: string;
  priceBadge?: string;
}

interface InitialData {
  whops: DealWithPromos[];
  totalUsers: number;
  totalCount: number;
}

// Loading component for Suspense
const HomePageLoading = () => (
  <div className="text-center py-20">
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent"
      style={{ borderColor: 'var(--accent-color)', borderRightColor: 'transparent' }}
    ></div>
    <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
      Loading...
    </p>
  </div>
);

// Server-side data fetching with search/filter/sort support
async function getPagedWhops({
  page = 1,
  q = '',
  category = '',
  sort = '',
}: {
  page?: number;
  q?: string;
  category?: string;
  sort?: string;
}) {
  try {
    const limit = 15;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};

    // Search filter
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Category filter - using whopCategory enum field
    if (category && category !== '' && category !== 'all') {
      where.whopCategory = category;
    }

    // Build orderBy clause for sorting
    let orderBy: any = { displayOrder: 'asc' }; // default

    if (sort) {
      switch (sort) {
        case 'newest':
          orderBy = { createdAt: 'desc' };
          break;
        case 'highest-rated':
          orderBy = { rating: 'desc' };
          break;
        case 'alpha-asc':
          orderBy = { name: 'asc' };
          break;
        case 'alpha-desc':
          orderBy = { name: 'desc' };
          break;
        case 'relevance':
        default:
          orderBy = { displayOrder: 'asc' };
          break;
      }
    }

    // Fetch with filtering and sorting
    const [whops, totalCount] = await Promise.all([
      prisma.deal.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          PromoCode: {
            select: {
              id: true,
              title: true,
              description: true,
              code: true,
              type: true,
              value: true,
            },
          },
        },
      }),
      prisma.deal.count({ where }),
    ]);

    // Get user count (DB)
    const totalUsersDb = await prisma.user.count();

    // Unified, env-first marketing counter
    const marketingUsers = getMarketingUsers(totalUsersDb);

    // Transform data to match expected format
    const formattedWhops = whops.map((whop) => ({
      id: whop.id,
      name: whop.name,
      slug: whop.slug,
      logo: whop.logo,
      description: whop.description,
      rating: whop.rating,
      displayOrder: whop.displayOrder,
      affiliateLink: whop.affiliateLink,
      promoCodes: whop.PromoCode.map((code) => ({
        id: code.id,
        title: code.title,
        description: code.description,
        code: code.code,
        type: code.type,
        value: code.value,
      })),
      // Add price fields for card display
      priceText: (whop as any).price || 'Free',
      price: (whop as any).price || 'Free',
      priceBadge: (whop as any).price || 'Free',
    }));

    return {
      items: formattedWhops,
      totalPages: Math.ceil(totalCount / limit),
      total: totalCount,
      totalUsers: marketingUsers,
    };
  } catch (error) {
    console.error('Error fetching paged whops:', error);
    return {
      items: [],
      totalPages: 1,
      total: 0,
      totalUsers: 0,
    };
  }
}

// Metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const title = `${SITE_BRAND} - Verified Promo Codes & Exclusive Deals ${currentYear}`;
  const description = `${SITE_TAGLINE}. Browse 8,000+ verified promo codes for digital products, courses, communities, and memberships - updated daily for ${currentYear}.`;

  return {
    title,
    description,
    alternates: {
      // PHASE1-DEINDEX:       canonical: absoluteUrl('/')
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: absoluteUrl('/'),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    search?: string;
    whopCategory?: string;
    sortBy?: string;
  };
}) {
  // Parse all search params
  const page = Math.max(1, Number(searchParams?.page ?? '1') || 1);
  const search = (searchParams?.search ?? '').toString().trim();
  const whopCategory = (searchParams?.whopCategory ?? '').toString();
  const sortBy = (searchParams?.sortBy ?? '').toString();

  // Deterministic log for debugging
  console.log('[HOME SSR]', { page, search, whopCategory, sortBy });

  const [data, statistics] = await Promise.all([
    getPagedWhops({
      page,
      q: search,
      category: whopCategory,
      sort: sortBy,
    }),
    getStatisticsCached(),
  ]);
  const currentYear = new Date().getFullYear();

  // Build JSON-LD schemas for server HTML
  const siteUrl = absoluteUrl('/');
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name: SITE_BRAND,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}#org`,
    name: SITE_BRAND,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo.png'),
      width: 400,
      height: 400,
    },
    description: SITE_DESCRIPTION,
    // sameAs removed - no verified social profiles for new brand yet
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: absoluteUrl('/contact'),
    },
  };

  const offersSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Top Deals & Discounts ${currentYear}`,
    description: `Curated list of the best deals and discount codes for ${currentYear}`,
    numberOfItems: data.total,
    itemListElement: data.items.slice(0, 10).map((whop, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: whop.name,
        description: whop.description,
        url: offerAbsoluteUrl(whop.slug.toLowerCase()),
        image: whop.logo,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: whop.rating,
          bestRating: 5,
          worstRating: 1,
        },
        offers: whop.promoCodes.map((promo) => ({
          '@type': 'Offer',
          name: promo.title,
          description: promo.description,
          url: offerAbsoluteUrl(whop.slug.toLowerCase()),
          availability: 'https://schema.org/InStock',
          validFrom: new Date().toISOString(),
          priceSpecification: {
            '@type': 'PriceSpecification',
            price:
              promo.value && promo.value !== '0'
                ? promo.value.includes('$') ||
                  promo.value.includes('%') ||
                  promo.value.includes('off')
                  ? promo.value
                  : `${promo.value}% off`
                : 'Exclusive Access',
          },
        })),
      },
    })),
  };

  return (
    <main
      className="min-h-screen pt-0 mt-0 pb-12 md:py-12 transition-theme"
      style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
    >
      {/* Server-rendered JSON-LD structured data */}
      <script
        id="homepage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        id="offers-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }}
      />

      {/* Server-rendered content - pure server component with key for remounting */}
      <HomePageServer
        key={`p-${page}`}
        items={data.items}
        currentPage={page}
        totalPages={data.totalPages}
        total={data.total}
      />

      {/* Statistics Section - Server Rendered */}
      <StatisticsSectionServer stats={statistics} />

      {/* Marketing / trust section */}
      <div className="container mx-auto max-w-6xl px-3 sm:px-4 lg:px-0">
        <div
          className="mobile-dark-section mt-12 md:mt-20 mb-16 rounded-3xl border px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12 transition-theme shadow-theme-promo"
          style={{
            backgroundColor: 'var(--background-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Hero / trust copy */}
          <div className="text-center mb-12 md:mb-16">
            {/* Trust pill - uses same totalUsers as stats */}
            <div className="flex justify-center">
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs sm:text-[13px] font-medium"
                style={{
                  borderColor: 'rgba(5,150,105,0.25)',
                  backgroundColor: 'rgba(5,150,105,0.06)',
                  color: 'var(--accent-color)',
                }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                />
                <span>
                  {statistics.totalUsers > 0
                    ? `Trusted by ${formatUserCount(statistics.totalUsers)} users`
                    : 'Used by savvy digital buyers'}
                </span>
              </div>
            </div>

            <h2
              className="mt-4 text-2xl sm:text-3xl font-bold text-center"
              style={{ color: 'var(--text-color)' }}
            >
              Why people rely on {SITE_BRAND}
            </h2>

            <p
              className="mt-2 text-sm sm:text-base text-center max-w-2xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              We focus on real savings for digital products, tools and memberships – without the usual coupon-site clutter or dead codes.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-10 md:mb-12">
            {/* Card 1: Curated, not scraped */}
            <div
              className="flex flex-col gap-3 rounded-2xl border px-5 py-5 sm:px-6 sm:py-6 shadow-theme-promo"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--background-color)',
              }}
            >
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(5,150,105,0.08)',
                  color: 'var(--accent-color)',
                }}
              >
                {/* Shield check icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
                  Curated, not scraped
                </h3>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Every promo is reviewed before it goes live, so you're not wasting time trying random codes that never work.
                </p>
              </div>
            </div>

            {/* Card 2: Better entry points */}
            <div
              className="flex flex-col gap-3 rounded-2xl border px-5 py-5 sm:px-6 sm:py-6 shadow-theme-promo"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--background-color)',
              }}
            >
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(5,150,105,0.08)',
                  color: 'var(--accent-color)',
                }}
              >
                {/* Link/arrow icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
                  Better entry points
                </h3>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Many codes are negotiated directly with creators, giving you exclusive or better-than-public discounts.
                </p>
              </div>
            </div>

            {/* Card 3: Kept up-to-date */}
            <div
              className="flex flex-col gap-3 rounded-2xl border px-5 py-5 sm:px-6 sm:py-6 shadow-theme-promo"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--background-color)',
              }}
            >
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(5,150,105,0.08)',
                  color: 'var(--accent-color)',
                }}
              >
                {/* Refresh/clock icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
                  Kept up-to-date
                </h3>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Codes are reviewed regularly and retired when they stop working – no more guessing if a deal is still valid.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <CallToAction />
        </div>
      </div>
    </main>
  );
}
```

---

## File 2: `src/components/HomePageServer.tsx` (Hero, pagination, offer grid)

```tsx
// src/components/HomePageServer.tsx
// Server component for homepage - no client state, pure server rendering
import Link from 'next/link';
import OfferCard from '@/components/OfferCard';
import FilterControlsWrapper from '@/components/FilterControlsWrapper';
import { SITE_BRAND, SITE_TAGLINE } from '@/lib/brand';

interface PromoCode {
  id: string;
  title: string;
  description: string;
  code: string | null;
  type: string;
  value: string;
}

interface DealItem {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string;
  rating: number;
  displayOrder: number;
  affiliateLink: string | null;
  promoCodes: PromoCode[];
  price?: string | null;
  priceText?: string;
  priceBadge?: string;
}

interface HomePageServerProps {
  items: DealItem[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export default function HomePageServer({
  items,
  currentPage,
  totalPages,
  total,
}: HomePageServerProps) {
  const pageHref = (n: number) => `/?page=${n}`;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="container mx-auto max-w-6xl px-3 sm:px-4 lg:px-0 mt-8 md:mt-6 lg:mt-4">
      {/* HERO */}
      <section className="text-center mt-2 mb-8 space-y-3">
        <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-semibold md:font-bold tracking-tight">
          <span style={{ color: 'var(--accent-color)' }}>{SITE_BRAND}</span>
          <span style={{ color: 'var(--text-color)' }}>
            {' '}
            – Deals, Discounts &amp; Exclusive Offers
          </span>
        </h1>
        {SITE_TAGLINE && (
          <p
            className="text-sm md:text-base max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            {SITE_TAGLINE}
          </p>
        )}
      </section>

      {/* Client island for search/filters */}
      <div className="rounded-2xl border px-3 sm:px-4 py-3 sm:py-4 mb-4 md:mb-6 transition-theme shadow-theme-promo"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <FilterControlsWrapper />
      </div>

      {/* Results count */}
      {total > 0 && (
        <p
          className="mb-4 md:mb-6 text-center text-sm md:text-base"
          style={{ color: 'var(--text-secondary)' }}
        >
          Showing {((currentPage - 1) * 15) + 1}-{Math.min(currentPage * 15, total)} of {total}{' '}
          results
        </p>
      )}

      {/* Mobile-only Pagination Controls (Top) */}
      {totalPages > 1 && (
        <div className="md:hidden flex justify-center items-center gap-1 sm:gap-2 mt-2 mb-6 px-2 overflow-x-auto">
          {/* Previous Button */}
          {currentPage > 1 ? (
            <Link
              href={pageHref(currentPage - 1)}
              prefetch={false}
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Link>
          ) : (
            <span
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 opacity-50"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
              aria-disabled="true"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </span>
          )}

          {/* Page Numbers */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {getPageNumbers().map((pageNum) => (
              <Link
                key={pageNum}
                href={pageHref(pageNum)}
                prefetch={false}
                aria-current={pageNum === currentPage ? 'page' : undefined}
                className={`px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base flex-shrink-0 min-w-[36px] sm:min-w-[40px] text-center transition-all duration-200 hover:opacity-85 active:scale-[0.98] ${
                  pageNum === currentPage ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor:
                    pageNum === currentPage
                      ? 'var(--accent-color)'
                      : 'var(--background-secondary)',
                  borderColor:
                    pageNum === currentPage
                      ? 'var(--accent-color)'
                      : 'var(--border-color)',
                  color: pageNum === currentPage ? '#ffffff' : 'var(--text-color)',
                }}
              >
                {pageNum}
              </Link>
            ))}
          </div>

          {/* Next Button */}
          {currentPage < totalPages ? (
            <Link
              href={pageHref(currentPage + 1)}
              prefetch={false}
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </Link>
          ) : (
            <span
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 opacity-50"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
              aria-disabled="true"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </span>
          )}
        </div>
      )}

      {/* Desktop-only Pagination Controls (Top) */}
      {totalPages > 1 && (
        <div className="hidden md:flex justify-center items-center gap-1 sm:gap-2 mt-2 mb-6 px-2 overflow-x-auto">
          {/* Previous Button */}
          {currentPage > 1 ? (
            <Link
              href={pageHref(currentPage - 1)}
              prefetch={false}
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Link>
          ) : (
            <span
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 opacity-50"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
              aria-disabled="true"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </span>
          )}

          {/* Page Numbers */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {getPageNumbers().map((pageNum) => (
              <Link
                key={pageNum}
                href={pageHref(pageNum)}
                prefetch={false}
                aria-current={pageNum === currentPage ? 'page' : undefined}
                className={`px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base flex-shrink-0 min-w-[36px] sm:min-w-[40px] text-center transition-all duration-200 hover:opacity-85 active:scale-[0.98] ${
                  pageNum === currentPage ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor:
                    pageNum === currentPage
                      ? 'var(--accent-color)'
                      : 'var(--background-secondary)',
                  borderColor:
                    pageNum === currentPage
                      ? 'var(--accent-color)'
                      : 'var(--border-color)',
                  color: pageNum === currentPage ? '#ffffff' : 'var(--text-color)',
                }}
              >
                {pageNum}
              </Link>
            ))}
          </div>

          {/* Next Button */}
          {currentPage < totalPages ? (
            <Link
              href={pageHref(currentPage + 1)}
              prefetch={false}
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </Link>
          ) : (
            <span
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 opacity-50"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
              aria-disabled="true"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </span>
          )}
        </div>
      )}

      {/* Offer Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-7 mb-8">
        {items.map((whop) => (
          <OfferCard
            key={whop.id}
            promo={{
              id: whop.id,
              whopName: whop.name,
              slug: whop.slug,
              promoType: whop.promoCodes[0]?.type || 'discount',
              promoValue: parseInt(whop.promoCodes[0]?.value || '0'),
              promoText: whop.promoCodes[0]?.title || 'Exclusive Access',
              logoUrl: whop.logo || '',
              promoCode: whop.promoCodes[0]?.code || null,
              affiliateLink: whop.affiliateLink || '',
              isActive: true,
              price: whop.price,
              priceText: whop.priceText,
              priceBadge: whop.priceBadge,
              offerId: whop.id,
              promoCodeId: whop.promoCodes[0]?.id,
            }}
          />
        ))}
      </div>

      {/* Pagination Controls (Bottom) */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 sm:gap-2 mt-4 mb-10 px-2 overflow-x-auto">
          {/* Previous Button */}
          {currentPage > 1 ? (
            <Link
              href={pageHref(currentPage - 1)}
              prefetch={false}
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Link>
          ) : (
            <span
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 opacity-50"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
              aria-disabled="true"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </span>
          )}

          {/* Page Numbers */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {getPageNumbers().map((pageNum) => (
              <Link
                key={pageNum}
                href={pageHref(pageNum)}
                prefetch={false}
                aria-current={pageNum === currentPage ? 'page' : undefined}
                className={`px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base flex-shrink-0 min-w-[36px] sm:min-w-[40px] text-center transition-all duration-200 hover:opacity-85 active:scale-[0.98] ${
                  pageNum === currentPage ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor:
                    pageNum === currentPage
                      ? 'var(--accent-color)'
                      : 'var(--background-secondary)',
                  borderColor:
                    pageNum === currentPage
                      ? 'var(--accent-color)'
                      : 'var(--border-color)',
                  color: pageNum === currentPage ? '#ffffff' : 'var(--text-color)',
                }}
              >
                {pageNum}
              </Link>
            ))}
          </div>

          {/* Next Button */}
          {currentPage < totalPages ? (
            <Link
              href={pageHref(currentPage + 1)}
              prefetch={false}
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </Link>
          ) : (
            <span
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 opacity-50"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
              aria-disabled="true"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </span>
          )}
        </div>
      )}

      {/* No results message */}
      {items.length === 0 && (
        <div className="col-span-full text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div
              className="h-12 w-12 mx-auto rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(5,150,105,0.10)',
                color: 'var(--accent-color)',
              }}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
              No matching deals found
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Try adjusting your filters or search for a different product, tool, or creator.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## File 3: `src/components/OfferCard.tsx` (Individual promo card)

```tsx
'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSocialProof, createSocialProofFromOffer } from '@/contexts/SocialProofContext';
import InitialsAvatar from './InitialsAvatar';
import { OfferLogoSSR } from './OfferLogoSSR';
import { offerHref } from '@/lib/paths';
import { resolveLogoUrl } from '@/lib/image-url';

// Define the promo type directly here to avoid import issues
interface Promo {
  id: string;
  whopName: string;
  slug?: string;
  promoType: string;
  promoValue: number;
  promoText: string;
  logoUrl: string;
  promoCode?: string | null;
  affiliateLink: string;
  isActive: boolean;
  price?: string | null;
  priceText?: string;
  priceBadge?: string;
  offerId?: string;
  promoCodeId?: string;
}

interface OfferCardProps {
  promo: Promo;
  priority?: boolean; // For prioritizing above-the-fold images
}

export default function OfferCard({ promo, priority = false }: OfferCardProps) {
  const { t, language, isHydrated } = useLanguage();
  const { addNotification } = useSocialProof();
  const pathname = usePathname();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Robust fallbacks for API shape variations
  const title =
    (promo as any).title ??
    promo.whopName ??
    (promo as any).name ??
    'Unknown Whop';

  // Resolve logo URL to absolute path for SSR-safe rendering
  const logoUrl = resolveLogoUrl(promo.logoUrl);

  const discountPercent =
    typeof (promo as any).discountPercent === 'number'
      ? (promo as any).discountPercent
      : typeof promo.promoValue === 'number'
      ? promo.promoValue
      : null;

  const detailHref =
    (promo as any).href ??
    (promo.slug
      ? `/offer/${encodeURIComponent(promo.slug)}`
      : promo.id
      ? `/offer/${encodeURIComponent(promo.id)}`
      : '#');

  const previewText =
    (promo as any).preview ??
    (promo as any).promoText ??
    (promo as any).description ??
    (promo as any).excerpt ??
    '';

  // Get price badge from API
  const rawPriceBadge =
    (promo as any).priceBadge ??
    (promo as any).priceText ??
    (promo as any).price ??
    null;

  // Only show pill if we have a real price (not "Free")
  const priceBadge =
    rawPriceBadge && rawPriceBadge.toLowerCase() !== 'free'
      ? rawPriceBadge
      : null;

  // Temporary debug logging
  console.log('CARD', {
    slug: promo.slug || promo.id,
    keys: Object.keys(promo),
    priceText: (promo as any).priceText,
    price: (promo as any).price,
    rawPriceBadge,
    priceBadge,
  });

  // Helper function to get the correct detail page URL based on language
  const getDetailPageUrl = () => {
    // Use slug if available, otherwise fall back to id
    const identifier = promo.slug || promo.id;

    // Use canonical offerHref helper - handles encoding properly
    return offerHref(identifier);
  };

  const handleGetPromoClick = (e: React.MouseEvent) => {
    console.log('🔥 OfferCard: Get Promo button clicked!', {
      offerName: promo.whopName,
      offerId: promo.offerId,
      promoCodeId: promo.promoCodeId,
      hasOfferId: !!promo.offerId,
      hasPromoCodeId: !!promo.promoCodeId,
      timestamp: new Date().toISOString(),
    });

    // Track the click event - now works even without promo code ID
    if (promo.offerId) {
      console.log(
        '✅ OfferCard: Offer ID present, calling trackOfferClick',
      );
      trackOfferClick(promo.offerId, promo.promoCodeId || null);
    } else {
      console.warn('⚠️ OfferCard: Missing offer ID:', promo.offerId);
    }

    // Trigger social proof notification
    const socialProofData = createSocialProofFromOffer({
      whopName: promo.whopName,
      promoCode: promo.promoCode,
      promoValue: promo.promoValue,
      promoType: promo.promoType,
      promoText: promo.promoText,
    });
    addNotification(socialProofData);
  };

  const handleViewDealClick = (e: React.MouseEvent) => {
    // Only navigation to deal page, no social proof notification
  };

  const trackOfferClick = async (offerId: string, promoCodeId: string | null) => {
    console.log('🔥 OfferCard: trackOfferClick called with:', {
      offerId,
      promoCodeId,
      offerName: promo.whopName,
      timestamp: new Date().toISOString(),
    });

    try {
      const requestBody = {
        casinoId: offerId, // Using offerId as casinoId for compatibility
        bonusId: promoCodeId, // Using promoCodeId as bonusId for compatibility (can be null)
        actionType: 'code_copy',
      };

      console.log('📤 OfferCard: Sending tracking request:', requestBody);

      const response = await fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ OfferCard: Tracking successful:', result);
      } else {
        const errorData = await response.text();
        console.error(
          '❌ OfferCard: Tracking failed:',
          response.status,
          errorData,
        );
      }
    } catch (error) {
      console.error('❌ OfferCard: Error tracking offer click:', error);
    }
  };

  // Intersection Observer for prefetching
  useEffect(() => {
    if (!cardRef.current) return;

    const cardElement = cardRef.current;
    let didPrefetch = false;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !didPrefetch) {
            const linkElement = cardElement.querySelector(
              'a[href^="/offer/"], a[href*="/offer/"]',
            ) as HTMLAnchorElement;
            if (linkElement) {
              linkElement.dispatchEvent(
                new MouseEvent('mouseover', { bubbles: true }),
              );
              didPrefetch = true;
            }
          }
        });
      },
      { rootMargin: '200px' },
    );

    io.observe(cardElement);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={cardRef} className="relative h-full">
      <article
        className="relative flex h-full flex-col justify-between rounded-2xl border shadow-theme-promo transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        {/* Thin fintech accent bar at the top */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-2xl"
          style={{
            background:
              'linear-gradient(90deg, rgba(4,120,87,0.9), rgba(22,163,74,0.8))',
          }}
        />

        <Link
          href={getDetailPageUrl()}
          prefetch={true}
          onMouseEnter={() => router.prefetch(getDetailPageUrl())}
          onTouchStart={() => router.prefetch(getDetailPageUrl())}
          className="block px-5 pt-5 pb-3"
          title={`${promo.whopName} Promo Code - ${promo.promoText} (${new Date().toLocaleDateString(
            'en-US',
            { month: 'long', year: 'numeric' },
          )})`}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-xl border"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              {!logoUrl ||
              logoUrl.includes('Simplified Logo') ||
              logoUrl.includes('placeholder') ? (
                <InitialsAvatar
                  name={title}
                  size="lg"
                  shape="square"
                  className="w-full h-full"
                />
              ) : (
                <OfferLogoSSR
                  src={logoUrl}
                  alt={`${promo.whopName} logo`}
                  width={64}
                  height={64}
                />
              )}
            </div>

            <div className="min-w-0">
              <h2
                className="truncate text-lg font-semibold md:text-xl"
                style={{ color: 'var(--text-color)' }}
              >
                {title}
              </h2>

              {previewText && (
                <p
                  className="mt-1 line-clamp-2 text-sm md:text-base"
                  style={{ color: 'var(--text-secondary)' }}
                  title={previewText}
                >
                  {previewText}
                </p>
              )}

              {priceBadge && (
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                    style={{
                      backgroundColor: 'var(--success-color)',
                      color: 'white',
                    }}
                  >
                    {priceBadge}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>

        <div className="mt-1 space-y-2 px-5 pb-5">
          {/* Primary CTA: external promo click */}
          <a
            href={promo.affiliateLink || '#'}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block w-full transform-gpu rounded-full border px-4 py-2.5 text-center text-sm font-semibold uppercase tracking-wide transition-all duration-150 hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              borderColor: 'var(--accent-color)',
            }}
            onClick={handleGetPromoClick}
          >
            {t('whop.getPromo')}
          </a>

          {/* Secondary CTA: internal detail view */}
          <Link
            href={getDetailPageUrl()}
            prefetch={true}
            onMouseEnter={() => router.prefetch(getDetailPageUrl())}
            onTouchStart={() => router.prefetch(getDetailPageUrl())}
            className="block w-full transform-gpu rounded-full border px-4 py-2.5 text-center text-sm font-medium transition-all duration-150 hover:-translate-y-0.5 hover:bg-theme-secondary active:translate-y-0"
            style={{
              backgroundColor: 'var(--background-color)',
              color: 'var(--accent-color)',
              borderColor: 'var(--border-color)',
            }}
            onClick={handleViewDealClick}
          >
            {t('whop.viewDeal')}
          </Link>
        </div>
      </article>
    </div>
  );
}
```

---

## File 4: `src/components/StatisticsSectionServer.tsx` (Platform stats section)

```tsx
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
            Live platform metrics
          </h2>
          <p
            className="mt-2 text-sm sm:text-base max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            A snapshot of how people use WhopPromoCodes to save on digital products and memberships.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-5 lg:gap-6">
          <StatCard
            label="Active users"
            value={stats?.totalUsers || 0}
            caption="People browsing deals this month"
            icon={<UsersIcon />}
          />
          <StatCard
            label="Verified offers"
            value={stats?.totalOffersAvailable || 0}
            caption="Verified offers currently listed"
            icon={<OffersIcon />}
          />
          <StatCard
            label="Codes redeemed"
            value={stats?.promoCodesClaimed || 0}
            caption="Promo codes successfully redeemed"
            icon={<TicketIcon />}
          />
          <StatCard
            label="Most clicked"
            value={stats?.mostClaimedOffer?.name || 'N/A'}
            caption="Most-clicked programme"
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
```

---

## File 5: `src/components/CallToAction.tsx` (CTA buttons at bottom)

```tsx
'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'next/navigation';

export default function CallToAction() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  // Get current search parameters to preserve state
  const currentParams = searchParams.toString();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTopAndFocusSearch = () => {
    // First scroll to the top with smooth animation (IDENTICAL to Browse Deals button)
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Wait longer for the smooth scroll to COMPLETELY finish before doing anything else
    setTimeout(() => {
      // Try multiple ways to find the search input
      let targetInput: HTMLInputElement | null = null;

      // Method 1: Try specific IDs
      const desktopSearchInput = document.getElementById('main-search-input') as HTMLInputElement;
      const mobileSearchInput = document.getElementById('main-search-input-mobile') as HTMLInputElement;

      // Check which input is visible and clickable
      if (desktopSearchInput && window.getComputedStyle(desktopSearchInput.parentElement!).display !== 'none') {
        targetInput = desktopSearchInput;
      } else if (mobileSearchInput && window.getComputedStyle(mobileSearchInput.parentElement!).display !== 'none') {
        targetInput = mobileSearchInput;
      } else if (desktopSearchInput) {
        // Try desktop input even if parent visibility check failed
        targetInput = desktopSearchInput;
      } else if (mobileSearchInput) {
        // Try mobile input even if parent visibility check failed
        targetInput = mobileSearchInput;
      } else {
        // Method 2: Fallback - find any search input with placeholder "Search courses..."
        const allSearchInputs = document.querySelectorAll('input[type="search"]') as NodeListOf<HTMLInputElement>;
        for (const input of allSearchInputs) {
          if (input.placeholder.includes('Search courses')) {
            targetInput = input;
            break;
          }
        }
      }

      if (targetInput) {
        // Force the click and focus ONLY after scrolling is completely done
        targetInput.click();
        targetInput.focus();

        // Also trigger a small visual effect to show it worked
        targetInput.style.transition = 'box-shadow 0.3s ease';
        targetInput.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
        setTimeout(() => {
          targetInput!.style.boxShadow = '';
        }, 1000);

        console.log('Search input clicked and focused:', targetInput.id || 'no-id');
      } else {
        console.log('No search input found');
    }
    }, 800); // 800ms delay to ensure smooth scroll completely finishes
  };

  return (
    <div className="text-center mt-12">
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
        {t('home.readyToSave')}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={scrollToTop}
          className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]"
          style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
        >
          {t('home.cta')}
        </button>
        <button
          onClick={scrollToTopAndFocusSearch}
          className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:shadow-sm hover:-translate-y-[1px]"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          {t('home.filterCodes')}
        </button>
      </div>
    </div>
  );
}
```

---

## File 6: `src/components/FilterControls.tsx` (Search and filter UI)

```tsx
import React from 'react';
import { FilterState, WhopCategory, getCategoryLabel } from '@/types/offer';

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  casinos: string[];
  className?: string;
  formRef?: React.RefObject<HTMLFormElement>;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  submitMode?: 'manual' | 'auto';
}

// All available categories in a logical order
const WHOP_CATEGORIES: WhopCategory[] = [
  'TRADING',
  'AI',
  'SOCIAL_MEDIA',
  'SPORTS_BETTING',
  'BUSINESS',
  'ECOMMERCE',
  'GAMING',
  'PERSONAL_DEVELOPMENT',
  'PERSONAL_FINANCE',
  'RESELLING',
  'CAREERS',
  'FITNESS',
  'RECREATION',
  'COMPUTER_SCIENCE',
  'REAL_ESTATE',
  'DATING',
  'TRAVEL',
  'LANGUAGES',
  'OTHER',
];

export default function FilterControls({
  filters,
  onFilterChange,
  casinos,
  className = '',
  formRef,
  onSubmit,
  submitMode = 'auto',
}: FilterControlsProps) {
  // Shared select base classes
  const selectBase =
    'h-11 md:h-12 w-full rounded-full border-0 pl-4 pr-9 text-sm md:text-base ' +
    'focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] ' +
    'transition-all appearance-none';

  const inputBase =
    'w-full h-11 md:h-12 rounded-full border-0 pl-10 pr-4 text-sm md:text-base ' +
    'focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all';

  const selectWrapper =
    'relative flex-1 min-w-[150px] md:min-w-[180px]';

  const chevronIcon = (
    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs">
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        style={{ color: 'var(--text-muted)' }}
      >
        <path
          d="M6 9l6 6 6-6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      method="GET"
      action="/"
      className={`w-full max-w-4xl mx-auto ${className}`}
    >
      {/* DESKTOP: pill-style horizontal bar */}
      <div
        className="hidden sm:flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-3xl border"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Search Bar */}
        <div className="relative flex-[1.9] min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
              style={{ color: 'var(--text-muted)' }}
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            id="main-search-input"
            name="search"
            type="search"
            placeholder="Search tools, courses & communities"
            defaultValue={filters.searchTerm}
            onChange={
              submitMode === 'auto'
                ? (e) => onFilterChange({ searchTerm: e.target.value })
                : undefined
            }
            className={inputBase}
            style={{
              backgroundColor: 'var(--background-color)',
              color: 'var(--text-color)',
            }}
          />
        </div>

        {/* Category Dropdown */}
        <div className={selectWrapper}>
          <select
            value={filters.whopCategory}
            onChange={(e) =>
              onFilterChange({
                whopCategory: e.target.value as WhopCategory | '',
              })
            }
            className={selectBase}
            style={{
              backgroundColor: 'var(--background-color)',
              color: 'var(--text-color)',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
          >
            <option value="">All categories</option>
            {WHOP_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {getCategoryLabel(category)}
              </option>
            ))}
          </select>
          {chevronIcon}
        </div>

        {/* Sort Dropdown */}
        <div className={selectWrapper}>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })
            }
            className={selectBase}
            style={{
              backgroundColor: 'var(--background-color)',
              color: 'var(--text-color)',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
          >
            <option value="">Sort by</option>
            <option value="newest">Newest added</option>
            <option value="highest-rated">Highest rated</option>
            <option value="highest">Highest value</option>
            <option value="lowest">Lowest value</option>
            <option value="alpha-asc">A–Z</option>
            <option value="alpha-desc">Z–A</option>
          </select>
          {chevronIcon}
        </div>
      </div>

      {/* MOBILE: stacked but still pill-like */}
      <div className="sm:hidden flex flex-col gap-2">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
              style={{ color: 'var(--text-muted)' }}
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            id="main-search-input-mobile"
            name="search"
            type="search"
            placeholder="Search tools, courses & communities"
            defaultValue={filters.searchTerm}
            onChange={
              submitMode === 'auto'
                ? (e) => onFilterChange({ searchTerm: e.target.value })
                : undefined
            }
            className={inputBase}
            style={{
              backgroundColor: 'var(--background-color)',
              color: 'var(--text-color)',
            }}
          />
        </div>

        {/* Category */}
        <div className={selectWrapper}>
          <select
            value={filters.whopCategory}
            onChange={(e) =>
              onFilterChange({
                whopCategory: e.target.value as WhopCategory | '',
              })
            }
            className={selectBase}
            style={{
              backgroundColor: 'var(--background-secondary)',
              color: 'var(--text-color)',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
          >
            <option value="">All categories</option>
            {WHOP_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {getCategoryLabel(category)}
              </option>
            ))}
          </select>
          {chevronIcon}
        </div>

        {/* Sort */}
        <div className={selectWrapper}>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })
            }
            className={selectBase}
            style={{
              backgroundColor: 'var(--background-secondary)',
              color: 'var(--text-color)',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
          >
            <option value="">Sort by</option>
            <option value="newest">Newest added</option>
            <option value="highest-rated">Highest rated</option>
            <option value="highest">Highest value</option>
            <option value="lowest">Lowest value</option>
            <option value="alpha-asc">A–Z</option>
            <option value="alpha-desc">Z–A</option>
          </select>
          {chevronIcon}
        </div>
      </div>
    </form>
  );
}
```

---

## Summary of User-Facing Text to Reword

### page.tsx (Homepage)
- Metadata title/description
- JSON-LD schema text (name, description fields)
- Trust pill text: "Trusted by X users" / "Used by savvy digital buyers"
- Section heading: "Why people rely on {SITE_BRAND}"
- Section description about savings
- Feature card 1: "Curated, not scraped" + description
- Feature card 2: "Better entry points" + description
- Feature card 3: "Kept up-to-date" + description

### HomePageServer.tsx
- Hero H1: "– Deals, Discounts & Exclusive Offers"
- Results text: "Showing X-Y of Z results"
- Pagination buttons: "Previous" / "Prev" / "Next"
- No results: "No matching deals found" + description

### OfferCard.tsx
- Fallback title: "Unknown Whop"
- CTA buttons use translation keys (whop.getPromo, whop.viewDeal)

### StatisticsSectionServer.tsx
- Section heading: "Live platform metrics"
- Section description about how people use the site
- Stat labels: "Active users", "Verified offers", "Codes redeemed", "Most clicked"
- Stat captions: "People browsing deals this month", "Verified offers currently listed", etc.

### CallToAction.tsx
- Uses translation keys (home.readyToSave, home.cta, home.filterCodes)

### FilterControls.tsx
- Search placeholder: "Search tools, courses & communities"
- Dropdown defaults: "All categories", "Sort by"
- Sort options: "Newest added", "Highest rated", "Highest value", "Lowest value", "A–Z", "Z–A"

---

**Note:** The OfferCard and CallToAction components use i18n translation keys. Those translation values are in `src/lib/i18n.ts` and may also need updating if you want to change those button labels.
