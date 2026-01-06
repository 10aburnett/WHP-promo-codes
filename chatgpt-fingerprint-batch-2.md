# Fingerprint Reset Batch 2 - Remaining Files

These files have NOT been touched yet and need fingerprint reset. Please provide surgical, line-level copy changes for each file - change the wording while preserving code structure, imports, props, and logic.

---

## FILE 1: src/app/layout.tsx (Root Layout - Meta Tags)

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import Script from 'next/script';
import { GA_TRACKING_ID } from '@/lib/analytics';
import ForceDebugClient from './_force-debug-client';
import { SITE_BRAND, SITE_DESCRIPTION, SITE_AUTHOR } from '@/lib/brand';
import { siteOrigin } from '@/lib/site-origin';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent FOIT (Flash of Invisible Text)
  preload: true,
  fallback: ['system-ui', 'arial']
});
const currentYear = new Date().getFullYear();

// Use a static version for cache busting to prevent hydration mismatches
const STATIC_VERSION = '1.0.0';

// Cache the favicon fetching for 1 hour with better error handling
const getFaviconUrl = unstable_cache(
  async () => {
    try {
      const settings = await prisma.settings.findFirst();
      const baseUrl = settings?.faviconUrl || '/favicon.ico';
      // Use static version to prevent hydration mismatches
      return `${baseUrl}?v=${STATIC_VERSION}`;
    } catch (error) {
      console.error('Error fetching favicon from settings:', error);
      return `/favicon.ico?v=${STATIC_VERSION}`;
    }
  },
  ['favicon-url'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['favicon']
  }
);

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl = '/favicon.ico'; // Default fallback

  try {
    faviconUrl = await getFaviconUrl();
  } catch (error) {
    console.error('Error in generateMetadata favicon fetch:', error);
    // Use default favicon if there's an error
    faviconUrl = `/favicon.ico?v=${STATIC_VERSION}`;
  }

  const origin = siteOrigin();

  return {
    title: `${SITE_BRAND} - Verified Promo Codes & Exclusive Deals ${currentYear}`,
    description: SITE_DESCRIPTION,
    keywords: 'promo codes, discount codes, deals, coupons, digital product discounts, community access codes, course promo codes, exclusive discounts, verified codes',
    metadataBase: new URL(origin),
    openGraph: {
      title: `${SITE_BRAND} - Verified Promo Codes & Exclusive Deals ${currentYear}`,
      description: SITE_DESCRIPTION,
      url: origin,
      type: 'website',
      siteName: SITE_BRAND,
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `${SITE_BRAND} - Verified Promo Codes & Exclusive Deals`
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_BRAND} - Verified Promo Codes & Exclusive Deals ${currentYear}`,
      description: SITE_DESCRIPTION,
      images: ['/logo.png'],
    },
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: false,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
    icons: {
      icon: [
        {
          url: faviconUrl,
          type: 'image/svg+xml',
        },
        {
          url: faviconUrl.replace('.svg', '.ico'),
          sizes: '32x32',
          type: 'image/x-icon',
        }
      ],
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

// Export viewport separately (Next.js 14+ best practice)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    // Light mode: fintech accent green
    { media: '(prefers-color-scheme: light)', color: '#047857' }, // emerald-800
    // Dark mode: deep slate background
    { media: '(prefers-color-scheme: dark)', color: '#020617' },  // slate-950
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let faviconUrl = '/favicon.ico'; // Default fallback

  try {
    faviconUrl = await getFaviconUrl();
  } catch (error) {
    console.error('Error in RootLayout favicon fetch:', error);
    // Use default favicon if there's an error
    faviconUrl = `/favicon.ico?v=${STATIC_VERSION}`;
  }

  return (
    <html lang="en">
      <head>
        {/* viewport and robots now managed via viewport export and generateMetadata */}
        <meta name="author" content={SITE_AUTHOR} />
        <meta name="language" content="en" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="1 days" />
        <meta property="og:locale" content="en_US" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://assets.whop.com" crossOrigin="" />
        <link rel="preconnect" href="https://img-v2-prod.whop.com" crossOrigin="" />
        {/* dns-prefetch for dynamic origin handled by siteOrigin() */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="preload" href="/logo.png" as="image" />
        {/* Comprehensive favicon setup for all browsers */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <meta name="msapplication-TileColor" content="#047857" />
        <meta name="theme-color" content="#047857" />
        {/* Only include manifest in production to avoid 401s on Vercel protected previews */}
        {process.env.VERCEL_ENV === 'production' && (
          <link rel="manifest" href="/site.webmanifest" />
        )}
      </head>
      <body className={`${inter.className} overflow-x-hidden`} style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
        <ForceDebugClient />
        {children}

        {/* Google Analytics – load once at root */}
        {GA_TRACKING_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="lazyOnload"
            />
            <Script id="ga-init" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}');
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
```

---

## FILE 2: src/app/(public)/layout.tsx (Public Layout - Meta Tags)

```tsx
import type { Metadata } from 'next';
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import { absoluteUrl } from '@/lib/urls';
import { buildOrgSite } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import { siteOrigin } from '@/lib/site-origin';
import { SITE_BRAND, SITE_TAGLINE, SITE_DESCRIPTION } from '@/lib/brand';

const currentYear = new Date().getFullYear();

// Use a static version for cache busting to prevent hydration mismatches
const STATIC_VERSION = '1.0.0';

// Cache the favicon fetching for 1 hour with better error handling
const getFaviconUrl = unstable_cache(
  async () => {
    try {
      const settings = await prisma.settings.findFirst();
      const baseUrl = settings?.faviconUrl || '/favicon.ico';
      // Use static version to prevent hydration mismatches
      return `${baseUrl}?v=${STATIC_VERSION}`;
    } catch (error) {
      console.error('Error fetching favicon from settings:', error);
      return `/favicon.ico?v=${STATIC_VERSION}`;
    }
  },
  ['favicon-url'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['favicon']
  }
);

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl = '/favicon.ico'; // Default fallback

  try {
    faviconUrl = await getFaviconUrl();
  } catch (error) {
    console.error('Error in generateMetadata favicon fetch:', error);
    // Use default favicon if there's an error
    faviconUrl = `/favicon.ico?v=${STATIC_VERSION}`;
  }

  const title = `${SITE_BRAND} - Verified Promo Codes & Exclusive Deals ${currentYear}`;
  const description = `${SITE_DESCRIPTION} Find verified promo codes, discount codes & exclusive offers for ${currentYear}. Updated daily!`;

  return {
    title,
    description,
    keywords: 'promo codes, discount codes, deals, coupons, digital product discounts, community access, course discounts, exclusive offers, verified codes',
    metadataBase: new URL(siteOrigin()),
    openGraph: {
      title,
      description,
      url: siteOrigin(),
      type: 'website',
      siteName: SITE_BRAND,
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `${SITE_BRAND} - Verified Promo Codes & Exclusive Deals`
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_BRAND} - Verified Promo Codes & Exclusive Deals ${currentYear}`,
      description,
      images: ['/logo.png'],
      // Twitter handles removed until new brand accounts exist
    },
    verification: {
      google: 'your-google-verification-code',
    },
    icons: {
      icon: [
        {
          url: faviconUrl,
          type: 'image/svg+xml',
        },
        {
          url: faviconUrl.replace('.svg', '.ico'),
          sizes: '32x32',
          type: 'image/x-icon',
        }
      ],
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let faviconUrl = '/favicon.ico'; // Default fallback

  try {
    faviconUrl = await getFaviconUrl();
  } catch (error) {
    console.error('Error in PublicLayout favicon fetch:', error);
    // Use default favicon if there's an error
    faviconUrl = `/favicon.ico?v=${STATIC_VERSION}`;
  }

  // Build Organization + WebSite JSON-LD (SSR only, no DB queries)
  const orgSiteSchema = buildOrgSite({
    org: {
      name: SITE_BRAND,
      url: absoluteUrl(),
      logo: absoluteUrl('/logo.png'),
      // sameAs removed until new brand social accounts exist
    },
    site: {
      name: SITE_BRAND,
      url: absoluteUrl(),
      searchTarget: absoluteUrl('/?search={search_term_string}')
    }
  });

  return (
    <>
      <JsonLd data={orgSiteSchema[0]} />
      <JsonLd data={orgSiteSchema[1]} />
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider>
            <ConditionalLayout faviconUrl={faviconUrl}>
              {children}
            </ConditionalLayout>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
      <Toaster position="top-right" />
    </>
  );
}
```

---

## FILE 3: src/app/error.tsx (Global Error Page)

```tsx
'use client';

