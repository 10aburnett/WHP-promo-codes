# WhopPromoCodes Fingerprint Reset - Static Pages & Forms

## Context
We're rebranding WhopPromoCodes.com and need to completely redesign the following sections to remove any old layout fingerprints and create a fresh, unique visual identity. The site uses:
- Next.js 14 App Router
- Tailwind CSS
- CSS Variables for theming (e.g., `var(--accent-color)`, `var(--background-secondary)`, etc.)
- The accent color is a deep green (#166534 / emerald-800)

## Files to Redesign

---

### 1. ABOUT PAGE

**File: `src/app/(public)/about/page.tsx`**
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

      <div className="min-h-screen py-12 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <div className="mx-auto w-[90%] md:w-[95%] max-w-[800px]">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent leading-tight"
                style={{ backgroundImage: `linear-gradient(to right, var(--text-color), var(--text-secondary))` }}>
              About Us
            </h1>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--accent-color)' }}></div>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none space-y-6" style={{ color: 'var(--text-color)' }}>
            <div className="text-center mb-8">
              <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Welcome to <strong style={{ color: 'var(--accent-color)' }}>{SITE_BRAND}</strong> — your go-to hub for exclusive deals, discounts, and digital product insights. Check out our <Link href="/blog" className="underline hover:opacity-80" style={{ color: 'var(--accent-color)' }}>latest blog posts</Link> or <Link href="/contact" className="underline hover:opacity-80" style={{ color: 'var(--accent-color)' }}>get in touch</Link>.
              </p>
            </div>

            <section className="about-v2">
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">
                  We curate and maintain one of the largest collections of verified digital product offers online, helping you save money on premium courses, tools, and digital communities. Whether you're a trader, entrepreneur, or digital learner, we've got deals that unlock real value — without the guesswork.
                </p>

                <div className="about-card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h2 className="about-heading text-2xl font-bold mb-4 text-center text-gray-900" style={{ color: 'var(--accent-color)' }}>
                    Our Mission
                  </h2>
                  <p className="about-copy-white text-xl text-center font-medium text-gray-900">
                    Make premium digital products more affordable and transparent.
                  </p>
                </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                  What sets us apart?
                </h2>

                <div className="grid gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 mt-1">
                      <svg className="w-6 h-6" style={{ color: 'var(--accent-color)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <strong>8,000+ curated listings</strong>, organised for easy navigation
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 mt-1">
                      <svg className="w-6 h-6" style={{ color: 'var(--accent-color)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <strong>Daily updates</strong> to keep codes fresh and active
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 mt-1">
                      <svg className="w-6 h-6" style={{ color: 'var(--accent-color)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <strong>No misleading offers</strong> — every listing includes course summaries, pricing details, and our honest take
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 mt-1">
                      <svg className="w-6 h-6" style={{ color: 'var(--accent-color)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <strong>Affiliate transparency</strong> — we earn a commission when you use our links, at no extra cost to you
                    </div>
                  </div>
                </div>
              </div>

                <div className="about-card bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                  <p className="about-copy-muted text-lg leading-relaxed mb-4 text-gray-900">
                    We're independent curators and affiliates who use our experience to help others navigate the fast-growing world of online learning and mentorship.
                  </p>
                </div>

                <div className="about-card text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="about-copy-white text-xl font-semibold text-gray-900">
                    If you're tired of wasting time hunting for working promo codes, welcome home.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
```

---

### 2. SUBSCRIBE PAGE

**File: `src/app/(public)/subscribe/page.tsx`**
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

  return (
    <div className="min-h-screen py-12 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <div className="mx-auto w-[90%] md:w-[95%] max-w-[700px]">
        <div className="space-y-8">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 py-2"
                style={{ color: 'var(--text-color)', lineHeight: '1.3' }}>
              Join Our VIP List! <span style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>🎉</span>
            </h1>
            <div className="w-20 h-1 mx-auto rounded-full mb-6" style={{ backgroundColor: 'var(--accent-color)' }}></div>
            <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              Get exclusive access to the <strong style={{ color: 'var(--accent-color)' }}>newest Whop promo codes</strong>,
              insider tips, and deals before anyone else! Join thousands of savvy shoppers saving big.
            </p>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: 'var(--accent-color)' }}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                  Exclusive Codes
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Get promo codes not available anywhere else
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: 'var(--accent-color)' }}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                  Early Access
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Be the first to know about new deals and limited-time offers
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: 'var(--accent-color)' }}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                  Weekly Tips
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Insider strategies for maximizing your savings
                </p>
              </div>
            </div>
          </div>

          {/* Subscribe Form */}
          <div className="rounded-2xl shadow-lg p-8 border"
               style={{
                 backgroundColor: 'var(--card-bg)',
                 borderColor: 'var(--card-border)',
                 boxShadow: 'var(--promo-shadow)'
               }}>

            {message && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center">
                  {message.type === 'success' ? (
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  {message.text}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: 'var(--background-color)',
                      borderColor: 'var(--card-border)',
                      color: 'var(--text-color)'
                    }}
                    placeholder="Your name"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: 'var(--background-color)',
                      borderColor: 'var(--card-border)',
                      color: 'var(--text-color)'
                    }}
                    placeholder="your@email.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 rounded-lg font-medium text-lg transition-colors disabled:opacity-50 hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    color: 'white'
                  }}
                >
                  {isSubmitting ? 'Joining...' : 'Join VIP List! 🚀'}
                </button>
              </div>

              <div className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                We respect your privacy. Unsubscribe anytime with one click.
              </div>
            </form>
          </div>

          {/* Divider */}
          <div className="flex justify-center">
            <div className="w-full max-w-md h-px" style={{ backgroundColor: 'var(--border-color)' }}></div>
          </div>

          {/* FAQ Section */}
          <div className="rounded-2xl shadow-lg p-8 border"
               style={{
                 backgroundColor: 'var(--card-bg)',
                 borderColor: 'var(--card-border)',
                 boxShadow: 'var(--promo-shadow)'
               }}>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--text-color)' }}>
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                  How often will I receive emails?
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  We send out weekly newsletters with the latest promo codes and deals. During special promotions, you might receive 2-3 emails per week.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                  Can I unsubscribe anytime?
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Absolutely! Every email contains an unsubscribe link, or you can visit our <Link href="/unsubscribe" style={{ color: 'var(--accent-color)' }}>unsubscribe page</Link> anytime.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                  Do you share my email with third parties?
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Never! We respect your privacy and will only use your email to send you our exclusive promo codes and updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 3. CONTACT PAGE

**File: `src/app/(public)/contact/page.tsx`**
```tsx
import type { Metadata } from 'next';
import { siteOrigin } from '@/lib/site-origin';
import ContactClient from '@/components/ContactClient';
import { SITE_BRAND, CONTACT_EMAIL } from '@/lib/brand';

// SSG configuration - form is client component but page shell is static
export const dynamic = 'force-static'
export const fetchCache = 'force-cache'
export const revalidate = 86400 // 24h

const title = `Contact ${SITE_BRAND} - Get in Touch for Support & Partnerships`;
const description = `Contact ${SITE_BRAND} for questions about deals, partnerships, or support. We respond within 24-48 hours to all inquiries.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
// PHASE1-DEINDEX:     canonical: `${siteOrigin()}/contact`,
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
    url: `${siteOrigin()}/contact`,
    type: 'website',
    siteName: SITE_BRAND,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function ContactPage() {
  const origin = siteOrigin();

  return (
    <>
      {/* ContactPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "@id": `${origin}/contact#page`,
            name: `Contact ${SITE_BRAND}`,
            url: `${origin}/contact`,
            mainEntity: {
              "@type": "Organization",
              "@id": `${origin}#org`,
              name: SITE_BRAND,
              url: origin,
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: CONTACT_EMAIL,
                url: `${origin}/contact`
              }
            }
          })
        }}
      />

      <ContactClient />
    </>
  );
}
```

**File: `src/components/ContactClient.tsx`**
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
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen py-12 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <div className="mx-auto w-[90%] md:w-[95%] max-w-[1000px]">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center transition-colors duration-200 hover:opacity-80"
            style={{ color: 'var(--accent-color)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
            {t('contact.backToHome')}
          </Link>

          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>{t('contact.title')}</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-color)' }}>{t('contact.sendMessage')}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  {t('contact.name')} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-opacity-50 transition-colors duration-200 focus:border-[var(--accent-color)]"
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)'
                  }}
                  placeholder={t('contact.name')}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  {t('contact.email')} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-opacity-50 transition-colors duration-200 focus:border-[var(--accent-color)]"
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)'
                  }}
                  placeholder={t('contact.email')}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  {t('contact.subject')} *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-opacity-50 transition-colors duration-200 focus:border-[var(--accent-color)]"
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)'
                  }}
                  placeholder={t('contact.subject')}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  {t('contact.message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-opacity-50 transition-colors duration-200 resize-vertical focus:border-[var(--accent-color)]"
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)'
                  }}
                  placeholder={t('contact.message')}
                />
              </div>

              {submitStatus === 'success' && (
                <div className="border rounded-lg p-4" style={{ backgroundColor: 'rgba(var(--success-color-rgb), 0.1)', borderColor: 'rgba(var(--success-color-rgb), 0.2)' }}>
                  <p className="text-sm" style={{ color: 'var(--success-color)' }}>
                    ✓ {t('contact.successMessage')}
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="border rounded-lg p-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  <p className="text-sm" style={{ color: '#ef4444' }}>
                    ✗ {t('contact.errorMessage')}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed hover:opacity-90"
                style={{
                  backgroundColor: 'var(--accent-color)',
                  color: 'white',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
                {isSubmitting ? t('common.loading') : t('contact.send')}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-color)' }}>{t('contact.getInTouch')}</h2>

            <div className="space-y-6">
              <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-color)' }}>{t('contact.emailSupport')}</h3>
                    <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {t('contact.emailSupportDesc')}
                    </p>
                    <a
                      href="mailto:whoppromocodes@gmail.com"
                      className="transition-colors duration-200 hover:opacity-80"
                      style={{ color: 'var(--accent-color)' }}
                    >
                      whoppromocodes@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-color)' }}>{t('contact.businessInquiries')}</h3>
                    <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {t('contact.businessInquiriesDesc')}
                    </p>
                    <a
                      href="mailto:whoppromocodes@gmail.com"
                      className="transition-colors duration-200 hover:opacity-80"
                      style={{ color: 'var(--accent-color)' }}
                    >
                      whoppromocodes@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-color)' }}>{t('contact.responseTime')}</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {t('contact.responseTimeDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>{t('contact.faqTitle')}</h3>
              <div className="space-y-4">
                <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--accent-color)' }}>{t('contact.faq1Question')}</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {t('contact.faq1Answer')}
                  </p>
                </div>

                <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--accent-color)' }}>{t('contact.faq2Question')}</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {t('contact.faq2Answer')}
                  </p>
                </div>

                <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--accent-color)' }}>{t('contact.faq3Question')}</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {t('contact.faq3Answer')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

### 4. UNSUBSCRIBE PAGE

**File: `src/app/(public)/unsubscribe/page.tsx`**
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
    <div className="min-h-screen py-12 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <div className="mx-auto w-[90%] md:w-[95%] max-w-[600px]">
        <div className="space-y-8">
          {/* Back to Home */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center font-medium hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent-color)' }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent py-2"
                style={{ backgroundImage: `linear-gradient(to right, var(--text-color), var(--text-secondary))`, lineHeight: '1.3' }}>
              Unsubscribe from Mailing List
            </h1>
            <div className="w-20 h-1 mx-auto rounded-full mb-6" style={{ backgroundColor: 'var(--accent-color)' }}></div>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Sorry to see you go! Enter your email below to unsubscribe from our mailing list.
            </p>
          </div>

          {/* Unsubscribe Form */}
          <div className="rounded-2xl shadow-lg p-8 border"
               style={{
                 backgroundColor: 'var(--card-bg)',
                 borderColor: 'var(--card-border)',
                 boxShadow: 'var(--promo-shadow)'
               }}>

            {message && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center">
                  {message.type === 'success' ? (
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  {message.text}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: 'var(--background-color)',
                    borderColor: 'var(--card-border)',
                    color: 'var(--text-color)'
                  }}
                  placeholder="Enter the email address to unsubscribe"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  We'll remove this email from all future mailings
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    color: 'white'
                  }}
                >
                  {isSubmitting ? 'Unsubscribing...' : 'Unsubscribe'}
                </button>
              </div>
            </form>

            {/* Privacy Notice */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div className="text-sm space-y-2" style={{ color: 'var(--text-muted)' }}>
                <p><strong>Privacy Notice:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Your email will be removed from our mailing list within 48 hours</li>
                  <li>You may still receive emails that were already in transit</li>
                  <li>You can resubscribe at any time through our website</li>
                  <li>We respect your privacy and will not share your information</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Having trouble? Contact us at{' '}
              <a
                href="mailto:whoppromocodes@gmail.com"
                className="hover:opacity-80 transition-opacity"
                style={{ color: 'var(--accent-color)' }}
              >
                whoppromocodes@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 5. TERMS OF SERVICE PAGE

**File: `src/app/(public)/terms/page.tsx`**
```tsx
import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import DynamicLegalPage from '@/components/DynamicLegalPage';
import { siteOrigin } from '@/lib/site-origin';
import { SITE_BRAND } from '@/lib/brand';

// SSG configuration
export const dynamic = 'force-static'
export const fetchCache = 'force-cache'
export const revalidate = 86400 // 24h

export const metadata: Metadata = {
  title: `Terms of Service - ${SITE_BRAND}`,
  description: `Read the terms and conditions for using ${SITE_BRAND} deals platform and our affiliate services.`,
  alternates: {
// PHASE1-DEINDEX:     canonical: `${siteOrigin()}/terms`,
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
    title: `Terms of Service - ${SITE_BRAND}`,
    description: `Read the terms and conditions for using ${SITE_BRAND} deals platform and our affiliate services.`,
    url: `${siteOrigin()}/terms`,
    type: 'website',
    siteName: SITE_BRAND,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Terms of Service - ${SITE_BRAND}`,
    description: `Read the terms and conditions for using ${SITE_BRAND} deals platform and our affiliate services.`,
  },
};

// Default content if not found in database
const defaultTermsContent = `
<div class="section">
  <h2>Agreement to Terms</h2>
          <p>By accessing and using this website ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
</div>

<div class="section">
  <h2>Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials on this website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
  <ul>
    <li>Modify or copy the materials</li>
    <li>Use the materials for any commercial purpose or for any public display</li>
    <li>Attempt to reverse engineer any software contained on the website</li>
    <li>Remove any copyright or other proprietary notations from the materials</li>
  </ul>
</div>

<div class="section">
  <h2>Disclaimer</h2>
  <ul>
    <li><strong>Information Accuracy:</strong> The materials on this website are provided on an 'as is' basis. We make no warranties, expressed or implied.</li>
    <li><strong>Third-Party Services:</strong> We are not responsible for the content, policies, or practices of third-party websites that we link to.</li>
    <li><strong>Promotion Availability:</strong> Promotions and discounts are subject to change without notice. We do not guarantee the availability or terms of any promotional offers.</li>
  </ul>
</div>

<div class="section">
  <h2>Responsible Use</h2>
  <p>We promote responsible use of digital products and services. We encourage users to:</p>
  <ul>
    <li>Only purchase products and services you can afford</li>
    <li>Research products thoroughly before purchasing</li>
    <li>Read terms and conditions of products carefully</li>
    <li>Contact providers directly for product support</li>
  </ul>
  <p>If you have concerns about any product or service, please contact the provider directly or reach out to us through our contact form.</p>
</div>

<div class="section">
  <h2>Contact Information</h2>
  <p>If you have any questions about these Terms of Service, please contact us:</p>
  <p>Website: <a href="/contact">Contact Form</a></p>
</div>
`;

export default async function TermsOfService() {
  let legalPage;

  try {
    legalPage = await prisma.legalPage.findUnique({
      where: { slug: 'terms' }
    });
  } catch (error) {
    console.error('Error fetching terms of service:', error);
  }

  // If no page found in database, use default content
  if (!legalPage) {
    legalPage = {
      title: 'Terms of Service',
      content: defaultTermsContent,
      updatedAt: new Date().toISOString()
    };
  }

  const origin = siteOrigin();

  return (
    <>
      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service",
            description: `Read the terms and conditions for using ${SITE_BRAND} platform.`,
            url: `${origin}/terms`,
            mainEntity: {
              "@type": "Organization",
              name: SITE_BRAND,
              url: origin
            }
          })
        }}
      />

      <DynamicLegalPage
        title={legalPage.title}
        content={legalPage.content}
        lastUpdated={legalPage.updatedAt}
      />
    </>
  );
}
```

---

### 6. PRIVACY POLICY PAGE

**File: `src/app/(public)/privacy/page.tsx`**
```tsx
import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import DynamicLegalPage from '@/components/DynamicLegalPage';
import { siteOrigin } from '@/lib/site-origin';
import { SITE_BRAND } from '@/lib/brand';

// SSG configuration
export const dynamic = 'force-static'
export const fetchCache = 'force-cache'
export const revalidate = 86400 // 24h

export const metadata: Metadata = {
  title: `Privacy Policy - ${SITE_BRAND}`,
  description: `Learn how ${SITE_BRAND} collects, uses, and protects your information when you use our deals platform.`,
  alternates: {
// PHASE1-DEINDEX:     canonical: `${siteOrigin()}/privacy`,
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
    title: `Privacy Policy - ${SITE_BRAND}`,
    description: `Learn how ${SITE_BRAND} collects, uses, and protects your information when you use our deals platform.`,
    url: `${siteOrigin()}/privacy`,
    type: 'website',
    siteName: SITE_BRAND,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Privacy Policy - ${SITE_BRAND}`,
    description: `Learn how ${SITE_BRAND} collects, uses, and protects your information when you use our deals platform.`,
  },
};

// Default content if not found in database
const defaultPrivacyContent = `
<div class="section">
  <h2>Introduction</h2>
          <p>We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
</div>

<div class="section">
  <h2>Information We Collect</h2>

  <h3>Information You Provide</h3>
  <ul>
    <li>Contact information when you reach out to us</li>
    <li>Feedback and comments you submit</li>
    <li>Newsletter subscription information</li>
  </ul>

  <h3>Information Automatically Collected</h3>
  <ul>
    <li>Browser type and version</li>
    <li>Device information</li>
    <li>Pages visited and time spent on our site</li>
    <li>Referring website information</li>
    <li>Cookies and similar tracking technologies</li>
  </ul>
</div>

<div class="section">
  <h2>How We Use Your Information</h2>
  <ul>
    <li><strong>Provide Services:</strong> To operate and maintain our website and provide product information</li>
    <li><strong>Improve Experience:</strong> To analyze usage patterns and improve our content and user experience</li>
    <li><strong>Communication:</strong> To respond to your inquiries and send important updates</li>
    <li><strong>Analytics:</strong> To track website performance and user engagement</li>
    <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
  </ul>
</div>

<div class="section">
  <h2>Information Sharing</h2>
  <p>We do not sell, trade, or rent your personal information. We may share information in the following circumstances:</p>
  <ul>
    <li><strong>Affiliate Partners:</strong> When you click on offer links, you may be redirected to our affiliate partners</li>
    <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our website</li>
    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
    <li><strong>Business Transfers:</strong> In connection with a merger, sale, or transfer of assets</li>
  </ul>
</div>

<div class="section">
  <h2>Contact Us</h2>
  <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
  <p>Website: <a href="/contact">Contact Form</a></p>
</div>
`;

export default async function PrivacyPolicy() {
  let legalPage;

  try {
    legalPage = await prisma.legalPage.findUnique({
      where: { slug: 'privacy' }
    });
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
  }

  // If no page found in database, use default content
  if (!legalPage) {
    legalPage = {
      title: 'Privacy Policy',
      content: defaultPrivacyContent,
      updatedAt: new Date().toISOString()
    };
  }

  const origin = siteOrigin();

  return (
    <>
      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy",
            description: `Learn how ${SITE_BRAND} collects, uses, and protects your information.`,
            url: `${origin}/privacy`,
            mainEntity: {
              "@type": "Organization",
              name: SITE_BRAND,
              url: origin
            }
          })
        }}
      />

      <DynamicLegalPage
        title={legalPage.title}
        content={legalPage.content}
        lastUpdated={legalPage.updatedAt}
      />
    </>
  );
}
```

**File: `src/components/DynamicLegalPage.tsx`**
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
      return path; // English uses root paths
    }
    return `/${language}${path}`; // Other languages use language prefix
  };

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Use appropriate locale for date formatting
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

  // Determine if this is privacy or terms page based on title
  const isPrivacyPage = title.toLowerCase().includes('privacy') || title.toLowerCase().includes('privacidad') || title.toLowerCase().includes('privacybeleid') || title.toLowerCase().includes('confidentialité') || title.toLowerCase().includes('datenschutz') || title.toLowerCase().includes('politica') || title.toLowerCase().includes('privacidade') || title.toLowerCase().includes('隐私');

  // Generate translated content
  const generateTranslatedContent = () => {
    if (isPrivacyPage) {
      return `
        <div class="section">
          <h2>${t('privacy.introduction.title')}</h2>
          <p>${t('privacy.introduction.content')}</p>
        </div>

        <div class="section">
          <h2>${t('privacy.infoCollect.title')}</h2>

          <h3>${t('privacy.infoProvide.title')}</h3>
          <p>${t('privacy.infoProvide.content').replace(/\n/g, '<br>')}</p>

          <h3>${t('privacy.infoAuto.title')}</h3>
          <p>${t('privacy.infoAuto.content').replace(/\n/g, '<br>')}</p>
        </div>

        <div class="section">
          <h2>${t('privacy.howUse.title')}</h2>
          <p>${t('privacy.howUse.content').replace(/\n/g, '<br>')}</p>
        </div>

        <div class="section">
          <h2>${t('privacy.sharing.title')}</h2>
          <p>${t('privacy.sharing.content').replace(/\n/g, '<br>').replace(/\n\n/g, '<br><br>')}</p>
        </div>

        <div class="section">
          <h2>${t('privacy.cookies.title')}</h2>
          <p>${t('privacy.cookies.content').replace(/\n/g, '<br>').replace(/\n\n/g, '<br><br>')}</p>
        </div>

        <div class="section">
          <h2>${t('privacy.security.title')}</h2>
          <p>${t('privacy.security.content').replace(/\n/g, '<br>')}</p>
        </div>

        <div class="section">
          <h2>${t('privacy.rights.title')}</h2>
          <p>${t('privacy.rights.content').replace(/\n/g, '<br>')}</p>
        </div>

        <div class="section">
          <h2>${t('privacy.contact.title')}</h2>
          <p>${t('privacy.contact.content').replace(/\n/g, '<br>')}</p>
        </div>
      `;
    } else {
      // Terms of Service
      return `
        <div class="section">
          <h2>${t('terms.agreement.title')}</h2>
          <p>${t('terms.agreement.content')}</p>
        </div>

        <div class="section">
          <h2>${t('terms.license.title')}</h2>
          <p>${t('terms.license.content').replace(/\n/g, '<br>')}</p>
        </div>

        <div class="section">
          <h2>${t('terms.disclaimer.title')}</h2>
          <p>${t('terms.disclaimer.content').replace(/\n/g, '<br>')}</p>
        </div>

        <div class="section">
          <h2>${t('terms.responsible.title')}</h2>
          <p>${t('terms.responsible.content').replace(/\n/g, '<br>').replace(/\n\n/g, '<br><br>')}</p>
        </div>

        <div class="section">
          <h2>${t('terms.contactInfo.title')}</h2>
          <p>${t('terms.contactInfo.content').replace(/\n/g, '<br>')}</p>
        </div>
      `;
    }
  };

  return (
    <>
      <main className="min-h-screen py-12 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
        <div className="mx-auto w-[90%] md:w-[95%] max-w-[800px]">
          <div className="mb-8">
            <Link
              href={getLocalizedPath('/')}
              className="inline-flex items-center gap-2 transition-colors duration-200 mb-6 hover:opacity-80"
              style={{ color: 'var(--accent-color)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              {t('legal.backToHome')}
            </Link>

            <h1 className="text-4xl font-bold mb-4">
              {isPrivacyPage ? t('privacy.title') : t('terms.title')}
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              {t('legal.lastUpdated')}: {formatDate(lastUpdated)}
            </p>
          </div>

          <div
            className="legal-content-wrapper"
            dangerouslySetInnerHTML={{ __html: generateTranslatedContent() }}
          />
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
          .legal-content-wrapper h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            margin-top: 2rem;
            color: var(--text-color);
          }

          .legal-content-wrapper h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            margin-top: 1.5rem;
            color: var(--accent-color);
          }

          .legal-content-wrapper p {
            margin-bottom: 1rem;
            line-height: 1.6;
            color: var(--text-secondary);
          }

          .legal-content-wrapper ul, .legal-content-wrapper ol {
            margin-bottom: 1rem;
            padding-left: 1.5rem;
          }

          .legal-content-wrapper li {
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
          }

          .legal-content-wrapper strong {
            color: var(--text-color);
            font-weight: 600;
          }

          .legal-content-wrapper a {
            color: var(--accent-color);
            text-decoration: none;
            transition: opacity 0.2s;
          }

          .legal-content-wrapper a:hover {
            opacity: 0.8;
          }

          .legal-content-wrapper .section {
            background: var(--background-secondary);
            border-radius: 0.75rem;
            padding: 1.5rem;
            border: 1px solid var(--border-color);
            margin-bottom: 2rem;
          }
        `
      }} />
    </>
  );
}
```

---

### 7. PROMO CODE SUBMISSION FORM

**File: `src/components/PromoCodeSubmissionForm.tsx`**
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
  preselectedOfferId?: string; // For deal-specific submissions
  preselectedOfferName?: string; // For displaying the preselected deal name
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
    isGeneral: !preselectedOfferId, // Default to general if no preselected course
    offerId: preselectedOfferId || '',
    customCourseName: '', // For new courses
    isNewCourse: false,
  });

  // Initialize search term with preselected course name only once
  useEffect(() => {
    if (preselectedOfferName && !searchTerm) {
      setSearchTerm(preselectedOfferName);
      setDebouncedSearchTerm(preselectedOfferName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedOfferName]);

  // Optimized debounce with shorter delay for instant feel
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 100);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Server-side search with request cancellation
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
        console.error('Error searching courses:', error);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsSearching(false);
      }
    }
  }, []);

  // Trigger search when debounced term changes
  useEffect(() => {
    if (showDropdown) {
      searchWhops(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, showDropdown, searchWhops]);

  // Get selected course name efficiently
  const selectedCourseName = useMemo(() => {
    if (formData.isNewCourse) return formData.customCourseName;
    const selectedOffer = searchResults.find((w) => w.id === formData.offerId);
    return selectedOffer?.name || '';
  }, [searchResults, formData.offerId, formData.isNewCourse, formData.customCourseName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Base validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.submitterName ||
      !formData.submitterEmail
    ) {
      alert('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.code.trim() || !formData.value.trim()) {
      alert(
        'Please provide both a promo code and discount value. If no code is required, enter "No code required" in the promo code field.'
      );
      setIsSubmitting(false);
      return;
    }

    // Course-specific validation
    if (!formData.isGeneral && !formData.offerId && !formData.isNewCourse) {
      alert(
        'Please select a course or mark it as a new course for course-specific submissions.'
      );
      setIsSubmitting(false);
      return;
    }

    if (
      !formData.isGeneral &&
      formData.isNewCourse &&
      !formData.customCourseName.trim()
    ) {
      alert('Please enter the name of the new course.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/promo-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          offerId: formData.isGeneral
            ? null
            : formData.isNewCourse
            ? null
            : formData.offerId,
          customCourseName: formData.isNewCourse
            ? formData.customCourseName
            : null,
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
        }, 15000);
      } else {
        throw new Error('Failed to submit promo code');
      }
    } catch (error) {
      console.error('Error submitting promo code:', error);
      alert('Failed to submit promo code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCourseSelect = useCallback((whop: DealSearchResult) => {
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

  const handleNewCourse = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      isNewCourse: true,
      offerId: '',
      customCourseName: searchTerm,
    }));
    setShowDropdown(false);
  }, [searchTerm]);

  // Cleanup on unmount
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

  /* =====================
     SUCCESS STATE MODAL
     ===================== */
  if (showSuccessMessage) {
    return (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border shadow-theme-promo transition-theme p-8 text-center"
          style={{
            backgroundColor: 'var(--background-color)',
            borderColor: 'var(--border-color)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleCloseSuccess}
            className="absolute top-4 right-4 hover:opacity-80 text-2xl font-bold"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Close"
          >
            ×
          </button>
          <div className="mb-6">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(22, 163, 74, 0.12)' }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: 'var(--accent-color)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--text-color)' }}
            >
              Thank You! 🎉
            </h3>
            <p
              className="text-lg leading-relaxed"
              style={{ color: 'var(--text-color)' }}
            >
              You&apos;re awesome! Thanks for making our community better by
              sharing this promo code. Your contribution adds real value and
              helps fellow members save money.
            </p>
            <p
              className="mt-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              We&apos;ll review your submission and add it to the site once
              approved. Keep being amazing! ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =====================
     MAIN FORM MODAL
     ===================== */
  const handleOverlayClick = () => {
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 sm:px-6"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)' }}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-theme-promo transition-theme"
        style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header row */}
        <div
          className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-3 border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div>
            <h2
              className="text-lg sm:text-xl font-bold"
              style={{ color: 'var(--text-color)' }}
            >
              Submit a promo code
            </h2>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Share a promo you&apos;ve found and we&apos;ll review it for the community.
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[var(--background-color)] transition-colors"
              aria-label="Close"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Form body - TRUNCATED FOR LENGTH - see full file for complete form */}
        <div className="px-5 sm:px-6 py-5">
          {/* ... full form implementation ... */}
        </div>
      </div>
    </div>
  );
}
```

