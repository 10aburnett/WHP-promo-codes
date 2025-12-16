/**
 * Centralized promo label logic
 *
 * Rule:
 * - If a valid percent discount exists (1-99): show "{percent}% Off"
 * - Otherwise: show "Special Access"
 *
 * Never show "Exclusive Access" - use "Special Access" consistently.
 */

export interface PromoLabelInput {
  discountPercent?: number | null;
  promoValue?: number | string | null;
  promoText?: string | null;
  promoTitle?: string | null;
}

/**
 * Extract percent discount from various input sources
 */
export function extractPercentOff(input: PromoLabelInput): number | null {
  // Try discountPercent first
  if (typeof input.discountPercent === 'number' && input.discountPercent > 0 && input.discountPercent <= 100) {
    return input.discountPercent;
  }

  // Try promoValue
  if (typeof input.promoValue === 'number' && input.promoValue > 0 && input.promoValue <= 100) {
    return input.promoValue;
  }

  // Try parsing promoValue as string
  if (typeof input.promoValue === 'string') {
    const parsed = parseInt(input.promoValue, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 100) {
      return parsed;
    }
  }

  return null;
}

/**
 * Get the primary promo label for display
 * Returns pill text and subtitle text
 */
export function getPrimaryPromoLabel(input: PromoLabelInput): { pill: string | null; subtitle: string } {
  const pct = extractPercentOff(input);

  if (pct && pct > 0) {
    return {
      pill: `${pct}% OFF`,
      subtitle: `${pct}% Off`,
    };
  }

  return {
    pill: null, // No pill for non-percent offers
    subtitle: 'Special Access',
  };
}

/**
 * Get discount badge text for card meta strip
 * Returns the badge text or null if no badge should be shown
 */
export function getDiscountBadge(input: PromoLabelInput): string | null {
  const pct = extractPercentOff(input);

  if (pct && pct > 0) {
    return `${pct}% off`;
  }

  // For non-percent offers, show "Special Access" as the badge
  return 'Special Access';
}

/**
 * Get badge text for OfferCardLink (recommendations/alternatives)
 * Same logic as getDiscountBadge but with consistent formatting
 */
export function getOfferBadgeText(input: PromoLabelInput): string {
  const pct = extractPercentOff(input);

  if (pct && pct > 0) {
    return `${pct}% Off`;
  }

  return 'Special Access';
}
