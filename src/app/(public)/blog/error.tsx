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
      title="Blog temporarily unavailable"
      description="We're experiencing technical difficulties with the blog. Our team has been notified and is working on a fix."
      onRetry={reset}
      secondaryCta={{ href: '/', label: 'Back to homepage' }}
    />
  );
}