**File: `src/components/PromoCodeSubmissionButton.tsx`**
```tsx
'use client'
import { useState } from 'react'
import PromoCodeSubmissionForm from './PromoCodeSubmissionForm'

interface PromoCodeSubmissionButtonProps {
  offerId: string
  whopName: string
}

export default function PromoCodeSubmissionButton({ offerId, whopName }: PromoCodeSubmissionButtonProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <section
        className="rounded-2xl border shadow-theme-promo px-6 py-6 sm:px-7 sm:py-7 transition-theme"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex flex-col gap-4 sm:gap-5 text-left">
          <div>
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--text-color)' }}
            >
              Know a better code?
            </h3>
            <p
              className="text-base leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Help the community by submitting a promo code for {whopName}
            </p>
          </div>

          <div className="w-full flex sm:justify-start">
            <button
              onClick={() => setShowForm(true)}
              type="button"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all duration-150"
              style={{
                backgroundColor: 'var(--background-tertiary)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)',
              }}
            >
              Submit a promo for this offer
            </button>
          </div>
        </div>
      </section>

      {/* Submission Form Modal */}
      {showForm && (
        <PromoCodeSubmissionForm
          preselectedOfferId={offerId}
          preselectedOfferName={whopName}
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}
    </>
  )
}
```

