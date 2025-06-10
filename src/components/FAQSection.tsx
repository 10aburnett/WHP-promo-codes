'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="rounded-xl px-7 py-6 sm:p-8 border transition-theme" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}>
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="rounded-lg border transition-all duration-200 overflow-hidden" 
            style={{ 
              backgroundColor: 'var(--background-color)',
              borderColor: 'var(--border-color)'
            }}
          >
            {/* Question Header - Clickable */}
            <button
              onClick={() => toggleItem(index)}
              className="w-full p-4 text-left flex justify-between items-center hover:opacity-80 transition-opacity"
              aria-expanded={openItems.has(index)}
            >
              <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
              <div className="flex-shrink-0">
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openItems.has(index) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Answer Content - Collapsible */}
            <div
              className={`transition-all duration-200 ease-in-out ${
                openItems.has(index) 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="px-4 pb-4">
                <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 