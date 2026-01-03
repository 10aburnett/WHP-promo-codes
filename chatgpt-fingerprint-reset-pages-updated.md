# Updated Static Pages - Post Fingerprint Reset (GitHub Up-to-Date)

These are the redesigned files after the fingerprint reset. All changes have been pushed to both `development` and `main` branches.

---

## 1. About Page
**File:** `src/app/(public)/about/page.tsx`

```tsx
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
              About WhopPromoCodes
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
```

---

## 2. Subscribe Page
**File:** `src/app/(public)/subscribe/page.tsx`

```tsx
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
      question: 'How often will I receive emails?',
      answer: 'We send weekly digests with the latest verified promo codes. During major promotional periods, you may receive 2-3 emails per week.'
    },
    {
      question: 'Can I unsubscribe anytime?',
      answer: 'Yes. Every email includes an unsubscribe link, or you can visit our unsubscribe page at any time.'
    },
    {
      question: 'Is my email shared with third parties?',
      answer: 'No. We do not sell or share your email address. Your information is used solely for sending promo code updates.'
    }
  ]

  return (
    <div className="min-h-screen py-16 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <div className="mx-auto w-[90%] md:w-[95%] max-w-[640px]">

        {/* Left-aligned Header */}
        <header className="mb-12">
          <span className="text-xs font-medium tracking-wider uppercase mb-3 block" style={{ color: 'var(--text-muted)' }}>
            Email Updates
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
            Get the latest digital savings
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Join the list to receive verified digital promo codes, product updates, and savings insights.
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
              <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>Verified codes</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Receive promo codes tested for accuracy before we send them.
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
              <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>Early access</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Get notified about limited-time offers before they expire.
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
              <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>Savings insights</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Practical tips on maximizing value from digital products.
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
                Your name
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
                Email address
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
              {isSubmitting ? 'Subscribing...' : 'Subscribe to updates'}
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Unsubscribe anytime. No spam.
            </p>
          </form>
        </div>

        {/* FAQ Accordion */}
        <section>
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-color)' }}>
            Common questions
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
            Already subscribed?{' '}
            <Link
              href="/unsubscribe"
              className="hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent-color)' }}
            >
              Manage preferences
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
```

---

## 3. Unsubscribe Page
**File:** `src/app/(public)/unsubscribe/page.tsx`

```tsx
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
              href="mailto:whoppromocodescontact@gmail.com"
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
```

---

