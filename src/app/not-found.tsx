import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#343541] text-white">
      <div className="text-center p-8 max-w-md">
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-[#a4a5b0] mb-6">
          We could not find the page you were looking for.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#68D08B] text-white rounded-md hover:bg-[#5abc7a] transition-colors inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 