'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#343541] text-white">
      <div className="text-center p-8 max-w-md">
        <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
        <p className="text-[#a4a5b0] mb-6">
          We apologize for the inconvenience. The error has been logged.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[#68D08B] text-white rounded-md hover:bg-[#5abc7a] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 