/**
 * Launch Cohort Allowlist
 *
 * Controls which offer pages are publicly accessible during phased rollout.
 * When LAUNCH_MODE is enabled, only slugs in LAUNCH_COHORT_SLUGS will render.
 * All other slugs return real 404s (not noindex, not redirects).
 *
 * Usage:
 * - Set NEXT_PUBLIC_LAUNCH_MODE=cohort in .env to enable gating
 * - Add slugs to LAUNCH_COHORT_SLUGS set below
 * - Use isOfferLaunchEligible(slug) to check eligibility
 */

/**
 * When true, only offers in LAUNCH_COHORT_SLUGS are accessible.
 * When false (default), all offers behave normally.
 */
export const LAUNCH_MODE = process.env.NEXT_PUBLIC_LAUNCH_MODE === 'cohort';

/**
 * Set of slugs that are eligible to be shown during launch.
 * These should be high-quality offers with real promo codes.
 *
 * Target: ~200 offers for initial launch cohort.
 */
export const LAUNCH_COHORT_SLUGS = new Set<string>([
  // === TEMPORARY TEST SLUGS (10) - Replace with real cohort ===
  // These are placeholder slugs for testing the gating mechanism
  // TODO: Replace with actual 200 high-quality slugs from DB export
  'high-ticket-incubator',
  'korvato',
  'vibe-coding',
  'ai-video-labs',
  'penny-stock-mafia',
  'goldboys-gold',
  'real-af-ai-club',
  'deal-flip-formula-main',
  'ayecon-academy-monthly-mentorship',
  'seceda-alerts',
]);

/**
 * Check if an offer slug is eligible to be shown.
 *
 * @param slug - The offer slug to check (should be lowercase/canonical)
 * @returns true if offer should be rendered, false if it should 404
 */
export function isOfferLaunchEligible(slug: string): boolean {
  // When launch mode is off, everything is eligible (normal behavior)
  if (!LAUNCH_MODE) return true;

  // When launch mode is on, only cohort slugs are eligible
  return LAUNCH_COHORT_SLUGS.has(slug.toLowerCase());
}

/**
 * Get the count of offers in the launch cohort.
 * Useful for logging/debugging.
 */
export function getLaunchCohortCount(): number {
  return LAUNCH_COHORT_SLUGS.size;
}

/**
 * Check if launch mode is currently active.
 * Useful for conditional logic in components.
 */
export function isLaunchModeActive(): boolean {
  return LAUNCH_MODE;
}
