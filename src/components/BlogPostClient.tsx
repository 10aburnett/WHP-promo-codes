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
                  DigitalPromoCodes Insights
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