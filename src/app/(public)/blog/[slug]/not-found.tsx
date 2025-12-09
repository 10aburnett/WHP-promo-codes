import ErrorState from '@/components/layout/ErrorState';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog post not found | DigitalPromoCodes',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlogPostNotFound() {
  return (
    <ErrorState
      variant="not-found"
      title="Article not found"
      description="This article is no longer available on DigitalPromoCodes. It may have been removed, renamed, or never existed."
      primaryCta={{ href: '/blog', label: 'View all insights' }}
      secondaryCta={{ href: '/', label: 'Back to homepage' }}
    />
  );
}
