'use client';

import { useEffect } from 'react';
import ErrorState from '@/components/layout/ErrorState';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <ErrorState
      variant="error"
      title="We hit a snag loading this page"
      description="An unexpected error occurred while loading this part of DigitalPromoCodes. Our team is automatically notified so we can look into it."
      onRetry={reset}
      secondaryCta={{ href: '/', label: 'Back to homepage' }}
    />
  );
}
