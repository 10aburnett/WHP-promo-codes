# Blog Post Pages - Fingerprint Reset Batch

These are all the files related to individual blog post pages and the blog listing. Please provide surgical OLD → NEW copy replacements for fingerprint differentiation while maintaining SEO optimization.

---

## FILE 1: src/components/BlogPostClient.tsx (Main Blog Post Client Component)

```tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import CommentForm from '@/components/CommentForm'
import CommentsList from '@/components/CommentsList'
import RelatedPosts from '@/components/RelatedPosts'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string | null
  publishedAt: string | null
  slug: string
  readingTime: number
  headings: Array<{
    id: string
    text: string
    level: number
  }>
  authorName?: string | null
  author?: {
    name: string
  }
}

interface BlogPostClientProps {
  post: BlogPost
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const [refreshComments, setRefreshComments] = useState(0)
  const [replyTo, setReplyTo] = useState<{ parentId: string, parentAuthor: string } | null>(null)
  const [showToc, setShowToc] = useState(false)

  // Show table of contents for posts with 3+ headings
  const shouldShowToc = post.headings && post.headings.length >= 3

  const handleCommentSubmitted = () => {
    setRefreshComments(prev => prev + 1)
    setReplyTo(null) // Clear reply state after submission
  }

  const handleReply = (parentId: string, parentAuthor: string) => {
    setReplyTo({ parentId, parentAuthor })
    // Scroll to comment form
    setTimeout(() => {
      document.querySelector('[data-comment-form]')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleCancelReply = () => {
    setReplyTo(null)
  }

  return (
    <div className="min-h-screen py-12 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <div className="mx-auto w-[90%] md:w-[95%] max-w-[800px]">
        <div className="space-y-8">
          {/* Breadcrumb Navigation - Simplified slash format */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>
                <Link href="/" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--accent-color)' }}>
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--accent-color)' }}>
                  Insights
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="truncate max-w-[12rem]" style={{ color: 'var(--text-muted)' }}>
                {post.title}
              </li>
            </ol>
          </nav>

          {/* Article */}
          <article>
            {/* Carded Hero Header */}
            <header className="mb-10">
              <div
                className="rounded-2xl border p-6 md:p-8 shadow-sm"
                style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--accent-color)' }}>
                  WhopPromoCodes Insights
                </p>
                <h1 className="text-3xl md:text-4xl font-bold mb-3"
                    style={{ color: 'var(--text-color)', lineHeight: 1.2 }}>
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {post.publishedAt && (
                    <time>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  )}

                  {(post.authorName || post.author?.name) && (
                    <span>By {post.authorName || post.author?.name}</span>
                  )}

                  <span className="flex items-center">
                    <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l3 3" />
                    </svg>
                    {post.readingTime} min read
                  </span>
                </div>
              </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Table of Contents - Desktop Sidebar */}
              {shouldShowToc && (
                <div className="hidden lg:block lg:w-64 shrink-0">
                  <div className="sticky top-8">
                    <div
                      className="rounded-xl border p-5 shadow-sm"
                      style={{
                        backgroundColor: 'var(--background-secondary)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                        On this page
                      </h3>
                      <nav className="space-y-1.5">
                        {post.headings.map((heading, index) => (
                          <a
                            key={index}
                            href={`#${heading.id}`}
                            className="block text-sm transition-opacity hover:opacity-80"
                            style={{
                              color: 'var(--text-secondary)',
                              paddingLeft: `${(heading.level - 1) * 12}px`,
                            }}
                          >
                            {heading.text}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Table of Contents Toggle */}
              {shouldShowToc && (
                <div className="lg:hidden mb-6">
                  <button
                    onClick={() => setShowToc(!showToc)}
                    className="flex w-full items-center justify-between rounded-xl border px-4 py-3"
                    style={{
                      backgroundColor: 'var(--background-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-color)',
                    }}
                  >
                    <span className="font-medium text-sm">{showToc ? 'Hide outline' : 'Show outline'}</span>
                    <svg
                      className={`h-5 w-5 transition-transform ${showToc ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showToc && (
                    <div className="mt-4 p-4 rounded-xl border" style={{
                      backgroundColor: 'var(--background-secondary)',
                      borderColor: 'var(--border-color)'
                    }}>
                      <nav className="space-y-1.5">
                        {post.headings.map((heading, index) => (
                          <a
                            key={index}
                            href={`#${heading.id}`}
                            onClick={() => setShowToc(false)}
                            className="block text-sm hover:opacity-80 transition-opacity"
                            style={{
                              color: 'var(--text-secondary)',
                              paddingLeft: `${(heading.level - 1) * 12}px`
                            }}
                          >
                            {heading.text}
                          </a>
                        ))}
                      </nav>
                    </div>
                  )}
                </div>
              )}

              {/* Main Content */}
              <div className="flex-1">
                <div
                  className="rounded-2xl border px-6 py-7 md:px-10 md:py-10"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--card-border)',
                    boxShadow: 'var(--promo-shadow)',
                  }}
                >
                  <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                    Last updated for accuracy and clarity. Some details may change over time.
                  </p>
                  <div
                    className="prose prose-lg max-w-none blog-content"
                    style={{
                      color: 'var(--text-color)',
                      '--tw-prose-headings': 'var(--text-color)',
                      '--tw-prose-links': 'var(--accent-color)',
                    } as React.CSSProperties}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts Section */}
          <div className="mt-12">
            <RelatedPosts
              currentPostId={post.id}
              currentPostTitle={post.title}
            />
          </div>

          {/* Comments Section */}
          <div className="mt-12 space-y-8">
            <CommentsList
              blogPostId={post.id}
              refreshTrigger={refreshComments}
              onReply={handleReply}
            />
            <div data-comment-form>
              <CommentForm
                blogPostId={post.id}
                onCommentSubmitted={handleCommentSubmitted}
                parentId={replyTo?.parentId}
                parentAuthor={replyTo?.parentAuthor}
                onCancel={replyTo ? handleCancelReply : undefined}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-16 flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold shadow-sm hover:shadow-md transition"
              style={{
                backgroundColor: 'var(--accent-color)',
                color: 'white',
              }}
            >
              Browse all articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## FILE 2: src/app/(public)/blog/page.tsx (Blog Listing Page)

