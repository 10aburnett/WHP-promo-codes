'use client';

import { useEffect } from 'react';
import ErrorState from '@/components/layout/ErrorState';

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog page error:', error);
  }, [error]);

  return (
    <ErrorState
      variant="error"
      title="We couldn't load the blog"
      description="Something went wrong while loading blog content on DigitalPromoCodes. Please retry or return to the homepage."
      onRetry={reset}
      secondaryCta={{ href: '/', label: 'Back to homepage' }}
    />
  );
}
