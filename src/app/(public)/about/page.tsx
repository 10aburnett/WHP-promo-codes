import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteOrigin } from '@/lib/site-origin';
import { SITE_BRAND, SITE_DESCRIPTION } from '@/lib/brand';

// SSG configuration
export const dynamic = 'force-static'
export const fetchCache = 'force-cache'
export const revalidate = 86400 // 24h

const title = `About ${SITE_BRAND} - Verified Promo Codes & Digital Product Discounts`;
const description = `Learn about ${SITE_BRAND} - ${SITE_DESCRIPTION} We curate 8,000+ verified listings with daily updates.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: 'about us, deals, discount codes, digital course discounts, affiliate, course reviews, verified offers',
  alternates: {
// PHASE1-DEINDEX:     canonical: `${siteOrigin()}/about`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    }
  },
  openGraph: {
    title,
    description,
    url: `${siteOrigin()}/about`,
    type: 'website',
    siteName: SITE_BRAND,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function AboutPage() {
  const origin = siteOrigin();

  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${origin}#org`,
            name: SITE_BRAND,
            url: origin,
            logo: `${origin}/logo.png`,
            contactPoint: { "@type": "ContactPoint", contactType: "customer service", url: `${origin}/contact` }
          })
        }}
      />

      <div className="min-h-screen py-16 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
        <div className="mx-auto w-[90%] md:w-[95%] max-w-[1100px]">

          {/* Left-aligned Hero */}
          <header className="mb-16">
            <span
              className="inline-block text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: 'rgba(22, 101, 52, 0.08)', color: 'var(--accent-color)' }}
            >
              About DigitalPromoCodes
            </span>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
              Verified savings for digital products
            </h1>
            <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              We aggregate and verify promotional offers across digital products, courses, and communities — providing accurate pricing and transparent affiliate disclosure.
            </p>
          </header>

          {/* Two-column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16 mb-20">

            {/* LEFT: Mission Narrative */}
            <div className="space-y-8">
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Finding legitimate discounts for digital products can be time-consuming. Promo codes expire, terms change, and many listings are outdated or inaccurate. We created {SITE_BRAND} to solve this problem.
              </p>

              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Our team maintains one of the largest collections of verified digital product offers online. Each listing includes current pricing, applicable discounts, and straightforward product summaries — updated daily.
              </p>

              {/* Horizontal Mission Banner */}
              <div
                className="flex items-center gap-4 py-5 px-6 mt-8"
                style={{ backgroundColor: 'var(--background-secondary)' }}
              >
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6" style={{ color: 'var(--accent-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Our mission</span>
                  <p className="text-base font-medium" style={{ color: 'var(--text-color)' }}>
                    Make digital product pricing more transparent and accessible.
                  </p>
                </div>
              </div>

              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                We operate as independent affiliates. When you purchase through our links, we may earn a commission at no additional cost to you. This model allows us to maintain the site and continue verifying offers.
              </p>
            </div>

            {/* RIGHT: Stats & Values Rail */}
            <aside className="space-y-6">
              <div className="py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-5 h-5" style={{ color: 'var(--accent-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Database</span>
                </div>
                <p className="text-2xl font-semibold" style={{ color: 'var(--text-color)' }}>8,000+ listings</p>
              </div>

              <div className="py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-5 h-5" style={{ color: 'var(--accent-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Updates</span>
                </div>
                <p className="text-2xl font-semibold" style={{ color: 'var(--text-color)' }}>Daily verification</p>
              </div>

              <div className="py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-5 h-5" style={{ color: 'var(--accent-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Accuracy</span>
                </div>
                <p className="text-2xl font-semibold" style={{ color: 'var(--text-color)' }}>Verified codes</p>
              </div>

              <div className="py-4">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-5 h-5" style={{ color: 'var(--accent-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Transparency</span>
                </div>
                <p className="text-2xl font-semibold" style={{ color: 'var(--text-color)' }}>Clear disclosure</p>
              </div>
            </aside>
          </div>

          {/* Numbered Timeline: What Sets Us Apart */}
          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-8" style={{ color: 'var(--text-color)' }}>
              How we operate
            </h2>

            <div className="relative pl-8">
              {/* Vertical line */}
              <div
                className="absolute left-[11px] top-2 bottom-2 w-px"
                style={{ backgroundColor: 'var(--border-color)' }}
              />

              <div className="space-y-8">
                {/* Item 1 */}
                <div className="relative">
                  <div
                    className="absolute -left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
                  >
                    1
                  </div>
                  <h3 className="text-base font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                    Comprehensive aggregation
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    We collect promotional offers from digital product creators, course platforms, and online communities.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="relative">
                  <div
                    className="absolute -left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
                  >
                    2
                  </div>
                  <h3 className="text-base font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                    Daily verification
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Our systems check code validity and pricing accuracy to remove expired or incorrect listings.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="relative">
                  <div
                    className="absolute -left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
                  >
                    3
                  </div>
                  <h3 className="text-base font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                    Transparent presentation
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Each listing includes product summaries, current pricing, and clear affiliate disclosure.
                  </p>
                </div>

                {/* Item 4 */}
                <div className="relative">
                  <div
                    className="absolute -left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
                  >
                    4
                  </div>
                  <h3 className="text-base font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                    Community contributions
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Users can submit promo codes they discover, which we verify before adding to the database.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Links */}
          <footer className="pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Questions or feedback? We're here to help.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                href="/contact"
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: 'var(--accent-color)' }}
              >
                Contact us <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: 'var(--accent-color)' }}
              >
                Read our insights <span aria-hidden="true">→</span>
              </Link>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}
