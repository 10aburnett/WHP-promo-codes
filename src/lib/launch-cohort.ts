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
  // === HARDENED LAUNCH COHORT (200 slugs) - Generated 2025-12-13 ===
  // Criteria: has promo code, retired=false, retirement=NONE
  // Filters: length >= 8, tokens >= 2, no generic-only slugs, no denylist
  // Sorted alphabetically, deduped
  '4orte-tiktok-upgrade',
  '60-day-ab-strength-for-golfers',
  'agency-blueprint',
  'ai-news-bot',
  'amazon-fba-mastery',
  'anonymous-traders',
  'archetype-premium',
  'attention-economy-club',
  'baseline-bets',
  'big-tick-energy-premium',
  'blw-master-app',
  'brand-partnership-blueprint',
  'bronze-package',
  'bullfrogs-investment-community',
  'cash-it-betting-vip',
  'catalyst-culture-membership',
  'ceo-trades-lifetime-access',
  'chart-hackers-pay-with-crypto',
  'chroma-trading',
  'clube-de-membros-vip',
  'collectables-reselling',
  'cookin-crew',
  'creator-blueprint',
  'credit-elevation-program',
  'crown-crypto-premium',
  'crypto-hungary-market-maker',
  'crypto-rich-vip',
  'currency-creators-vip',
  'datawise-sports-betting',
  'desarrollo-exponencial',
  'digital-wealth-simplified',
  'dms-picks',
  'dreamsbets-vip',
  'dres-playbook',
  'drop-oclock-membership',
  'dtr-trading',
  'easy-ways-to-bet',
  'elevate-community',
  'elite-coaches-community',
  'elite-squad-network',
  'elitetradingsnipers-20',
  'envelope-business-deposit',
  'envxys-kingdom',
  'etu-100rr-advanced-course',
  'euphoric-trading-vip',
  'exclusive-live-bet-chat',
  'executive-chef',
  'fba-accelerator-course',
  'fc-trading-lab',
  'fit-girl-workouts-program',
  'flipping-to-freedom-full-offer',
  'flipping-to-freedom-lego',
  'fte-model',
  'fulfilledby-group-a2a-bots',
  'full-coaching-community',
  'fvg-mindful-trading-pro',
  'galaxia-etu',
  'gamblers-paradise-prem',
  'gemini-trading-indicator',
  'gencorp-trading',
  'global-trade-empire-vip',
  'gnotz-algo-on-tradingview',
  'god-backdoor-membership',
  'golden-goat-trading',
  'got-lockz',
  'guitar-mastery',
  'h1-to-m5-model',
  'hammer-investments-guarantee',
  'hermes-sneaker-reselling',
  'hobbyist-collective-membership',
  'i-am-trading-standard',
  'iblv-live',
  'iblv-trading-vip-discord',
  'indelible-patrons',
  'inner-circle-academy',
  'ivolution-trading',
  'jarvis-alerts',
  'jokers-hideout',
  'jomos-trades',
  'justpips-trading',
  'kenny-trades',
  'kingdom-business-ventures',
  'kodas-prop-picks',
  'kryptoknowledge-alpha',
  'ku2z-king',
  'kurlyfries-vip-access',
  'learn-how-to-trade-with-me',
  'learn-with-ibrahim',
  'legerity-trading-membership',
  'legup-picks',
  'limitless-rei-wholesale',
  'line-snipers-membership',
  'live-trading-gold-monthly',
  'locking-profits-premium',
  'lunch-money-membership',
  'lune-trading-pro',
  'madmoney-trading',
  'major-wagers',
  'maxs-premium-access',
  'media-metas-clips',
  'membresa-clsica-zero',
  'membresia-boletos',
  'merkabah-13',
  'mikkjo-trading-vip',
  'mind-of-khan-free-community',
  'minted-monthly-access',
  'minted-yearly-access-crypto',
  'mirror-tradinglifetime',
  'mobile-money-university',
  'mogul-builder',
  'monthly-elites-itm',
  'mr-wicks-discord',
  'new-trader-boot-camp-0625',
  'novo-legacy-trading-vip',
  'nycalert-pass',
  'occam-trading-group',
  'ofm-empire-trends-vip',
  'ofm-empire-vip-full-access',
  'ogs-private',
  'on-brand',
  'one-trade-system',
  'options-pro-club',
  'overman-group',
  'owls-options-traders-twitter',
  'papapickz-money-making',
  'papecheck-picks-premium',
  'parlay-minds-premium',
  'parlayxpapi-props',
  'payout-palace-picks',
  'pbg-consultation-silver',
  'phantom-picks',
  'picxys-premium',
  'pingted-mois-super',
  'platinum-vip-ai-sports-picks',
  'player-props-vip',
  'plugged-inn-weekly-access',
  'potion-tracker-starter',
  'primepicks-premium-free-trial',
  'profit-house-trading-group',
  'profit-pioneers',
  'pure-trading-ventures',
  'quantumresearch-systems',
  'rainbowalgo-monthly-access',
  'relicusroad-pro-bundle',
  'risen-consulting-coaching',
  'rja-accelerator-eur',
  'rl-labs-premium',
  'road-to-millions-vip',
  'royal-british',
  'scarface-trades-premium',
  'sharp-slips-all-access',
  'sharpshooters-sports-picks',
  'shortkingbets-vip',
  'soccer-slips-premium',
  'social-university',
  'sovo-network',
  'sports-betting-theory',
  'stupid-simple-devs',
  'sushi-fnf-access-options',
  'swush-trading-premium',
  'system-based-betting',
  'tailored-trades-premium',
  'th-picks',
  'the-ai-space',
  'the-art-of-financing',
  'the-crypto-collective-premium',
  'the-floor-signals-chat',
  'the-interstellar-2',
  'the-lock-talk-long-term',
  'the-outlet-premium',
  'the-shein-ambassador-program',
  'the-trade-syndicate',
  'thooth-pings',
  'ticket-broker-u-pro',
  'tonafba-wholesale-program',
  'trade-bandit-elite',
  'trade-copy-service-only',
  'trader-capital-premium',
  'traderade-premium-service',
  'traders-roadmap-premium',
  'trading-levels-algo-basic',
  'trading-louis-live-stream',
  'trend-fusion-algo-with-discord',
  'umbrella-vip-picks',
  'us30-indicator',
  'velaris-trading-de',
  'vinted-plug-abonnement-goat',
  'vip-club-membership-tier',
  'vip-money-millionaires',
  'vito-commercis-free-community',
  'volaris-learn-how-to-use-ai',
  'wall-street-jd',
  'waynes-pivots-pro',
  'win-with-alex-discord-vip',
  'wva-advanced-coaching-program',
  'z1-capital-membership',
  'zapify-amazon-oawholesale',
  'zeddy-lockz-monthly-premium',
  'zeiierman-all-inclusive',
  'zth-player-accelerator',
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
