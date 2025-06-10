'use client';

import { useRef } from 'react';
import WhopPageClient from './WhopPageClient';
import PromoStatsDisplay, { PromoStatsDisplayHandle } from './PromoStatsDisplay';

interface WhopPageInteractiveProps {
  whop: {
    id: string;
    name: string;
    affiliateLink: string | null;
  };
  firstPromo: {
    id: string;
    code: string | null;
    title: string;
    type?: string;
    value?: string;
  } | null;
  promoCode: string | null;
  promoTitle: string;
}

// Standalone compact stats component
export function WhopPageCompactStats({ whopId, promoCodeId }: { whopId: string; promoCodeId: string }) {
  return (
    <PromoStatsDisplay 
      whopId={whopId} 
      promoCodeId={promoCodeId}
      compact={true}
    />
  );
}

export default function WhopPageInteractive({ whop, firstPromo, promoCode, promoTitle }: WhopPageInteractiveProps) {
  const mainStatsRef = useRef<PromoStatsDisplayHandle>(null);

  const handleTrackingComplete = () => {
    console.log('🔄 WhopPageInteractive: Refreshing main PromoStatsDisplay after tracking');
    mainStatsRef.current?.refresh();
    
    // Also trigger refresh for all compact stats on the page
    const compactStatsElements = document.querySelectorAll('[data-compact-stats]');
    compactStatsElements.forEach((element) => {
      const event = new CustomEvent('refreshStats');
      element.dispatchEvent(event);
    });
  };

  return (
    <>
      {/* Interactive Button */}
      <WhopPageClient 
        whop={whop}
        firstPromo={firstPromo}
        promoCode={promoCode}
        promoTitle={promoTitle}
        onTrackingComplete={handleTrackingComplete}
      />
      
      {/* Main Promo Code Usage Statistics */}
      {firstPromo && (
        <div className="mt-6">
          <PromoStatsDisplay 
            ref={mainStatsRef}
            whopId={whop.id} 
            promoCodeId={firstPromo.id}
          />
        </div>
      )}
    </>
  );
} 