```tsx
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
                    WhopPromoCodes Insights
                  </p>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: 'var(--text-color)', lineHeight: 1.2 }}>
                    Strategies, updates & playbooks for smarter digital savings.
                  </h1>
                  <p className="text-sm md:text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                    Deep-dive guides and analysis on digital products, communities, and promo strategies from the team behind WhopPromoCodes.
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
                    We're working on in-depth guides and case studies. Check back soon for fresh insights.
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
                  WhopPromoCodes Insights
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: 'var(--text-color)', lineHeight: 1.2 }}>
                  Strategies, updates & playbooks for smarter digital savings.
                </h1>
                <p className="text-sm md:text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                  Deep-dive guides and analysis on digital products, communities, and promo strategies from the team behind WhopPromoCodes.
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
                  WhopPromoCodes Insights
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: 'var(--text-color)', lineHeight: 1.2 }}>
                  Strategies, updates & playbooks for smarter digital savings.
                </h1>
                <p className="text-sm md:text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                  Deep-dive guides and analysis on digital products, communities, and promo strategies from the team behind WhopPromoCodes.
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
```

---

## FILE 3: src/components/RelatedPosts.tsx (Related Posts Component)

```tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  publishedAt: string | null
  authorName?: string | null
  author?: { name?: string | null } | null
}

interface RelatedPostsProps {
  currentPostId: string
  currentPostTitle: string
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function RelatedPosts({ currentPostId, currentPostTitle }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch(`/api/blog/related?postId=${currentPostId}&title=${encodeURIComponent(currentPostTitle)}`)
        if (response.ok) {
          const data = await response.json()
          setRelatedPosts(data.posts || [])
        }
      } catch (error) {
        console.error('Error fetching related posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedPosts()
  }, [currentPostId, currentPostTitle])

  if (loading) {
    return (
      <section className="mt-20">
        <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
          You might also like
        </h3>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div
              key={i}
              className="rounded-2xl border p-4 flex gap-4 animate-pulse"
              style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}
            >
              <div
                className="h-12 w-12 rounded-full flex-shrink-0"
                style={{ backgroundColor: 'var(--text-muted)', opacity: 0.3 }}
              />
              <div className="flex-1 space-y-2">
                <div
                  className="h-4 w-3/4 rounded"
                  style={{ backgroundColor: 'var(--text-muted)', opacity: 0.3 }}
                />
                <div
                  className="h-3 w-full rounded"
                  style={{ backgroundColor: 'var(--text-muted)', opacity: 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (relatedPosts.length === 0) {
    return null
  }

  // Only show first 2 posts for the new asymmetric layout
  const displayPosts = relatedPosts.slice(0, 2)

  return (
    <section className="mt-20">
      <h3
        className="text-2xl font-bold mb-6"
        style={{ color: 'var(--text-color)' }}
      >
        You might also like
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <article
              className="group flex flex-col rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-200 h-full"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="mb-3">
                <time
                  className="text-xs uppercase tracking-wide"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {formatDate(post.publishedAt)}
                </time>
              </div>

              <h4
                className="text-xl font-semibold mb-2 line-clamp-2 group-hover:opacity-90"
                style={{ color: 'var(--text-color)' }}
              >
                {post.title}
              </h4>

              {post.excerpt && (
                <p
                  className="text-sm mb-4 line-clamp-3"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {post.excerpt}
                </p>
              )}

              <div className="mt-auto flex items-center justify-between">
                <span
                  className="inline-flex items-center text-sm font-medium"
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

                {(post.authorName || post.author?.name) && (
                  <span
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {post.authorName || post.author?.name}
                  </span>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

---

## FILE 4: src/components/CommentForm.tsx (Comment Form Component)

```tsx
'use client'
import { useState, useEffect } from 'react'
import MailingListPopup from './MailingListPopup'

