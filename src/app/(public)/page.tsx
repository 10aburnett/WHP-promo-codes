import { Suspense } from 'react';
import HomePageServer from '@/components/HomePageServer';
import StatisticsSectionServer from '@/components/StatisticsSectionServer';
import CallToAction from '@/components/CallToAction';
import { prisma } from '@/lib/prisma';
import { getStatisticsCached } from '@/data/statistics'; // Server-side statistics
import { absoluteUrl, offerAbsoluteUrl } from '@/lib/urls';
import { SITE_BRAND, SITE_TAGLINE, SITE_DESCRIPTION } from '@/lib/brand';
import { formatUserCount } from '@/config/platformMetrics';
import type { Metadata } from 'next';
import { isOfferLaunchEligible, LAUNCH_MODE, LAUNCH_COHORT_SLUGS } from '@/lib/launch-cohort';

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

// Skeleton loading components for Suspense boundaries
const OfferGridSkeleton = () => (
  <div className="mx-auto w-[90%] md:w-[95%] max-w-[1200px]">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 lg:gap-6 mb-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border p-4 md:p-5 animate-pulse"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
          <div className="pt-3 border-t flex gap-2" style={{ borderColor: 'var(--border-color)' }}>
            <div className="h-9 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StatsSkeleton = () => (
  <div className="py-12 animate-pulse">
    <div className="container mx-auto max-w-4xl px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center">
            <div className="h-8 w-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
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

    // Launch cohort gate: Only show cohort slugs when launch mode is active
    if (LAUNCH_MODE && LAUNCH_COHORT_SLUGS.size > 0) {
      where.slug = { in: Array.from(LAUNCH_COHORT_SLUGS) };
    }

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
  const title = `Promo Codes for Online Courses & Memberships | ${SITE_BRAND}`; // 64 chars
  const description = `Browse promo codes for digital products and services. Compare pricing on software, courses, and communities with regularly checked offers for ${currentYear}.`;

  return {
    title,
    description,
    alternates: {
      canonical: 'https://whoppromocodes.com/',
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
    '@id': `${siteUrl}#dpc-website`,
    name: SITE_BRAND,
    description: 'Directory of promo codes and discounts for digital products, software, and online services.',
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
    '@id': `${siteUrl}#dpc-org`,
    name: SITE_BRAND,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo.png'),
      width: 400,
      height: 400,
    },
    description: 'An independent platform cataloguing promotional codes and pricing information for digital tools and services.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: absoluteUrl('/contact'),
    },
  };

  // Simple ItemList with URLs only - individual offer pages have full Product schemas
  // This avoids duplicate/invalid Product schemas on homepage
  const offersSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${siteUrl}#dpc-featured-list`,
    name: `Featured Digital Offers ${currentYear}`,
    description: `A curated selection of digital product discounts available in ${currentYear}`,
    numberOfItems: Math.min(data.items.length, 10),
    itemListElement: data.items.slice(0, 10).map((whop, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: offerAbsoluteUrl(whop.slug.toLowerCase()),
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

      {/* Server-rendered content with Suspense for faster hydration */}
      <Suspense fallback={<OfferGridSkeleton />}>
        <HomePageServer
          key={`p-${page}`}
          items={data.items}
          currentPage={page}
          totalPages={data.totalPages}
          total={data.total}
        />
      </Suspense>

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
                    ? `${formatUserCount(statistics.totalUsers)} people have used us to find digital deals`
                    : 'Used by people who compare prices before they buy'}
                </span>
              </div>
            </div>

            <h2
              className="mt-4 text-2xl sm:text-3xl font-bold text-center"
              style={{ color: 'var(--text-color)' }}
            >
              Why shoppers choose {SITE_BRAND} for digital deals
            </h2>

            <p
              className="mt-2 text-sm sm:text-base text-center max-w-2xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              The focus is simple: working savings on digital products, tools and memberships – without pages of expired coupons and noisy clutter.
            </p>
          </div>

          {/* Two-column layout: Numbered list left, Trust card right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
            {/* Left column: Numbered benefits list */}
            <div className="flex flex-col gap-5">
              {/* Benefit 1 */}
              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: 'rgba(5,150,105,0.1)',
                    color: 'var(--accent-color)',
                  }}
                >
                  1
                </div>
                <div>
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-color)' }}>
                    Hand-checked, not auto-scraped
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Every promo is reviewed before it appears on the site, so you spend less time testing random codes.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: 'rgba(5,150,105,0.1)',
                    color: 'var(--accent-color)',
                  }}
                >
                  2
                </div>
                <div>
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-color)' }}>
                    Direct-from-creator deals
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Many offers come straight from creators or partners, meaning better-than-public discounts.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: 'rgba(5,150,105,0.1)',
                    color: 'var(--accent-color)',
                  }}
                >
                  3
                </div>
                <div>
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-color)' }}>
                    Actively maintained codes
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Codes are checked on a rolling basis and retired when they stop working.
                  </p>
                </div>
              </div>
            </div>

            {/* Right column: Trust / CTA card */}
            <div
              className="rounded-2xl border px-6 py-6 flex flex-col justify-between shadow-theme-promo"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--background-color)',
              }}
            >
              <div>
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: 'rgba(5,150,105,0.08)',
                    color: 'var(--accent-color)',
                  }}
                >
                  {/* Trophy/star icon */}
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                  Used by savvy shoppers
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Join others who use {SITE_BRAND} to find working codes for digital products, courses, and memberships.
                </p>
              </div>
              <CallToAction />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section - Server Rendered with Suspense */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatisticsSectionServer stats={statistics} />
      </Suspense>
    </main>
  );
}
