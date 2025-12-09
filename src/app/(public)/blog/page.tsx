// @ts-nocheck
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedBlogPosts, type BlogListItem } from '@/lib/blog'
import { siteOrigin } from '@/lib/site-origin'
import { SITE_BRAND, SITE_AUTHOR } from '@/lib/brand'

// TypeScript safety: allow optional fields without altering Prisma
type BlogListItemWithDates = BlogListItem & {
  updatedAt?: Date | null;
  authorName?: string | null;
  author?: { name?: string | null } | null;
};

// SSG + ISR configuration
export const dynamic = 'force-static'
export const revalidate = 3600 // 1 hour
export const fetchCache = 'force-cache'
export const runtime = 'nodejs' // Required for Prisma

const currentYear = new Date().getFullYear()

export const metadata: Metadata = {
  title: `${SITE_BRAND} Blog - Latest Deals, Tips & Digital Product Insights ${currentYear}`,
  description: `Discover the latest deals, digital product reviews, exclusive offers, and insider tips for ${currentYear}. Stay updated with the newest discounts and insights from the world of digital products and online communities.`,
  keywords: `blog, deals ${currentYear}, digital products, online courses, communities, exclusive deals, discount tips, digital marketplace insights`,
  alternates: {
// PHASE1-DEINDEX:     canonical: `${siteOrigin()}/blog`
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
    title: `${SITE_BRAND} Blog - Latest Deals & Digital Product Insights ${currentYear}`,
    description: `Your source for the latest deals, exclusive offers, and digital product insights for ${currentYear}. Get insider tips and discover new opportunities in the digital marketplace.`,
    type: 'website',
    url: `${siteOrigin()}/blog`
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_BRAND} Blog - Latest Deals & Digital Product Insights ${currentYear}`,
    description: `Your source for the latest deals, exclusive offers, and digital product insights for ${currentYear}. Get insider tips and discover new opportunities in the digital marketplace.`
  }
}

export default async function BlogPage() {
  try {
    const posts = await getPublishedBlogPosts();

    if (!posts.length) {
      return (
        <div className="min-h-screen py-8 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
          <div className="mx-auto w-[90%] md:w-[95%] max-w-[1200px]">
            <div className="space-y-6">
              {/* Two-column hero layout */}
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)] gap-8 items-start mb-10">
                <div>
                  <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'var(--accent-color)' }}>
                    DigitalPromoCodes Insights
                  </p>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: 'var(--text-color)', lineHeight: 1.2 }}>
                    Strategies, updates & playbooks for smarter digital savings.
                  </h1>
                  <p className="text-sm md:text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                    Deep-dive guides and analysis on digital products, communities, and promo strategies from the team behind DigitalPromoCodes.
                  </p>
                </div>

                <aside
                  className="rounded-2xl border p-5 md:p-6 shadow-sm"
                  style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}
                >
                  <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                    Stay ahead of the next deal wave
                  </h2>
                  <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Occasional roundups of new digital products, top promo codes, and strategy breakdowns. No spam.
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    New posts typically ship a few times per month.
                  </p>
                </aside>
              </div>

              {/* Empty state card */}
              <div className="flex justify-center py-16">
                <div
                  className="max-w-md text-center rounded-2xl border p-8"
                  style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}
                >
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full"
                       style={{ backgroundColor: 'rgba(5,150,105,0.12)', color: 'var(--accent-color)' }}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                    No articles published yet
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    We&apos;re working on in-depth guides and case studies. Check back soon for fresh insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const origin = siteOrigin();

    // Build JSON-LD CollectionPage schema for SEO
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${SITE_BRAND} Blog`,
      description: `Latest posts and guides on deals and digital products in ${currentYear}.`,
      url: `${origin}/blog`,
      hasPart: (posts as BlogListItemWithDates[]).slice(0, 20).map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        datePublished: p.publishedAt?.toISOString?.() ?? undefined,
        dateModified: (p.updatedAt ?? p.publishedAt)?.toISOString?.() ?? undefined,
        url: `${origin}/blog/${p.slug}`,
        author: {
          '@type': 'Person',
          name: (p as any).User?.name || (p as any).authorName || SITE_AUTHOR
        }
      })),
    };

    return (
      <div className="min-h-screen py-8 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
        {/* Server-rendered JSON-LD for blog collection */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <div className="mx-auto w-[90%] md:w-[95%] max-w-[1200px]">
          <div className="space-y-8">
            {/* Two-column hero layout */}
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)] gap-8 items-start mb-10">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'var(--accent-color)' }}>
                  DigitalPromoCodes Insights
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: 'var(--text-color)', lineHeight: 1.2 }}>
                  Strategies, updates & playbooks for smarter digital savings.
                </h1>
                <p className="text-sm md:text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                  Deep-dive guides and analysis on digital products, communities, and promo strategies from the team behind DigitalPromoCodes.
                </p>
              </div>

              <aside
                className="rounded-2xl border p-5 md:p-6 shadow-sm"
                style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}
              >
                <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                  Stay ahead of the next deal wave
                </h2>
                <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Occasional roundups of new digital products, top promo codes, and strategy breakdowns. No spam.
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  New posts typically ship a few times per month.
                </p>
              </aside>
            </div>

            {/* Blog posts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(posts as BlogListItemWithDates[]).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article
                    className="group h-full rounded-2xl border p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--card-border)',
                      boxShadow: 'var(--promo-shadow)',
                    }}
                  >
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <time
                          className="text-xs uppercase tracking-wide"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : ''}
                        </time>
                        {post.pinned && (
                          <span
                            className="rounded-full px-2.5 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: 'rgba(5,150,105,0.1)',
                              color: 'var(--accent-color)',
                            }}
                          >
                            Featured
                          </span>
                        )}
                      </div>

                      <h2
                        className="text-lg md:text-xl font-semibold group-hover:opacity-90"
                        style={{ color: 'var(--text-color)' }}
                      >
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-sm line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t"
                         style={{ borderColor: 'var(--border-color)' }}>
                      <span
                        className="inline-flex items-center text-xs font-medium"
                        style={{ color: 'var(--accent-color)' }}
                      >
                        Read article
                        <svg
                          className="ml-1.5 h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.8}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="M13 5l7 7-7 7" />
                        </svg>
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        By {post.authorName ?? post.author?.name ?? 'Unknown'}
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error('Blog page load failed:', err);
    return (
      <div className="min-h-screen py-8 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
        <div className="mx-auto w-[90%] md:w-[95%] max-w-[1200px]">
          <div className="space-y-6">
            {/* Two-column hero layout (error state) */}
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)] gap-8 items-start mb-10">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'var(--accent-color)' }}>
                  DigitalPromoCodes Insights
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: 'var(--text-color)', lineHeight: 1.2 }}>
                  Strategies, updates & playbooks for smarter digital savings.
                </h1>
                <p className="text-sm md:text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                  Deep-dive guides and analysis on digital products, communities, and promo strategies from the team behind DigitalPromoCodes.
                </p>
              </div>

              <aside
                className="rounded-2xl border p-5 md:p-6 shadow-sm"
                style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}
              >
                <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                  Stay ahead of the next deal wave
                </h2>
                <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Occasional roundups of new digital products, top promo codes, and strategy breakdowns. No spam.
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  New posts typically ship a few times per month.
                </p>
              </aside>
            </div>

            {/* Error state card */}
            <div className="flex justify-center py-16">
              <div
                className="max-w-md text-center rounded-2xl border p-8"
                style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}
              >
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full"
                     style={{ backgroundColor: 'rgba(248, 113, 113, 0.15)', color: '#ef4444' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                  Unable to load articles
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Something went wrong while fetching blog content. Please refresh or try again in a few minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}