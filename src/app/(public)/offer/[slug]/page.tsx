import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import dynamicImport from 'next/dynamic';
import { normalizeImagePath } from '@/lib/image-utils';
import { getOfferBySlugCached } from '@/data/offers'; // NEW: Use cached version
import { getOfferBySlug, getOfferBySlugUnfiltered } from '@/lib/data'; // Keep for metadata generation
import { prisma } from '@/lib/prisma';
import { whereIndexable } from '@/lib/where-indexable';
import { Suspense } from 'react';
import { canonicalSlugForDB, canonicalSlugForPath } from '@/lib/slug-utils';
import { siteOrigin } from '@/lib/site-origin';
import { notFoundWithReason } from '@/lib/notFoundReason';
import { dlog } from '@/lib/debug';

// Static generation with ISR for stable SSR/CSR hydration
export const dynamic = 'force-static';
export const revalidate = 300; // 5 minute revalidation for freshness (optimal SEO balance)
export const dynamicParams = true; // Enable dynamic params for all slugs
export const runtime = 'nodejs'; // required for Prisma database access

import InitialsAvatar from '@/components/InitialsAvatar';
import OfferLogo from '@/components/OfferLogo';
import OfferPageInteractive from '@/components/OfferPageInteractive';
import PromoCodeSubmissionButton from '@/components/PromoCodeSubmissionButton';

// Below-the-fold components: dynamically import to reduce initial bundle size
const OfferReviewSection = dynamicImport(() => import('@/components/OfferReviewSection'), {
  loading: () => null,
});
import FAQSectionServer from '@/components/FAQSectionServer'; // Server component for SEO
import RecommendedOffersServer from '@/components/RecommendedOffersServer'; // Server component for recommendations
import AlternativesServer from '@/components/AlternativesServer'; // Server component for alternatives
import { getRecommendations, getAlternatives } from '@/data/recommendations'; // Data fetching for recommendations/alternatives
import { getPromoStatsForSlug } from '@/data/promo-stats'; // Server-side promo usage statistics
const CommunityPromoSection = dynamicImport(() => import('@/components/CommunityPromoSection'), {
  loading: () => null, // Keep SSR for SEO-relevant content
});

import { parseFaqContent } from '@/lib/faq-types';
import RenderPlain from '@/components/RenderPlain';
import { looksLikeHtml, isMeaningful, escapeHtml, toPlainText } from '@/lib/textRender';
import PromoStatsDisplay from '@/components/PromoStatsDisplay';
import VerificationStatus from '@/components/VerificationStatus';
import HowToSection from '@/components/offer/HowToSection';
import HowToSchema from '@/components/offer/HowToSchema';
import HydrationTripwire from '@/components/HydrationTripwire';
import ServerSectionGuard from '@/components/ServerSectionGuard';
import { djb2 } from '@/lib/hydration-debug';
import 'server-only';
import { jsonLdScript } from '@/lib/jsonld';
import { buildPrimaryEntity, buildBreadcrumbList, buildOffers, buildFAQ, buildHowTo, buildItemList, buildReviews } from '@/lib/buildSchema';
import type { OfferViewModel } from '@/lib/buildSchema';
import { getOfferViewModel } from './vm';
import { LOCALES, isLocaleEnabled, getSchemaLocale } from '@/lib/schema-locale';
import { offerAbsoluteUrl } from '@/lib/urls';
import { getPageClassification, getRobotsForClassification, shouldIncludeInHreflang } from '@/lib/seo-classification';

// Prebuild top 800 quality pages at build time, use ISR for long tail
// TEMPORARILY DISABLED per ChatGPT fix - causes 404s with JS ON
// export async function generateStaticParams() {
//   if (process.env.NODE_ENV !== 'production') return [];

//   const rows = await prisma.deal.findMany({
//     where: whereIndexable(),
//     select: { slug: true },
//     orderBy: { displayOrder: 'asc' },
//     take: 800 // Budget for top "money pages"
//   });

//   return rows.map(r => ({ slug: r.slug }));
// }

interface PromoCode {
  id: string;
  title: string;
  description: string;
  code: string | null;
  type: string;
  value: string;
}

interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
  verified: boolean;
}

interface Offer {
  id: string;
  name: string;
  whopName?: string;
  slug: string;
  logo: string | null;
  description: string;
  rating: number;
  affiliateLink: string | null;
  website: string | null;
  price: string | null;
  category: string | null;
  promoCodes: PromoCode[];
  reviews?: Review[];
}

function resolveBaseUrl(): string {
  // Use centralized siteOrigin helper (static-generation safe)
  return siteOrigin();
}

