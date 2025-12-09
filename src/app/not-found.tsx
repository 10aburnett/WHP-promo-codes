import ErrorState from '@/components/layout/ErrorState';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found | DigitalPromoCodes',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <ErrorState
      variant="not-found"
      title="We couldn't find that page"
      description="This link doesn't match any promo or product on DigitalPromoCodes. It might have moved, expired, or never existed."
      primaryCta={{ href: '/', label: 'Back to homepage' }}
      secondaryCta={{ href: '/blog', label: 'Read our blog' }}
    />
  );
}
