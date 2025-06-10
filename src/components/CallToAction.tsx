'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'next/navigation';

export default function CallToAction() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  // Get current search parameters to preserve state
  const currentParams = searchParams.toString();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTopAndFocusSearch = () => {
    // First scroll to the top with smooth animation (IDENTICAL to Browse Deals button)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Wait longer for the smooth scroll to COMPLETELY finish before doing anything else
    setTimeout(() => {
      // Try multiple ways to find the search input
      let targetInput: HTMLInputElement | null = null;
      
      // Method 1: Try specific IDs
      const desktopSearchInput = document.getElementById('main-search-input') as HTMLInputElement;
      const mobileSearchInput = document.getElementById('main-search-input-mobile') as HTMLInputElement;
      
      // Check which input is visible and clickable
      if (desktopSearchInput && window.getComputedStyle(desktopSearchInput.parentElement!).display !== 'none') {
        targetInput = desktopSearchInput;
      } else if (mobileSearchInput && window.getComputedStyle(mobileSearchInput.parentElement!).display !== 'none') {
        targetInput = mobileSearchInput;
      } else if (desktopSearchInput) {
        // Try desktop input even if parent visibility check failed
        targetInput = desktopSearchInput;
      } else if (mobileSearchInput) {
        // Try mobile input even if parent visibility check failed
        targetInput = mobileSearchInput;
      } else {
        // Method 2: Fallback - find any search input with placeholder "Search courses..."
        const allSearchInputs = document.querySelectorAll('input[type="search"]') as NodeListOf<HTMLInputElement>;
        for (const input of allSearchInputs) {
          if (input.placeholder.includes('Search courses')) {
            targetInput = input;
            break;
          }
        }
      }
      
      if (targetInput) {
        // Force the click and focus ONLY after scrolling is completely done
        targetInput.click();
        targetInput.focus();
        
        // Also trigger a small visual effect to show it worked
        targetInput.style.transition = 'box-shadow 0.3s ease';
        targetInput.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
        setTimeout(() => {
          targetInput!.style.boxShadow = '';
        }, 1000);
        
        console.log('Search input clicked and focused:', targetInput.id || 'no-id');
      } else {
        console.log('No search input found');
    }
    }, 800); // 800ms delay to ensure smooth scroll completely finishes
  };

  return (
    <div className="text-center mt-12">
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
        {t('home.readyToSave')}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={scrollToTop}
          className="font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02] transform-gpu"
          style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
        >
          {t('home.cta')}
        </button>
        <button 
          onClick={scrollToTopAndFocusSearch}
          className="border font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02] transform-gpu"
          style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}
        >
          {t('home.filterCodes')}
        </button>
      </div>
    </div>
  );
} 