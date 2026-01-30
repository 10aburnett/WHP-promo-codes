/**
 * CLEAN SITEMAP GENERATOR
 *
 * Generates these files:
 * - public/sitemap-offers.xml (exactly 121 /offer/<slug> URLs in launch mode)
 * - public/sitemap-static.xml (hardcoded allowlist of static routes)
 * - public/sitemap-blog.xml (published blog posts)
 * - public/sitemap.xml (index referencing the above)
 *
 * NO noindex sitemap.
 * NO legacy /whop/ routes.
 * NO chunked sitemaps.
 * NO dynamic discovery of static routes.
 *
 * This is the CANONICAL sitemap generation script for whoppromocodes.com launch.
 */

import { PrismaClient } from '@prisma/client';
import { writeFileSync, rmSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

// === CONFIGURATION ===
const SITE_URL = 'https://whoppromocodes.com';
const EXPECTED_COHORT_COUNT = 362;

// === STATIC ROUTES ALLOWLIST ===
// These are the ONLY static routes that will be included in the sitemap.
// NO BLOG. NO /whop/. NO dynamically discovered routes.
// NOTE: /offers is intentionally EXCLUDED - noindex hub during launch phase.
// Revisit in 4-6 weeks once individual pages have authority.
const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  // /offers excluded - noindex hub page, revisit post-launch
  { path: '/privacy', priority: 0.5, changefreq: 'yearly' },
  { path: '/terms', priority: 0.5, changefreq: 'yearly' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },
  { path: '/submit', priority: 0.7, changefreq: 'monthly' },
  { path: '/how-to-redeem', priority: 0.6, changefreq: 'monthly' },
];

