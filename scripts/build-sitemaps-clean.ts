/**
 * CLEAN SITEMAP GENERATOR
 *
 * Generates ONLY these files:
 * - public/sitemap-offers.xml (exactly 101 /offer/<slug> URLs in launch mode)
 * - public/sitemap-static.xml (hardcoded allowlist of static routes)
 * - public/sitemap-index.xml (references only the above two)
 *
 * NO blog sitemap.
 * NO noindex sitemap.
 * NO legacy /whop/ routes.
 * NO chunked sitemaps.
 * NO dynamic discovery of static routes.
 *
 * This is the CANONICAL sitemap generation script for digitalpromocodes.com launch.
 */

import { PrismaClient } from '@prisma/client';
import { writeFileSync, rmSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

// === CONFIGURATION ===
const SITE_URL = 'https://digitalpromocodes.com';
const EXPECTED_COHORT_COUNT = 101;

// === STATIC ROUTES ALLOWLIST ===
// These are the ONLY static routes that will be included in the sitemap.
// NO BLOG. NO /whop/. NO dynamically discovered routes.
// NOTE: /offers is intentionally EXCLUDED - noindex hub during launch phase.
// Revisit in 4-6 weeks once individual pages have authority.
const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  // /offers excluded - noindex hub page, revisit post-launch
  { path: '/privacy', priority: 0.5, changefreq: 'yearly' },
  { path: '/terms', priority: 0.5, changefreq: 'yearly' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },
];

// === COHORT SLUGS (101 curated offers) ===
// Source: data/launch-cohort-curated-101.json (CANONICAL)
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

function assertNoBadUrls(urls: string[]): void {
  for (const url of urls) {
    if (url.includes('/whop/')) {
      throw new Error(`FATAL: URL contains /whop/: ${url}`);
    }
    if (url.includes('/blog/')) {
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
  const legacyPatterns = [
    'sitemap-whops',
    'blog.xml',
    'noindex.xml',
    'index-1.xml',
    'gone.xml',
  ];

  const files = existsSync(publicDir) ? readdirSync(publicDir) : [];
  const sitemapsDir = join(publicDir, 'sitemaps');
  const sitemapFiles = existsSync(sitemapsDir) ? readdirSync(sitemapsDir) : [];

  const allFiles = [...files, ...sitemapFiles];

  for (const file of allFiles) {
    for (const pattern of legacyPatterns) {
      if (file.includes(pattern)) {
        throw new Error(`FATAL: Legacy sitemap file exists: ${file}`);
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
  const legacyFiles = [
    'sitemap.xml',
    'sitemap-index.xml',
    'sitemap-whops-1.xml',
    'sitemap-static.xml',
    'sitemap-offers.xml',
    'sitemap-blog.xml',
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

  // Step 6: Generate sitemap index
  console.log('📝 Generating sitemap-index.xml...');

  const sitemapIndex = generateSitemapIndex([
    `${SITE_URL}/sitemap-offers.xml`,
    `${SITE_URL}/sitemap-static.xml`,
  ]);

  writeFileSync(join(publicDir, 'sitemap-index.xml'), sitemapIndex);
  console.log('   ✅ Generated sitemap-index.xml referencing 2 sitemaps\n');

  // Step 7: Final assertions
  console.log('🔒 Running final assertions...');
  assertNoLegacyFiles(publicDir);
  console.log('   ✅ No legacy sitemap files found\n');

  // Step 8: Summary
  console.log('═══════════════════════════════════════');
  console.log('✅ CLEAN SITEMAP GENERATION COMPLETE');
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log('Generated files:');
  console.log(`  • public/sitemap-index.xml (2 sitemaps)`);
  console.log(`  • public/sitemap-offers.xml (${offerEntries.length} URLs)`);
  console.log(`  • public/sitemap-static.xml (${staticEntries.length} URLs)`);
  console.log('');
  console.log('NOT generated (by design):');
  console.log('  • NO blog sitemap');
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