---

### 8. API ROUTES (for reference)

**File: `src/app/api/mailing-list/subscribe/route.ts`**
```tsx
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SubscribeSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  email: z.string().trim().toLowerCase().email().max(320),
  source: z.string().optional().default('vip'),
});

// POST /api/mailing-list/subscribe - Subscribe user to mailing list
export async function POST(req: Request) {
  // ... implementation
}
```

**File: `src/app/api/mailing-list/unsubscribe/route.ts`**
```tsx
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// POST /api/mailing-list/unsubscribe - Unsubscribe user from mailing list
export async function POST(request: NextRequest) {
  // ... implementation
}
```

**File: `src/app/api/contact/route.ts`**
```tsx
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendContactEmail, sendAutoReply } from '@/lib/email';
import { z } from 'zod';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().toLowerCase().max(320),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional().or(z.literal('')), // Honeypot
});

// POST /api/contact - Submit contact form
export async function POST(req: Request) {
  // ... implementation
}
```

---

## ISSUES TO FIX

1. **Subscribe page** still references "Whop promo codes" - needs to be generic "digital promo codes"
2. **All pages** have similar card/section layouts - need differentiated designs
3. **Gradient headers** are used everywhere - need variety
4. **Checkmark lists** pattern repeated too much
5. **"VIP List"** terminology may not fit the brand
6. **Legal pages** use same DynamicLegalPage component - could have unique layouts

## DESIGN REQUEST

Please provide a complete redesign for all these pages that:
1. Creates unique, differentiated layouts for each page
2. Removes any "Whop" or old branding references
3. Introduces new visual patterns (not just rounded cards with checkmarks)
4. Maintains the CSS variable theming system
5. Uses the deep green (#166534) accent color appropriately
6. Creates a cohesive but distinct visual identity for each section
7. Updates all copy to be WhopPromoCodes-focused (digital products, verified promo codes, savings)
