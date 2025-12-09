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
      title="Blog post not found"
      description="We couldn't find this article on DigitalPromoCodes. It may have been removed, renamed, or the link may be incorrect."
      primaryCta={{ href: '/blog', label: 'Browse all articles' }}
      secondaryCta={{ href: '/', label: 'Back to homepage' }}
    />
  );
}
