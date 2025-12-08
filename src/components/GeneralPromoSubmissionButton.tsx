'use client';

import { useState, useEffect, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import PromoCodeSubmissionForm from './PromoCodeSubmissionForm';

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
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure we only portal on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => setShowForm(false);
  const handleSuccess = () => setShowForm(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className={className}
        style={style}
        aria-haspopup="dialog"
        aria-expanded={showForm}
      >
        {children || 'Submit Code'}
      </button>

      {showForm && mounted &&
        createPortal(
          <PromoCodeSubmissionForm
            onClose={handleClose}
            onSuccess={handleSuccess}
          />,
          document.body
        )}
    </>
  );
}
