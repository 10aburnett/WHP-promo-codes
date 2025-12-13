// src/data/recommendations.ts
import { prisma } from '@/lib/prisma';
import { loadNeighbors, getNeighborSlugsFor, getExploreFor } from '@/lib/graph';
import { normalizeSlug } from '@/lib/slug-normalize';
import { isOfferLaunchEligible, LAUNCH_MODE } from '@/lib/launch-cohort';

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
  blurb: string | null; // Second sentence from aboutContent for preview
  category: string | null;
  price: string | null;
  rating: number | null;
  ratingCount: number;
  promoCodes: PromoCode[];
}

/**
 * Extract the second sentence from text content.
 * Falls back to first sentence if only one exists, or null if empty.
 */
function getSecondSentence(text: string | null | undefined): string | null {
  if (!text || !text.trim()) return null;

  // Split on sentence-ending punctuation followed by space or end
  const sentences = text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0);

  if (sentences.length === 0) return null;
  if (sentences.length === 1) return sentences[0];

  // Return second sentence, trimmed
  return sentences[1].trim();
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
 * Server-side fetch for recommendations using graph neighbors
 */
export async function getRecommendations(currentOfferSlug: string): Promise<{
  items: OfferItem[];
  explore: ExploreLink | null;
}> {
  try {
    const canonicalSlug = normalizeSlug(currentOfferSlug);

    // Load graph neighbors
    const neighbors = await loadNeighbors();
    const rawSlugs = getNeighborSlugsFor(neighbors, canonicalSlug, 'recommendations');
    // Launch cohort gate: Only include slugs that are launch-eligible
    let slugs = Array.from(new Set(rawSlugs.filter(Boolean).filter(isOfferLaunchEligible))).slice(0, 4);

    // Fallback: if graph has no neighbors, use category-based recommendations
    if (slugs.length === 0) {
      const currentOffer = await prisma.deal.findFirst({
        where: { slug: canonicalSlug },
        select: { category: true }
      });

      if (currentOffer?.category) {
        const categoryWhops = await prisma.deal.findMany({
          where: {
            category: currentOffer.category,
            slug: { not: canonicalSlug }
          },
          select: { slug: true },
          orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
          take: 20 // Fetch more to filter by launch cohort
        });

        // Launch cohort gate: Filter to only launch-eligible slugs
        slugs = categoryWhops.map(w => w.slug).filter(isOfferLaunchEligible).slice(0, 4);
      }

      if (slugs.length === 0) {
        return { items: [], explore: null };
      }
    }

    // Fetch whop details from database - FILTER OUT GONE pages to prevent 404s
    const whops = await prisma.deal.findMany({
      where: {
        slug: { in: slugs },
        // Per ChatGPT fix: only exclude GONE pages (match whop detail page logic)
        NOT: {
          retirement: 'GONE'
        }
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
          where: {
            NOT: { id: { startsWith: 'community_' } }
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            title: true,
            type: true,
            value: true,
            code: true
          }
        }
      },
      take: 4
    });

    // Transform to expected format - use second sentence from aboutContent as blurb
    const items: OfferItem[] = whops.map(whop => ({
      id: whop.id,
      name: whop.name,
      slug: normalizeSlug(whop.slug), // Ensure canonical slug for links
      logo: whop.logo,
      description: whop.description,
      aboutContent: whop.aboutContent,
      blurb: getSecondSentence(whop.aboutContent) || whop.description,
      category: whop.category,
      price: whop.price,
      rating: whop.rating,
      ratingCount: whop._count?.Review ?? 0,
      promoCodes: whop.PromoCode || []
    }));

    // Fetch explore link
    let explore: ExploreLink | null = null;
    try {
      const exploreSlug = getExploreFor(neighbors, canonicalSlug);
      const shownSlugs = new Set(items.map(r => r.slug));

      // Launch cohort gate: Only show explore link if slug is launch-eligible
      if (exploreSlug && !shownSlugs.has(exploreSlug) && isOfferLaunchEligible(exploreSlug)) {
        const exploreWhop = await prisma.deal.findFirst({
          where: {
            slug: exploreSlug,
            // Filter out GONE pages to prevent 404s
            NOT: {
              retirement: 'GONE'
            }
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

        if (exploreWhop) {
          explore = {
            slug: normalizeSlug(exploreWhop.slug), // Ensure canonical slug
            name: exploreWhop.name,
            logo: exploreWhop.logo,
            blurb: getSecondSentence(exploreWhop.aboutContent) || exploreWhop.description,
            category: exploreWhop.category ?? undefined,
            rating: exploreWhop.rating,
            ratingCount: exploreWhop._count?.Review ?? 0
          };
        }
      }
    } catch {
      // Silent fail for explore link
    }

    return { items, explore };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return { items: [], explore: null };
  }
}

/**
 * Server-side fetch for alternatives using graph neighbors
 */
export async function getAlternatives(currentOfferSlug: string): Promise<{
  items: OfferItem[];
  explore: ExploreLink | null;
}> {
  try {
    const canonicalSlug = normalizeSlug(currentOfferSlug);

    // Load graph neighbors
    const neighbors = await loadNeighbors();
    const rawAltSlugs = getNeighborSlugsFor(neighbors, canonicalSlug, 'alternatives');

    // Get recommended slugs to exclude them from alternatives (keep sections distinct)
    const recSlugs = getNeighborSlugsFor(neighbors, canonicalSlug, 'recommendations');
    const recSet = new Set(recSlugs);

    // Filter out any alternatives that appear in recommendations + launch cohort gate
    let slugs = Array.from(new Set(rawAltSlugs.filter(Boolean).filter(slug => !recSet.has(slug)).filter(isOfferLaunchEligible))).slice(0, 5);

    // Fallback: if graph has no alternatives, use category-based alternatives
    if (slugs.length === 0) {
      const currentOffer = await prisma.deal.findFirst({
        where: { slug: canonicalSlug },
        select: { category: true }
      });

      if (currentOffer?.category) {
        const excludeSlugs = [canonicalSlug, ...Array.from(recSet)];
        const categoryWhops = await prisma.deal.findMany({
          where: {
            category: currentOffer.category,
            slug: { notIn: excludeSlugs } // Exclude current whop and recommendations
          },
          select: { slug: true },
          orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
          take: 20 // Fetch more to filter by launch cohort
        });

        // Launch cohort gate: Filter to only launch-eligible slugs
        slugs = categoryWhops.map(w => w.slug).filter(isOfferLaunchEligible).slice(0, 5);
      }

      if (slugs.length === 0) {
        return { items: [], explore: null };
      }
    }

    // Fetch whop details from database - FILTER OUT GONE pages to prevent 404s
    const whops = await prisma.deal.findMany({
      where: {
        slug: { in: slugs },
        // Per ChatGPT fix: only exclude GONE pages (match whop detail page logic)
        NOT: {
          retirement: 'GONE'
        }
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
          where: {
            NOT: { id: { startsWith: 'community_' } }
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            title: true,
            type: true,
            value: true,
            code: true
          }
        }
      },
      take: 5
    });

    // Transform to expected format - use second sentence from aboutContent as blurb
    const items: OfferItem[] = whops.map(whop => ({
      id: whop.id,
      name: whop.name,
      slug: normalizeSlug(whop.slug), // Ensure canonical slug for links
      logo: whop.logo,
      description: whop.description,
      aboutContent: whop.aboutContent,
      blurb: getSecondSentence(whop.aboutContent) || whop.description,
      category: whop.category,
      price: whop.price,
      rating: whop.rating,
      ratingCount: whop._count?.Review ?? 0,
      promoCodes: whop.PromoCode || []
    }));

    // Fetch explore link
    let explore: ExploreLink | null = null;
    try {
      const exploreSlug = getExploreFor(neighbors, canonicalSlug);
      const shownSlugs = new Set(items.map(r => r.slug));

      // Launch cohort gate: Only show explore link if slug is launch-eligible
      if (exploreSlug && !shownSlugs.has(exploreSlug) && isOfferLaunchEligible(exploreSlug)) {
        const exploreWhop = await prisma.deal.findFirst({
          where: {
            slug: exploreSlug,
            // Filter out GONE pages to prevent 404s
            NOT: {
              retirement: 'GONE'
            }
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

        if (exploreWhop) {
          explore = {
            slug: normalizeSlug(exploreWhop.slug), // Ensure canonical slug
            name: exploreWhop.name,
            logo: exploreWhop.logo,
            blurb: getSecondSentence(exploreWhop.aboutContent) || exploreWhop.description,
            category: exploreWhop.category ?? undefined,
            rating: exploreWhop.rating,
            ratingCount: exploreWhop._count?.Review ?? 0
          };
        }
      }
    } catch {
      // Silent fail for explore link
    }

    return { items, explore };
  } catch (error) {
    console.error('Error fetching alternatives:', error);
    return { items: [], explore: null };
  }
}
