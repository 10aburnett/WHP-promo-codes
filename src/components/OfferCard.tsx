'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSocialProof, createSocialProofFromOffer } from '@/contexts/SocialProofContext';
import InitialsAvatar from './InitialsAvatar';
import { OfferLogoSSR } from './OfferLogoSSR';
import { offerHref } from '@/lib/paths';
import { resolveLogoUrl } from '@/lib/image-url';

// Define the promo type directly here to avoid import issues
interface Promo {
  id: string;
  whopName: string;
  slug?: string;
  promoType: string;
  promoValue: number;
  promoText: string;
  logoUrl: string;
  promoCode?: string | null;
  affiliateLink: string;
  isActive: boolean;
  price?: string | null;
  priceText?: string;
  priceBadge?: string;
  offerId?: string;
  promoCodeId?: string;
}

interface OfferCardProps {
  promo: Promo;
  priority?: boolean; // For prioritizing above-the-fold images
}

export default function OfferCard({ promo, priority = false }: OfferCardProps) {
  const { t, language, isHydrated } = useLanguage();
  const { addNotification } = useSocialProof();
  const pathname = usePathname();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Robust fallbacks for API shape variations
  const title =
    (promo as any).title ??
    promo.whopName ??
    (promo as any).name ??
    'Unknown Whop';

  // Resolve logo URL to absolute path for SSR-safe rendering
  const logoUrl = resolveLogoUrl(promo.logoUrl);

  const discountPercent =
    typeof (promo as any).discountPercent === 'number'
      ? (promo as any).discountPercent
      : typeof promo.promoValue === 'number'
      ? promo.promoValue
      : null;

  const detailHref =
    (promo as any).href ??
    (promo.slug
      ? `/offer/${encodeURIComponent(promo.slug)}`
      : promo.id
      ? `/offer/${encodeURIComponent(promo.id)}`
      : '#');

  const previewText =
    (promo as any).preview ??
    (promo as any).promoText ??
    (promo as any).description ??
    (promo as any).excerpt ??
    '';

  // Get price badge from API
  const rawPriceBadge =
    (promo as any).priceBadge ??
    (promo as any).priceText ??
    (promo as any).price ??
    null;

  // Only show pill if we have a real price (not "Free")
  const priceBadge =
    rawPriceBadge && rawPriceBadge.toLowerCase() !== 'free'
      ? rawPriceBadge
      : null;

  // Temporary debug logging
  console.log('CARD', {
    slug: promo.slug || promo.id,
    keys: Object.keys(promo),
    priceText: (promo as any).priceText,
    price: (promo as any).price,
    rawPriceBadge,
    priceBadge,
  });

  // Helper function to get the correct detail page URL based on language
  const getDetailPageUrl = () => {
    // Use slug if available, otherwise fall back to id
    const identifier = promo.slug || promo.id;

    // Use canonical offerHref helper - handles encoding properly
    return offerHref(identifier);
  };

  const handleGetPromoClick = (e: React.MouseEvent) => {
    console.log('🔥 OfferCard: Get Promo button clicked!', {
      offerName: promo.whopName,
      offerId: promo.offerId,
      promoCodeId: promo.promoCodeId,
      hasOfferId: !!promo.offerId,
      hasPromoCodeId: !!promo.promoCodeId,
      timestamp: new Date().toISOString(),
    });

    // Track the click event - now works even without promo code ID
    if (promo.offerId) {
      console.log(
        '✅ OfferCard: Offer ID present, calling trackOfferClick',
      );
      trackOfferClick(promo.offerId, promo.promoCodeId || null);
    } else {
      console.warn('⚠️ OfferCard: Missing offer ID:', promo.offerId);
    }

    // Trigger social proof notification
    const socialProofData = createSocialProofFromOffer({
      whopName: promo.whopName,
      promoCode: promo.promoCode,
      promoValue: promo.promoValue,
      promoType: promo.promoType,
      promoText: promo.promoText,
    });
    addNotification(socialProofData);
  };

  const handleViewDealClick = (e: React.MouseEvent) => {
    // Only navigation to deal page, no social proof notification
  };

  const trackOfferClick = async (offerId: string, promoCodeId: string | null) => {
    console.log('🔥 OfferCard: trackOfferClick called with:', {
      offerId,
      promoCodeId,
      offerName: promo.whopName,
      timestamp: new Date().toISOString(),
    });

    try {
      const requestBody = {
        casinoId: offerId, // Using offerId as casinoId for compatibility
        bonusId: promoCodeId, // Using promoCodeId as bonusId for compatibility (can be null)
        actionType: 'code_copy',
      };

      console.log('📤 OfferCard: Sending tracking request:', requestBody);

      const response = await fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ OfferCard: Tracking successful:', result);
      } else {
        const errorData = await response.text();
        console.error(
          '❌ OfferCard: Tracking failed:',
          response.status,
          errorData,
        );
      }
    } catch (error) {
      console.error('❌ OfferCard: Error tracking offer click:', error);
    }
  };

  // Intersection Observer for prefetching
  useEffect(() => {
    if (!cardRef.current) return;

    const cardElement = cardRef.current;
    let didPrefetch = false;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !didPrefetch) {
            const linkElement = cardElement.querySelector(
              'a[href^="/offer/"], a[href*="/offer/"]',
            ) as HTMLAnchorElement;
            if (linkElement) {
              linkElement.dispatchEvent(
                new MouseEvent('mouseover', { bubbles: true }),
              );
              didPrefetch = true;
            }
          }
        });
      },
      { rootMargin: '200px' },
    );

    io.observe(cardElement);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={cardRef} className="relative h-full">
      <article
        className="relative flex h-full flex-col justify-between rounded-2xl border shadow-theme-promo transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        {/* Thin fintech accent bar at the top */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-2xl"
          style={{
            background:
              'linear-gradient(90deg, rgba(4,120,87,0.9), rgba(22,163,74,0.8))',
          }}
        />

        <Link
          href={getDetailPageUrl()}
          prefetch={true}
          onMouseEnter={() => router.prefetch(getDetailPageUrl())}
          onTouchStart={() => router.prefetch(getDetailPageUrl())}
          className="block px-5 pt-5 pb-3"
          title={`${promo.whopName} Promo Code - ${promo.promoText} (${new Date().toLocaleDateString(
            'en-US',
            { month: 'long', year: 'numeric' },
          )})`}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-xl border"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              {!logoUrl ||
              logoUrl.includes('Simplified Logo') ||
              logoUrl.includes('placeholder') ? (
                <InitialsAvatar
                  name={title}
                  size="lg"
                  shape="square"
                  className="w-full h-full"
                />
              ) : (
                <OfferLogoSSR
                  src={logoUrl}
                  alt={`${promo.whopName} logo`}
                  width={64}
                  height={64}
                />
              )}
            </div>

            <div className="min-w-0">
              <h2
                className="truncate text-lg font-semibold md:text-xl"
                style={{ color: 'var(--text-color)' }}
              >
                {title}
              </h2>

              {previewText && (
                <p
                  className="mt-1 line-clamp-2 text-sm md:text-base"
                  style={{ color: 'var(--text-secondary)' }}
                  title={previewText}
                >
                  {previewText}
                </p>
              )}

              {priceBadge && (
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                    style={{
                      backgroundColor: 'var(--success-color)',
                      color: 'white',
                    }}
                  >
                    {priceBadge}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>

        <div className="mt-1 space-y-2 px-5 pb-5">
          {/* Primary CTA: external promo click */}
          <a
            href={promo.affiliateLink || '#'}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block w-full transform-gpu rounded-full border px-4 py-2.5 text-center text-sm font-semibold uppercase tracking-wide transition-all duration-150 hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              borderColor: 'var(--accent-color)',
            }}
            onClick={handleGetPromoClick}
          >
            {t('whop.getPromo')}
          </a>

          {/* Secondary CTA: internal detail view */}
          <Link
            href={getDetailPageUrl()}
            prefetch={true}
            onMouseEnter={() => router.prefetch(getDetailPageUrl())}
            onTouchStart={() => router.prefetch(getDetailPageUrl())}
            className="block w-full transform-gpu rounded-full border px-4 py-2.5 text-center text-sm font-medium transition-all duration-150 hover:-translate-y-0.5 hover:bg-theme-secondary active:translate-y-0"
            style={{
              backgroundColor: 'var(--background-color)',
              color: 'var(--accent-color)',
              borderColor: 'var(--border-color)',
            }}
            onClick={handleViewDealClick}
          >
            {t('whop.viewDeal')}
          </Link>
        </div>
      </article>
    </div>
  );
}