## 4. Contact Page (Client Component)
**File:** `src/components/ContactClient.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactClient() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showMessage, setShowMessage] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setShowMessage(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question: t('contact.faq1Question'),
      answer: t('contact.faq1Answer')
    },
    {
      question: t('contact.faq2Question'),
      answer: t('contact.faq2Answer')
    },
    {
      question: t('contact.faq3Question'),
      answer: t('contact.faq3Answer')
    }
  ];

  return (
    <main className="min-h-screen py-16 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <div className="mx-auto w-[90%] md:w-[95%] max-w-[1100px]">

        {/* Header */}
        <header className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm mb-6 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-color)' }}
          >
            <span aria-hidden="true">←</span>
            <span className="ml-2">{t('contact.backToHome')}</span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-semibold mb-3" style={{ color: 'var(--text-color)' }}>
            {t('contact.title')}
          </h1>
          <p className="text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            {t('contact.subtitle')}
          </p>
          <div className="w-16 h-px mt-6" style={{ backgroundColor: 'var(--border-color)' }} />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">

          {/* LEFT: Contact Form */}
          <div
            className="p-8"
            style={{ backgroundColor: 'var(--background-secondary)' }}
          >
            <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-color)' }}>
              {t('contact.sendMessage')}
            </h2>

            {/* Toast Message */}
            {showMessage && (
              <div
                className={`mb-6 py-3 px-4 border-l-2 transition-all duration-300 ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
                style={{
                  borderLeftColor: submitStatus === 'success' ? 'var(--accent-color)' : '#ef4444',
                  backgroundColor: submitStatus === 'success' ? 'rgba(22, 101, 52, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                }}
              >
                <p className="text-sm" style={{ color: submitStatus === 'success' ? 'var(--accent-color)' : '#ef4444' }}>
                  {submitStatus === 'success' ? t('contact.successMessage') : t('contact.errorMessage')}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-opacity-50 px-4 py-3 text-base focus:outline-none transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)'
                  }}
                  placeholder=" "
                />
                <label
                  htmlFor="name"
                  className="absolute left-3 -top-2 px-1 text-xs"
                  style={{ color: 'var(--text-muted)', backgroundColor: 'var(--background-color)' }}
                >
                  {t('contact.name')}
                </label>
              </div>

              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-opacity-50 px-4 py-3 text-base focus:outline-none transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)'
                  }}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute left-3 -top-2 px-1 text-xs"
                  style={{ color: 'var(--text-muted)', backgroundColor: 'var(--background-color)' }}
                >
                  {t('contact.email')}
                </label>
              </div>

              {/* Subject Field */}
              <div className="relative">
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-opacity-50 px-4 py-3 text-base focus:outline-none transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)'
                  }}
                  placeholder=" "
                />
                <label
                  htmlFor="subject"
                  className="absolute left-3 -top-2 px-1 text-xs"
                  style={{ color: 'var(--text-muted)', backgroundColor: 'var(--background-color)' }}
                >
                  {t('contact.subject')}
                </label>
              </div>

              {/* Message Field */}
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-transparent border border-opacity-50 px-4 py-3 text-base focus:outline-none transition-all duration-200 resize-none"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)'
                  }}
                  placeholder=" "
                />
                <label
                  htmlFor="message"
                  className="absolute left-3 -top-2 px-1 text-xs"
                  style={{ color: 'var(--text-muted)', backgroundColor: 'var(--background-color)' }}
                >
                  {t('contact.message')}
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 font-medium text-base transition-all duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--accent-color)',
                  color: 'white'
                }}
              >
                {isSubmitting ? t('common.loading') : t('contact.send')}
              </button>
            </form>
          </div>

          {/* RIGHT: Contact Info + FAQ */}
          <aside className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-color)' }}>
                {t('contact.getInTouch')}
              </h2>

              <div className="space-y-5">
                {/* Email Support */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(22, 101, 52, 0.06)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--accent-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                      {t('contact.emailSupport')}
                    </h3>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {t('contact.emailSupportDesc')}
                    </p>
                    <a
                      href="mailto:whoppromocodescontact@gmail.com"
                      className="text-sm hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--accent-color)' }}
                    >
                      whoppromocodescontact@gmail.com
                    </a>
                  </div>
                </div>

                {/* Business Inquiries */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(22, 101, 52, 0.06)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--accent-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                      {t('contact.businessInquiries')}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {t('contact.businessInquiriesDesc')}
                    </p>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(22, 101, 52, 0.06)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--accent-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                      {t('contact.responseTime')}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {t('contact.responseTimeDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Collapsible */}
            <div className="pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                {t('contact.faqTitle')}
              </h3>

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
                      className="w-full py-3 flex items-center justify-between text-left"
                    >
                      <span className="text-sm font-medium pr-4" style={{ color: 'var(--text-color)' }}>
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
                      className={`overflow-hidden transition-all duration-200 ${openFaq === index ? 'max-h-32 pb-3' : 'max-h-0'}`}
                    >
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}
```

---

## 5. Dynamic Legal Page (Terms & Privacy)
**File:** `src/components/DynamicLegalPage.tsx`

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface DynamicLegalPageProps {
  title: string;
  content: string;
  lastUpdated: string;
}

export default function DynamicLegalPage({ title, content, lastUpdated }: DynamicLegalPageProps) {
  const { language, t } = useLanguage();

  // Helper function to get localized paths
  const getLocalizedPath = (path: string) => {
    if (language === 'en') {
      return path;
    }
    return `/${language}${path}`;
  };

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const localeMap: { [key: string]: string } = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'nl': 'nl-NL',
      'zh': 'zh-CN'
    };

    const locale = localeMap[language] || 'en-US';

    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Determine if this is privacy or terms page
  const isPrivacyPage = title.toLowerCase().includes('privacy') || title.toLowerCase().includes('privacidad') || title.toLowerCase().includes('privacybeleid') || title.toLowerCase().includes('confidentialité') || title.toLowerCase().includes('datenschutz') || title.toLowerCase().includes('politica') || title.toLowerCase().includes('privacidade') || title.toLowerCase().includes('隐私');

  // Generate translated content with clean legal-document format
  const generateTranslatedContent = () => {
    if (isPrivacyPage) {
      return `
        <section>
          <h2>${t('privacy.introduction.title')}</h2>
          <p>${t('privacy.introduction.content')}</p>
        </section>

        <section>
          <h2>${t('privacy.infoCollect.title')}</h2>

          <h3>${t('privacy.infoProvide.title')}</h3>
          <p>${t('privacy.infoProvide.content').replace(/\n/g, '<br>')}</p>

          <h3>${t('privacy.infoAuto.title')}</h3>
          <p>${t('privacy.infoAuto.content').replace(/\n/g, '<br>')}</p>
        </section>

        <section>
          <h2>${t('privacy.howUse.title')}</h2>
          <p>${t('privacy.howUse.content').replace(/\n/g, '<br>')}</p>
        </section>

        <section>
          <h2>${t('privacy.sharing.title')}</h2>
          <p>${t('privacy.sharing.content').replace(/\n/g, '<br>').replace(/\n\n/g, '<br><br>')}</p>
        </section>

        <section>
          <h2>${t('privacy.cookies.title')}</h2>
          <p>${t('privacy.cookies.content').replace(/\n/g, '<br>').replace(/\n\n/g, '<br><br>')}</p>
        </section>

        <section>
          <h2>${t('privacy.security.title')}</h2>
          <p>${t('privacy.security.content').replace(/\n/g, '<br>')}</p>
        </section>

        <section>
          <h2>${t('privacy.rights.title')}</h2>
          <p>${t('privacy.rights.content').replace(/\n/g, '<br>')}</p>
        </section>

        <section>
          <h2>${t('privacy.contact.title')}</h2>
          <p>${t('privacy.contact.content').replace(/\n/g, '<br>')}</p>
        </section>
      `;
    } else {
      return `
        <section>
          <h2>${t('terms.agreement.title')}</h2>
          <p>${t('terms.agreement.content')}</p>
        </section>

        <section>
          <h2>${t('terms.license.title')}</h2>
          <p>${t('terms.license.content').replace(/\n/g, '<br>')}</p>
        </section>

        <section>
          <h2>${t('terms.disclaimer.title')}</h2>
          <p>${t('terms.disclaimer.content').replace(/\n/g, '<br>')}</p>
        </section>

        <section>
          <h2>${t('terms.responsible.title')}</h2>
          <p>${t('terms.responsible.content').replace(/\n/g, '<br>').replace(/\n\n/g, '<br><br>')}</p>
        </section>

        <section>
          <h2>${t('terms.contactInfo.title')}</h2>
          <p>${t('terms.contactInfo.content').replace(/\n/g, '<br>')}</p>
        </section>
      `;
    }
  };

  return (
    <>
      <main className="min-h-screen py-16 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
        <div className="mx-auto w-[90%] md:w-[95%] max-w-[720px]">

          {/* Header */}
          <header className="mb-12">
            <Link
              href={getLocalizedPath('/')}
              className="inline-flex items-center text-sm mb-8 hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent-color)' }}
            >
              <span aria-hidden="true">←</span>
              <span className="ml-2">{t('legal.backToHome')}</span>
            </Link>

            <span className="text-xs font-medium tracking-wider uppercase mb-3 block" style={{ color: 'var(--text-muted)' }}>
              Legal Information
            </span>

            <h1 className="text-3xl md:text-4xl font-semibold mb-3" style={{ color: 'var(--text-color)' }}>
              {isPrivacyPage ? t('privacy.title') : t('terms.title')}
            </h1>

            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {t('legal.lastUpdated')}: {formatDate(lastUpdated)}
            </p>

            <div className="w-full h-px mt-8" style={{ backgroundColor: 'var(--border-color)' }} />
          </header>

          {/* Content */}
          <div
            className="legal-document"
            dangerouslySetInnerHTML={{ __html: generateTranslatedContent() }}
          />

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Questions about this policy?{' '}
              <Link
                href="/contact"
                className="hover:opacity-80 transition-opacity"
                style={{ color: 'var(--accent-color)' }}
              >
                Contact us
              </Link>
            </p>
          </footer>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
          .legal-document section {
            margin-bottom: 3rem;
          }

          .legal-document section:last-child {
            margin-bottom: 0;
          }

          .legal-document h2 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--accent-color);
            display: inline-block;
            color: var(--text-color);
          }

          .legal-document h3 {
            font-size: 1rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: var(--text-color);
          }

          .legal-document p {
            font-size: 0.9375rem;
            line-height: 1.75;
            margin-bottom: 1rem;
            color: var(--text-secondary);
          }

          .legal-document ul,
          .legal-document ol {
            margin-bottom: 1rem;
            padding-left: 1.25rem;
          }

          .legal-document li {
            font-size: 0.9375rem;
            line-height: 1.75;
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
            list-style-type: disc;
          }

          .legal-document strong {
            color: var(--text-color);
            font-weight: 600;
          }

          .legal-document a {
            color: var(--accent-color);
            text-decoration: none;
            transition: opacity 0.2s;
          }

          .legal-document a:hover {
            text-decoration: underline;
          }
        `
      }} />
    </>
  );
}
```

---

## 6. Promo Code Submission Form (Modal)
**File:** `src/components/PromoCodeSubmissionForm.tsx`

```tsx
'use client';

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';

