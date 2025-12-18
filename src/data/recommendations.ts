// src/data/recommendations.ts
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { loadNeighbors, getNeighborSlugsFor, getExploreFor } from '@/lib/graph';
import { normalizeSlug } from '@/lib/slug-normalize';
import { isOfferLaunchEligible, LAUNCH_MODE } from '@/lib/launch-cohort';
import { getCohortFallbackSlugs, MIN_INTERNAL_LINKS } from '@/lib/cohort-fallback-links';

interface PromoCode {
  id: string;
  title: string;
  type: string;
  value: string;
  code: string | null;
}

interface OfferItem {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  aboutContent: string | null;
  blurb: string | null;
  category: string | null;
  price: string | null;
  rating: number | null;
  ratingCount: number;
  promoCodes: PromoCode[];
}

interface ExploreLink {
  slug: string;
  name: string;
  logo?: string | null;
  blurb?: string | null;
  category?: string | null;
  rating?: number | null;
  ratingCount?: number;
}

/**
 * Extract the second sentence from text content.
 */
function getSecondSentence(text: string | null | undefined): string | null {
  if (!text || !text.trim()) return null;
  const sentences = text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0);
  if (sentences.length === 0) return null;
  if (sentences.length === 1) return sentences[0];
  return sentences[1].trim();
}

// ============================================================================
// UNIFIED RENDER-TIME ASSEMBLY (CRITICAL: NO DUPLICATES ALLOWED)
// ============================================================================

/**
 * HARD RULE: A slug may appear AT MOST ONCE per offer page.
 *
 * This function builds both recommendations and alternatives together,
 * using a shared usedSlugs set to guarantee zero overlap.
 *
 * If uniqueness cannot be satisfied, we REDUCE COUNT rather than duplicate.
 */
export async function getRecsAndAlts(currentOfferSlug: string): Promise<{
  recommendations: { items: OfferItem[]; explore: ExploreLink | null };
  alternatives: { items: OfferItem[]; explore: ExploreLink | null };
}> {
  // Just lowercase, don't strip hyphens - graph keys may have trailing hyphens
  const canonicalSlug = currentOfferSlug.toLowerCase();

  // Global exclusion set - once a slug is here, it cannot appear anywhere else on this page
  const usedSlugs = new Set<string>();
  usedSlugs.add(canonicalSlug); // Always exclude current page

  try {
    const neighbors = await loadNeighbors();

    // ========================================================================
    // STEP 1: Build recommendations (first priority)
    // ========================================================================
    const recItems = await buildSection(
      canonicalSlug,
      neighbors,
      'recommendations',
      usedSlugs,
      4 // target count
    );

    // ========================================================================
    // STEP 2: Build alternatives (second priority, MUST NOT overlap with recs)
    // ========================================================================
    const altItems = await buildSection(
      canonicalSlug,
      neighbors,
      'alternatives',
      usedSlugs, // recs already added to usedSlugs
      4 // target count
    );

    // ========================================================================
    // STEP 3: Build explore link (if not already used)
    // ========================================================================
    const explore = await buildExploreLink(canonicalSlug, neighbors, usedSlugs);

    return {
      recommendations: { items: recItems, explore: null },
      alternatives: { items: altItems, explore }, // explore shown with alts (matches original)
    };
  } catch (error) {
    console.error('Error fetching recs/alts:', error);
    return {
      recommendations: { items: [], explore: null },
      alternatives: { items: [], explore: null },
    };
  }
}

/**
 * Build a single section (recs or alts) with global deduplication.
 *
 * CRITICAL: This function MUTATES usedSlugs to track what's been used.
 * Each slug added to the section is also added to usedSlugs.
 */
