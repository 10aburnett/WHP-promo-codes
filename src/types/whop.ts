export type WhopCategory = 
  | 'PERSONAL_DEVELOPMENT'
  | 'SOCIAL_MEDIA'
  | 'LANGUAGES'
  | 'CAREERS'
  | 'GAMING'
  | 'AI'
  | 'TRADING'
  | 'RECREATION'
  | 'FITNESS'
  | 'AGENCIES'
  | 'SPIRITUALITY'
  | 'REAL_ESTATE'
  | 'TRAVEL'
  | 'GAME_SHOW'
  | 'SPORTS_BETTING'
  | 'ECOMMERCE'
  | 'BUSINESS'
  | 'RESELLING'
  | 'PODCASTS'
  | 'DATING'
  | 'COMPUTER_SCIENCE'
  | 'NEWSLETTERS'
  | 'PERSONAL_FINANCE'
  | 'OTHER';

export type PromoType = 'discount' | 'free_trial' | 'exclusive_access' | 'bundle_deal' | 'limited_time' | 'other';

export interface Review {
  id: string;
  username: string;
  rating: number; // 1-5
  text: string;
  date: string;
  verified: boolean;
}

export interface WhopPromo {
  id: string;
  whopName: string;
  promoType: PromoType;
  promoValue: number;
  promoText: string;
  logoUrl: string;
  promoCode?: string;
  affiliateLink: string;
  isActive: boolean;
  reviews?: Review[];
  whopCategory?: WhopCategory;
}

export interface FilterState {
  searchTerm: string;
  promoType: PromoType | '';
  whopCategory: WhopCategory | '';
  whop: string;
  sortBy: 'highest' | 'lowest' | 'alpha-asc' | 'alpha-desc' | 'newest' | 'highest-rated' | '';
}

// Helper function to convert enum values to display labels
export function getCategoryLabel(category: WhopCategory): string {
  const labels: Record<WhopCategory, string> = {
    PERSONAL_DEVELOPMENT: 'Personal Development',
    SOCIAL_MEDIA: 'Social Media',
    LANGUAGES: 'Languages',
    CAREERS: 'Careers',
    GAMING: 'Gaming',
    AI: 'AI',
    TRADING: 'Trading',
    RECREATION: 'Recreation',
    FITNESS: 'Fitness',
    AGENCIES: 'Agencies',
    SPIRITUALITY: 'Spirituality',
    REAL_ESTATE: 'Real Estate',
    TRAVEL: 'Travel',
    GAME_SHOW: 'Game Show',
    SPORTS_BETTING: 'Sports Betting',
    ECOMMERCE: 'E-commerce',
    BUSINESS: 'Business',
    RESELLING: 'Reselling',
    PODCASTS: 'Podcasts',
    DATING: 'Dating',
    COMPUTER_SCIENCE: 'Computer Science',
    NEWSLETTERS: 'Newsletters',
    PERSONAL_FINANCE: 'Personal Finance',
    OTHER: 'Other'
  };
  return labels[category];
} 