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
              {/* Header */}
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold py-1"
                    style={{ lineHeight: '1.3', marginBottom: '0.6rem' }}>
                  <span style={{ color: 'var(--accent-color)' }}>DigitalPromoCodes</span>
                  <span className="ml-2" style={{ color: 'var(--text-color)' }}>
                    Blog
                  </span>
                </h1>
                <div
                  className="mx-auto h-1.5 w-28 rounded-full"
                  style={{
                    backgroundImage: 'linear-gradient(to right, var(--accent-color), rgba(59,130,246,0.6))'
                  }}
                ></div>
              </div>

              <div className="text-center -mt-2">
                <p className="text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Deep-dive guides, savings strategies, and digital product insights from the team behind DigitalPromoCodes.
                </p>
              </div>

              <div className="text-center py-16">
                <div
                  className="inline-flex flex-col items-center justify-center rounded-2xl border px-8 py-10 shadow-sm"
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'rgba(5,150,105,0.12)', color: 'var(--accent-color)' }}
                  >
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="6" />
                      <path d="m16 16 3.5 3.5" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                    No articles published yet
                  </h2>
                  <p className="text-sm max-w-md" style={{ color: 'var(--text-secondary)' }}>
                    We're preparing in-depth guides on digital products, promo strategies, and savings tips.
                    Check back soon for fresh content from the DigitalPromoCodes team.
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
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold py-1"
                  style={{ lineHeight: '1.3', marginBottom: '0.6rem' }}>
                <span style={{ color: 'var(--accent-color)' }}>DigitalPromoCodes</span>
                <span className="ml-2" style={{ color: 'var(--text-color)' }}>
                  Blog
                </span>
              </h1>
              <div
                className="mx-auto h-1.5 w-28 rounded-full"
                style={{
                  backgroundImage: 'linear-gradient(to right, var(--accent-color), rgba(59,130,246,0.6))'
                }}
              ></div>
            </div>

            <div className="text-center -mt-2">
              <p className="text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Deep-dive guides, savings strategies, and digital product insights from the team behind DigitalPromoCodes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(posts as BlogListItemWithDates[]).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article
                    className="group relative flex h-full cursor-pointer flex-col rounded-2xl border bg-[var(--card-bg)] p-6 shadow-sm transition-all duration-200 hover:shadow-lg"
                    style={{
                      borderColor: 'var(--card-border)',
                      boxShadow: 'var(--promo-shadow)',
                    }}
                  >
                    {post.pinned && (
                      <div className="absolute right-4 top-4">
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: 'rgba(5,150,105,0.1)',
                            color: 'var(--accent-color)',
                          }}
                        >
                          Featured
                        </span>
                      </div>
                    )}
                    <div className="flex h-full flex-col">
                      <div className="mb-3">
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
                      </div>

                      <h2
                        className="mb-3 line-clamp-2 text-xl font-semibold group-hover:opacity-85"
                        style={{ color: 'var(--text-color)' }}
                      >
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p
                          className="mb-6 line-clamp-3 text-sm"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {post.excerpt}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <span
                          className="inline-flex items-center text-sm font-medium transition-opacity group-hover:opacity-80"
                          style={{ color: 'var(--accent-color)' }}
                        >
                          Read article
                          <svg
                            className="ml-2 h-4 w-4"
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
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold py-1"
                  style={{ lineHeight: '1.3', marginBottom: '0.6rem' }}>
                <span style={{ color: 'var(--accent-color)' }}>DigitalPromoCodes</span>
                <span className="ml-2" style={{ color: 'var(--text-color)' }}>
                  Blog
                </span>
              </h1>
              <div
                className="mx-auto h-1.5 w-28 rounded-full"
                style={{
                  backgroundImage: 'linear-gradient(to right, var(--accent-color), rgba(59,130,246,0.6))'
                }}
              ></div>
            </div>

            <div className="text-center -mt-2">
              <p className="text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Deep-dive guides, savings strategies, and digital product insights from the team behind DigitalPromoCodes.
              </p>
            </div>

            <div className="text-center py-16">
              <div
                className="inline-flex flex-col items-center justify-center rounded-2xl border px-8 py-10 shadow-sm"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'rgba(248, 113, 113, 0.15)', color: '#ef4444' }}
                >
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                    <path d="M10.29 3.86 1.82 18a1 1 0 0 0 .86 1.5h18.64a1 1 0 0 0 .86-1.5L13.71 3.86a1 1 0 0 0-1.72 0Z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-color)' }}>
                  Unable to load blog posts
                </h2>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Something went wrong while loading the latest articles. Please refresh the page or try again in a few minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}