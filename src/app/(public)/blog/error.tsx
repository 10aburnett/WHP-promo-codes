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
      description="An issue occurred while loading blog content on DigitalPromoCodes. Please refresh the page or try again shortly."
      onRetry={reset}
      secondaryCta={{ href: '/', label: 'Back to homepage' }}
    />
  );
}
