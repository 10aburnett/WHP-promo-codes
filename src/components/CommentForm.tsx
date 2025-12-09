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

  const checkEmailSubscription = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/mailing-list/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        const data = await response.json()
        return data.isSubscribed || false
      }
      return false
    } catch (error) {
      console.error('Error checking email subscription:', error)
      return false // If check fails, show popup to be safe
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          blogPostId,
          parentId: parentId || null
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        onCommentSubmitted()

        // Check if user is already subscribed before showing popup (for both comments and replies)
        const isAlreadySubscribed = await checkEmailSubscription(formData.authorEmail)

        if (!isAlreadySubscribed) {
          // Show mailing list popup if user is not already subscribed
          console.log('User not subscribed, showing mailing list popup')
          setTimeout(() => {
            setShowMailingListPopup(true)
          }, 1500) // Small delay to let user see success message
        } else {
          console.log('User already subscribed, skipping mailing list popup')
        }

      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit comment' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit comment. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetFormData = () => {
    setFormData({
      authorName: '',
      authorEmail: '',
      content: parentId && parentAuthor ? `@${parentAuthor} ` : ''
    })
  }

  const handleMailingListClose = () => {
    setShowMailingListPopup(false)
    // Clear form data after mailing list interaction
    resetFormData()
  }

  const handleMailingListSubmit = (subscribed: boolean) => {
    // Popup component handles the API call, we just need to cleanup
    setShowMailingListPopup(false)
    resetFormData()
  }

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

      {message && (
        <div
          className="p-4 rounded-xl mb-6"
          style={message.type === 'success' ? {
            backgroundColor: 'var(--accent-color)',
            color: 'white'
          } : {
            backgroundColor: 'light-dark(#fef2f2, rgba(220, 38, 38, 0.1))',
            color: 'light-dark(#dc2626, #fca5a5)',
            borderColor: 'light-dark(#fecaca, rgba(220, 38, 38, 0.3))'
          }}
        >
          {message.text}
        </div>
      )}

      {/* Single-column form layout */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name field */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
            Your name
          </label>
          <input
            type="text"
            value={formData.authorName}
            onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
            className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--background-color)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-color)'
            }}
            placeholder="What should we call you?"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Email field */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
            Email address
          </label>
          <input
            type="email"
            value={formData.authorEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, authorEmail: e.target.value }))}
            className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--background-color)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-color)'
            }}
            placeholder="your@email.com"
            required
            disabled={isSubmitting}
          />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Your email will not be published
          </p>
        </div>

        {/* Comment textarea */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
            Comment
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={4}
            className="w-full rounded-xl border px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--background-color)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-color)'
            }}
            placeholder="Write your thoughts..."
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Submit button */}
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

      {/* Mailing List Popup - for both comments and replies */}
      <MailingListPopup
        isOpen={showMailingListPopup}
        onClose={handleMailingListClose}
        userEmail={formData.authorEmail}
        userName={formData.authorName}
        onSubmit={handleMailingListSubmit}
      />
    </div>
  )
}