// Helper function for fetching deal data with Next.js caching
async function getDeal(slug: string) {
  // Use Next.js fetch with ISR caching
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/deals/${slug}`, {
      next: { revalidate: 300 }, // 5 minutes
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    // Fallback to direct database query if API fails
    console.warn('API fetch failed, falling back to direct DB query:', error);
    return await getOfferBySlug(slug);
  }
}

// Helper: load verification data (fetch-only, edge-safe)
async function getVerificationData(slug: string) {
  // In development, skip remote verification fetch to avoid timeouts
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  const origin = process.env.SITE_ORIGIN ?? 'https://digitalpromocodes.com';

  try {
    const res = await fetch(
      `${origin}/data/pages/${encodeURIComponent(slug)}.verification.json`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      console.warn('Verification fetch non-OK', slug, res.status);
      return null;
    }

    return (await res.json()) as any | null;
  } catch (err) {
    console.warn('Verification fetch failed', slug, err);
    return null;
  }
}

// Skeleton component for streaming sections
function SectionSkeleton() {
  return (
    <div
      className="h-48 w-full rounded-xl animate-pulse"
      style={{ backgroundColor: 'var(--background-secondary)' }}
    />
  );
}

// Helper function to extract currency from price string
function extractCurrency(price: string | null): string {
  if (!price) return 'USD';

  // Check for common currency symbols and patterns
  if (price.includes('$')) return 'USD';
  if (price.includes('£')) return 'GBP';
  if (price.includes('€')) return 'EUR';
  if (price.toLowerCase().includes('usd')) return 'USD';
  if (price.toLowerCase().includes('gbp')) return 'GBP';
  if (price.toLowerCase().includes('eur')) return 'EUR';

  return 'USD'; // Default fallback
}

// Helper function to detect if product has trial
function hasTrial(price: string | null): boolean {
  if (!price) return false;
  const lowerPrice = price.toLowerCase();
  return lowerPrice.includes('trial') || lowerPrice.includes('free trial') || lowerPrice.includes('7 days') || lowerPrice.includes('14 days');
}

// Helper function to format date for sidebar
function formatDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Helper function to get popularity label based on code count
function getPopularityLabel(codeCount: number): string {
  if (codeCount >= 10) return "Very popular";
  if (codeCount >= 3) return "Growing";
  if (codeCount >= 1) return "New and active";
  return "New listing";
}

// Helper to get tier label based on rank (1-indexed)
function getCodeTierLabel(rank: number): string {
  if (rank === 1) return "Main code";
  if (rank === 2) return "Secondary code";
  if (rank === 3) return "Tertiary code";
  return "Additional code";
}

// Async component for heavy sections that can be streamed
async function RecommendedSection({ currentOfferSlug }: { currentOfferSlug: string }) {
  const { items } = await getRecommendations(currentOfferSlug);
  // Freeze data to ensure deterministic server/client rendering
  const frozen = (items ?? [])
    .filter(Boolean)
    .map(w => ({
      slug: w.slug,
      name: w.name,
      logo: w.logo ?? null,
      description: w.description ?? null,
      category: w.category ?? null,
      rating: w.rating ?? null,
      ratingCount: w.ratingCount ?? 0
    }))
    .sort((a,b) => a.slug.localeCompare(b.slug));

  // Server-rendered recommendations with normal React hydration
  return <RecommendedOffersServer items={frozen} />;
}

async function AlternativesSection({ currentOfferSlug }: { currentOfferSlug: string }) {
  const { items, explore } = await getAlternatives(currentOfferSlug);
  // Freeze data to ensure deterministic server/client rendering
  const frozen = (items ?? [])
    .filter(Boolean)
    .map(w => ({
      slug: w.slug,
      name: w.name,
      logo: w.logo ?? null,
      blurb: w.description ?? null,
      category: w.category ?? null,
      rating: w.rating ?? null,
      ratingCount: w.ratingCount ?? 0
    }))
    .sort((a,b) => a.slug.localeCompare(b.slug));

  // Server-rendered alternatives with normal React hydration
  return <AlternativesServer items={frozen} explore={explore} />;
}

async function ReviewsSection({ offerId, whopName, reviews }: { offerId: string; whopName: string; reviews: any[] }) {
  // Simulate a small delay to show streaming effect in development
  await new Promise(resolve => setTimeout(resolve, 150));

  return (
    <OfferReviewSection
      offerId={offerId}
      whopName={whopName}
      reviews={reviews}
    />
  );
}

// Helper to check if a whop is indexable (supports multiple schema conventions)
const isIndexable = (raw: unknown) => {
  const v = String(raw ?? "").trim().toUpperCase();
  return v === "INDEX" || v === "INDEXED" || v === "ALLOW" || raw === true;
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    // Remove unstable_noStore() - rely on route-level revalidate
    const decoded = decodeURIComponent(params.slug ?? '');  // Decode before normalizing
    const canon = canonicalSlugForPath(decoded);
    // Use lowercase decoded slug for DB lookup (DB stores literal colons, not %3a)
    const dbSlug = decoded.toLowerCase();
    console.log('[OFFER META] Generating metadata for:', { slug: params.slug, dbSlug });

    // Use unfiltered fetch - show full content for noindex pages with robots meta
    const offerData = await getOfferBySlugUnfiltered(dbSlug, 'en');
    console.log('[OFFER META] Data fetched:', { found: !!offerData, name: offerData?.name });

    if (!offerData) {
      console.warn('[OFFER META] No data found, returning 404 metadata');
      return {
        title: 'Offer Not Found',
        description: 'The requested offer could not be found.',
        robots: { index: false, follow: false } // PHASE1-DEINDEX: hard noindex/nofollow
      };
    }

    // Check if whop should be indexed
    const shouldIndex = !offerData.retired && isIndexable(offerData.indexingStatus);

    if (!shouldIndex) {
      console.warn('[OFFER META] Whop is not indexable (but will show full content):', {
        retired: offerData.retired,
        indexingStatus: offerData.indexingStatus
      });
    }

  // Get current month and year for SEO
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const monthYear = `(${currentMonth} ${currentYear})`;

  const title = `${offerData.name} Promo Code ${monthYear}`;
  
  // Build dynamic meta description
  let description = '';
  const whopName = offerData.name;
  const promoCodes = offerData.PromoCode || [];
  const firstPromo = promoCodes[0];
  const price = offerData.price;
  const category = offerData.category;

  // Start with base call-to-action
  if (firstPromo && firstPromo.code) {
    // Has a promo code
    if (firstPromo.value && firstPromo.value !== '0' && firstPromo.value !== '') {
      // Has specific discount value
      const promoValueText = firstPromo.value.includes('$') || firstPromo.value.includes('%') || firstPromo.value.includes('off') 
        ? firstPromo.value 
        : `${firstPromo.value}% off`;
      description = `Get ${promoValueText} ${whopName} with our exclusive promo code.`;
    } else {
      // Has promo code but no specific discount value
      description = `Claim your exclusive discount on ${whopName} with our special promo code.`;
    }
  } else {
    // No promo code, just exclusive access
    description = `Get exclusive access to ${whopName} through our special link.`;
  }

  // Add pricing information if available
  if (price) {
    if (price === 'Free') {
      description += ` Access this free ${category ? category.toLowerCase() : 'content'}.`;
    } else if (price !== 'N/A') {
      description += ` Starting at ${price}.`;
    }
  }

  // Add category/type information
  if (category) {
    const categoryLower = category.toLowerCase();
    if (!description.includes(categoryLower)) {
      description += ` Premium ${categoryLower} content.`;
    }
  }

  // Add urgency and freshness
  description += ` Limited time offer - verified ${currentMonth} ${currentYear}.`;

  // Add final call-to-action
  if (firstPromo && firstPromo.code) {
    description += ' Copy code & save now!';
  } else {
    description += ' Join today!';
  }

  // Ensure description is within optimal length (150-160 characters)
  if (description.length > 160) {
    // Trim and add ellipsis, but try to keep complete sentences
    const sentences = description.split('. ');
    let shortDescription = '';
    for (const sentence of sentences) {
      const testLength = shortDescription + sentence + '. ';
      if (testLength.length <= 157) { // Leave room for ellipsis
        shortDescription = testLength;
      } else {
        break;
      }
    }
    
    if (shortDescription.length > 0) {
      description = shortDescription.trim();
      if (!description.endsWith('.')) {
        description += '...';
      }
    } else {
      // Fallback: hard truncate
      description = description.substring(0, 157) + '...';
    }
  }

  // Step 8: SEO classification-driven robots flags
  // PHASE1-DEINDEX: Hard noindex/nofollow for all pages (ignore DB flags)
  const classification = getPageClassification(canon);
  const robotsSettings = { index: false, follow: false }; // Hard noindex/nofollow for domain deindexing

  return {
    title,
    description,
    keywords: [
      `${offerData.name} promo code`,
      `${offerData.name} discount`,
      `${offerData.name} coupon`,
      firstPromo?.value ?
        (firstPromo.value.includes('$') || firstPromo.value.includes('%') || firstPromo.value.includes('off')
          ? firstPromo.value
          : `${firstPromo.value}% off`)
        : 'exclusive access',
      offerData.category,
      price === 'Free' ? 'free' : 'premium',
      currentMonth,
      currentYear.toString()
    ].filter(Boolean).join(', '),
    alternates: {
// PHASE1-DEINDEX:       canonical: `https://digitalpromocodes.com/offer/${canon}`,
      ...(isLocaleEnabled() && shouldIncludeInHreflang(classification) && {
        languages: (() => {
          const languages: Record<string, string> = {};
          for (const locale of LOCALES) {
            languages[locale] = offerAbsoluteUrl(canon, locale);
          }
          // x-default → default page for unmatched locales
          languages['x-default'] = offerAbsoluteUrl(canon, 'en');
          return languages;
        })()
      })
    },
    robots: {
      ...robotsSettings, // Always use robotsSettings (now hard-coded to index:false, follow:false)
      googleBot: {
        index: false,
        follow: false,
        noarchive: true,
        noimageindex: true,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: offerData.logo ? [
        {
          url: offerData.logo,
          alt: `${offerData.name} Logo`,
          width: 1200,
          height: 630,
        }
      ] : []
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: offerData.logo ? [offerData.logo] : []
    }
  };
  } catch (error) {
    console.error('[OFFER META] Error generating metadata:', error);
    // Return safe fallback metadata instead of crashing
    return {
      title: 'Offer',
      description: 'Discover exclusive deals and discounts.',
      robots: { index: false, follow: false } // PHASE1-DEINDEX: hard noindex/nofollow
    };
  }
}

