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

// All available categories in a logical order
const WHOP_CATEGORIES: WhopCategory[] = [
  'TRADING',
  'AI',
  'SOCIAL_MEDIA',
  'SPORTS_BETTING',
  'BUSINESS',
  'ECOMMERCE',
  'GAMING',
  'PERSONAL_DEVELOPMENT',
  'PERSONAL_FINANCE',
  'RESELLING',
  'CAREERS',
  'FITNESS',
  'RECREATION',
  'COMPUTER_SCIENCE',
  'REAL_ESTATE',
  'DATING',
  'TRAVEL',
  'LANGUAGES',
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
  // Shared select base classes
  const selectBase =
    'h-11 md:h-12 w-full rounded-full border-0 pl-4 pr-9 text-sm md:text-base ' +
    'focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] ' +
    'transition-all appearance-none';

  const inputBase =
    'w-full h-11 md:h-12 rounded-full border-0 pl-10 pr-4 text-sm md:text-base ' +
    'focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all';

  const selectWrapper =
    'relative flex-1 min-w-[150px] md:min-w-[180px]';

  const chevronIcon = (
    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs">
      <svg
        className="w-4 h-4"
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
    </span>
  );

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      method="GET"
      action="/"
      className={`w-full max-w-4xl mx-auto ${className}`}
    >
      {/* DESKTOP: pill-style horizontal bar */}
      <div
        className="hidden sm:flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-3xl border"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Search Bar */}
        <div className="relative flex-[1.9] min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
            placeholder="Search tools, courses & communities"
            defaultValue={filters.searchTerm}
            onChange={
              submitMode === 'auto'
                ? (e) => onFilterChange({ searchTerm: e.target.value })
                : undefined
            }
            className={inputBase}
            style={{
              backgroundColor: 'var(--background-color)',
              color: 'var(--text-color)',
            }}
          />
        </div>

        {/* Category Dropdown */}
        <div className={selectWrapper}>
          <select
            value={filters.whopCategory}
            onChange={(e) =>
              onFilterChange({
                whopCategory: e.target.value as WhopCategory | '',
              })
            }
            className={selectBase}
            style={{
              backgroundColor: 'var(--background-color)',
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
          {chevronIcon}
        </div>

        {/* Sort Dropdown */}
        <div className={selectWrapper}>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })
            }
            className={selectBase}
            style={{
              backgroundColor: 'var(--background-color)',
              color: 'var(--text-color)',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
          >
            <option value="">Sort by</option>
            <option value="newest">Newest added</option>
            <option value="highest-rated">Highest rated</option>
            <option value="highest">Highest value</option>
            <option value="lowest">Lowest value</option>
            <option value="alpha-asc">A–Z</option>
            <option value="alpha-desc">Z–A</option>
          </select>
          {chevronIcon}
        </div>
      </div>

      {/* MOBILE: stacked but still pill-like */}
      <div className="sm:hidden flex flex-col gap-2">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
            id="main-search-input-mobile"
            name="search"
            type="search"
            placeholder="Search tools, courses & communities"
            defaultValue={filters.searchTerm}
            onChange={
              submitMode === 'auto'
                ? (e) => onFilterChange({ searchTerm: e.target.value })
                : undefined
            }
            className={inputBase}
            style={{
              backgroundColor: 'var(--background-color)',
              color: 'var(--text-color)',
            }}
          />
        </div>

        {/* Category */}
        <div className={selectWrapper}>
          <select
            value={filters.whopCategory}
            onChange={(e) =>
              onFilterChange({
                whopCategory: e.target.value as WhopCategory | '',
              })
            }
            className={selectBase}
            style={{
              backgroundColor: 'var(--background-secondary)',
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
          {chevronIcon}
        </div>

        {/* Sort */}
        <div className={selectWrapper}>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })
            }
            className={selectBase}
            style={{
              backgroundColor: 'var(--background-secondary)',
              color: 'var(--text-color)',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
          >
            <option value="">Sort by</option>
            <option value="newest">Newest added</option>
            <option value="highest-rated">Highest rated</option>
            <option value="highest">Highest value</option>
            <option value="lowest">Lowest value</option>
            <option value="alpha-asc">A–Z</option>
            <option value="alpha-desc">Z–A</option>
          </select>
          {chevronIcon}
        </div>
      </div>
    </form>
  );
}
