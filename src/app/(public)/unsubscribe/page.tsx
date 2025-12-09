'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/mailing-list/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setEmail('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to unsubscribe' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to unsubscribe. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-20 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <div className="mx-auto w-[90%] max-w-[440px]">

        {/* Centered Icon + Header */}
        <div className="text-center mb-10">
          <div className="mb-6">
            <svg
              className="w-12 h-12 mx-auto"
              style={{ color: 'var(--text-muted)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V18z" />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold mb-3" style={{ color: 'var(--text-color)' }}>
            Unsubscribe from emails
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Enter your email address to stop receiving updates.
          </p>
        </div>

        {/* Form */}
        <div className="mb-8">
          {/* Inline Alert */}
          {message && (
            <div
              className="mb-6 py-3 px-4 border-l-2"
              style={{
                borderLeftColor: message.type === 'success' ? 'var(--accent-color)' : '#ef4444',
                backgroundColor: message.type === 'success' ? 'rgba(22, 101, 52, 0.05)' : 'rgba(239, 68, 68, 0.05)'
              }}
            >
              <p className="text-sm" style={{ color: message.type === 'success' ? 'var(--accent-color)' : '#ef4444' }}>
                {message.text}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field - Underline Style */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 px-0 py-3 text-base focus:outline-none focus:ring-0 peer transition-colors"
                style={{
                  borderBottomColor: 'var(--border-color)',
                  color: 'var(--text-color)'
                }}
                placeholder=" "
                required
                disabled={isSubmitting}
              />
              <label
                htmlFor="email"
                className="absolute left-0 top-3 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                Email address
              </label>
              <div
                className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 peer-focus:w-full"
                style={{ backgroundColor: 'var(--accent-color)' }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 font-medium text-base transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: 'var(--accent-color)',
                color: 'white'
              }}
            >
              {isSubmitting ? 'Processing...' : 'Unsubscribe'}
            </button>
          </form>
        </div>

        {/* Privacy Notice - Muted paragraphs */}
        <div
          className="p-5 mb-8"
          style={{ backgroundColor: 'var(--background-secondary)' }}
        >
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
            Your email will be removed from our mailing list within 48 hours. You may still receive emails that were already scheduled before your request was processed.
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            You can resubscribe at any time through our website. We do not share your email address with third parties.
          </p>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Changed your mind?{' '}
            <Link
              href="/subscribe"
              className="hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent-color)' }}
            >
              Subscribe again
            </Link>
          </p>

          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Need help?{' '}
            <a
              href="mailto:digitalpromocodescontact@gmail.com"
              className="hover:opacity-80 transition-opacity underline"
              style={{ color: 'var(--text-muted)' }}
            >
              Contact support
            </a>
          </p>

          <Link
            href="/"
            className="inline-block text-sm hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-color)' }}
          >
            <span aria-hidden="true">←</span> Back to home
          </Link>
        </div>

      </div>
    </div>
  )
}
