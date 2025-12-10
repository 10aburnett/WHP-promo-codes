import ErrorState from '@/components/layout/ErrorState';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Article not available | DigitalPromoCodes',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlogPostNotFound() {
  return (
    <ErrorState
      variant="not-found"
      title="This article can't be found"
      description="This article is not available on DigitalPromoCodes. It may have been moved, renamed or removed."
      primaryCta={{ href: '/blog', label: 'View all articles' }}
      secondaryCta={{ href: '/', label: 'Return to homepage' }}
    />
  );
}
