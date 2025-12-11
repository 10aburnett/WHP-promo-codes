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
  const title = `${SITE_BRAND} - Digital Promo Codes & Savings on Online Products ${currentYear}`;
  const description = `${SITE_BRAND} helps you uncover working promo codes for digital tools, courses, communities and memberships. Explore thousands of checked offers and discounts kept fresh throughout ${currentYear}.`;

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
    name: `Featured Digital Discounts & Promo Codes ${currentYear}`,
    description: `Editorial selection of digital product offers and promo codes for ${currentYear}`,
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
                : 'Special access',
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
                  Hand-checked, not auto-scraped
                </h3>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Every promo is reviewed before it appears on the site, so you spend less time testing random codes that were never going to work.
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
                  Direct-from-creator deals
                </h3>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Many offers come straight from creators or partners, which can mean extras or better-than-public discounts on digital products.
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
                  Actively maintained codes
                </h3>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Codes are checked on a rolling basis and retired when they stop working, so you know whether a deal is still live before you click through.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <CallToAction />
        </div>
      </div>

      {/* Statistics Section - Server Rendered */}
      <StatisticsSectionServer stats={statistics} />
    </main>
  );
}
