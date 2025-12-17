import React from 'react';
import { FilterState, WhopCategory, getCategoryLabel } from '@/types/offer';

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  casinos: string[];
  className?: string;
  formRef?: React.RefObject<HTMLFormElement>;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  submitMode?: 'manual' | 'auto';
}

// Categories ordered by user interest and engagement
const WHOP_CATEGORIES: WhopCategory[] = [
  'AI',
  'BUSINESS',
  'ECOMMERCE',
  'TRADING',
  'PERSONAL_FINANCE',
  'SOCIAL_MEDIA',
  'SPORTS_BETTING',
  'PERSONAL_DEVELOPMENT',
  'RESELLING',
  'FITNESS',
  'GAMING',
  'CAREERS',
  'COMPUTER_SCIENCE',
  'REAL_ESTATE',
  'RECREATION',
  'TRAVEL',
  'LANGUAGES',
  'DATING',
  'OTHER',
];

export default function FilterControls({
  filters,
  onFilterChange,
  casinos,
  className = '',
  formRef,
  onSubmit,
  submitMode = 'auto',
}: FilterControlsProps) {
  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      method="GET"
      action="/"
      className={`w-full pointer-events-none ${className}`}
    >
      {/* Card-style container - pointer-events-auto to re-enable clicks inside */}
      <div
        className="rounded-2xl border px-4 py-4 md:px-6 md:py-5 shadow-sm pointer-events-auto"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Header row */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--text-muted)' }}>
              Browse digital offers
            </p>
            <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
              Filter by category or sort to find the right deal faster.
            </p>
          </div>
        </div>

        {/* Grid layout: search on left, filters on right */}
        <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-start">
          {/* Left: Search input */}
          <div
            className="flex items-center rounded-full px-3 py-2.5 md:px-4 md:py-3 border"
            style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--border-color)' }}
          >
            <div className="pl-1 pr-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                style={{ color: 'var(--text-muted)' }}
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              id="main-search-input"
              name="search"
              type="search"
              placeholder="Find digital products and deals"
              defaultValue={filters.searchTerm}
              onChange={
                submitMode === 'auto'
                  ? (e) => onFilterChange({ searchTerm: e.target.value })
                  : undefined
              }
              className="w-full bg-transparent border-0 text-sm md:text-base focus:outline-none"
              style={{ color: 'var(--text-color)' }}
            />
          </div>

          {/* Right: Category + Sort in 2-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category dropdown wrapper */}
            <div
              className="rounded-full border px-3 py-2.5 md:px-4 md:py-3 flex items-center justify-between"
              style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--border-color)' }}
            >
              <select
                value={filters.whopCategory}
                onChange={(e) =>
                  onFilterChange({
                    whopCategory: e.target.value as WhopCategory | '',
                  })
                }
                className="w-full bg-transparent border-0 text-sm md:text-base focus:outline-none appearance-none cursor-pointer"
                style={{
                  color: 'var(--text-color)',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                }}
              >
                <option value="">All categories</option>
                {WHOP_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </select>
              <svg
                className="w-4 h-4 flex-shrink-0 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={{ color: 'var(--text-muted)' }}
              >
                <path
                  d="M6 9l6 6 6-6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Sort dropdown wrapper */}
            <div
              className="rounded-full border px-3 py-2.5 md:px-4 md:py-3 flex items-center justify-between"
              style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--border-color)' }}
            >
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })
                }
                className="w-full bg-transparent border-0 text-sm md:text-base focus:outline-none appearance-none cursor-pointer"
                style={{
                  color: 'var(--text-color)',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                }}
              >
                <option value="">Sort by</option>
                <option value="highest-rated">Top rated</option>
                <option value="newest">Recently added</option>
                <option value="alpha-asc">A–Z</option>
                <option value="alpha-desc">Z–A</option>
                <option value="highest">Biggest discount</option>
                <option value="lowest">Smallest discount</option>
              </select>
              <svg
                className="w-4 h-4 flex-shrink-0 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={{ color: 'var(--text-muted)' }}
              >
                <path
                  d="M6 9l6 6 6-6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