import { useEffect } from 'react';
import ErrorState from '@/components/layout/ErrorState';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <ErrorState
      variant="error"
      title="We hit a snag loading this page"
      description="An unexpected error occurred while loading this part of WhopPromoCodes. Our team is automatically notified so we can look into it."
      onRetry={reset}
      secondaryCta={{ href: '/', label: 'Back to homepage' }}
    />
  );
}
```

---

## FILE 4: src/app/not-found.tsx (Global 404 Page)

```tsx
import ErrorState from '@/components/layout/ErrorState';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found | WhopPromoCodes',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <ErrorState
      variant="not-found"
      title="We couldn't find that page"
      description="This link doesn't match any promo or product on WhopPromoCodes. It might have moved, expired, or never existed."
      primaryCta={{ href: '/', label: 'Back to homepage' }}
      secondaryCta={{ href: '/blog', label: 'Read our blog' }}
    />
  );
}
```

---

## FILE 5: src/app/(public)/offer/[slug]/error.tsx (Offer Error Page)

```tsx
'use client';

import { useEffect } from 'react';
import ErrorState from '@/components/layout/ErrorState';

export default function OfferError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Offer page error:', error);
  }, [error]);

  return (
    <ErrorState
      variant="error"
      title="We couldn't load this offer"
      description="An error occurred while loading this offer page on WhopPromoCodes. Our team has been notified."
      onRetry={reset}
      secondaryCta={{ href: '/', label: 'Browse all deals' }}
    />
  );
}
```

---

## FILE 6: src/app/(public)/offer/[slug]/not-found.tsx (Offer 404 Page)

```tsx
import ErrorState from '@/components/layout/ErrorState';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offer not found | WhopPromoCodes',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfferNotFound() {
  return (
    <ErrorState
      variant="not-found"
      title="This offer isn't available"
      description="We can't find an active promo page for this product on WhopPromoCodes. It may have expired, been removed by the creator, or the link may be incorrect."
      primaryCta={{ href: '/', label: 'Browse current deals' }}
      secondaryCta={{ href: '/blog', label: 'Read our blog' }}
    />
  );
}
```

---

## FILE 7: src/lib/brand.ts (Brand Constants)

```ts
// src/lib/brand.ts
// Centralised brand configuration for SEO metadata and JSON-LD

