import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

export async function GET() {
  try {
    // Read the sitemap-index.xml from public folder
    const sitemapPath = join(process.cwd(), 'public', 'sitemap-index.xml');
    const content = readFileSync(sitemapPath, 'utf-8');

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    // Fallback: redirect to sitemap-index.xml
    return NextResponse.redirect(new URL('/sitemap-index.xml', 'https://digitalpromocodes.com'), 301);
  }
}
