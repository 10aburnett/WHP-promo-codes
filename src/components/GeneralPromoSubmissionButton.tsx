import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

interface GeneralPromoSubmissionButtonProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export default function GeneralPromoSubmissionButton({
  className,
  style,
  children,
}: GeneralPromoSubmissionButtonProps) {
  return (
    <Link
      href="/submit-code"
      className={className}
      style={style}
    >
      {children || 'Submit Code'}
    </Link>
  );
}
