'use client'
import React, { useState, useEffect, useRef } from 'react'
import OfferPageClient from './OfferPageClient'

interface PromoCode {
  id: string
  title: string
  description: string
  code: string | null
  type: string
  value: string
  createdAt: Date
}

interface CommunityPromoSectionProps {
  offer: {
    id: string
    name: string
    affiliateLink: string | null
  }
  promoCodes: PromoCode[]
  slug?: string
}

// Helper to get tier label based on rank
const getCodeTierLabel = (rank: number): string => {
  if (rank === 1) return 'Main code'
  if (rank === 2) return 'Secondary code'
  if (rank === 3) return 'Tertiary code'
  return 'Additional code'
}

export default function CommunityPromoSection({ offer, promoCodes, slug }: CommunityPromoSectionProps) {

  // Separate community codes from original codes
  const communityPromoCodes = promoCodes.filter(code => code.id.startsWith('community_'))
  const originalPromoCodes = promoCodes.filter(code => !code.id.startsWith('community_'))


  // Handle tracking completion to refresh stats
  const handleTrackingComplete = () => {
    // Trigger refresh for all compact stats on the page
    const compactStatsElements = document.querySelectorAll('[data-compact-stats]');
    compactStatsElements.forEach((element) => {
      const event = new CustomEvent('refreshStats');
      element.dispatchEvent(event);
    });
  };

  if (communityPromoCodes.length === 0 && originalPromoCodes.length === 0) {
    // Create a fake promo code entry for whops without codes but keep the button functionality
    const fakePromo = {
      id: 'no-code',
      title: 'Exclusive Access',
      description: 'This creator doesn\'t allow promo codes at this time.',
      code: null,
      type: 'exclusive',
      value: '',
      createdAt: new Date()
    }
    
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="mb-3">
            <OfferPageClient
              offer={offer}
              firstPromo={fakePromo}
              promoCode={null}
              promoTitle="Exclusive Access"
              onTrackingComplete={handleTrackingComplete}
            />
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-4">
      {/* Community Submitted Promo Codes */}
      {communityPromoCodes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
              Community Codes
            </h3>
            <span className="px-2 py-1 rounded text-xs font-medium" 
                  style={{ 
                    backgroundColor: 'var(--accent-color)', 
                    color: 'white' 
                  }}>
              NEW
            </span>
          </div>
          
          {communityPromoCodes.map((promo, index) => (
            <div key={promo.id} className="mb-3">
              <div className="flex items-center gap-3 mb-2">
                {/* Rank badge - vertical capsule style */}
                <div
                  className="inline-flex flex-col items-center justify-center rounded-full border px-2.5 py-1.5"
                  style={{
                    borderColor: 'var(--accent-color)',
                    backgroundColor: 'rgba(5,150,105,0.08)',
                  }}
                  aria-label={`Rank ${index + 1} promo code`}
                >
                  <span className="text-[10px] uppercase tracking-wide font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Rank
                  </span>
                  <span className="text-sm font-bold" style={{ color: 'var(--accent-color)' }}>
                    #{index + 1}
                  </span>
                </div>
                {/* Community badge */}
                <span
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                  style={{
                    borderColor: 'rgba(5,150,105,0.28)',
                    backgroundColor: 'rgba(5,150,105,0.06)',
                    color: 'var(--accent-color)',
                  }}
                >
                  Community
                </span>
              </div>
              <OfferPageClient
                offer={offer}
                firstPromo={promo}
                promoCode={promo.code}
                promoTitle={promo.title}
                onTrackingComplete={handleTrackingComplete}
              />
            </div>
          ))}

          {/* Simple separator */}
          {originalPromoCodes.length > 0 && (
            <div className="border-t pt-4 mt-4" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
                  Original Codes
                </h3>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Original Promo Codes */}
      {originalPromoCodes.length > 0 && (
        <div className="space-y-3">
          {originalPromoCodes.map((promo, index) => {
            const rank = communityPromoCodes.length + index + 1
            return (
            <div key={promo.id} className="mb-3">
              <div className="flex items-center gap-3 mb-2">
                {/* Rank badge - vertical capsule style */}
                <div
                  className="inline-flex flex-col items-center justify-center rounded-full border px-2.5 py-1.5"
                  style={{
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'var(--background-secondary)',
                  }}
                  aria-label={`Rank ${rank} promo code`}
                >
                  <span className="text-[10px] uppercase tracking-wide font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Rank
                  </span>
                  <span className="text-sm font-bold" style={{ color: 'var(--text-color)' }}>
                    #{rank}
                  </span>
                </div>
                {/* Tier label badge */}
                <span
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                  style={{
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {getCodeTierLabel(rank)}
                </span>
              </div>
              <OfferPageClient
                offer={offer}
                firstPromo={promo}
                promoCode={promo.code}
                promoTitle={promo.title}
                onTrackingComplete={handleTrackingComplete}
              />
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}