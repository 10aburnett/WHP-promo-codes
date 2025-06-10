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