import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/site-origin';

// Production robots.txt for DigitalPromoCodes
// Clean sitemap references - NO blog, NO legacy routes

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/static/'],
      },
    ],
    // Single sitemap index that references all sitemaps
    sitemap: `${origin}/sitemap-index.xml`,
  };
}
