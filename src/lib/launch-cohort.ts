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
// COHORT_START
export const LAUNCH_COHORT_SLUGS = new Set<string>([
  // === CURATED LAUNCH COHORT (117 slugs) - Top Whop Affiliates ===
  // Source: data/launch-cohort-curated-101.json + top-100-rewritten-content.json (first 20)
  // Applied: 2025-12-16, Updated: 2026-01-08
  '-silver-tier-fyndit',
  '4orte-tiktok-upgrade',
  'ace-of-trades-',
  'ai-news-bot',
  'alertsify',
  'american-dream-mentorship',
  'amnotify-japan-renewal',
  'anonymous-sport-bets',
  'ascent-repricer',
  'beat-the-books',
  'bet-bettor-weekly',
  'betmagic-pro-membership',
  'blastoises-premium',
  'boka-trading-premium',
  'boosted-betz-premium',
  'bullish-bandits',
  'chart-hackers-pay-with-crypto',
  'chroma-trading',
  'coliseeprivateclub-premium',
  'creator-cartel',
  'crypto-archie-vip',
  'datawise-sports-betting',
  'deal-soldier',
  'divine-premium-access',
  'doc-prop-gold',
  'dodgys-dungeon',
  'ecom-tools-pro',
  'edu-elite-30-platinum',
  'elevate-community',
  'empire-sports',
  'enrich-trades-blueprint',
  'flash-fund-premium',
  'flipalert-membership-usa',
  'freecash-premium',
  'frugal-season',
  'full-port-university-annual',
  'gg33-enlightened-academy',
  'glo-sports-chat',
  'goat-sports-bets-membership',
  'grindlife-plays',
  'heatseeker-access',
  'hidden-society-trading',
  'hobbyist-collective-membership',
  'hold-my-hand-wholesale-pass',
  'house-of-resell',
  'house-of-stimms-vip',
  'jdub-trades-premium',
  'larrys-lounge-premium',
  'limitless-rei-wholesale',
  'lowkey-discord-membership',
  'lunch-money-membership',
  'market-fluidity-university',
  'mc-sports-premium',
  'media-metas',
  'meme-mafia',
  'miles-high-club-crypto-pay',
  'mogul-stock-group-premium',
  'momentum-monthly',
  'moon-trades-lifetime',
  'ndotdiab-vip-access',
  'new-age-trading-premium',
  'nextwave-indicators',
  'ofm-empire-vip-full-access',
  'owls-full-access',
  'parlay-minds-premium',
  'parlayscience-discord-access',
  'peloswing-premium-access',
  'pj-trades-premium',
  'pokefinder',
  'polar-chefs-premium',
  'potion-discord-access-crypto',
  'potion-tracker-whale',
  'profit-pioneers',
  'propbet-mafia',
  'propfellas-vip',
  'resale-radar-discord',
  'resellers-paradise-premium',
  'scalboost-club',
  'scarface-trades-premium',
  'sharpmoney-all-access-vip',
  'shocked-crypto-payments',
  'skyridge-toolbox',
  'sourced-betting-bots',
  'stellar-aio',
  'stock-talk-insiders',
  'tailored-trades-premium',
  'the-haven',
  'the-options-cartel-full-access',
  'the-sweepers-vip',
  'the-yard-dropship-mastermind',
  'ticket-broker-u-pro',
  'titans-algo-pro',
  'tms-1-on-whop',
  'tms-heavy-hitters-',
  'trade-with-insight-pro',
  'unity-academy-membership',
  'vulture',
  'wealth-group-crypto-pay',
  'your-first-dollar',
  'zth-player-accelerator',
  'zzz-money-club-vip',
  // === EXPANDED BATCH (45 slugs) - High-Value Rewritten Content ===
  // Updated: 2026-01-13
  // Note: 5 slugs deleted from Whop (korvato-gold-rush, metatradingai, alliance-group-coaching, growthopia-fz-llc, liv-cam-paid)
  'airbnb-empire-builder',
  'm1-capital-accelerator',
  'the-8-figure-masterclass',
  'daniel-g-hubzome-lda-speaking',
  'minotaur-consulting-services',
  'omnifunds',
  'million-dollar-brand-club',
  'global-wealth-mentorship',
  'asgard-bootcamp',
  'youtube-consulting',
  'lifetime-diamond-package-',
  '200k-500k-challenge',
  'lux-nomads-essentials',
  'innova-trade-ai',
  'devvy',
  // === NEW ADDITIONS (30 slugs) - 2026-01-13 ===
  'sober-living-riches',
  'optinsio',
  'fes-bootcamp',
  'the-only-system-you-need',
  'jlu-637',
  'platinum-tier-fast-action',
  'real-business-solutions',
  'royalty-hero-elite',
  'elite-coaching-academy',
  'arbitrage-society',
  'ttw-inner-circle',
  'daniel-g-x-d2d-con',
  'daniel-g-x-alkaline-electric',
  'capital-funding-accelerator',
  'skillset-solutions',
  'springboard-to-wealth',
  'riverz-marketing',
  'wall-street-academy',
  'leadconsulting-ai',
  'tms-spartan-ai-bot',
  'great-energy-capital',
  'just-funded',
  'acquisition-network-',
  'agency-partner-package',
  'wholesale-to-millions',
  'the-trading-apprentice',
  'career-evolved',
  'lux-nomads-vip',
]);
// COHORT_END

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
