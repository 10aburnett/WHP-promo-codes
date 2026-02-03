// src/components/HomePageHybrid.tsx
// Hybrid server/client component for homepage
// Hero is server-rendered, grid is client-side for fast interactions

import { SITE_BRAND } from '@/lib/brand';
import OffersGridClient from '@/components/OffersGridClient';

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

interface HomePageHybridProps {
  items: DealItem[];
  currentPage: number;
  totalPages: number;
  total: number;
  searchParams?: { search?: string; whopCategory?: string; sortBy?: string };
}

// Transform server data format to API format for OffersGridClient
function transformToApiFormat(items: DealItem[]) {
  return items.map(item => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    logo: item.logo,
    description: item.description,
    rating: item.rating,
    displayOrder: item.displayOrder,
    affiliateLink: item.affiliateLink,
    price: item.price,
    category: null,
    PromoCode: item.promoCodes.map(pc => ({
      id: pc.id,
      code: pc.code,
      title: pc.title,
      description: pc.description,
      value: pc.value,
      type: pc.type,
    })),
    _count: { Review: 0 },
  }));
}

export default function HomePageHybrid({
  items,
  currentPage,
  totalPages,
  total,
  searchParams = {},
}: HomePageHybridProps) {
  // Transform items to API format
  const apiFormatOffers = transformToApiFormat(items);

  return (
    <>
      {/* HERO - Server-rendered for SEO */}
      <section
        className="pt-8 md:pt-10 pb-6 transition-theme"
        style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
      >
        <div className="mx-auto w-[90%] md:w-[95%] max-w-[1200px]">
          <header className="mb-6 md:mb-8">
            <p
              className="text-xs font-semibold tracking-wide uppercase mb-3"
              style={{ color: 'var(--accent-color)' }}
            >
              {SITE_BRAND} - verified digital savings
            </p>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
              style={{ color: 'var(--text-color)', lineHeight: 1.1 }}
            >
              Whop promo codes for digital tools, courses &amp; memberships.
            </h1>
            <p
              className="text-sm md:text-base max-w-2xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              Reliable discounts on SaaS, trading communities, AI tools and more - hand-checked before you buy.
            </p>
          </header>
        </div>
      </section>

      {/* Client-side grid for fast interactions */}
      <OffersGridClient
        initialOffers={apiFormatOffers}
        initialTotal={total}
        initialPage={currentPage}
        initialSearch={searchParams.search || ''}
        initialCategory={searchParams.whopCategory || ''}
        initialSort={searchParams.sortBy || ''}
      />
    </>
  );
}