async function buildSection(
  canonicalSlug: string,
  neighbors: Record<string, { recommendations?: string[]; alternatives?: string[] }>,
  kind: 'recommendations' | 'alternatives',
  usedSlugs: Set<string>,
  targetCount: number
): Promise<OfferItem[]> {
  // Get candidate slugs from graph
  let candidateSlugs = getNeighborSlugsFor(neighbors, canonicalSlug, kind);

  // Filter: launch cohort + not already used
  candidateSlugs = candidateSlugs
    .filter(Boolean)
    .filter(isOfferLaunchEligible)
    .filter(slug => !usedSlugs.has(slug));

  // Fallback 1: category-based if graph has nothing
  if (candidateSlugs.length === 0) {
    const currentOffer = await prisma.deal.findFirst({
      where: { slug: canonicalSlug },
      select: { category: true }
    });

    if (currentOffer?.category) {
      const categoryWhops = await prisma.deal.findMany({
        where: {
          category: currentOffer.category,
          slug: { notIn: Array.from(usedSlugs) }
        },
        select: { slug: true },
        orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
        take: 20
      });

      candidateSlugs = categoryWhops
        .map(w => w.slug)
        .filter(isOfferLaunchEligible)
        .filter(slug => !usedSlugs.has(slug));
    }
  }

  // Fallback 2: cohort fallback if still not enough
  if (LAUNCH_MODE && candidateSlugs.length < MIN_INTERNAL_LINKS) {
    const fallbackSlugs = getCohortFallbackSlugs(
      canonicalSlug,
      targetCount - candidateSlugs.length,
      usedSlugs // Pass the GLOBAL usedSlugs set
    );
    candidateSlugs = [...candidateSlugs, ...fallbackSlugs];
  }

  // Take only what we need
  const slugsToFetch = candidateSlugs.slice(0, targetCount);

  if (slugsToFetch.length === 0) {
    return [];
  }

  // Fetch from DB (filter out GONE pages)
  const whops = await prisma.deal.findMany({
    where: {
      slug: { in: slugsToFetch },
      NOT: { retirement: 'GONE' }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      description: true,
      aboutContent: true,
      category: true,
      price: true,
      rating: true,
      _count: { select: { Review: true } },
      PromoCode: {
        where: { NOT: { id: { startsWith: 'community_' } } },
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { id: true, title: true, type: true, value: true, code: true }
      }
    },
    take: targetCount
  });

  // Transform and ADD TO USED SLUGS
  // Use raw DB slug - don't normalize (preserves trailing hyphens like 'tms-heavy-hitters-')
  const items: OfferItem[] = whops.map(whop => {
    usedSlugs.add(whop.slug); // CRITICAL: Mark as used

    return {
      id: whop.id,
      name: whop.name,
      slug: whop.slug,
      logo: whop.logo,
      description: whop.description,
      aboutContent: whop.aboutContent,
      blurb: getSecondSentence(whop.aboutContent) || whop.description,
      category: whop.category,
      price: whop.price,
      rating: whop.rating,
      ratingCount: whop._count?.Review ?? 0,
      promoCodes: whop.PromoCode || []
    };
  });

  return items;
}

/**
 * Build explore link, checking against usedSlugs.
 */
async function buildExploreLink(
  canonicalSlug: string,
  neighbors: Record<string, { recommendations?: string[]; alternatives?: string[]; explore?: string }>,
  usedSlugs: Set<string>
): Promise<ExploreLink | null> {
  try {
    const exploreSlug = getExploreFor(neighbors, canonicalSlug);

    if (!exploreSlug) return null;
    if (usedSlugs.has(exploreSlug)) return null;
    if (!isOfferLaunchEligible(exploreSlug)) return null;

    const exploreWhop = await prisma.deal.findFirst({
      where: {
        slug: exploreSlug,
        NOT: { retirement: 'GONE' }
      },
      select: {
        slug: true,
        name: true,
        logo: true,
        description: true,
        aboutContent: true,
        category: true,
        rating: true,
        _count: { select: { Review: true } }
      }
    });

    if (!exploreWhop) return null;

    // Use raw DB slug - don't normalize (preserves trailing hyphens)
    usedSlugs.add(exploreWhop.slug); // Mark as used

    return {
      slug: exploreWhop.slug,
      name: exploreWhop.name,
      logo: exploreWhop.logo,
      blurb: getSecondSentence(exploreWhop.aboutContent) || exploreWhop.description,
      category: exploreWhop.category ?? undefined,
      rating: exploreWhop.rating,
      ratingCount: exploreWhop._count?.Review ?? 0
    };
  } catch {
    return null;
  }
}

// ============================================================================
// CACHED API - Uses unstable_cache for ISR caching across serverless invocations
// ============================================================================

/**
 * ISR-cached fetch for recommendations and alternatives.
 * This is the primary API - uses Next.js unstable_cache for proper caching.
 */
export const getRecsAndAltsCached = unstable_cache(
  async (slug: string) => {
    const t0 = Date.now();
    const result = await getRecsAndAlts(slug);
    console.log('[PERF] getRecsAndAlts', Date.now() - t0, 'ms', { slug });
    return result;
  },
  ['recs-alts'],
  {
    revalidate: 300, // 5 minutes
    tags: ['recommendations']
  }
);

/**
 * Server-side fetch for recommendations.
 * @deprecated Use getRecsAndAltsCached() for guaranteed deduplication
 */
export async function getRecommendations(currentOfferSlug: string): Promise<{
  items: OfferItem[];
  explore: ExploreLink | null;
}> {
  const result = await getRecsAndAltsCached(currentOfferSlug);
  return result.recommendations;
}

/**
 * Server-side fetch for alternatives.
 * @deprecated Use getRecsAndAltsCached() for guaranteed deduplication
 */
export async function getAlternatives(currentOfferSlug: string): Promise<{
  items: OfferItem[];
  explore: ExploreLink | null;
}> {
  const result = await getRecsAndAltsCached(currentOfferSlug);
  return result.alternatives;
}