// === COHORT SLUGS (121 curated offers) ===
// Source: data/launch-cohort-curated-101.json + top-100-rewritten-content.json (first 20)
const LAUNCH_COHORT_SLUGS = [
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
  // === EDITORIAL REVIEWS BATCH (42 slugs) - 2026-01-16 ===
  'the-godspeed-growth-system',
  'section-8-cartel',
  'affiniti-flow',
  'swayer',
  'listing-agent-accelerator',
  'airflow',
  'sovereign-man',
  'momentum-circle',
  'fernpicks-diamond-package',
  'qa-automation-job-interviews',
  'tech-sales-job-interviews',
  'osa-gold-program',
  'the-ai-incubator',
  'acquisition-ace',
  'learn-minerals',
  'locatelli-acquisition',
  'data-engineer-academy-fin',
  'baller-package',
  'the-high-ticket-ecom-program',
  'electrin-group',
  'consulting-utopia-dfy',
  'fit-n-healthy',
  'ai-profit-lab',
  'formula-6',
  'ayecon-academy-lifetime-membership',
  'mdbc-tiktok-hop',
  'amazon-inner-circle',
  'the-real-sales-academy',
  'digital-creator-university',
  'gold-tier',
  'exclusive-calls',
  'beyond-clinical-care',
  'info-scaler',
  'diagofit',
  'goodlife-brand-accelerator',
  'accelerator-program',
  'inovate',
  'learn-airbnb-arbitrage',
  'sickboytrades-mentorship',
  'the-black-room',
  'tiktok-shop-accelerator',
  '7th-level-community',
  // === EDITORIAL REVIEWS BATCH 2 (67 slugs) - 2026-01-19 ===
  '1-on-1-coaching',
  '1of1locks',
  '360-sales-agency',
  '4everpaidbets',
  'accs-bot-vinted',
  'ai-for-pros',
  'aj-trading',
  'alex-crypto-universe',
  'alminmilanovic',
  'amazon-aco',
  'betwithhaddy',
  'bullprooftrading-strategy',
  'bullstocks',
  'businessgrowr-aaf-dfy-setup',
  'capital-44-elite-group',
  'cc-compass',
  'cdr-premium-betting',
  'chaos-indicator-for-trading',
  'cisero-ai',
  'coaching-by-brian',
  'creativeforge',
  'credit-repair-balance-2nd-pay',
  'criscklukks-whop',
  'dcoptions',
  'ddu-online-services-agency-4',
  'degen-vip',
  'delux',
  'dialos-major-league-profits',
  'diontrades',
  'dm-setting',
  'domsprops',
  'dubai-plug',
  'earnit-media',
  'essentials-to-trading',
  'falco-queue-buster',
  'flipflip-membership-og',
  'flipseek',
  'flxpickz-premium',
  'forked-creatives',
  'founders-arm',
  'freedom-team-mentorship',
  'freedomers',
  'future-founders-club',
  'game-changer-premium',
  'ghost-inner-circle',
  'glitchybets',
  'high-ticket-incubator',
  'hooksquare-contractors',
  'iced-investments-subscription',
  'infoprosio',
  'institutional-trading',
  'intensevalue',
  'inventory-insiders',
  'jlgrowth',
  'juiced-bets-vip-discord',
  'locks-together-premium',
  'master-your-money',
  'opusmagna-trading',
  'resistance',
  'saas-university',
  'steal-my-agency',
  'tennisxpert-premium',
  'the-locksmiths-hq',
  'traders-accelerator',
  'uncle-shaundys-trading-den',
  'zeus-bets',
  'zoom-trading-vip',
  // === EDITORIAL REVIEWS BATCH 3 (9 slugs) - 2026-01-22 ===
  'resell-radar',
  'tradialy',
  'pikes-peak-trades-advantage',
  'wave-maestro',
  'remote-riches',
  'opc-all-plays',
  'sigmavue',
  'exotic-fleet-formula',
  'canary-chain',
  // === PROMO CODE BATCH 1 (100 slugs) - 2026-01-29 ===
  'speed-ramp-from-a-to-z',
  '1-month-premium',
  '1-of-1-traders-full-access',
  '1-month-access-vipparlay-king',
  '1-on-1-mentorship-lifetime',
  '100-creative',
  '10kto50k-challenge-elite-plan',
  '1',
  '3-days-free-luxury-picks',
  '3-leaf-clover',
  '333picks',
  '3m-trading-vip-group-access',
  '4-leaf-clover',
  '6-figure-wash-system',
  '60-day-ab-strength-for-golfers',
  'itsbucketsnba-vip-telegram',
  'a-z-trading-guide-',
  'aa-trading',
  'ad-plus',
  'adt-diamond-lifetime',
  'adt-vip-gold-complete',
  'aementorship-basic-mentorship',
  'ai-fusion-megapack',
  'ai-signals-premium',
  'alive-trades-alliance-ata',
  'am-elites-premium',
  'amzshifu-university',
  'ape-trading',
  'apex-fitness-and-mind-mastery',
  'ar-trades',
  'archetype-premium',
  'atm-picks-pass',
  'abhey-takes-down-vegas-free',
  'acesso-alpha',
  'advanced-english-community',
  'agency-blueprint',
  'agency-domain',
  'algo28-day-trading-signals',
  'algobot-premium',
  'algorithmic-trading-blueprint',
  'all-access',
  'all-access-vip',
  'all-in-one-indicator-package',
  'alpha-market-pro',
  'amazon-fba-mastery',
  'amazon-fba-success-network',
  'american-dream-trading-crypto',
  'american-dream-trading-futures',
  'american-dream-trading-premium',
  'angelo-props-bread-winners',
  'anonymous-traders',
  'arbitrage-alley-pro',
  'ashleydoubles-community',
  'attention-economy-club',
  'aura-picks-vip',
  'aura-picks-vip-pass',
  'ayecon-academy-monthly-mentorship',
  'bankroll-bros-weekly',
  'bfx-signals',
  'blw-master-app',
  'ballerpicks-vip',
  'baseline-bets',
  'basic-plan',
  'basic-trading-mentorship',
  'beamly-hyper-growth',
  'best-of-both-worlds',
  'bet-sports-daily',
  'betdubs-premium',
  'betropolis-vip-esports-bot',
  'betting-central-101',
  'bettorprocess-member',
  'big-tick-energy-premium',
  'bigjoebets',
  'bigplaynate-monthly-gl',
  'blackhawk-indicator',
  'blackwolftrading',
  'blastoises-lifetime-premium',
  'blitzersports-vip',
  'blockchain-bureau-apprentice',
  'bobbys-bets-sports-analytics',
  'bookie-breakers-vip',
  'boominati-io-membership',
  'bors-trading-premium',
  'brand-leverage-blueprint',
  'brand-partnership-blueprint',
  'braver-crypto-vip',
  'bronze-package',
  'build-your-brand-ecom-coaching',
  'build-your-first-app-with-ai',
  'bulhaven-trading-group',
  'bullfrogs-investment-community',
  'caa-itin-forensic-training',
  'ccs-collectibles',
  'ceo-trades-lifetime-access',
  'clean-sweeps-vip',
  'cms-basic-ta-course',
  'cms-vip',
  'cryptowzrd',
  'cali-betz',
  'caps-7-day-package',
];

