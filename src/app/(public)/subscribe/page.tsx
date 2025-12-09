'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function SubscribePage() {
  const [formData, setFormData] = useState({
    email: '',
    name: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/mailing-list/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          source: 'subscribe_page'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setFormData({ email: '', name: '' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to subscribe' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const faqs = [
    {
      question: 'How often do you send emails?',
      answer: 'Typically once a week with a digest of new codes. During busy promotional seasons, you might see up to two or three emails per week.'
    },
    {
      question: 'Can I opt out later?',
      answer: 'Yes. Every email contains an unsubscribe link, or you can use the opt-out page on this site whenever you like.'
    },
    {
      question: 'Will my email be shared?',
      answer: "No. We never sell or share your address with third parties. It's used only for sending deal updates."
    }
  ]

  return (
    <div className="min-h-screen py-16 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <div className="mx-auto w-[90%] md:w-[95%] max-w-[640px]">

        {/* Left-aligned Header */}
        <header className="mb-12">
          <span className="text-xs font-medium tracking-wider uppercase mb-3 block" style={{ color: 'var(--text-muted)' }}>
            Newsletter
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
            Stay informed on new deals
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Receive periodic emails featuring recently added promo codes, seasonal discounts, and useful buying guides.
          </p>
        </header>

        {/* Benefits - Horizontal Layout */}
        <div className="mb-12 space-y-4">
          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center"
              style={{ backgroundColor: 'var(--background-secondary)' }}
            >
              <svg className="w-5 h-5" style={{ color: 'var(--accent-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>Checked codes</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Every code is reviewed for accuracy before it reaches your inbox.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center"
              style={{ backgroundColor: 'var(--background-secondary)' }}
            >
              <svg className="w-5 h-5" style={{ color: 'var(--accent-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>Timely alerts</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Hear about time-sensitive promotions while they're still active.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center"
              style={{ backgroundColor: 'var(--background-secondary)' }}
            >
              <svg className="w-5 h-5" style={{ color: 'var(--accent-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>Buying tips</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Occasional advice on getting more value from digital tools and courses.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div
          className="p-8 mb-12"
          style={{ backgroundColor: 'var(--background-secondary)' }}
        >
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field - Underline Style */}
            <div className="relative">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                htmlFor="name"
                className="absolute left-0 top-3 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                Name
              </label>
              <div
                className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 peer-focus:w-full"
                style={{ backgroundColor: 'var(--accent-color)' }}
              />
            </div>

            {/* Email Field - Underline Style */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                Email
              </label>
              <div
                className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 peer-focus:w-full"
                style={{ backgroundColor: 'var(--accent-color)' }}
              />
            </div>

            {/* Submit Button - Wide Pill */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full font-medium text-base transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md"
              style={{
                backgroundColor: 'var(--accent-color)',
                color: 'white'
              }}
            >
              {isSubmitting ? 'Subscribing...' : 'Join the mailing list'}
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              You can unsubscribe at any time. No spam, ever.
            </p>
          </form>
        </div>

        {/* FAQ Accordion */}
        <section>
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-color)' }}>
            Frequently asked
          </h2>

          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full py-4 flex items-center justify-between text-left transition-colors"
                >
                  <span className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                    {faq.question}
                  </span>
                  <svg
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-muted)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${openFaq === index ? 'max-h-40 pb-4' : 'max-h-0'}`}
                >
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Link */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already on the list?{' '}
            <Link
              href="/unsubscribe"
              className="hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent-color)' }}
            >
              Manage your subscription
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
