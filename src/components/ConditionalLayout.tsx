'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import PromoBanner from './PromoBanner';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { SocialProofProvider, useSocialProof } from '@/contexts/SocialProofContext';
import SocialProofPopupManager from './SocialProofPopup';
import GeneralPromoSubmissionButton from './GeneralPromoSubmissionButton';
import { SITE_BRAND } from '@/lib/brand';

interface ConditionalLayoutProps {
  children: React.ReactNode;
  faviconUrl: string;
}

function LayoutContent({ children, faviconUrl }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const { notifications, removeNotification } = useSocialProof();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFooterOpen, setIsMobileFooterOpen] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  const currentYear = new Date().getFullYear();

  // Helper function to get localized paths
  const getLocalizedPath = (path: string) => {
    if (language === 'en') {
      return path; // English uses root paths
    }
    return `/${language}${path}`; // Other languages use language prefix
  };

  // Check if we're in the admin panel - ONLY exclude admin routes from header/footer
  const isAdminRoute = pathname.startsWith('/admin');

  // For admin routes, only render the children without header/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For ALL other pages (including offer pages), show the full layout with header and footer
  return (
    <>
      {/* PROMO DROP EXTENSION BANNER */}
      {!isBannerDismissed && (
        <PromoBanner onDismiss={() => setIsBannerDismissed(true)} />
      )}

      {/* HEADER - Two-row structure */}
      <header
        className={`sticky ${isBannerDismissed ? 'top-0' : 'top-[44px] md:top-[52px]'} z-40 border-b backdrop-blur-md transition-theme`}
        style={{
          backgroundColor: 'var(--background-color)',
          borderColor: 'var(--border-color)',
          transition: 'top 0.3s ease, background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div className="mx-auto w-[92%] max-w-6xl">
          {/* BRAND + ACTIONS ROW */}
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* Left: Brand + tagline */}
            <div className="flex flex-col">
              <Link
                href={getLocalizedPath('/')}
                className="flex items-baseline gap-0.5 transition-opacity hover:opacity-80"
                aria-label={`${SITE_BRAND} home`}
              >
                <span className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--accent-color)' }}>
                  Whop
                </span>
                <span className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--text-color)' }}>
                  PromoCodes
                </span>
              </Link>
              <p className="hidden md:block mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                Verified Whop promo codes for digital tools, courses &amp; memberships.
              </p>
            </div>

            {/* Right: controls cluster (desktop) */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <ThemeToggle />
              <GeneralPromoSubmissionButton
                className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
                style={{
                  borderColor: 'var(--accent-color)',
                  backgroundColor: 'var(--accent-color)',
                  color: '#ffffff',
                }}
              >
                <span>Share a promo</span>
                <span className="ml-1" aria-hidden="true">↗</span>
              </GeneralPromoSubmissionButton>
            </div>

            {/* Mobile: controls + menu toggle */}
            <div className="flex md:hidden items-center gap-1.5">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--background-secondary)',
                  color: 'var(--text-color)',
                }}
                aria-label="Toggle navigation"
                aria-expanded={isMobileMenuOpen}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* NAV ROW (desktop) */}
          <nav className="hidden md:flex items-center gap-6 pb-3" aria-label="Main navigation">
            <Link
              href={getLocalizedPath('/')}
              className={`relative pb-2 text-sm font-medium transition-colors ${
                pathname === '/' || pathname === `/${language}`
                  ? 'text-[var(--text-color)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-color)]'
              }`}
            >
              {t('nav.home')}
              {(pathname === '/' || pathname === `/${language}`) && (
                <span
                  className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                />
              )}
            </Link>
                        <Link
              href="/offers"
              className={`relative pb-2 text-sm font-medium transition-colors ${
                pathname === '/offers'
                  ? 'text-[var(--text-color)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-color)]'
              }`}
            >
              Offers
              {pathname === '/offers' && (
                <span
                  className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                />
              )}
            </Link>
            <Link
              href={getLocalizedPath('/blog')}
              className={`relative pb-2 text-sm font-medium transition-colors ${
                pathname.startsWith('/blog')
                  ? 'text-[var(--text-color)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-color)]'
              }`}
            >
              Blog
              {pathname.startsWith('/blog') && (
                <span
                  className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                />
              )}
            </Link>
            <Link
              href="/how-to-redeem"
              className={`relative pb-2 text-sm font-medium transition-colors ${
                pathname === '/how-to-redeem'
                  ? 'text-[var(--text-color)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-color)]'
              }`}
            >
              How to Redeem
              {pathname === '/how-to-redeem' && (
                <span
                  className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                />
              )}
            </Link>
            <Link
              href="/subscribe"
              className={`relative pb-2 text-sm font-medium transition-colors ${
                pathname === '/subscribe'
                  ? 'text-[var(--text-color)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-color)]'
              }`}
            >
              Subscribe
              {pathname === '/subscribe' && (
                <span
                  className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                />
              )}
            </Link>
            <Link
              href={getLocalizedPath('/about')}
              className={`relative pb-2 text-sm font-medium transition-colors ${
                pathname === '/about' || pathname === `/${language}/about`
                  ? 'text-[var(--text-color)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-color)]'
              }`}
            >
              {t('nav.about')}
              {(pathname === '/about' || pathname === `/${language}/about`) && (
                <span
                  className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                />
              )}
            </Link>
            <Link
              href={getLocalizedPath('/contact')}
              className={`relative pb-2 text-sm font-medium transition-colors ${
                pathname === '/contact' || pathname === `/${language}/contact`
                  ? 'text-[var(--text-color)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-color)]'
              }`}
            >
              {t('nav.contact')}
              {(pathname === '/contact' || pathname === `/${language}/contact`) && (
                <span
                  className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                />
              )}
            </Link>
          </nav>
        </div>

        {/* MOBILE NAV PANEL */}
        {isMobileMenuOpen && (
          <>
            {/* scrim */}
            <button
              aria-label="Close menu overlay"
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40"
            />
            {/* panel */}
            <div
              className="fixed inset-x-0 top-0 z-50 border-b shadow-lg"
              style={{
                backgroundColor: 'var(--background-color)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="mx-auto w-[92%] max-w-6xl py-4">
                {/* Header row in mobile panel */}
                <div className="flex items-center justify-between mb-4">
                  <Link
                    href={getLocalizedPath('/')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-baseline gap-0.5"
                  >
                    <span className="text-xl font-semibold" style={{ color: 'var(--accent-color)' }}>
                      Whop
                    </span>
                    <span className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>
                      PromoCodes
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
                    aria-label="Close menu"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Nav links - vertical list */}
                <nav className="space-y-1 mb-4" aria-label="Mobile navigation">
                  <Link
                    href={getLocalizedPath('/')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium"
                    style={{ color: pathname === '/' ? 'var(--text-color)' : 'var(--text-secondary)' }}
                  >
                    {t('nav.home')}
                  </Link>
                                    <Link
                    href="/offers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium"
                    style={{ color: pathname === '/offers' ? 'var(--text-color)' : 'var(--text-secondary)' }}
                  >
                    Offers
                  </Link>
                  <Link
                    href={getLocalizedPath('/blog')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium"
                    style={{ color: pathname.startsWith('/blog') ? 'var(--text-color)' : 'var(--text-secondary)' }}
                  >
                    Blog
                  </Link>
                  <Link
                    href="/how-to-redeem"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium"
                    style={{ color: pathname === '/how-to-redeem' ? 'var(--text-color)' : 'var(--text-secondary)' }}
                  >
                    How to Redeem
                  </Link>
                  <Link
                    href="/subscribe"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium"
                    style={{ color: pathname === '/subscribe' ? 'var(--text-color)' : 'var(--text-secondary)' }}
                  >
                    Subscribe
                  </Link>
                  <Link
                    href={getLocalizedPath('/about')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium"
                    style={{ color: pathname === '/about' ? 'var(--text-color)' : 'var(--text-secondary)' }}
                  >
                    {t('nav.about')}
                  </Link>
                  <Link
                    href={getLocalizedPath('/contact')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium"
                    style={{ color: pathname === '/contact' ? 'var(--text-color)' : 'var(--text-secondary)' }}
                  >
                    {t('nav.contact')}
                  </Link>
                </nav>

                {/* CTA button */}
                <Link
                  href="/submit"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm"
                  style={{ backgroundColor: 'var(--accent-color)', color: '#ffffff' }}
                >
                  Share a promo
                  <span className="ml-1" aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </header>

      {/* MAIN CONTENT OFFSET FOR STICKY HEADER */}
      <div
        className="transition-theme"
        style={{ backgroundColor: 'var(--background-color)' }}
      >
        {children}
      </div>

      {/* FOOTER */}
      <footer
        className="border-t mt-12 transition-theme"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* DESKTOP FOOTER */}
        <div className="hidden md:block">
          <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              {/* Brand + description */}
              <div className="max-w-sm">
                <div className="text-base font-semibold mb-1" style={{ color: 'var(--text-color)' }}>
                  <span style={{ color: 'var(--accent-color)' }}>Whop</span>PromoCodes
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Curated Whop promo codes and offers for digital tools, courses, and communities.
                </p>
              </div>

              {/* Link columns */}
              <div className="flex flex-wrap gap-8 text-sm">
                <div>
                  <div className="font-semibold mb-2" style={{ color: 'var(--text-color)' }}>Explore</div>
                  <ul className="space-y-1">
                                        <li>
                      <Link href="/offers" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>
                        All offers
                      </Link>
                    </li>
                    <li>
                      <Link href={getLocalizedPath('/blog')} className="hover:underline" style={{ color: 'var(--text-secondary)' }}>
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link href="/how-to-redeem" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>
                        How to Redeem
                      </Link>
                    </li>
                    <li>
                      <GeneralPromoSubmissionButton
                        className="hover:underline cursor-pointer"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Submit a promo
                      </GeneralPromoSubmissionButton>
                    </li>
                    <li>
                      <Link href="/subscribe" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>
                        Subscribe
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2" style={{ color: 'var(--text-color)' }}>Company</div>
                  <ul className="space-y-1">
                    <li>
                      <Link href={getLocalizedPath('/about')} className="hover:underline" style={{ color: 'var(--text-secondary)' }}>
                        {t('nav.about')}
                      </Link>
                    </li>
                    <li>
                      <Link href={getLocalizedPath('/contact')} className="hover:underline" style={{ color: 'var(--text-secondary)' }}>
                        {t('nav.contact')}
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2" style={{ color: 'var(--text-color)' }}>Legal</div>
                  <ul className="space-y-1">
                    <li>
                      <Link href={getLocalizedPath('/privacy')} className="hover:underline" style={{ color: 'var(--text-secondary)' }}>
                        {t('footer.privacy')}
                      </Link>
                    </li>
                    <li>
                      <Link href={getLocalizedPath('/terms')} className="hover:underline" style={{ color: 'var(--text-secondary)' }}>
                        {t('footer.terms')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/unsubscribe" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>
                        Unsubscribe
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div className="font-semibold mb-3 text-sm" style={{ color: 'var(--text-color)' }}>Follow Us</div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://www.instagram.com/whoppromocodes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="p-2 rounded-full border transition-all hover:scale-110"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="https://x.com/Whoppromocodes"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on X (Twitter)"
                  className="p-2 rounded-full border transition-all hover:scale-110"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/alexander-burnett-6659113a1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect with us on LinkedIn"
                  className="p-2 rounded-full border transition-all hover:scale-110"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://www.pinterest.com/whoppromocodes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Pinterest"
                  className="p-2 rounded-full border transition-all hover:scale-110"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/channel/UCFpK11C_aBFOrhd1yVOjqIg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to our YouTube channel"
                  className="p-2 rounded-full border transition-all hover:scale-110"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@whoppromocodes"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on TikTok"
                  className="p-2 rounded-full border transition-all hover:scale-110"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
                <a
                  href="https://t.me/whoppromocodes"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join our Telegram channel"
                  className="p-2 rounded-full border transition-all hover:scale-110"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
                <a
                  href="https://t.me/whoppromocodeschat"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join our Telegram community chat"
                  className="p-2 rounded-full border transition-all hover:scale-110 flex items-center gap-1.5"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  <span className="text-xs">Chat</span>
                </a>
              </div>
            </div>

            {/* Copyright row */}
            <div
              className="mt-6 pt-4 border-t text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              <span>© {currentYear} {SITE_BRAND}. {t('footer.rights')}</span>
            </div>
          </div>
        </div>

        {/* MOBILE FOOTER (compact) */}
        <div className="md:hidden py-4">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col items-center gap-3">
              {/* logo */}
              <Link
                href={getLocalizedPath('/')}
                className="select-none text-base font-semibold tracking-tight"
                aria-label={`${SITE_BRAND} home`}
              >
                <span style={{ color: 'var(--accent-color)' }}>Whop</span>
                <span style={{ color: 'var(--text-color)' }}>PromoCodes</span>
              </Link>

              {/* hamburger button */}
              <button
                type="button"
                onClick={() => setIsMobileFooterOpen(!isMobileFooterOpen)}
                aria-label="Open footer menu"
                className="mt-1 rounded-full border px-4 py-2 text-sm font-medium shadow-sm active:scale-[0.98] transition-all duration-200"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-secondary)',
                }}
              >
                More links
              </button>

              {/* Social links - mobile */}
              <div className="flex flex-wrap justify-center items-center gap-2 mt-3">
                <a
                  href="https://www.instagram.com/whoppromocodes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="p-1.5 rounded-full border"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="https://x.com/Whoppromocodes"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on X (Twitter)"
                  className="p-1.5 rounded-full border"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/alexander-burnett-6659113a1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect with us on LinkedIn"
                  className="p-1.5 rounded-full border"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/channel/UCFpK11C_aBFOrhd1yVOjqIg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to our YouTube channel"
                  className="p-1.5 rounded-full border"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@whoppromocodes"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on TikTok"
                  className="p-1.5 rounded-full border"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
                <a
                  href="https://t.me/whoppromocodes"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join our Telegram channel"
                  className="p-1.5 rounded-full border"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
              </div>

              {/* copyright */}
              <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                © {currentYear} {SITE_BRAND}. {t('footer.rights')}
              </p>
            </div>
          </div>
        </div>

        {/* MOBILE bottom sheet */}
        {isMobileFooterOpen && (
          <>
            {/* scrim */}
            <button
              aria-label="Close menu overlay"
              onClick={() => setIsMobileFooterOpen(false)}
              className="fixed inset-0 z-40 bg-black/40"
            />
            {/* sheet */}
            <div
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t p-4 shadow-theme-promo transition-theme"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div
                className="mx-auto h-1.5 w-10 rounded-full"
                style={{ backgroundColor: 'var(--border-color)' }}
              />
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                                <Link
                  href="/offers"
                  onClick={() => setIsMobileFooterOpen(false)}
                  className="rounded-xl border px-3 py-2.5 text-sm font-medium active:scale-[0.98] transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)',
                  }}
                >
                  Offers
                </Link>
                <Link
                  href={getLocalizedPath('/blog')}
                  onClick={() => setIsMobileFooterOpen(false)}
                  className="rounded-xl border px-3 py-2.5 text-sm font-medium active:scale-[0.98] transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)',
                  }}
                >
                  Blog
                </Link>
                <Link
                  href="/how-to-redeem"
                  onClick={() => setIsMobileFooterOpen(false)}
                  className="rounded-xl border px-3 py-2.5 text-sm font-medium active:scale-[0.98] transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)',
                  }}
                >
                  How to Redeem
                </Link>
                <Link
                  href="/submit"
                  onClick={() => setIsMobileFooterOpen(false)}
                  className="rounded-xl border px-3 py-2.5 text-sm font-medium active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--accent-color)',
                    backgroundColor: 'var(--background-color)',
                  }}
                >
                  Submit Code
                </Link>
                <Link
                  href="/subscribe"
                  onClick={() => setIsMobileFooterOpen(false)}
                  className="rounded-xl border px-3 py-2.5 text-sm font-medium active:scale-[0.98] transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)',
                  }}
                >
                  Subscribe
                </Link>
                <Link
                  href={getLocalizedPath('/about')}
                  onClick={() => setIsMobileFooterOpen(false)}
                  className="rounded-xl border px-3 py-2.5 text-sm font-medium active:scale-[0.98] transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)',
                  }}
                >
                  {t('nav.about')}
                </Link>
                <Link
                  href={getLocalizedPath('/privacy')}
                  onClick={() => setIsMobileFooterOpen(false)}
                  className="rounded-xl border px-3 py-2.5 text-sm font-medium active:scale-[0.98] transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)',
                  }}
                >
                  {t('footer.privacy')}
                </Link>
                <Link
                  href={getLocalizedPath('/terms')}
                  onClick={() => setIsMobileFooterOpen(false)}
                  className="rounded-xl border px-3 py-2.5 text-sm font-medium active:scale-[0.98] transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)',
                  }}
                >
                  {t('footer.terms')}
                </Link>
                <Link
                  href={getLocalizedPath('/contact')}
                  onClick={() => setIsMobileFooterOpen(false)}
                  className="rounded-xl border px-3 py-2.5 text-sm font-medium active:scale-[0.98] transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)',
                  }}
                >
                  {t('nav.contact')}
                </Link>
                <Link
                  href="/unsubscribe"
                  onClick={() => setIsMobileFooterOpen(false)}
                  className="rounded-xl border px-3 py-2.5 text-sm font-medium active:scale-[0.98] transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)',
                  }}
                >
                  Unsubscribe
                </Link>
              </div>
              <button
                onClick={() => setIsMobileFooterOpen(false)}
                className="mt-4 w-full rounded-full border px-3 py-2.5 text-sm font-medium transition-all duration-200"
                aria-label="Close menu"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-secondary)',
                }}
              >
                Close
              </button>
            </div>
          </>
        )}
      </footer>

      {/* Social Proof Popup Manager */}
      <SocialProofPopupManager notifications={notifications} onRemove={removeNotification} />
    </>
  );
}

export function ConditionalLayout({ children, faviconUrl }: ConditionalLayoutProps) {
  return (
    <SocialProofProvider>
      <LayoutContent faviconUrl={faviconUrl}>{children}</LayoutContent>
    </SocialProofProvider>
  );
}