interface CommentFormProps {
  blogPostId: string
  onCommentSubmitted: () => void
  parentId?: string
  parentAuthor?: string
  onCancel?: () => void
}

export default function CommentForm({ blogPostId, onCommentSubmitted, parentId, parentAuthor, onCancel }: CommentFormProps) {
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showMailingListPopup, setShowMailingListPopup] = useState(false)

  // Auto-fill with @username when replying
  useEffect(() => {
    if (parentId && parentAuthor) {
      setFormData(prev => ({
        ...prev,
        content: `@${parentAuthor} `
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        content: ''
      }))
    }
  }, [parentId, parentAuthor])

  // ... rest of the component logic ...

  return (
    <div className="rounded-2xl shadow-lg p-8 border"
         style={{
           backgroundColor: 'var(--background-secondary)',
           borderColor: 'var(--border-color)',
           boxShadow: 'var(--promo-shadow)'
         }}>
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>
          Join the discussion
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Share your thoughts with the community. Your comment helps others navigate digital products more confidently.
        </p>
      </div>

      {/* Reply indicator pill */}
      {parentId && parentAuthor && (
        <div className="mb-4 flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs"
            style={{ backgroundColor: 'rgba(5,150,105,0.08)', color: 'var(--accent-color)' }}
          >
            Replying to {parentAuthor}
          </span>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs px-3 py-1 rounded-full border transition-colors hover:opacity-80"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--background-color)'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Form fields with labels */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
            Your name
          </label>
          <input
            type="text"
            placeholder="What should we call you?"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
            Email address
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            required
            disabled={isSubmitting}
          />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Your email will not be published
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
            Comment
          </label>
          <textarea
            placeholder="Write your thoughts..."
            required
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition disabled:opacity-50"
          style={{
            backgroundColor: 'var(--accent-color)',
            color: 'white'
          }}
        >
          {isSubmitting ? 'Posting...' : (parentId ? 'Post reply' : 'Post comment')}
        </button>
      </form>
    </div>
  )
}
```

---

## FILE 5: src/components/CommentsList.tsx (Comments List Component)

```tsx
'use client'
import { useState, useEffect } from 'react'

// ... interfaces and helper functions ...

export default function CommentsList({ blogPostId, refreshTrigger, onReply }: CommentsListProps) {
  // ... state and logic ...

  if (loading) {
    return (
      <div className="rounded-2xl shadow-lg p-8 border" style={{ ... }}>
        <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
          Discussion
        </h3>
        {/* Loading skeleton */}
      </div>
    )
  }

  return (
    <div className="rounded-2xl shadow-lg p-8 border" style={{ ... }}>
      <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
        Discussion ({comments?.length || 0})
      </h3>

      {!comments || comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {comments.map(comment => renderComment(comment))}
        </div>
      )}
    </div>
  )
}
```

---

## FILE 6: src/app/(public)/blog/[slug]/not-found.tsx (Blog Post 404)

```tsx
import ErrorState from '@/components/layout/ErrorState';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog post not found | WhopPromoCodes',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlogPostNotFound() {
  return (
    <ErrorState
      variant="not-found"
      title="Article not found"
      description="This article is no longer available on WhopPromoCodes. It may have been removed, renamed, or never existed."
      primaryCta={{ href: '/blog', label: 'View all insights' }}
      secondaryCta={{ href: '/', label: 'Back to homepage' }}
    />
  );
}
```

---

## FILE 7: src/app/(public)/blog/error.tsx (Blog Error Page)

```tsx
'use client';

