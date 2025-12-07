'use client';

import { useState, useEffect } from 'react';
import { useSocialProof, createSocialProofFromOffer } from '@/contexts/SocialProofContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface OfferPageClientProps {
  offer: {
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
  onTrackingComplete?: () => void; // Callback to refresh stats
}

export default function OfferPageClient({ offer, firstPromo, promoCode, promoTitle, onTrackingComplete }: OfferPageClientProps) {
  const [codeRevealed, setCodeRevealed] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { addNotification, isHydrated } = useSocialProof();
  const { t } = useLanguage();
  
  // Ensure hydration compatibility - delay client-only rendering
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Reset codeRevealed state when offer changes (e.g., language switch)
  useEffect(() => {
    setCodeRevealed(false);
  }, [offer.id, offer.name]); // Reset when offer ID or name changes

  const handleRevealCode = async () => {
    console.log("🔥 OfferPageClient: Reveal Code button clicked!", {
      offerName: offer.name,
      offerId: offer.id,
      firstPromoId: firstPromo?.id,
      hasOfferId: !!offer.id,
      hasFirstPromo: !!firstPromo,
      timestamp: new Date().toISOString()
    });

    // Open affiliate link
    if (offer?.affiliateLink) {
      window.open(offer.affiliateLink, '_blank', 'noopener,noreferrer');
    }
    
    // Reveal the code
    setCodeRevealed(true);
    
    // Track the action - now works even without promo code ID
    if (offer) {
      console.log("✅ OfferPageClient: Offer present, calling trackRevealCode");
      const success = await trackRevealCode(offer.id, firstPromo?.id || null);
      
      // Call the callback to refresh statistics if tracking was successful
      if (success && onTrackingComplete) {
        console.log("🔄 OfferPageClient: Calling onTrackingComplete to refresh stats");
        onTrackingComplete();
      }
    } else {
      console.warn("⚠️ OfferPageClient: Missing offer:", offer);
    }

    // Trigger social proof notification - only after mount and context is hydrated
    if (hasMounted && isHydrated) {
      const socialProofData = createSocialProofFromOffer({
        whopName: offer.name,
        promoCode: promoCode,
        promoValue: firstPromo?.value ? parseFloat(firstPromo.value) : undefined,
        promoType: firstPromo?.type,
        promoText: promoTitle,
      });
      addNotification(socialProofData);
    }
  };

  const trackRevealCode = async (offerId: string, promoCodeId: string | null): Promise<boolean> => {
    console.log("🔥 OfferPageClient: trackRevealCode called with:", {
      offerId,
      promoCodeId,
      offerName: offer.name,
      timestamp: new Date().toISOString()
    });

    try {
      const requestBody = {
        casinoId: offerId, // Using offerId as casinoId for compatibility
        bonusId: promoCodeId, // Using promoCodeId as bonusId for compatibility (can be null)
        actionType: 'code_copy', // Changed from 'button_click' to 'code_copy' for consistency with stats
      };

      console.log("📤 OfferPageClient: Sending tracking request:", requestBody);

      const response = await fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ OfferPageClient: Tracking successful:", result);
        return true;
      } else {
        const errorData = await response.text();
        console.error("❌ OfferPageClient: Tracking failed:", response.status, errorData);
        return false;
      }
    } catch (error) {
      console.error("❌ OfferPageClient: Error tracking reveal code:", error);
      return false;
    }
  };

  // Show initial button state during SSR and until mounted to prevent hydration mismatch
  if (!hasMounted) {
    return (
      <div className="w-full">
        <button 
          className="w-full font-bold py-3 px-4 rounded-lg text-center transition-all duration-200 hover:opacity-90 hover:scale-[1.02] transform-gpu"
          style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
          disabled
        >
          {t('whop.revealCode')}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!codeRevealed ? (
        <button 
          onClick={handleRevealCode}
          className="w-full font-bold py-3 px-4 rounded-lg text-center transition-all duration-200 hover:opacity-90 hover:scale-[1.02] transform-gpu"
          style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
        >
          {t('whop.revealCode')}
        </button>
      ) : (
        <div className="w-full border-2 font-bold py-3 px-4 rounded-lg text-center transition-theme" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--accent-color)', color: 'var(--text-color)' }}>
          {promoCode ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>{promoCode}</span>
          ) : offer.name === 'Josh Exclusive VIP Access' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>JOSH</span>
          ) : offer.name === 'Momentum Monthly' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-1A92969C</span>
          ) : offer.name === 'Larry\'s Lounge Premium' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-BF9EF1CC</span>
          ) : offer.name === 'Dodgy\'s Dungeon' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-565022F7</span>
          ) : offer.name === 'Trade With Insight - Pro' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-624C9EA4</span>
          ) : offer.name === 'ParlayScience Discord Access' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-C0047AFA</span>
          ) : offer.name === 'Scarface Trades Premium' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-01FE6235</span>
          ) : offer.name === 'The Haven' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-45EF5D24</span>
          ) : offer.name === 'PropFellas VIP' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-B83DC955</span>
          ) : offer.name === 'Owls Full Access' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-7136BFC8</span>
          ) : offer.name === 'Stellar AIO' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-1A6008FA</span>
          ) : offer.name === 'Goat Ecom Growth' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-1B868367</span>
          ) : offer.name === 'Indicators & VIP | LIFETIME' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-7DBFEB18</span>
          ) : offer.name === 'Supercar Income' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-5E906FAB</span>
          ) : offer.name === 'GOAT Sports Bets Membership' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-3352BB19</span>
          ) : offer.name === 'Best Of Both Worlds' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-336B4ACD</span>
          ) : offer.name === 'Moementum University' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-23AB3618</span>
          ) : offer.name === 'ZWM Lifetime Access' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-4E6D572F</span>
          ) : offer.name === 'Ayecon Academy Lifetime Membership' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-022D1F18</span>
          ) : offer.name === 'The BFI Traders University' ? (
            <span className="text-lg" style={{ color: 'var(--accent-color)' }}>PROMO-58B279FF</span>
          ) : (
            <span className="text-lg" style={{ color: 'var(--success-color)' }}>{t('whop.noCode')}</span>
          )}
        </div>
      )}
    </div>
  );
} 