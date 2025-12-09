'use client';

import { useEffect } from 'react';
import ErrorState from '@/components/layout/ErrorState';

export default function OfferError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Offer page error:', error);
  }, [error]);

  return (
    <ErrorState
      variant="error"
      title="We couldn't load this offer"
      description="An error occurred while loading this offer page on DigitalPromoCodes. Our team has been notified."
      onRetry={reset}
      secondaryCta={{ href: '/', label: 'Browse all deals' }}
    />
  );
}
