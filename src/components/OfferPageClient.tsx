'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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

export default function OfferPageClient({
  offer,
  firstPromo,
  promoCode,
  promoTitle,
  onTrackingComplete,
}: OfferPageClientProps) {
  const [codeRevealed, setCodeRevealed] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { addNotification, isHydrated } = useSocialProof();
  const { t } = useLanguage();

  // Shared button styling so SSR + CSR match exactly
  // Pill shape with subtle lift on hover for fintech feel
  const baseButtonClass =
    'w-full inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm sm:text-base font-bold ' +
    'transition-all duration-200 hover:brightness-105 hover:shadow-lg hover:-translate-y-0.5 ' +
    'focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2 ' +
    'disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:hover:shadow-none disabled:hover:translate-y-0';

  // Extract a numeric promo value if possible (e.g. "20% off" → 20)
  const promoNumericValue = useMemo(() => {
    if (!firstPromo?.value) return undefined;
    const match = firstPromo.value.match(/[\d.]+/);
    if (!match) return undefined;
    const n = Number(match[0]);
    return Number.isFinite(n) ? n : undefined;
  }, [firstPromo?.value]);

  // Ensure hydration compatibility - delay client-only rendering
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Reset codeRevealed state when offer changes (e.g., language switch)
  useEffect(() => {
    setCodeRevealed(false);
  }, [offer.id, offer.name]);

  const trackRevealCode = useCallback(
    async (offerId: string, promoCodeId: string | null): Promise<boolean> => {
      console.log('🔥 OfferPageClient: trackRevealCode called with:', {
        offerId,
        promoCodeId,
        offerName: offer.name,
        timestamp: new Date().toISOString(),
      });

      try {
        const requestBody = {
          casinoId: offerId, // Using offerId as casinoId for compatibility
          bonusId: promoCodeId, // Using promoCodeId as bonusId for compatibility (can be null)
          actionType: 'code_copy', // Consistent with stats
        };

        console.log('📤 OfferPageClient: Sending tracking request:', requestBody);

        const response = await fetch('/api/tracking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ OfferPageClient: Tracking successful:', result);
          return true;
        } else {
          const errorData = await response.text();
          console.error('❌ OfferPageClient: Tracking failed:', response.status, errorData);
          return false;
        }
      } catch (error) {
        console.error('❌ OfferPageClient: Error tracking reveal code:', error);
        return false;
      }
    },
    [offer.name],
  );

  const handleRevealCode = async () => {
    console.log('🔥 OfferPageClient: Reveal Code button clicked!', {
      offerName: offer.name,
      offerId: offer.id,
      firstPromoId: firstPromo?.id,
      hasOfferId: !!offer.id,
      hasFirstPromo: !!firstPromo,
      timestamp: new Date().toISOString(),
    });

    // Open affiliate link
    if (offer?.affiliateLink) {
      window.open(offer.affiliateLink, '_blank', 'noopener,noreferrer');
    }

    // Reveal the code immediately for UX
    setCodeRevealed(true);

    // Track the action - now works even without promo code ID
    if (offer) {
      console.log('✅ OfferPageClient: Offer present, calling trackRevealCode');
      const success = await trackRevealCode(offer.id, firstPromo?.id || null);

      // Call the callback to refresh statistics if tracking was successful
      if (success && onTrackingComplete) {
        console.log('🔄 OfferPageClient: Calling onTrackingComplete to refresh stats');
        onTrackingComplete();
      }
    } else {
      console.warn('⚠️ OfferPageClient: Missing offer:', offer);
    }

    // Trigger social proof notification - only after mount and context is hydrated
    if (hasMounted && isHydrated) {
      const socialProofData = createSocialProofFromOffer({
        whopName: offer.name,
        promoCode,
        promoValue: promoNumericValue,
        promoType: firstPromo?.type,
        promoText: promoTitle,
      });
      addNotification(socialProofData);
    }
  };

  // Show initial button state during SSR and until mounted to prevent hydration mismatch
  if (!hasMounted) {
    return (
      <div className="w-full">
        <button
          className={baseButtonClass}
          style={{ backgroundColor: 'var(--accent-color)', color: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
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
          className={baseButtonClass}
          style={{ backgroundColor: 'var(--accent-color)', color: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
        >
          {t('whop.revealCode')}
        </button>
      ) : (
        <div
          className="w-full border-2 font-bold py-3.5 px-6 rounded-full text-center transition-all duration-200 hover:shadow-sm"
          style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--accent-color)', color: 'var(--text-color)' }}
        >
          <div className="flex-1 min-w-0">
            <span
              className="block text-xs uppercase tracking-wide mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              {promoCode ? t('whop.yourCode') : t('whop.noCode')}
            </span>
            <span
              className="text-lg sm:text-xl font-semibold break-all"
              style={{ color: promoCode ? 'var(--accent-color)' : 'var(--success-color)' }}
            >
              {promoCode ? (
                promoCode
              ) : offer.name === 'Josh Exclusive VIP Access' ? (
                'JOSH'
              ) : offer.name === 'Momentum Monthly' ? (
                'PROMO-1A92969C'
              ) : offer.name === "Larry's Lounge Premium" ? (
                'PROMO-BF9EF1CC'
              ) : offer.name === "Dodgy's Dungeon" ? (
                'PROMO-565022F7'
              ) : offer.name === 'Trade With Insight - Pro' ? (
                'PROMO-624C9EA4'
              ) : offer.name === 'ParlayScience Discord Access' ? (
                'PROMO-C0047AFA'
              ) : offer.name === 'Scarface Trades Premium' ? (
                'PROMO-01FE6235'
              ) : offer.name === 'The Haven' ? (
                'PROMO-45EF5D24'
              ) : offer.name === 'PropFellas VIP' ? (
                'PROMO-B83DC955'
              ) : offer.name === 'Owls Full Access' ? (
                'PROMO-7136BFC8'
              ) : offer.name === 'Stellar AIO' ? (
                'PROMO-1A6008FA'
              ) : offer.name === 'Goat Ecom Growth' ? (
                'PROMO-1B868367'
              ) : offer.name === 'Indicators & VIP | LIFETIME' ? (
                'PROMO-7DBFEB18'
              ) : offer.name === 'Supercar Income' ? (
                'PROMO-5E906FAB'
              ) : offer.name === 'GOAT Sports Bets Membership' ? (
                'PROMO-3352BB19'
              ) : offer.name === 'Best Of Both Worlds' ? (
                'PROMO-336B4ACD'
              ) : offer.name === 'Moementum University' ? (
                'PROMO-23AB3618'
              ) : offer.name === 'ZWM Lifetime Access' ? (
                'PROMO-4E6D572F'
              ) : offer.name === 'Ayecon Academy Lifetime Membership' ? (
                'PROMO-022D1F18'
              ) : offer.name === 'The BFI Traders University' ? (
                'PROMO-58B279FF'
              ) : (
                t('whop.noCode')
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
