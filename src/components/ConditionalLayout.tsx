'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { SocialProofProvider, useSocialProof } from '@/contexts/SocialProofContext';
import SocialProofPopupManager from './SocialProofPopup';
import GeneralPromoSubmissionButton from './GeneralPromoSubmissionButton';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { SITE_BRAND } from '@/lib/brand';

interface ConditionalLayoutProps {
  children: React.ReactNode;
  faviconUrl: string;
}

function LayoutContent({ children, faviconUrl }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, t } = useLanguage();
  const { notifications, removeNotification } = useSocialProof();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFooterOpen, setIsMobileFooterOpen] = useState(false);
  const isMobile = useIsMobile();

  const currentYear = new Date().getFullYear();

  // Helper function to get localized paths
  const getLocalizedPath = (path: string) => {
    if (language === 'en') {
      return path; // English uses root paths
    }
    return `/${language}${path}`; // Other languages use language prefix
  };

  // Handler for mobile Submit Code button
  const handleMobileSubmitCode = () => {
    // Always close the sheet first
    setIsMobileMenuOpen(false);
    setIsMobileFooterOpen(false);

    // Mobile: navigate to the dedicated page so it always works
    if (isMobile) {
      router.push('/submit-code');
      return;
    }

    // Desktop: fallback to page navigation (modal behavior handled elsewhere)
    router.push('/submit-code');
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
      {/* HEADER - Two-row structure */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md transition-theme"
        style={{
          backgroundColor: 'var(--background-color)',
          borderColor: 'var(--border-color)',
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
                  Digital
                </span>
                <span className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--text-color)' }}>
                  PromoCodes
                </span>
              </Link>
              <p className="hidden md:block mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                Verified promo codes for digital tools, courses &amp; memberships.
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
            {/* NOTE: /offers is a UX hub (noindex, follow). Do not add to sitemap without SEO review. */}
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
                      Digital
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
                  {/* NOTE: /offers is a UX hub (noindex, follow). Do not add to sitemap without SEO review. */}
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
                <button
                  type="button"
                  onClick={handleMobileSubmitCode}
                  className="w-full inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm"
                  style={{ backgroundColor: 'var(--accent-color)', color: '#ffffff' }}
                >
                  Share a promo
                  <span className="ml-1" aria-hidden="true">↗</span>
                </button>
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
                  <span style={{ color: 'var(--accent-color)' }}>Digital</span>PromoCodes
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Curated promo codes and offers for digital tools, courses, and communities.
                </p>
              </div>

              {/* Link columns */}
              <div className="flex flex-wrap gap-8 text-sm">
                <div>
                  <div className="font-semibold mb-2" style={{ color: 'var(--text-color)' }}>Explore</div>
                  <ul className="space-y-1">
                    {/* NOTE: /offers is a UX hub (noindex, follow). Do not add to sitemap without SEO review. */}
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
                <span style={{ color: 'var(--accent-color)' }}>Digital</span>
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
                {/* NOTE: /offers is a UX hub (noindex, follow). Do not add to sitemap without SEO review. */}
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
                <button
                  type="button"
                  onClick={handleMobileSubmitCode}
                  className="rounded-xl border px-3 py-2.5 text-sm font-medium active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--accent-color)',
                    backgroundColor: 'var(--background-color)',
                  }}
                >
                  Submit Code
                </button>
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