import { useEffect } from 'react';
import ErrorState from '@/components/layout/ErrorState';

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog page error:', error);
  }, [error]);

  return (
    <ErrorState
      variant="error"
      title="We couldn't load the blog"
      description="Something went wrong while loading blog content on WhopPromoCodes. Please retry or return to the homepage."
      onRetry={reset}
      secondaryCta={{ href: '/', label: 'Back to homepage' }}
    />
  );
}
```

---

## FILE 8: src/lib/blog-utils.ts (Blog Utility Functions - Schema/SEO)

Key copy in this file:

```ts
// Line 108: Genre
'genre': 'Online products & savings',

// Line 109: Keywords pattern
'keywords': `digital promo codes, online products, savings strategies, ${post.title}`,

// Line 110: Article section
'articleSection': 'Digital products & promo strategies',

// Line 133: Breadcrumb "Insights"
'name': 'Insights',
```

---

## FILE 9: src/app/(public)/blog/[slug]/page.tsx (Blog Post Page - Server Component)

Key copy that may need review:

```tsx
// Line 68-70: Unavailable article metadata
title: `Article unavailable - ${SITE_BRAND}`,
description: 'This article is no longer available on WhopPromoCodes.',

// Line 76: Default meta description
const metaDescription = post.excerpt ?? `Clear, practical guidance on digital products, discount strategies and online savings from ${SITE_BRAND}.`;

// Line 117-119: Fallback metadata
title: `Blog Post - ${SITE_BRAND}`,
description: 'Browse guides and explanations on digital products, saving strategies, and getting more value online.'

// Line 165: Breadcrumb "Articles"
name: 'Articles',
```

---

## SUMMARY OF CURRENT COPY TO REVIEW:

### Section Headers & Titles:
- "WhopPromoCodes Insights" (badge/label)
- "Insights" (breadcrumb link)
- "On this page" (TOC heading)
- "Show outline" / "Hide outline" (mobile TOC toggle)
- "You might also like" (related posts heading)
- "Join the discussion" (comment form heading)
- "Discussion" (comments list heading)
- "Browse all articles" (CTA button)
- "Read article" (card CTA)

### Blog Listing Page:
- "Strategies, updates & playbooks for smarter digital savings." (H1)
- "Deep-dive guides and analysis on digital products, communities, and promo strategies from the team behind WhopPromoCodes." (subtitle)
- "Stay ahead of the next deal wave" (sidebar heading)
- "Occasional roundups of new digital products, top promo codes, and strategy breakdowns. No spam." (sidebar text)
- "New posts typically ship a few times per month." (sidebar note)
- "No articles published yet" (empty state)
- "We're working on in-depth guides and case studies. Check back soon for fresh insights." (empty state description)
- "Unable to load articles" (error state)
- "Featured" (pinned badge)

### Comment Form:
- "Share your thoughts with the community. Your comment helps others navigate digital products more confidently."
- "Your name" / "What should we call you?"
- "Email address" / "your@email.com"
- "Your email will not be published"
- "Comment" / "Write your thoughts..."
- "Post comment" / "Post reply" / "Posting..."
- "Replying to {author}"

### Comments List:
- "No comments yet. Be the first to share your thoughts!"

### Error/404:
- "Article not found"
- "This article is no longer available on WhopPromoCodes. It may have been removed, renamed, or never existed."
- "View all insights"
- "We couldn't load the blog"
- "Something went wrong while loading blog content on WhopPromoCodes. Please retry or return to the homepage."

### Content Card:
- "Last updated for accuracy and clarity. Some details may change over time."

### Schema/SEO:
- 'Online products & savings' (genre)
- 'Digital products & promo strategies' (articleSection)

Please provide surgical OLD → NEW replacements to differentiate these from any template fingerprint while maintaining SEO value.