interface DealSearchResult {
  id: string;
  name: string;
  slug: string;
}

interface PromoCodeSubmissionFormProps {
  preselectedOfferId?: string;
  preselectedOfferName?: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function PromoCodeSubmissionForm({
  preselectedOfferId,
  preselectedOfferName,
  onClose,
  onSuccess,
}: PromoCodeSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState<DealSearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchController = useRef<AbortController | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    value: '',
    submitterName: '',
    submitterEmail: '',
    submitterMessage: '',
    isGeneral: !preselectedOfferId,
    offerId: preselectedOfferId || '',
    customCourseName: '',
    isNewCourse: false,
  });

  useEffect(() => {
    if (preselectedOfferName && !searchTerm) {
      setSearchTerm(preselectedOfferName);
      setDebouncedSearchTerm(preselectedOfferName);
    }
  }, [preselectedOfferName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 100);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const searchWhops = useCallback(async (query: string) => {
    if (searchController.current) {
      searchController.current.abort();
    }

    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    searchController.current = controller;
    setIsSearching(true);

    try {
      const response = await fetch(
        `/api/whops/search?q=${encodeURIComponent(query)}&limit=20`,
        { signal: controller.signal }
      );

      if (response.ok && !controller.signal.aborted) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error searching products:', error);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsSearching(false);
      }
    }
  }, []);

  useEffect(() => {
    if (showDropdown) {
      searchWhops(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, showDropdown, searchWhops]);

  const selectedProductName = useMemo(() => {
    if (formData.isNewCourse) return formData.customCourseName;
    const selectedOffer = searchResults.find((w) => w.id === formData.offerId);
    return selectedOffer?.name || '';
  }, [searchResults, formData.offerId, formData.isNewCourse, formData.customCourseName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.title || !formData.description || !formData.submitterName || !formData.submitterEmail) {
      alert('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.code.trim() || !formData.value.trim()) {
      alert('Please provide both a promo code and discount value.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.isGeneral && !formData.offerId && !formData.isNewCourse) {
      alert('Please select a product or mark it as new.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.isGeneral && formData.isNewCourse && !formData.customCourseName.trim()) {
      alert('Please enter the product name.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/promo-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          offerId: formData.isGeneral ? null : formData.isNewCourse ? null : formData.offerId,
          customCourseName: formData.isNewCourse ? formData.customCourseName : null,
        }),
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setFormData({
            title: '',
            description: '',
            code: '',
            value: '',
            submitterName: '',
            submitterEmail: '',
            submitterMessage: '',
            isGeneral: !preselectedOfferId,
            offerId: preselectedOfferId || '',
            customCourseName: '',
            isNewCourse: false,
          });
          setSearchTerm('');
          setShowSuccessMessage(false);
          onSuccess?.();
        }, 10000);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductSelect = useCallback((whop: DealSearchResult) => {
    setFormData((prev) => ({
      ...prev,
      offerId: whop.id,
      isNewCourse: false,
      customCourseName: '',
    }));
    setSearchTerm(whop.name);
    setShowDropdown(false);
    setSearchResults((prev) => {
      const exists = prev.find((w) => w.id === whop.id);
      return exists ? prev : [whop, ...prev];
    });
  }, []);

  const handleNewProduct = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      isNewCourse: true,
      offerId: '',
      customCourseName: searchTerm,
    }));
    setShowDropdown(false);
  }, [searchTerm]);

  useEffect(() => {
    return () => {
      if (searchController.current) {
        searchController.current.abort();
      }
    };
  }, []);

  const handleCloseSuccess = () => {
    setShowSuccessMessage(false);
    onSuccess?.();
  };

  // Success Modal
  if (showSuccessMessage) {
    return (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="relative w-full max-w-sm p-8 text-center shadow-lg"
          style={{ backgroundColor: 'var(--background-color)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleCloseSuccess}
            className="absolute top-3 right-3 p-1 hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mb-6">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: 'var(--accent-color)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
              Submission received
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Thanks for contributing. We'll review your promo code and add it once verified.
            </p>
          </div>

          <button
            onClick={handleCloseSuccess}
            className="px-6 py-2 text-sm font-medium rounded-full"
            style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Main Form Modal
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
      role="dialog"
      aria-modal="true"
      onClick={() => onClose?.()}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-lg"
        style={{ backgroundColor: 'var(--background-color)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent top border */}
        <div className="h-1" style={{ backgroundColor: 'var(--accent-color)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
              Submit a promo code
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Share a code for the community to use
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Form Body */}
        <div className="px-6 py-5">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Promo Type Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isGeneral: false }))}
                className={`flex-1 py-2 text-sm font-medium border transition-colors ${!formData.isGeneral ? '' : ''}`}
                style={{
                  backgroundColor: !formData.isGeneral ? 'var(--accent-color)' : 'transparent',
                  color: !formData.isGeneral ? 'white' : 'var(--text-secondary)',
                  borderColor: !formData.isGeneral ? 'var(--accent-color)' : 'var(--border-color)'
                }}
              >
                Product-specific
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isGeneral: true, offerId: '', isNewCourse: false, customCourseName: '' }))}
                className="flex-1 py-2 text-sm font-medium border transition-colors"
                style={{
                  backgroundColor: formData.isGeneral ? 'var(--accent-color)' : 'transparent',
                  color: formData.isGeneral ? 'white' : 'var(--text-secondary)',
                  borderColor: formData.isGeneral ? 'var(--accent-color)' : 'var(--border-color)'
                }}
              >
                General promo
              </button>
            </div>

            {/* Product Search */}
            {!formData.isGeneral && (
              <div className="relative">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Select product
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                      setFormData((prev) => ({ ...prev, offerId: '', isNewCourse: false, customCourseName: '' }));
                    }}
                    onFocus={() => {
                      setShowDropdown(true);
                      if (searchTerm.length >= 2) searchWhops(searchTerm);
                    }}
                    placeholder="Search for a product..."
                    className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0 transition-colors"
                    style={{
                      borderBottomColor: 'var(--border-color)',
                      color: 'var(--text-color)',
                      backgroundColor: 'transparent'
                    }}
                    autoComplete="off"
                  />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent-color)' }} />
                    ) : (
                      <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Dropdown */}
                {showDropdown && (
                  <>
                    <div
                      className="absolute z-20 w-full mt-1 max-h-48 overflow-y-auto shadow-md"
                      style={{ backgroundColor: 'var(--background-color)', border: '1px solid var(--border-color)' }}
                    >
                      {searchTerm.length < 2 && (
                        <div className="px-3 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                          Type at least 2 characters...
                        </div>
                      )}

                      {!isSearching && searchTerm.length >= 2 && searchResults.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleProductSelect(item)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--background-secondary)] transition-colors"
                          style={{ color: 'var(--text-color)' }}
                        >
                          {item.name}
                        </button>
                      ))}

                      {searchTerm.length > 2 && (
                        <button
                          type="button"
                          onClick={handleNewProduct}
                          className="w-full px-3 py-2 text-left text-sm border-t transition-colors"
                          style={{ color: 'var(--accent-color)', borderColor: 'var(--border-color)' }}
                        >
                          + Add "{searchTerm}" as new product
                        </button>
                      )}
                    </div>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                  </>
                )}

                {(selectedProductName || formData.isNewCourse) && (
                  <div className="mt-2 text-xs" style={{ color: 'var(--accent-color)' }}>
                    Selected: {formData.isNewCourse ? formData.customCourseName : selectedProductName}
                  </div>
                )}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Promo title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. 20% Off Summer Sale"
                className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0"
                style={{ borderBottomColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
                required
              />
            </div>

            {/* Code + Value row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Promo code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="SUMMER20"
                  className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0"
                  style={{ borderBottomColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Discount value
                </label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
                  placeholder="20% off"
                  className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0"
                  style={{ borderBottomColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the promo and any conditions..."
                rows={2}
                className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0 resize-none"
                style={{ borderBottomColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
                required
              />
            </div>

            {/* Name + Email row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Your name
                </label>
                <input
                  type="text"
                  value={formData.submitterName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, submitterName: e.target.value }))}
                  className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0"
                  style={{ borderBottomColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Your email
                </label>
                <input
                  type="email"
                  value={formData.submitterEmail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, submitterEmail: e.target.value }))}
                  className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0"
                  style={{ borderBottomColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
                  required
                />
              </div>
            </div>

            {/* Optional Message */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Additional notes (optional)
              </label>
              <textarea
                value={formData.submitterMessage}
                onChange={(e) => setFormData((prev) => ({ ...prev, submitterMessage: e.target.value }))}
                rows={2}
                className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0 resize-none"
                style={{ borderBottomColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-sm font-medium border"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium rounded-full disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>

          <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            All submissions are reviewed before publishing.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 7. Promo Code Submission Button
**File:** `src/components/PromoCodeSubmissionButton.tsx`

```tsx
'use client'
import { useState } from 'react'
import PromoCodeSubmissionForm from './PromoCodeSubmissionForm'

interface PromoCodeSubmissionButtonProps {
  offerId: string
  offerName: string
}

export default function PromoCodeSubmissionButton({ offerId, offerName }: PromoCodeSubmissionButtonProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <section
        className="border py-6 px-6 transition-theme"
        style={{
          borderColor: 'var(--border-color)',
          backgroundColor: 'transparent',
        }}
      >
        <div className="flex flex-col gap-4 text-left">
          <div>
            <h4
              className="text-lg font-semibold mb-1"
              style={{ color: 'var(--text-color)' }}
            >
              Know a better code?
            </h4>
            <p
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Help the community by submitting a promo code for {offerName}
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            type="button"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-opacity duration-150 hover:opacity-80"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--accent-color)',
              border: '1px solid var(--accent-color)',
            }}
          >
            Submit a promo code
          </button>
        </div>
      </section>

      {/* Submission Form Modal */}
      {showForm && (
        <PromoCodeSubmissionForm
          preselectedOfferId={offerId}
          preselectedOfferName={offerName}
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}
    </>
  )
}
```

---

## Summary of Design Patterns Applied

| Page | Key Design Elements |
|------|-------------------|
| **About** | Left-aligned hero with pill label, two-column layout (narrative + stats rail), numbered timeline |
| **Subscribe** | Left-aligned header, horizontal benefits with square icons, underline inputs, FAQ accordion |
| **Unsubscribe** | Minimalistic centered layout, outlined email icon, underline input, muted privacy notice |
| **Contact** | Two-column layout (form left, info right), floating label inputs, collapsible FAQ sidebar |
| **Legal Pages** | "Legal Information" label, H2 with accent underline, clean document sections |
| **PromoSubmissionForm** | Flat panel modal with accent top border, underline inputs, toggle buttons |
| **PromoSubmissionButton** | Thin outline box, H4 heading, pill CTA with accent border |

**CSS Variables Used:**
- `--accent-color` (deep green #166534)
- `--background-color`, `--background-secondary`
- `--text-color`, `--text-secondary`, `--text-muted`
- `--border-color`