// === XML GENERATION HELPERS ===

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateUrlEntry(url: string, lastmod: string, changefreq: string, priority: number): string {
  return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function wrapUrlset(entries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;
}

function generateSitemapIndex(sitemaps: string[]): string {
  const now = new Date().toISOString();
  const entries = sitemaps.map(url => `  <sitemap>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>`;
}

// === ASSERTIONS ===

// Locale pattern to detect locale-prefixed paths (EN-only invariant)
const LOCALE_PATH_PATTERN = /\/(en|es|fr|de|it|pt|nl|zh|ja|ko|ru|ar)\//i;

function assertNoBadUrls(urls: string[], allowBlog = false): void {
  for (const url of urls) {
    if (url.includes('/whop/')) {
      throw new Error(`FATAL: URL contains /whop/: ${url}`);
    }
    if (!allowBlog && url.includes('/blog/')) {
      throw new Error(`FATAL: URL contains /blog/: ${url}`);
    }
    if (url.includes('?')) {
      throw new Error(`FATAL: URL contains query string: ${url}`);
    }
    if (url.endsWith('/') && url !== `${SITE_URL}/`) {
      throw new Error(`FATAL: URL has trailing slash: ${url}`);
    }
    // EN-only invariant: No locale prefixes in URLs
    if (LOCALE_PATH_PATTERN.test(url)) {
      throw new Error(`FATAL: URL contains locale prefix (EN-only mode): ${url}`);
    }
  }
}

function assertNoLegacyFiles(publicDir: string): void {
  // Files the script legitimately generates (whitelist)
  const allowedFiles = [
    'sitemap.xml',
    'sitemap-offers.xml',
    'sitemap-static.xml',
    'sitemap-blog.xml',
  ];

  // Exact filenames that should never exist
  const legacyExactFiles = [
    'sitemap-index.xml',
  ];

  // Prefixes - any file starting with these is legacy
  const legacyPrefixes = [
    'sitemap-whops',    // catches sitemap-whops-1.xml, sitemap-whops-2.xml, etc.
    'sitemap-noindex',  // catches sitemap-noindex.xml, sitemap-noindex-old.xml, etc.
    'sitemap-gone',     // catches any gone variants
  ];

  const files = existsSync(publicDir) ? readdirSync(publicDir) : [];

  for (const file of files) {
    // Only check sitemap files
    if (!file.startsWith('sitemap')) continue;

    // Skip files we legitimately generate
    if (allowedFiles.includes(file)) continue;

    // Check exact matches
    if (legacyExactFiles.includes(file)) {
      throw new Error(`FATAL: Legacy sitemap file found: ${file} - delete this file`);
    }

    // Check prefix matches
    for (const prefix of legacyPrefixes) {
      if (file.startsWith(prefix)) {
        throw new Error(`FATAL: Legacy sitemap file found: ${file} - delete this file`);
      }
    }
  }
}

// === MAIN ===

async function main() {
  console.log('🗺️  CLEAN SITEMAP GENERATOR');
  console.log('===========================\n');
  console.log(`Site URL: ${SITE_URL}`);
  console.log(`Expected cohort count: ${EXPECTED_COHORT_COUNT}\n`);

  const publicDir = join(process.cwd(), 'public');

  // Step 1: Clean up any legacy sitemap files first
  console.log('🧹 Cleaning up legacy sitemap artifacts...');

  // Remove public/sitemaps/ directory entirely
  const sitemapsDir = join(publicDir, 'sitemaps');
  if (existsSync(sitemapsDir)) {
    rmSync(sitemapsDir, { recursive: true });
    console.log('   Removed public/sitemaps/');
  }

  // Remove any legacy sitemap files from public/
  // Note: sitemap.xml, sitemap-static.xml, sitemap-offers.xml, sitemap-blog.xml
  // are NOT in this list because the script generates them fresh
  const legacyFiles = [
    'sitemap-index.xml',
    'sitemap-whops-1.xml',
  ];

  for (const file of legacyFiles) {
    const filepath = join(publicDir, file);
    if (existsSync(filepath)) {
      rmSync(filepath);
      console.log(`   Removed public/${file}`);
    }
  }

  console.log('');

  // Step 2: Validate cohort count
  console.log('📊 Validating cohort...');
  if (LAUNCH_COHORT_SLUGS.length !== EXPECTED_COHORT_COUNT) {
    throw new Error(`FATAL: Expected ${EXPECTED_COHORT_COUNT} slugs, got ${LAUNCH_COHORT_SLUGS.length}`);
  }
  console.log(`   ✅ Cohort has exactly ${EXPECTED_COHORT_COUNT} slugs\n`);

  // Step 3: Verify all cohort slugs exist in DB
  console.log('🔍 Verifying cohort slugs exist in database...');
  const dbDeals = await prisma.deal.findMany({
    where: {
      slug: { in: LAUNCH_COHORT_SLUGS },
      retired: false,
    },
    select: { slug: true, updatedAt: true, indexingStatus: true },
  });

  const dbSlugs = new Set(dbDeals.map(d => d.slug));
  const missingSlugs = LAUNCH_COHORT_SLUGS.filter(s => !dbSlugs.has(s));

  if (missingSlugs.length > 0) {
    console.error('   Missing from DB:', missingSlugs);
    throw new Error(`FATAL: ${missingSlugs.length} cohort slugs not found in database`);
  }
  console.log(`   ✅ All ${EXPECTED_COHORT_COUNT} slugs exist in database\n`);

  // Step 4: Generate offer sitemap
  console.log('📝 Generating sitemap-offers.xml...');
  const now = new Date().toISOString();

  // Sort by slug for determinism
  const sortedDeals = [...dbDeals].sort((a, b) => a.slug.localeCompare(b.slug));

  const offerUrls: string[] = [];
  const offerEntries: string[] = [];

  for (const deal of sortedDeals) {
    const url = `${SITE_URL}/offer/${deal.slug}`;
    offerUrls.push(url);
    offerEntries.push(generateUrlEntry(
      url,
      deal.updatedAt.toISOString(),
      'weekly',
      0.8
    ));
  }

  // Assert no bad URLs
  assertNoBadUrls(offerUrls);

  const offerSitemap = wrapUrlset(offerEntries);
  writeFileSync(join(publicDir, 'sitemap-offers.xml'), offerSitemap);
  console.log(`   ✅ Generated sitemap-offers.xml with ${offerEntries.length} URLs\n`);

  // Step 5: Generate static sitemap
  console.log('📝 Generating sitemap-static.xml...');

  const staticUrls: string[] = [];
  const staticEntries: string[] = [];

  for (const route of STATIC_ROUTES) {
    // Homepage needs trailing slash to match Google's crawled URL
    const url = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
    staticUrls.push(url);
    staticEntries.push(generateUrlEntry(
      url,
      now,
      route.changefreq,
      route.priority
    ));
  }

  // Assert no bad URLs
  assertNoBadUrls(staticUrls);

  const staticSitemap = wrapUrlset(staticEntries);
  writeFileSync(join(publicDir, 'sitemap-static.xml'), staticSitemap);
  console.log(`   ✅ Generated sitemap-static.xml with ${staticEntries.length} URLs\n`);

  // Step 6: Generate blog sitemap
  console.log('📝 Generating sitemap-blog.xml...');

  const publishedPosts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true, publishedAt: true },
    orderBy: { publishedAt: 'desc' },
  });

  const blogUrls: string[] = [];
  const blogEntries: string[] = [];

  for (const post of publishedPosts) {
    const url = `${SITE_URL}/blog/${post.slug}`;
    blogUrls.push(url);
    blogEntries.push(generateUrlEntry(
      url,
      (post.updatedAt || post.publishedAt || new Date()).toISOString(),
      'monthly',
      0.7
    ));
  }

  // Assert no bad URLs (allow blog URLs for this sitemap)
  assertNoBadUrls(blogUrls, true);

  const blogSitemap = wrapUrlset(blogEntries);
  writeFileSync(join(publicDir, 'sitemap-blog.xml'), blogSitemap);
  console.log(`   ✅ Generated sitemap-blog.xml with ${blogEntries.length} URLs\n`);

  // Step 7: Generate sitemap index (as sitemap.xml for GSC compatibility)
  console.log('📝 Generating sitemap.xml (index)...');

  const sitemapList = [
    `${SITE_URL}/sitemap-offers.xml`,
    `${SITE_URL}/sitemap-static.xml`,
  ];

  // Only include blog sitemap if there are published posts
  if (blogEntries.length > 0) {
    sitemapList.push(`${SITE_URL}/sitemap-blog.xml`);
  }

  const sitemapIndex = generateSitemapIndex(sitemapList);

  writeFileSync(join(publicDir, 'sitemap.xml'), sitemapIndex);
  console.log(`   ✅ Generated sitemap.xml referencing ${sitemapList.length} sitemaps\n`);

  // Step 8: Final assertions
  console.log('🔒 Running final assertions...');
  assertNoLegacyFiles(publicDir);
  console.log('   ✅ No legacy sitemap files found\n');

  // Step 9: Summary
  console.log('═══════════════════════════════════════');
  console.log('✅ CLEAN SITEMAP GENERATION COMPLETE');
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log('Generated files:');
  console.log(`  • public/sitemap.xml (index, ${sitemapList.length} sitemaps)`);
  console.log(`  • public/sitemap-offers.xml (${offerEntries.length} URLs)`);
  console.log(`  • public/sitemap-static.xml (${staticEntries.length} URLs)`);
  if (blogEntries.length > 0) {
    console.log(`  • public/sitemap-blog.xml (${blogEntries.length} URLs)`);
  }
  console.log('');
  console.log('NOT generated (by design):');
  console.log('  • NO noindex sitemap');
  console.log('  • NO /whop/ URLs');
  console.log('  • NO chunked sitemaps');
  console.log('');
}

main()
  .catch((e) => {
    console.error('\n❌ SITEMAP GENERATION FAILED:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
