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
