import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/brand';

// Production robots.txt for DigitalPromoCodes
// Env-based: blocks indexing on non-production Vercel deployments (preview, dev aliases)
// Uses VERCEL env vars which are available at build time - no dynamic needed

export default function robots(): MetadataRoute.Robots {
  // VERCEL === '1' on all Vercel deployments
  // VERCEL_ENV === 'production' only on production deployment
  const isVercelPreview = process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'production';

  // Block indexing of all non-production Vercel deployments (preview + dev aliases)
  if (isVercelPreview) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      // No sitemap on preview - prevents accidental discovery
    };
  }

  // Production deployment: allow crawl + point sitemap to canonical domain
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/static/'],
      },
    ],
    // Always use canonical domain for sitemap
    sitemap: `${SITE_URL}/sitemap-index.xml`,
  };
}
