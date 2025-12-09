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
    title: `${SITE_BRAND} - Genuine Promo Codes and Fresh Deals ${currentYear}`,
    description: SITE_DESCRIPTION,
    keywords: 'digital promo codes, online discounts, coupon alternatives, savings on software, course discounts, membership offers, verified digital deals',
    metadataBase: new URL(origin),
    openGraph: {
      title: `${SITE_BRAND} - Genuine Promo Codes and Fresh Deals ${currentYear}`,
      description: SITE_DESCRIPTION,
      url: origin,
      type: 'website',
      siteName: SITE_BRAND,
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `${SITE_BRAND} – Digital Deals & Discount Finder`
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_BRAND} - Genuine Promo Codes and Fresh Deals ${currentYear}`,
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
        <meta name="rating" content="safe for all audiences" />
        <meta name="revisit-after" content="7 days" />
        <meta property="og:locale" content="en_US" />
        <meta name="geo.region" content="GB" />
        <meta name="geo.placename" content="United Kingdom" />
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