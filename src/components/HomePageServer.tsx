// src/components/HomePageServer.tsx
// Server component for homepage - no client state, pure server rendering
import Link from 'next/link';
import OfferCard from '@/components/OfferCard';
import FilterControlsWrapper from '@/components/FilterControlsWrapper';
import { SITE_BRAND, SITE_TAGLINE } from '@/lib/brand';

interface PromoCode {
  id: string;
  title: string;
  description: string;
  code: string | null;
  type: string;
  value: string;
}

interface DealItem {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string;
  rating: number;
  displayOrder: number;
  affiliateLink: string | null;
  promoCodes: PromoCode[];
  price?: string | null;
  priceText?: string;
  priceBadge?: string;
}

interface HomePageServerProps {
  items: DealItem[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export default function HomePageServer({
  items,
  currentPage,
  totalPages,
  total,
}: HomePageServerProps) {
  const pageHref = (n: number) => `/?page=${n}`;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="container mx-auto max-w-6xl px-3 sm:px-4 lg:px-0 mt-8 md:mt-6 lg:mt-4">
      {/* HERO */}
      <section className="text-center mt-2 mb-8 space-y-3">
        <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-semibold md:font-bold tracking-tight">
          <span style={{ color: 'var(--accent-color)' }}>{SITE_BRAND}</span>
          <span style={{ color: 'var(--text-color)' }}>
            {' '}
            – Deals, Discounts &amp; Exclusive Offers
          </span>
        </h1>
        {SITE_TAGLINE && (
          <p
            className="text-sm md:text-base max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            {SITE_TAGLINE}
          </p>
        )}
      </section>

      {/* Client island for search/filters */}
      <div className="rounded-2xl border px-3 sm:px-4 py-3 sm:py-4 mb-4 md:mb-6 transition-theme shadow-theme-promo"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <FilterControlsWrapper />
      </div>

      {/* Results count */}
      {total > 0 && (
        <p
          className="mb-4 md:mb-6 text-center text-sm md:text-base"
          style={{ color: 'var(--text-secondary)' }}
        >
          Showing {((currentPage - 1) * 15) + 1}-{Math.min(currentPage * 15, total)} of {total}{' '}
          results
        </p>
      )}

      {/* Mobile-only Pagination Controls (Top) */}
      {totalPages > 1 && (
        <div className="md:hidden flex justify-center items-center gap-1 sm:gap-2 mt-2 mb-6 px-2 overflow-x-auto">
          {/* Previous Button */}
          {currentPage > 1 ? (
            <Link
              href={pageHref(currentPage - 1)}
              prefetch={false}
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Link>
          ) : (
            <span
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 opacity-50"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
              aria-disabled="true"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </span>
          )}

          {/* Page Numbers */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {getPageNumbers().map((pageNum) => (
              <Link
                key={pageNum}
                href={pageHref(pageNum)}
                prefetch={false}
                aria-current={pageNum === currentPage ? 'page' : undefined}
                className={`px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base flex-shrink-0 min-w-[36px] sm:min-w-[40px] text-center transition-all duration-200 hover:opacity-85 active:scale-[0.98] ${
                  pageNum === currentPage ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor:
                    pageNum === currentPage
                      ? 'var(--accent-color)'
                      : 'var(--background-secondary)',
                  borderColor:
                    pageNum === currentPage
                      ? 'var(--accent-color)'
                      : 'var(--border-color)',
                  color: pageNum === currentPage ? '#ffffff' : 'var(--text-color)',
                }}
              >
                {pageNum}
              </Link>
            ))}
          </div>

          {/* Next Button */}
          {currentPage < totalPages ? (
            <Link
              href={pageHref(currentPage + 1)}
              prefetch={false}
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </Link>
          ) : (
            <span
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 opacity-50"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
              aria-disabled="true"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </span>
          )}
        </div>
      )}

      {/* Desktop-only Pagination Controls (Top) */}
      {totalPages > 1 && (
        <div className="hidden md:flex justify-center items-center gap-1 sm:gap-2 mt-2 mb-6 px-2 overflow-x-auto">
          {/* Previous Button */}
          {currentPage > 1 ? (
            <Link
              href={pageHref(currentPage - 1)}
              prefetch={false}
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Link>
          ) : (
            <span
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 opacity-50"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
              aria-disabled="true"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </span>
          )}

          {/* Page Numbers */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {getPageNumbers().map((pageNum) => (
              <Link
                key={pageNum}
                href={pageHref(pageNum)}
                prefetch={false}
                aria-current={pageNum === currentPage ? 'page' : undefined}
                className={`px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base flex-shrink-0 min-w-[36px] sm:min-w-[40px] text-center transition-all duration-200 hover:opacity-85 active:scale-[0.98] ${
                  pageNum === currentPage ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor:
                    pageNum === currentPage
                      ? 'var(--accent-color)'
                      : 'var(--background-secondary)',
                  borderColor:
                    pageNum === currentPage
                      ? 'var(--accent-color)'
                      : 'var(--border-color)',
                  color: pageNum === currentPage ? '#ffffff' : 'var(--text-color)',
                }}
              >
                {pageNum}
              </Link>
            ))}
          </div>

          {/* Next Button */}
          {currentPage < totalPages ? (
            <Link
              href={pageHref(currentPage + 1)}
              prefetch={false}
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </Link>
          ) : (
            <span
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 opacity-50"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
              aria-disabled="true"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </span>
          )}
        </div>
      )}

      {/* Offer Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-7 mb-8">
        {items.map((whop) => (
          <OfferCard
            key={whop.id}
            promo={{
              id: whop.id,
              whopName: whop.name,
              slug: whop.slug,
              promoType: whop.promoCodes[0]?.type || 'discount',
              promoValue: parseInt(whop.promoCodes[0]?.value || '0'),
              promoText: whop.promoCodes[0]?.title || 'Exclusive Access',
              logoUrl: whop.logo || '',
              promoCode: whop.promoCodes[0]?.code || null,
              affiliateLink: whop.affiliateLink || '',
              isActive: true,
              price: whop.price,
              priceText: whop.priceText,
              priceBadge: whop.priceBadge,
              offerId: whop.id,
              promoCodeId: whop.promoCodes[0]?.id,
            }}
          />
        ))}
      </div>

      {/* Pagination Controls (Bottom) */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 sm:gap-2 mt-4 mb-10 px-2 overflow-x-auto">
          {/* Previous Button */}
          {currentPage > 1 ? (
            <Link
              href={pageHref(currentPage - 1)}
              prefetch={false}
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Link>
          ) : (
            <span
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 opacity-50"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
              aria-disabled="true"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </span>
          )}

          {/* Page Numbers */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {getPageNumbers().map((pageNum) => (
              <Link
                key={pageNum}
                href={pageHref(pageNum)}
                prefetch={false}
                aria-current={pageNum === currentPage ? 'page' : undefined}
                className={`px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base flex-shrink-0 min-w-[36px] sm:min-w-[40px] text-center transition-all duration-200 hover:opacity-85 active:scale-[0.98] ${
                  pageNum === currentPage ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor:
                    pageNum === currentPage
                      ? 'var(--accent-color)'
                      : 'var(--background-secondary)',
                  borderColor:
                    pageNum === currentPage
                      ? 'var(--accent-color)'
                      : 'var(--border-color)',
                  color: pageNum === currentPage ? '#ffffff' : 'var(--text-color)',
                }}
              >
                {pageNum}
              </Link>
            ))}
          </div>

          {/* Next Button */}
          {currentPage < totalPages ? (
            <Link
              href={pageHref(currentPage + 1)}
              prefetch={false}
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </Link>
          ) : (
            <span
              className="px-3 sm:px-4 py-2.5 rounded-full border text-sm sm:text-base whitespace-nowrap flex-shrink-0 opacity-50"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
              aria-disabled="true"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </span>
          )}
        </div>
      )}

      {/* No results message */}
      {items.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            No results found
          </p>
        </div>
      )}
    </div>
  );
}