export default async function DealPage({ params }: { params: { slug: string } }) {
  const raw = params.slug || '';
  const decoded = decodeURIComponent(raw);  // Decode before normalizing
  // Use lowercase decoded slug for DB lookup (DB stores literal colons, not %3a)
  const dbSlug = decoded.toLowerCase();
  const canonSlug = canonicalSlugForPath(decoded);

  // Phase 1 instrumentation: Log inputs (searchParams removed to allow ISR)
  dlog('whop', 'OfferPage params', { raw, decoded, dbSlug, canonSlug });

  // Step 8: Determine SEO classification for this page
  const classification = getPageClassification(canonSlug);
  const shouldEmitSchema = classification === 'indexable';

  // 1) Try lookup with normalized slug for DB
  console.log('[WHOP DETAIL] Starting fetch for slug:', { raw, dbSlug, canonSlug });

  // Performance measurement: time parallel data fetches
  console.time('[PERF] Parallel data fetch');

  // Parallelize all data fetches for faster load time
  const [vm, dealData, finalOfferData, verificationData] = await Promise.all([
    // Load view model for schema (reuse existing data path)
    getOfferViewModel(raw, undefined).catch((error) => {
      console.warn('Failed to load view model for schema:', error);
      return null;
    }),
    // Get deal data
    getDeal(dbSlug),
    // Use cached, tagged data (D1) - no fallback needed
    getOfferBySlugCached(dbSlug),
    // Load verification data for Screenshot B
    getVerificationData(dbSlug),
  ]);

  console.timeEnd('[PERF] Parallel data fetch');

  console.log('[WHOP DETAIL] getDeal result:', { found: !!dealData, id: dealData?.id });
  console.log('[WHOP DETAIL] Final data chosen:', {
    found: !!finalOfferData,
    name: finalOfferData?.name,
    indexingStatus: (finalOfferData as any)?.indexingStatus,
    retirement: (finalOfferData as any)?.retirement,
    promoCount: (finalOfferData as any)?.PromoCode?.length
  });

  // Debug logging for production troubleshooting
  console.log('Verification data loaded for', dbSlug, ':', verificationData);

  // 3) 404 handling: Not found, retired, or not indexed
  if (!finalOfferData) {
    console.error('[WHOP DETAIL] 404 - No data found:', { raw, dbSlug, reason: 'finalOfferData is null/undefined' });
    if (process.env.SEO_DEBUG === '1') {
      return (
        <pre style={{ padding: 16 }}>
          {JSON.stringify({ raw, dbSlug, flags: null }, null, 2)}
        </pre>
      );
    }
    return notFoundWithReason('no_record_for_slug', { raw, decoded, dbSlug });
  }

  // 4) Relaxed quality check per ChatGPT fix - only block GONE pages
  // Use isIndexable helper for consistent indexability checks
  const pageIsIndexable = !finalOfferData.retired && isIndexable(finalOfferData.indexingStatus);
  const isGone = finalOfferData.retirement === 'GONE';

  // T3: Build trace array for future 404 debugging
  const trace: string[] = [];
  trace.push(`slug=${dbSlug}, id=${finalOfferData.id ?? 'null'}`);
  trace.push(`retired=${finalOfferData.retirement} indexing=${finalOfferData.indexingStatus}`);

  console.log('[WHOP DETAIL] Quality check (relaxed):', {
    dbSlug,
    indexingStatus: finalOfferData.indexingStatus,
    pageIsIndexable,
    retirement: finalOfferData.retirement,
    isGone,
    nodeEnv: process.env.NODE_ENV
  });

  // RELAXED: Only 404 for GONE pages in all environments
  // In development, allow all non-GONE pages (even if not indexed) to fix rec/alt 404s
  if (isGone) {
    trace.push('gate:retired_or_gone');
    console.log('[DBG:reasons:page]', new Date().toISOString(), trace);
    return notFoundWithReason('retired_or_gone', { raw, decoded, dbSlug, retirement: finalOfferData.retirement, isGone });
  }

  // Log successful render decision
  trace.push(`render:true (relaxed_gate)`);
  console.log('[DBG:reasons:page]', new Date().toISOString(), trace);

  // Soft warning in dev for non-indexed pages (but don't 404)
  if (process.env.NODE_ENV !== 'production' && !pageIsIndexable) {
    dlog('reasons', 'indexingStatus not indexed - still rendering', { dbSlug, indexingStatus: finalOfferData.indexingStatus });
  }

  // 5) Handle redirects
  if (finalOfferData.retirement === 'REDIRECT' && finalOfferData.redirectToPath) {
    return permanentRedirect(finalOfferData.redirectToPath); // 308
  }


  // Fetch promo usage statistics server-side for SEO (SSR/SSG)
  const usageStats = await getPromoStatsForSlug(dbSlug);

  // Use verification data loaded from JSON files (not from database)
  const freshnessData = verificationData
    ? {
        whopUrl: String(verificationData.whopUrl || ''),
        lastUpdated: verificationData.lastUpdated ? new Date(verificationData.lastUpdated).toISOString() : new Date().toISOString(),
        ledger: (verificationData.ledger || []).map((row: any) => ({
          ...row,
          checkedAt: row?.checkedAt ? new Date(row.checkedAt).toISOString() : undefined,
          verifiedAt: row?.verifiedAt ? new Date(row.verifiedAt).toISOString() : undefined,
        })),
      }
    : null;

  // Transform raw Prisma data to match expected format
  const offerFormatted = {
    id: finalOfferData.id,
    name: finalOfferData.name,
    description: finalOfferData.description,
    logo: finalOfferData.logo,
    affiliateLink: finalOfferData.affiliateLink,
    website: finalOfferData.website || null,
    price: finalOfferData.price,
    category: finalOfferData.category || null,
    aboutContent: finalOfferData.aboutContent,
    howToRedeemContent: finalOfferData.howToRedeemContent,
    promoDetailsContent: finalOfferData.promoDetailsContent,
    featuresContent: finalOfferData.featuresContent,
    termsContent: finalOfferData.termsContent,
    faqContent: finalOfferData.faqContent,
    updatedAt: finalOfferData.updatedAt,
    createdAt: finalOfferData.createdAt,
    usageStats,
    freshnessData,
    promoCodes: (finalOfferData.PromoCode ?? []).map(code => ({
      id: code.id,
      title: code.title,
      description: code.description,
      code: code.code,
      type: code.type,
      value: code.value,
      createdAt: code.createdAt
    })),
    reviews: (finalOfferData.Review ?? []).map(review => ({
      id: review.id,
      author: review.author,
      content: review.content,
      rating: review.rating,
      createdAt: review.createdAt instanceof Date
        ? review.createdAt.toISOString()
        : String(review.createdAt),
      verified: review.verified
    }))
  };

  
  const firstPromo = offerFormatted.promoCodes[0] || null;
  const promoCode = firstPromo?.code || null;
  const promoTitle = "Exclusive Access"; // Always show "Exclusive Access" on detail pages

  // TASK 1: Helper boolean for hiding promo-code UI when no codes
  const hasPromoCodes =
    Array.isArray(offerFormatted.promoCodes) &&
    offerFormatted.promoCodes.length > 0;

  // TASK 2: Helper booleans for conditional jump links
  const hasOverview =
    isMeaningful(offerFormatted.aboutContent) ||
    isMeaningful(offerFormatted.description);
  const hasRedemption = true; // Always show - has fallback content
  const hasDetails = true; // Always show - has fallback content
  const hasFeatures = isMeaningful(offerFormatted.featuresContent);
  const hasTerms = true; // Always show - has fallback content

  // Helper function to check if whop has a promo code
  const hasPromoCode = (whopName: string): boolean => {
    // Now all promo codes are in database - if promoCode exists, we have a promo
    return promoCode !== null;
  };

  // Helper function to get discount percentage
  const getDiscountPercentage = (whopName: string): string => {
    // Now all promo codes are in database - use firstPromo.value directly
    return firstPromo?.value || '0';
  };

  // Create unique key for remounting when slug changes
  const pageKey = `dpc-offer-${params.slug}`;

  // Prepare fallback FAQ data for the collapsible component (used only if no database FAQ content)
  const fallbackFaqData = [
    {
      question: `How do I use the ${offerFormatted.name} promo code?`,
      answer: `To use the ${promoTitle} for ${offerFormatted.name}, simply click "Reveal Code" above to visit their website.${hasPromoCode(offerFormatted.name) ? ' Copy the promo code and enter it during checkout.' : ' The discount will be automatically applied when you purchase through our link.'}`
    },
    {
      question: `What type of product is ${offerFormatted.name}?`,
      answer: `${offerFormatted.name} is ${offerFormatted.category ? `in the ${offerFormatted.category.toLowerCase()} category and provides` : 'an exclusive platform that provides'} premium content and resources for its members. It's designed to help users achieve their goals through expert guidance and community support.`
    },
    {
      question: 'How long is this offer valid?',
      answer: `This exclusive offer for ${offerFormatted.name} is available for a limited time. We recommend claiming it as soon as possible as these deals can expire or change without notice.`
    }
  ];

  // Generate JSON-LD schema (Step 2: Primary entity + BreadcrumbList, Step 3: Offers, Step 4: FAQ + HowTo)
  // Step 8: Only emit schemas for indexable pages
  let jsonLdSchemas = [];
  if (vm && shouldEmitSchema) {
    try {
      const primary = buildPrimaryEntity(vm);
      const breadcrumbs = buildBreadcrumbList(vm);

      // Step 3: Attach offers to primary entity if price data is available
      const offers = buildOffers(vm);
      if (offers) {
        (primary as any).offers = offers;
      }

      // Step 6: Attach reviews to primary entity if review data is available
      const reviews = buildReviews(vm);
      if (reviews) {
        (primary as any).review = reviews;
      }

      // Step 4: Build FAQ and HowTo schemas (undefined if no data)
      const faqNode = buildFAQ(vm);     // undefined if no visible FAQ
      const howtoNode = buildHowTo(vm); // undefined if no real steps

      // Step 5: Build ItemList schemas for recommendations and alternatives
      const recommendedNode  = buildItemList('recommended',  vm.recommendedUrls, vm.url);
      const alternativesNode = buildItemList('alternatives', vm.alternativeUrls, vm.url);

      jsonLdSchemas = [primary, breadcrumbs, faqNode, howtoNode, recommendedNode, alternativesNode].filter(Boolean);

      // Log schema emission (one-line, prod-only)
      console.info('[schema-log-probe]', process.env.NODE_ENV, process.env.LOG_SCHEMA);
      if (process.env.NODE_ENV === 'production' && process.env.LOG_SCHEMA === '1') {
        const nodeLabels = jsonLdSchemas.map(n => {
          const t = (n as any)['@type'];
          if (t === 'ItemList') {
            const id = String((n as any)['@id'] || '');
            if (id.endsWith('#recommended')) return 'ItemList(reco)';
            if (id.endsWith('#alternatives')) return 'ItemList(alt)';
          }
          return Array.isArray(t) ? t[0] : t; // handle array @type defensively
        });

        // Single log line—easy to grep in Vercel logs
        console.log(JSON.stringify({
          tag: 'schema',
          slug: canonSlug,
          nodes: nodeLabels,
          ts: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.warn('Failed to build JSON-LD schemas:', error);
    }
  }

  return (
    <main
      key={pageKey}
      className="dpc-offer-page min-h-screen pt-24 pb-16 transition-theme"
      style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
    >
      {/* HowTo Schema for SEO */}
      <HowToSchema
        slug={params.slug}
        brand={offerFormatted.name}
        currency={extractCurrency(offerFormatted.price)}
        hasTrial={hasTrial(offerFormatted.price)}
        siteOrigin={siteOrigin()}
      />

      {/* JSON-LD Structured Data */}
      {jsonLdSchemas.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(jsonLdSchemas)}
        />
      )}

      <div className="dpc-offer-container container mx-auto max-w-6xl px-3 sm:px-4">
        {/* Noindex Notice Banner */}
        {!pageIsIndexable && (
          <div className="dpc-notice-banner max-w-4xl mx-auto mb-6">
            <div className="rounded-full border px-4 py-3 text-sm" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)', opacity: 0.8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                ℹ️ This page is currently not indexed by search engines, but is available for viewing.
              </span>
            </div>
          </div>
        )}

        {/* Two-Column Layout: Main Content + Sidebar */}
        <div className="dpc-offer-layout flex flex-col lg:flex-row lg:gap-8 max-w-4xl mx-auto">

          {/* Main Content Column */}
          <article className="dpc-offer-main flex-1 min-w-0 space-y-6 mb-8 lg:mb-0">

            {/* Hero Header */}
            <header className="dpc-offer-header rounded-2xl px-7 py-6 sm:p-8 shadow-theme-promo border transition-theme" style={{ background: 'linear-gradient(to bottom right, var(--background-secondary), var(--background-tertiary))', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-4 sm:gap-6 mb-4">
                <figure className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-xl border overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--border-color)' }}>
                  <OfferLogo offer={offerFormatted} />
                </figure>
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">{offerFormatted.name} Promo Code</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base sm:text-lg" style={{ color: 'var(--accent-color)' }}>
                      {promoTitle}
                    </p>
                    {offerFormatted.price && offerFormatted.price !== 'N/A' && (
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold"
                        style={{
                          backgroundColor: offerFormatted.price === 'Free' ? 'var(--success-color)' : 'var(--success-color)',
                          color: 'white',
                        }}
                      >
                        {offerFormatted.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Promo Codes CTA */}
              <div className="dpc-offer-cta mt-4">
                <hr className="mb-4" style={{ borderColor: 'var(--border-color)', borderWidth: '1px', opacity: 0.3 }} />
                <CommunityPromoSection
                  key={`community-${offerFormatted.id}-${offerFormatted.promoCodes?.length || 0}`}
                  offer={{
                    id: offerFormatted.id,
                    name: offerFormatted.name,
                    affiliateLink: offerFormatted.affiliateLink
                  }}
                  promoCodes={offerFormatted.promoCodes || []}
                  slug={params.slug}
                />
                <div className="mt-6">
                  <PromoCodeSubmissionButton
                    offerId={offerFormatted.id}
                    offerName={offerFormatted.name}
                  />
                </div>
              </div>
            </header>

            {/* Jump Links Navigation - Only show links for sections that exist */}
            <nav className="dpc-jump-links rounded-full px-4 py-3 border shadow-theme-promo" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }} aria-label="Page sections">
              <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-medium">
                {hasOverview && (
                  <li><a href="#overview" className="hover:underline" style={{ color: 'var(--accent-color)' }}>Overview</a></li>
                )}
                {hasRedemption && (
                  <li><a href="#redemption" className="hover:underline" style={{ color: 'var(--accent-color)' }}>Redemption</a></li>
                )}
                {hasDetails && (
                  <li><a href="#details" className="hover:underline" style={{ color: 'var(--accent-color)' }}>Details</a></li>
                )}
                {hasFeatures && (
                  <li><a href="#features" className="hover:underline" style={{ color: 'var(--accent-color)' }}>Features</a></li>
                )}
                <li><a href="#faq" className="hover:underline" style={{ color: 'var(--accent-color)' }}>FAQ</a></li>
                {hasTerms && (
                  <li><a href="#terms" className="hover:underline" style={{ color: 'var(--accent-color)' }}>Terms</a></li>
                )}
              </ul>
            </nav>

            {/* Overview Section */}
            {(() => {
              const aboutVal =
                isMeaningful(offerFormatted.aboutContent) ? offerFormatted.aboutContent
                : (isMeaningful(offerFormatted.description) ? offerFormatted.description : null);

              return aboutVal && (
                <section id="overview" className="dpc-offer-overview rounded-2xl px-7 py-6 sm:p-8 border shadow-theme-promo transition-theme" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
                  <h2 className="text-xl sm:text-2xl font-bold mb-4">Overview</h2>
                  <div className="dpc-content-block text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {looksLikeHtml(aboutVal) ? (
                      <div
                        className="prose prose-sm max-w-none whitespace-break-spaces prose-headings:text-current prose-p:text-current prose-ul:text-current prose-ol:text-current prose-li:text-current prose-strong:text-current prose-em:text-current prose-a:text-blue-600 hover:prose-a:text-blue-700"
                        dangerouslySetInnerHTML={{ __html: aboutVal }}
                      />
                    ) : (
                      <RenderPlain text={aboutVal} />
                    )}
                  </div>
                </section>
              );
            })()}

            {/* Redemption Steps Section */}
            <section id="redemption" className="dpc-offer-redemption rounded-2xl px-7 py-6 sm:p-8 border shadow-theme-promo transition-theme" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Redemption Steps</h2>
              {isMeaningful(offerFormatted.howToRedeemContent) ? (
                <div className="dpc-content-block text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {looksLikeHtml(offerFormatted.howToRedeemContent!) ? (
                    <div
                      className="prose prose-sm max-w-none whitespace-break-spaces prose-headings:text-current prose-p:text-current prose-ul:text-current prose-ol:text-current prose-li:text-current prose-strong:text-current prose-em:text-current prose-a:text-blue-600 hover:prose-a:text-blue-700"
                      dangerouslySetInnerHTML={{ __html: offerFormatted.howToRedeemContent! }}
                    />
                  ) : (
                    <RenderPlain text={offerFormatted.howToRedeemContent!} />
                  )}
                </div>
              ) : (
                <ol className="dpc-steps-list space-y-2 text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>
                  <li className="flex items-start">
                    <span className="mr-2 font-semibold">1.</span>
                    <span>Click &quot;Reveal Code&quot; above to visit {offerFormatted.name} and get your exclusive offer</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 font-semibold">2.</span>
                    <span>Follow the instructions on the checkout page to apply your savings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 font-semibold">3.</span>
                    <span>Complete your purchase to access the exclusive content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 font-semibold">4.</span>
                    <span>Enjoy your {promoTitle} and start learning!</span>
                  </li>
                </ol>
              )}
            </section>

            {/* Deal Specifics Section */}
            <section id="details" className="dpc-offer-details rounded-2xl px-7 py-6 sm:p-8 border shadow-theme-promo transition-theme" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Deal Specifics</h2>
              {isMeaningful(offerFormatted.promoDetailsContent) ? (
                <div className="dpc-content-block text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {looksLikeHtml(offerFormatted.promoDetailsContent!) ? (
                    <div
                      className="prose prose-sm max-w-none whitespace-break-spaces prose-headings:text-current prose-p:text-current prose-ul:text-current prose-ol:text-current prose-li:text-current prose-strong:text-current prose-em:text-current prose-a:text-blue-600 hover:prose-a:text-blue-700"
                      dangerouslySetInnerHTML={{ __html: offerFormatted.promoDetailsContent! }}
                    />
                  ) : (
                    <RenderPlain text={offerFormatted.promoDetailsContent!} />
                  )}
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: 'var(--background-color)' }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--accent-color)' }}>{promoTitle}</h3>
                    <p className="text-base sm:text-lg leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                      Get exclusive access and special discounts with our promo code.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--background-color)', color: 'var(--accent-color)' }}>
                      {firstPromo?.type?.replace('_', ' ').toUpperCase() || 'DISCOUNT'} OFFER
                    </span>
                  </div>
                </>
              )}
            </section>

            {/* What's Included Section */}
            {isMeaningful(offerFormatted.featuresContent) && (
              <section id="features" className="dpc-offer-features rounded-2xl px-7 py-6 sm:p-8 border shadow-theme-promo transition-theme" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">What&apos;s Included</h2>
                <div className="dpc-content-block text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {looksLikeHtml(offerFormatted.featuresContent!) ? (
                    <div
                      className="prose prose-sm max-w-none whitespace-break-spaces prose-headings:text-current prose-p:text-current prose-ul:text-current prose-ol:text-current prose-li:text-current prose-strong:text-current prose-em:text-current prose-a:text-blue-600 hover:prose-a:text-blue-700"
                      dangerouslySetInnerHTML={{ __html: offerFormatted.featuresContent! }}
                    />
                  ) : (
                    <RenderPlain text={offerFormatted.featuresContent!} />
                  )}
                </div>
              </section>
            )}

            {/* Visual Guide Section */}
            <section className="dpc-offer-howto rounded-2xl px-7 py-6 sm:p-8 border shadow-theme-promo transition-theme" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
              <HowToSection brand={offerFormatted.name} />
            </section>

            {/* FAQ Section */}
            <section id="faq" className="dpc-offer-faq" aria-labelledby="faq-heading">
              <FAQSectionServer
                faqContent={offerFormatted.faqContent}
                faqs={fallbackFaqData}
                whopName={offerFormatted.name}
              />
            </section>

            {/* Fine Print Section */}
            <section id="terms" className="dpc-offer-terms rounded-2xl px-7 py-6 sm:p-8 border shadow-theme-promo transition-theme" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Fine Print</h2>
              {isMeaningful(offerFormatted.termsContent) ? (
                <div className="dpc-content-block text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {looksLikeHtml(offerFormatted.termsContent!) ? (
                    <div
                      className="prose prose-sm max-w-none whitespace-break-spaces prose-headings:text-current prose-p:text-current prose-ul:text-current prose-ol:text-current prose-li:text-current prose-strong:text-current prose-em:text-current prose-a:text-blue-600 hover:prose-a:text-blue-700"
                      dangerouslySetInnerHTML={{ __html: offerFormatted.termsContent! }}
                    />
                  ) : (
                    <RenderPlain text={offerFormatted.termsContent!} />
                  )}
                </div>
              ) : (
                <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  This exclusive offer for {offerFormatted.name} is available through our partnership.
                  {hasPromoCode(offerFormatted.name) ? ' Use the promo code during checkout to get your discount.' : ' The discount will be automatically applied when you click through our link.'}
                  {' '}Terms and conditions apply as set by {offerFormatted.name}. Offer subject to availability and may be modified or discontinued at any time.
                </p>
              )}
            </section>
          </article>

          {/* Sidebar Column */}
          <aside className="dpc-offer-sidebar w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* 1. Product Summary Card */}
              <div
                className="dpc-summary-card rounded-2xl px-6 py-5 border shadow-theme-promo"
                style={{
                  backgroundColor: "var(--background-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <h3 className="text-lg font-bold mb-3">Product Summary</h3>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt
                      className="font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Category
                    </dt>
                    <dd>{offerFormatted.category ?? "Not specified"}</dd>
                  </div>

                  <div>
                    <dt
                      className="font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Listing type
                    </dt>
                    <dd>
                      {offerFormatted.price === "Free"
                        ? "Free digital resource"
                        : "Paid digital product"}
                    </dd>
                  </div>

                  <div>
                    <dt
                      className="font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Last checked
                    </dt>
                    <dd>
                      {verificationData?.best?.computedAt
                        ? formatDate(verificationData.best.computedAt)
                        : "Recently updated"}
                    </dd>
                  </div>

                  <div>
                    <dt
                      className="font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Popularity
                    </dt>
                    <dd>{getPopularityLabel(offerFormatted.promoCodes.length)}</dd>
                  </div>
                </dl>
              </div>

              {/* 2. Usage Statistics - moved ABOVE Key Facts */}
              <div
                className="dpc-stats-card rounded-2xl px-6 py-5 border shadow-theme-promo"
                style={{
                  backgroundColor: "var(--background-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <ServerSectionGuard label="PromoUsageStats">
                  <PromoStatsDisplay
                    offerId={offerFormatted.id}
                    slug={params.slug}
                    initialStats={offerFormatted.usageStats}
                  />
                </ServerSectionGuard>
              </div>

              {/* 3. Key Facts Card - Only show Discount/Codes when hasPromoCodes */}
              <div
                className="dpc-key-facts rounded-2xl px-6 py-5 border shadow-theme-promo"
                style={{
                  backgroundColor: "var(--background-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <h3 className="text-lg font-bold mb-4">Key Facts</h3>
                {(() => {
                  const hasPrice = !!offerFormatted.price;
                  const hasDiscount = !!(firstPromo?.value && firstPromo.value !== "0");
                  const hasCategory = !!offerFormatted.category;
                  const hasAnyFact = hasPrice || hasDiscount || hasCategory;

                  if (!hasAnyFact) {
                    return (
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>N/A</p>
                    );
                  }

                  return (
                    <dl className="dpc-facts-list space-y-3 text-sm">
                      {hasPrice && (
                        <>
                          <dt
                            className="font-medium"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Price
                          </dt>
                          <dd
                            className="mb-2 font-semibold"
                            style={{
                              color:
                                offerFormatted.price === "Free"
                                  ? "var(--success-color)"
                                  : "var(--text-color)",
                            }}
                          >
                            {offerFormatted.price}
                          </dd>
                        </>
                      )}

                      {hasDiscount && (
                        <>
                          <dt
                            className="font-medium"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Discount
                          </dt>
                          <dd
                            className="mb-2 font-semibold"
                            style={{ color: "var(--accent-color)" }}
                          >
                            {firstPromo.value.includes("%") ||
                            firstPromo.value.includes("$") ||
                            firstPromo.value.includes("off")
                              ? firstPromo.value
                              : `${firstPromo.value}%`}
                          </dd>
                        </>
                      )}

                      {hasCategory && (
                        <>
                          <dt
                            className="font-medium"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Category
                          </dt>
                          <dd className="mb-2">{offerFormatted.category}</dd>
                        </>
                      )}
                    </dl>
                  );
                })()}
              </div>

              {/* 4. Why We Like This Card */}
              <div
                className="dpc-why-card rounded-2xl px-6 py-5 border shadow-theme-promo"
                style={{
                  backgroundColor: "var(--background-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <h3 className="text-lg font-bold mb-3">Why we like this</h3>
                <ul
                  className="list-disc pl-5 space-y-1 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <li>
                    Solid option in the{" "}
                    {offerFormatted.category ?? "online"} space.
                  </li>
                  <li>
                    Clear value for users looking for {promoTitle.toLowerCase()}.
                  </li>
                  <li>
                    Simple sign-up flow with transparent pricing from{" "}
                    {offerFormatted.name}.
                  </li>
                  <li>
                    Good choice if you want to try something new before
                    committing long term.
                  </li>
                </ul>
              </div>

              {/* 5. Mini Alternatives Card */}
              <div
                className="dpc-mini-alternatives rounded-2xl px-6 py-5 border shadow-theme-promo"
                style={{
                  backgroundColor: "var(--background-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <h3 className="text-lg font-bold mb-2">Top alternatives</h3>
                <p
                  className="text-sm mb-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Not sure if {offerFormatted.name} is the right fit? We&apos;ve
                  listed a few similar deals further down this page.
                </p>
                <a
                  href="#alternatives"
                  className="text-sm font-medium hover:underline"
                  style={{ color: "var(--accent-color)" }}
                >
                  Jump to alternatives
                </a>
              </div>

              {/* 6. Discount Summary Cards - Only show when hasPromoCodes */}
              {hasPromoCodes && offerFormatted.promoCodes.map((promo, idx) => {
                const isCommunity = promo.id.startsWith("community_");
                const rank = idx + 1;
                return (
                  <div
                    key={promo.id}
                    className="dpc-discount-card rounded-2xl px-6 py-5 border shadow-theme-promo"
                    style={{
                      backgroundColor: "var(--background-secondary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-baseline gap-1.5">
                        <h4 className="text-sm font-semibold" style={{ color: 'var(--text-color)' }}>Code #{rank}</h4>
                      </div>
                      <span
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                        style={{
                          borderColor: isCommunity
                            ? "rgba(5,150,105,0.28)"
                            : "var(--border-color)",
                          backgroundColor: isCommunity
                            ? "rgba(5,150,105,0.06)"
                            : "var(--background-color)",
                          color: isCommunity ? "var(--accent-color)" : "var(--text-secondary)",
                        }}
                      >
                        {isCommunity ? "Community" : getCodeTierLabel(rank)}
                      </span>
                    </div>
                    <dl className="text-sm space-y-2">
                      {promo.value && promo.value !== "0" && (
                        <>
                          <dt className="sr-only">Value</dt>
                          <dd
                            className="font-semibold"
                            style={{ color: "var(--accent-color)" }}
                          >
                            {promo.value.includes("%") ||
                            promo.value.includes("$") ||
                            promo.value.includes("off")
                              ? promo.value
                              : `${promo.value}%`}{" "}
                            off
                          </dd>
                        </>
                      )}
                    </dl>
                  </div>
                );
              })}

              {/* 7. Verification Info */}
              <div className="dpc-verification-card">
                <ServerSectionGuard label="VerificationStatus">
                  {offerFormatted.freshnessData && (
                    <VerificationStatus freshnessData={offerFormatted.freshnessData} />
                  )}
                </ServerSectionGuard>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Content Sections */}
        <div className="dpc-related-content w-full space-y-8 mt-12">
          {/* Other Options */}
          <section id="alternatives" className="dpc-offer-alternatives max-w-4xl mx-auto">
            <Suspense fallback={<SectionSkeleton />}>
              <AlternativesSection currentOfferSlug={dbSlug} />
            </Suspense>
          </section>

          {/* You Might Also Like */}
          <section className="dpc-offer-recommended max-w-4xl mx-auto">
            <Suspense fallback={<SectionSkeleton />}>
              <RecommendedSection currentOfferSlug={dbSlug} />
            </Suspense>
          </section>

          {/* Community Feedback */}
          <section className="dpc-offer-reviews max-w-4xl mx-auto">
            <Suspense fallback={<SectionSkeleton />}>
              <ReviewsSection
                offerId={offerFormatted.id}
                whopName={offerFormatted.name}
                reviews={offerFormatted.reviews || []}
              />
            </Suspense>
          </section>

          {/* Back Link */}
          <nav className="dpc-back-link max-w-4xl mx-auto" aria-label="Back navigation">
            <a href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-colors hover:bg-[var(--background-secondary)]" style={{ color: 'var(--text-secondary)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to All Offers
            </a>
          </nav>
        </div>
      </div>

      {/* Hydration Debug Tripwire */}
      {process.env.NEXT_PUBLIC_HYDRATION_DEBUG === '1' && <HydrationTripwire />}
    </main>
  );
} 