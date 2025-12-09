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
              Site Policies
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
              Need clarification on anything above?{' '}
              <Link
                href="/contact"
                className="hover:opacity-80 transition-opacity"
                style={{ color: 'var(--accent-color)' }}
              >
                Reach out to us
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
