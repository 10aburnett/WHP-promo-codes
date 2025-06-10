'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { SocialProofProvider, useSocialProof } from '@/contexts/SocialProofContext';
import SocialProofPopupManager from './SocialProofPopup';

interface ConditionalLayoutProps {
  children: React.ReactNode;
  faviconUrl: string;
}

function LayoutContent({ children, faviconUrl }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const { notifications, removeNotification } = useSocialProof();

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

  // For ALL other pages (including whop pages), show the full layout with header and footer
  return (
    <>
      <header className="fixed top-0 w-full transition-theme z-50" style={{ backgroundColor: 'var(--background-color)', borderBottom: '2px solid var(--border-color)' }}>
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex justify-center flex-1">
            <Link href={getLocalizedPath('/')} className="flex items-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>
                WHP<span style={{ color: 'var(--text-color)' }}>CODES</span>
              </div>
            </Link>
          </div>
          
          {/* Navigation and Controls */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <Link href={getLocalizedPath('/')} className="transition-colors duration-200 hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
                {t('nav.home')}
              </Link>
              <Link href={getLocalizedPath('/contact')} className="transition-colors duration-200 hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
                {t('nav.contact')}
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="pt-20 transition-theme" style={{ backgroundColor: 'var(--background-color)' }}>
        {children}
      </div>

      <footer className="py-8 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-secondary)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6 sm:mb-0">
              <Link href={getLocalizedPath('/')} className="transition-all duration-200 hover:translate-y-[-1px] font-medium text-center sm:text-left hover:opacity-80" style={{ color: 'var(--accent-color)' }}>
                WHPCodes.com
              </Link>
              <div className="flex items-center justify-center sm:justify-start gap-6 text-sm mt-4 sm:mt-0">
                <Link href={getLocalizedPath('/privacy')} className="transition-all duration-200 hover:translate-y-[-1px] hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
                  {t('footer.privacy')}
                </Link>
                <Link href={getLocalizedPath('/terms')} className="transition-all duration-200 hover:translate-y-[-1px] hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
                  {t('footer.terms')}
                </Link>
                <Link href={getLocalizedPath('/contact')} className="transition-all duration-200 hover:translate-y-[-1px] hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
                  {t('nav.contact')}
                </Link>
              </div>
            </div>
            <div className="text-xs text-center sm:text-right opacity-70" style={{ color: 'var(--text-muted)' }}>
              © {currentYear} WHPCodes. {t('footer.rights')}
            </div>
          </div>
        </div>
      </footer>

      {/* Social Proof Popup Manager */}
      <SocialProofPopupManager 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </>
  );
}

export function ConditionalLayout({ children, faviconUrl }: ConditionalLayoutProps) {
  return (
    <SocialProofProvider>
      <LayoutContent faviconUrl={faviconUrl}>
        {children}
      </LayoutContent>
    </SocialProofProvider>
  );
} 