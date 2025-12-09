import ErrorState from '@/components/layout/ErrorState';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offer not found | DigitalPromoCodes',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfferNotFound() {
  return (
    <ErrorState
      variant="not-found"
      title="This offer isn't available"
      description="We can't find an active promo page for this product on DigitalPromoCodes. It may have expired, been removed by the creator, or the link may be incorrect."
      primaryCta={{ href: '/', label: 'Browse current deals' }}
      secondaryCta={{ href: '/blog', label: 'Read our blog' }}
    />
  );
}
