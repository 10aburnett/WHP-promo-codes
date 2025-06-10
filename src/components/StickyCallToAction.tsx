'use client';

import StickyCopyCodeButton from '@/components/StickyCopyCodeButton';
import OfferButton from '@/components/OfferButton';

interface StickyCallToActionProps {
  whopName: string;
  whopId: string;
  promoCodeId?: string;
  promoTitle: string;
  promoCode: string | null;
  affiliateLink: string | null;
  logo?: string | null;
}

export default function StickyCallToAction({
  whopName,
  whopId,
  promoCodeId,
  promoTitle,
  promoCode,
  affiliateLink
}: StickyCallToActionProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-[10px]">
      {promoCode ? (
        <div className="w-full sm:w-auto">
          <StickyCopyCodeButton 
            code={promoCode} 
            whopId={whopId}
            promoCodeId={promoCodeId}
          />
        </div>
      ) : null}
      <div className="w-full sm:w-auto">
        <OfferButton 
          affiliateLink={affiliateLink}
          whopId={whopId}
          promoCodeId={promoCodeId}
          size="default"
          isSticky={true}
        />
      </div>
    </div>
  );
} 