/**
 * Site brand name - used in titles, metadata, and JSON-LD
 */
export const SITE_BRAND = 'WhopPromoCodes';

/**
 * Site name (alias for SITE_BRAND)
 */
export const SITE_NAME = 'WhopPromoCodes';

/**
 * Site domain (without protocol)
 */
export const SITE_DOMAIN = 'whoppromocodes.com';

/**
 * Full site URL with protocol
 */
export const SITE_URL = 'https://whoppromocodes.com';

/**
 * Short tagline for the site - used in descriptions
 */
export const SITE_TAGLINE = 'Verified Discounts for Digital Products, Tools & Online Memberships';

/**
 * Longer description for home/about pages
 */
export const SITE_DESCRIPTION = 'Your trusted source for verified promo codes, discount codes & exclusive deals on digital products, online tools, courses, and memberships.';

/**
 * Default author/publisher name for content
 */
export const SITE_AUTHOR = 'WhopPromoCodes Team';

/**
 * Social media handles (without @)
 */
export const SOCIAL_HANDLES = {
  twitter: '',
  facebook: '',
};

/**
 * Contact email
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'whoppromocodes@gmail.com';
```

---

## FILE 8: src/lib/email.ts (Email Templates)

```ts
import nodemailer from 'nodemailer';
import { SITE_BRAND, CONTACT_EMAIL } from '@/lib/brand';
import { siteOrigin } from '@/lib/site-origin';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Create email transporter
const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || '',
    },
  };

  return nodemailer.createTransport(config);
};

// Send contact form email
export const sendContactEmail = async (data: ContactEmailData): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || 'whoppromocodes@gmail.com',
    to: 'whoppromocodes@gmail.com',
    subject: `Contact Form: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #6366f1; margin-top: 0;">Contact Details</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
          <h3 style="color: #6366f1; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #666; font-size: 12px;">
          <p>This email was sent from the ${SITE_BRAND} contact form.</p>
          <p>Reply directly to this email to respond to ${data.name} at ${data.email}</p>
        </div>
      </div>
    `,
    replyTo: data.email,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Contact email sent successfully');
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw new Error('Failed to send email');
  }
};

// Send auto-reply email to the user
export const sendAutoReply = async (data: ContactEmailData): Promise<void> => {
  const transporter = createTransporter();
  const origin = siteOrigin();

  const mailOptions = {
    from: process.env.SMTP_FROM || CONTACT_EMAIL,
    to: data.email,
    subject: `Thank you for contacting us - We've received your message`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
          Thank you for contacting ${SITE_BRAND}
        </h2>

        <p>Hi ${data.name},</p>

        <p>Thank you for reaching out to us! We've received your message and will get back to you as soon as possible.</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #6366f1; margin-top: 0;">Your Message Summary</h3>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; line-height: 1.6; font-style: italic;">${data.message}</p>
        </div>

        <div style="background-color: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #6366f1; margin-top: 0;">What happens next?</h3>
          <ul style="line-height: 1.6;">
            <li>Our team will review your message within 24 hours</li>
            <li>We'll respond to you directly at ${data.email}</li>
            <li>For urgent matters, please mention "URGENT" in the subject line</li>
          </ul>
        </div>

        <p>In the meantime, feel free to explore our latest deals at <a href="${origin}" style="color: #6366f1;">${SITE_BRAND}</a></p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #666; font-size: 12px;">
          <p>Best regards,<br>The ${SITE_BRAND} Team</p>
          <p>Visit us: <a href="${origin}" style="color: #6366f1;">${origin}</a></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Auto-reply email sent successfully');
  } catch (error) {
    console.error('Error sending auto-reply email:', error);
    // Don't throw here as auto-reply is not critical
  }
};

// Test email configuration
export const testEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration test failed:', error);
    return false;
  }
};
```

---

## FILE 9: src/lib/buildSchema.ts (JSON-LD Schema Builder)

```ts
// src/lib/buildSchema.ts
// NOTE: never import DB here; accepts only plain objects from page/layout.
import 'server-only';
import { absoluteUrl } from '@/lib/urls';

export type OfferViewModel = {
  // identity
  slug: string;
  url: string;                   // absolute canonical for this locale page
  inLanguage?: string;           // e.g., 'en', 'de'

  // display fields
  name: string;
  description?: string | null;
  images?: string[];             // absolute URLs, 0..3 items recommended
  brand?: string | { name: string; url?: string }; // visible provider label

  // commerce (must be visible on page to include)
  price?: number | null;        // regular price shown in UI (if shown)
  promoPrice?: number | null;   // promo price shown in UI (if shown)
  currency?: string | null;     // ISO 4217 (e.g., 'USD','GBP','EUR')

  // Promo window (only if UI shows it)
  promoValidUntil?: string | null;    // ISO 8601 date, if the promo is time-boxed and shown

  // Availability (from reliable signal per your rule)
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | null;
  availabilityStarts?: string | null; // ISO 8601 start date if PreOrder and shown

  // Renewal note (visible text, if you disclose renewal impact)
  priceNote?: string | null; // e.g., "Intro price first month; renews at £39"

  // ratings (only when visibly rendered AND > 0)
  ratingValue?: number | null;
  reviewCount?: number | null;

  // Optional: individual reviews IF they are rendered on the page (mirror exactly)
  reviews?: Array<{
    authorName: string;          // visible author display name
    ratingValue: number;         // 1..5 (or your scale)
    body: string;                // visible review text (plain)
    datePublishedISO?: string;   // ISO 8601 date if shown (e.g., '2025-07-14')
    url?: string;                // absolute permalink if you link to it
  }>;

  // IA
  category?: string | null;      // visible category name
  breadcrumbs?: Array<{ name: string; url: string }>; // absolute URLs in visible order

  // Primary type hint (optional; else choose Product)
  primaryType?: 'Product' | 'Course' | 'SoftwareApplication' | 'Service';

  // FAQs: must be exactly what the UI renders (same order & punctuation)
  faq?: Array<{ question: string; answer: string }>;

  // HowTo: only if UI shows genuine steps (redemption flow etc.)
  steps?: Array<{ title: string; text: string }>;

  // Internal linking (absolute URLs, ordered exactly like UI)
  recommendedUrls?: string[];   // absolute URLs, ordered exactly like UI
  alternativeUrls?: string[];   // absolute URLs, ordered exactly like UI
};

function brandNode(brand: OfferViewModel['brand']) {
  if (!brand) return undefined;
  if (typeof brand === 'string') return brand;
  if (brand.name) {
    const node: any = { "@type": "Organization", name: brand.name };
    if (brand.url) node.url = brand.url;
    return node;
  }
  return undefined;
}

export function buildPrimaryEntity(vm: OfferViewModel) {
  const type = vm.primaryType ?? 'Product'; // default
  const idSuffix =
    type === 'Product' ? 'product'
    : type === 'Course' ? 'course'
    : type === 'SoftwareApplication' ? 'software'
    : 'service';

  const entity: any = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${vm.url}#${idSuffix}`,
    url: vm.url,
    name: vm.name,
  };

  if (vm.description) entity.description = vm.description;
  if (vm.inLanguage) entity.inLanguage = vm.inLanguage;

  // images: filter truthy & dedupe; limit to 3
  const imgs = (vm.images ?? []).filter(Boolean);
  if (imgs.length) entity.image = imgs.slice(0, 3);

  const brand = brandNode(vm.brand);
  if (brand) entity.brand = brand;

  // Ratings: only if both > 0 and visibly rendered
  if (vm.reviewCount && vm.reviewCount > 0 && vm.ratingValue && vm.ratingValue > 0) {
    entity.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(vm.ratingValue).toFixed(1),
      reviewCount: vm.reviewCount
    };
  }

  // Offers block is handled in Step 3; DO NOT add here.
  return entity;
}

export function buildBreadcrumbList(vm: OfferViewModel) {
  const crumbs = vm.breadcrumbs && vm.breadcrumbs.length
    ? vm.breadcrumbs
    : [
        { name: 'Home', url: absoluteUrl('/') },
        ...(vm.category
          ? [{ name: vm.category, url: absoluteUrl(`/category/${encodeURIComponent(vm.category.toLowerCase().replace(/\s+/g, '-'))}`) }]
          : []),
        { name: vm.name, url: vm.url }
      ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url
    }))
  };
}

export function buildOffers(vm: OfferViewModel) {
  const offers: any[] = [];

  // Guard: need currency + at least one visible price
  const hasRegular = vm.price != null && vm.currency;
  const hasPromo   = vm.promoPrice != null && vm.currency;

  if (!hasRegular && !hasPromo) return undefined;

  // Helper to stringify price
  const money = (n: number) => String(n);

  // Regular price (only if UI shows it)
  if (hasRegular) {
    const regular: any = {
      "@type": "Offer",
      url: vm.url,                       // absolute URL to this page
      price: money(vm.price as number),
      priceCurrency: vm.currency,
    };
    // Availability: only if reliable & shown
    if (vm.availability) {
      regular.availability = `https://schema.org/${vm.availability}`;
      if (vm.availability === 'PreOrder' && vm.availabilityStarts) {
        regular.availabilityStarts = vm.availabilityStarts;
      }
    }
    // Optional: renewal/price note if visibly disclosed
    if (vm.priceNote) {
      regular.description = vm.priceNote;
    }
    offers.push(regular);
  }

  // Promo price (only if UI shows it)
  if (hasPromo) {
    const promo: any = {
      "@type": "Offer",
      url: vm.url,
      price: money(vm.promoPrice as number),
      priceCurrency: vm.currency,
    };
    // Availability mirrors the same logic
    if (vm.availability) {
      promo.availability = `https://schema.org/${vm.availability}`;
      if (vm.availability === 'PreOrder' && vm.availabilityStarts) {
        promo.availabilityStarts = vm.availabilityStarts;
      }
    }
    // If a real, visible end date exists, include it
    if (vm.promoValidUntil) {
      promo.priceValidUntil = vm.promoValidUntil;
    }
    if (vm.priceNote) {
      promo.description = vm.priceNote;
    }
    offers.push(promo);
  }

  // If we added nothing, return undefined
  return offers.length ? offers : undefined;
}

// Normalize to plain text (keep links as plaintext). We assume inputs are already plain,
// but this is a defensive cleanup if UI strings include simple markup.
function toPlain(x?: string | null) {
  if (!x) return undefined;
  // very light strip: remove basic HTML tags if any slipped in
  return x.replace(/<[^>]*>/g, '').trim();
}

export function buildFAQ(vm: OfferViewModel) {
  const qa = vm.faq?.filter(q => q?.question && q?.answer).map(q => ({
    "@type": "Question",
    name: toPlain(q.question),
    acceptedAnswer: { "@type": "Answer", text: toPlain(q.answer) }
  }));

  if (!qa || qa.length === 0) return undefined;

  const node: any = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${vm.url}#faq`,
    mainEntity: qa
  };
  if (vm.inLanguage) node.inLanguage = vm.inLanguage;
  return node;
}

export function buildHowTo(vm: OfferViewModel) {
  const steps = vm.steps?.filter(s => s?.title || s?.text).map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: toPlain(s.title) ?? `Step ${i + 1}`,
    text: toPlain(s.text) ?? undefined
  }));

  if (!steps || steps.length === 0) return undefined;

  const node: any = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${vm.url}#howto`,
    name: `How to redeem ${toPlain(vm.name)}`,
    step: steps
  };
  if (vm.inLanguage) node.inLanguage = vm.inLanguage;
  return node;
}

function uniqPreserveOrder<T>(xs: T[]) {
  const seen = new Set<string>();
  return xs.filter((x: any) => {
    const key = typeof x === 'string' ? x : JSON.stringify(x);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeUrls(urls?: string[], selfUrl?: string) {
  if (!urls) return [];
  const cleaned = urls
    .filter(Boolean)
    .map(u => String(u).trim())
    .filter(u => /^https?:\/\//i.test(u));        // absolute only
  const deduped = uniqPreserveOrder(cleaned);
  return selfUrl ? deduped.filter(u => u !== selfUrl) : deduped;
}

export function buildItemList(
  idSuffix: 'recommended' | 'alternatives',
  urls: string[] | undefined,
  selfUrl: string
) {
  const list = normalizeUrls(urls, selfUrl);
  if (!list.length) return undefined;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${selfUrl}#${idSuffix}`,
    "name": idSuffix === 'recommended' ? "Recommended for You" : "You might also consider…",
    "itemListElement": list.map((u, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": u
    }))
  };
}

function clampRating(n: number) {
  // If your UI uses 1..5, keep it; adjust only if needed
  return Math.max(0, Math.min(5, n));
}

export function buildReviews(vm: OfferViewModel) {
  const list = vm.reviews?.filter(r =>
    r &&
    typeof r.ratingValue === 'number' &&
    r.authorName &&
    r.body
  );
  if (!list || list.length === 0) return undefined;

  return list.map((r) => {
    const rev: any = {
      "@type": "Review",
      author: { "@type": "Person", name: r.authorName },
      reviewBody: r.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: clampRating(r.ratingValue),
        bestRating: 5,
        worstRating: 1
      }
    };
    if (r.datePublishedISO) rev.datePublished = r.datePublishedISO;
    if (r.url) rev.url = r.url;
    if (vm.inLanguage) rev.inLanguage = vm.inLanguage;
    return rev;
  });
}
```

---

## FILE 10: src/lib/jsonld.ts (Organization/Website Schema)

```ts
// src/lib/jsonld.ts
import 'server-only';

export function jsonLdScript(data: unknown) {
  // NOTE: never import DB here; accepts only plain objects from page/layout.
  return { __html: JSON.stringify(data, null, 0) };
}

type OrgParams = {
  name: string;              // e.g., "WhopPromoCodes"
  url: string;               // absolute
  logo: string;              // absolute
  sameAs?: string[];         // optional, only real profiles
};

type SiteParams = {
  name: string;              // e.g., "WhopPromoCodes"
  url: string;               // absolute homepage
  searchTarget: string;      // e.g., "https://whoppromocodes.com/search?q={search_term_string}"
};

export function buildOrgSite({ org, site }: { org: OrgParams; site: SiteParams }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${org.url}#org`,
    name: org.name,
    url: org.url,
    logo: org.logo,
    ...(org.sameAs && org.sameAs.length ? { sameAs: org.sameAs } : {})
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}#website`,
    url: site.url,
    name: site.name,
    potentialAction: {
      "@type": "SearchAction",
      target: site.searchTarget,
      "query-input": "required name=search_term_string"
    }
  };

  return [organization, website];
}
```

---

## FILE 11: src/components/Alternatives.tsx (Alternatives Section)

Key text to change (lines 105-117, 314, 421-422, 449-450, 482, 506):
- `'Exclusive Access'` (line 105, 116)
- `'Alternative offers that might interest you'` (line 314, 422, 450)
- `'You might also consider…'` (line 421, 449, 506)
- `'Explore another'` (line 482)

```tsx
// Line 105-117: getPromoText function
const getPromoText = (whop: AlternativeDeal) => {
  const firstPromo = whop.promoCodes?.[0];
  if (!firstPromo) return 'Exclusive Access';

  // If there's a promo code and a value > 0, show the discount
  if (firstPromo.code && firstPromo.value && firstPromo.value !== '0') {
    // Check if value already contains currency or percentage symbol
    if (firstPromo.value.includes('$') || firstPromo.value.includes('%') || firstPromo.value.includes('off')) {
      return firstPromo.value;
    }
    return `${firstPromo.value}% Off`;
  }

  return firstPromo.title || 'Exclusive Access';
};

// Line 314: setDesc fallback
setDesc('Alternative offers that might interest you');

// Lines 421-422: Loading state SectionPanel
<SectionPanel
  title="You might also consider…"
  subtitle="Alternative offers that might interest you"
>

// Lines 449-450: Main render SectionPanel
<SectionPanel
  title="You might also consider…"
  subtitle={desc || "Alternative offers that might interest you"}
>

// Line 482: Explore link text
<span style={{ color: 'var(--text-secondary)' }}>
  Explore another{explore.category ? ` in ${explore.category}` : ''}:
</span>

// Line 506: JSON-LD name
"name": "You might also consider…",
```

---

## FILE 12: src/app/(public)/blog/[slug]/page.tsx (Blog Post Page)

Key text to change (lines 68-70, 76, 119, 165):
- `'Blog Post Not Found'` (line 68)
- `'This article is not available on WhopPromoCodes.'` (line 69)
- `'Practical insights on digital products, promo strategies, and online savings'` (line 76)
- `'Explore practical guides and insights on digital products, promo strategies, and online savings.'` (line 119)
- `'Insights'` breadcrumb (line 165)

```tsx
// Lines 66-71: Not found metadata
if (!post || !post.published) {
  return {
    title: `Blog Post Not Found - ${SITE_BRAND}`,
    description: 'This article is not available on WhopPromoCodes.',
    robots: { index: false, follow: true }
  }
}

// Line 76: Default meta description
const metaDescription = post.excerpt ?? `Practical insights on digital products, promo strategies, and online savings from ${SITE_BRAND}.`;

// Lines 117-120: Error fallback metadata
return {
  title: `Blog Post - ${SITE_BRAND}`,
  description: 'Explore practical guides and insights on digital products, promo strategies, and online savings.'
}

// Lines 163-167: Breadcrumb "Insights" label
{
  '@type': 'ListItem',
  position: 2,
  name: 'Insights',
  item: `${siteOrigin()}/blog`
}
```

---

## FILE 13: src/lib/i18n.ts (Translation Keys - English Section Only)

Focus on these remaining keys that need fingerprint changes (lines 42-102):

```ts
// Statistics (lines 42-47)
'stats.users': 'Total Users',
'stats.whops': 'Active Offers',
'stats.codes': 'Promo Codes',
'stats.claimed': 'Promo Codes Claimed',
'stats.popular': 'Most Popular',

// Whop Page labels (lines 55-70)
'whop.promoCode': 'Promo Code',
'whop.howToRedeem': 'How to Redeem',
'whop.productDetails': 'Product Details',
'whop.about': 'About',
'whop.promoDetails': 'Promo Details',
'whop.termsConditions': 'Terms & Conditions',
'whop.faq': 'Frequently Asked Questions',
'whop.website': 'Website',
'whop.discountValue': 'Discount Value',
'whop.price': 'Price',
'whop.category': 'Category',
'whop.offer': 'OFFER',
'whop.discount': 'DISCOUNT',
'whop.noPromoAvailable': 'No promo available',
'whop.varies': 'Varies',

// How to Redeem Steps (lines 72-77)
'whop.step1': 'Click the "{button}" button to access {name}',
'whop.step2Code': 'Copy the revealed promo code',
'whop.step2NoCode': 'No code needed - discount automatically applied',
'whop.step3': 'Complete your registration or purchase',
'whop.step4': 'Enjoy your {promo}',

// FAQ (lines 79-89)
'whop.faqQ1': 'How do I use this {name} promo?',
'whop.faqA1': 'To use the {promo} for {name}, click the "{button}" button above.',
'whop.faqA1Code': ' Copy the code and enter it during checkout.',
'whop.faqA1NoCode': ' The discount will be automatically applied when you access the link.',
'whop.faqQ2': 'What type of service is {name}?',
'whop.faqA2': '{name} is {category} specialized solutions for its users.',
'whop.faqA2Category': 'in the {category} category and provides',
'whop.faqA2NoCategory': 'an exclusive service that provides',
'whop.faqQ3': 'How long is this promo valid?',
'whop.faqA3': 'Promo validity varies. Please check {name}\'s website for the most current information about expiration dates and terms.',

// Terms (lines 91-94)
'whop.termsText': 'This {offer} is valid for {name} and subject to their terms and conditions. The discount may be limited in time and availability. Please check {name}\'s website for the most current terms and conditions.',
'whop.termsOffer': 'promo code "{code}"',
'whop.termsOfferNoCode': 'offer',

// Footer (lines 96-102)
'footer.description': 'Your trusted source for deals, coupons, discounts and exclusive deals.',
'footer.quickLinks': 'Quick Links',
'footer.legal': 'Legal',
'footer.privacy': 'Privacy Policy',
'footer.terms': 'Terms of Service',
'footer.rights': 'All rights reserved.',
```

---

## FILE 14: src/components/RecommendedOffers.tsx (Recommendations Section - Client)

Key text to change (lines 316-317, 349, 360, 364-366, 393-394, 420, 435):

```tsx
// Lines 316-317: Loading state SectionPanel
<SectionPanel
  title="Recommended for You"
  subtitle="Similar offers based on your current selection"
>

// Lines 347-361: getPromoText function
const getPromoText = (whop: RecommendedDeal) => {
  const firstPromo = whop.promoCodes?.[0];
  if (!firstPromo) return 'Exclusive Access';

  // If there's a promo code and a value > 0, show the discount
  if (firstPromo.code && firstPromo.value && firstPromo.value !== '0') {
    // Check if value already contains currency or percentage symbol
    if (firstPromo.value.includes('$') || firstPromo.value.includes('%') || firstPromo.value.includes('off')) {
      return firstPromo.value;
    }
    return `${firstPromo.value}% Off`;
  }

  return firstPromo.title || 'Exclusive Access';
};

// Lines 364-366: Main render SectionPanel
<SectionPanel
  title="Recommended for You"
  subtitle="Similar offers based on your current selection"
>

// Lines 393-394: Explore link text
<span style={{ color: 'var(--text-secondary)' }}>
  Explore another{explore.category ? ` in ${explore.category}` : ''}:
</span>

// Line 420: View More link text
Explore All Offers

// Line 435: JSON-LD name
"name": "Recommended for You",
```

---

## FILE 15: src/components/RecommendedOffersServer.tsx (Recommendations Section - Server)

```tsx
// Server-safe list of recommended whops (no next/link, no client state)
import 'server-only';
import OfferMiniPreview from './OfferMiniPreview';
import { resolveLogoUrl } from '@/lib/image-url';

type Item = {
  slug: string;
  name: string;
  logo?: string | null;
  description?: string | null;
  blurb?: string | null;
  category?: string | null;
  rating?: number | null;
  ratingCount?: number;
};

export default function RecommendedOffersServer({ items }: { items?: Item[] }) {
  const list = (items ?? [])
    .filter((w): w is Item & { slug: string } => !!w && !!w.slug)
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug));

  if (!list.length) return null;

  return (
    <section aria-label="You might also like" className="mt-8">
      <h2 className="text-xl font-bold mb-4">You Might Also Like</h2>
      <ul className="flex flex-col gap-4" suppressHydrationWarning>
        {list.map((w, i) => (
          <OfferMiniPreview
            key={`${w.slug}#${i}`}
            slug={w.slug}
            name={w.name}
            logo={resolveLogoUrl(w.logo)}
            description={w.blurb || w.description}
            category={w.category}
            rating={w.rating}
            ratingCount={w.ratingCount ?? 0}
          />
        ))}
      </ul>
    </section>
  );
}
```

Key text to change:
- Line 26: `aria-label="You might also like"`
- Line 27: `"You Might Also Like"` heading

---

## INSTRUCTIONS FOR CHATGPT

Please provide surgical, line-level copy changes for each file above. For each change:

1. **Preserve all code structure** - imports, props, types, logic must remain identical
2. **Only change user-facing text strings** - reword to create unique fingerprint
3. **Maintain the same meaning** - just different wording
4. **Keep the same tone** - professional, helpful, trustworthy
5. **Format as: OLD → NEW** for each change

Example format:
```
FILE: src/app/error.tsx
Line 20: "We hit a snag loading this page" → "Something went wrong on this page"
Line 21: "An unexpected error occurred..." → "We encountered an issue..."
```
