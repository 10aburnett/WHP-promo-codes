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

const inter = Inter({ subsets: ['latin'] });
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

  return {
    title: `Best Whop Promo Codes & Digital Product Discounts ${currentYear}`,
    description: `Find the best Whop promo codes, exclusive discount codes, and digital product offers. Get access to premium communities, courses, and digital products at discounted prices.`,
    keywords: 'whop promo codes, whop discount codes, digital product discounts, community access codes, course promo codes',
    metadataBase: new URL('https://whpcodes.com'),
    openGraph: {
      title: `Best Whop Promo Codes & Digital Product Discounts ${currentYear}`,
      description: `Find the best Whop promo codes, exclusive discount codes, and digital product offers. Get access to premium communities, courses, and digital products at discounted prices.`,
      url: 'https://whpcodes.com',
      type: 'website',
      images: ['/logo.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Best Whop Promo Codes & Digital Product Discounts ${currentYear}`,
      description: `Find the best Whop promo codes, exclusive discount codes, and digital product offers. Get access to premium communities, courses, and digital products at discounted prices.`,
      images: ['/logo.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: 'https://whpcodes.com',
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        {/* Force favicon refresh with multiple formats */}
        <link rel="icon" type="image/svg+xml" href={faviconUrl} />
        <link rel="icon" type="image/x-icon" href={faviconUrl.replace('.svg', '.ico')} />
        <link rel="shortcut icon" href={faviconUrl} />
        <link rel="apple-touch-icon" href={faviconUrl} />
      </head>
      <body className={`${inter.className} overflow-x-hidden`} style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
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
      </body>
    </html>
  );
} 