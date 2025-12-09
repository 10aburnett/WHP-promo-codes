// src/lib/brand.ts
// Centralised brand configuration for SEO metadata and JSON-LD

/**
 * Site brand name - used in titles, metadata, and JSON-LD
 */
export const SITE_BRAND = 'DigitalPromoCodes';

/**
 * Site name (alias for SITE_BRAND)
 */
export const SITE_NAME = 'DigitalPromoCodes';

/**
 * Site domain (without protocol)
 */
export const SITE_DOMAIN = 'digitalpromocodes.com';

/**
 * Full site URL with protocol
 */
export const SITE_URL = 'https://digitalpromocodes.com';

/**
 * Short tagline for the site - used in descriptions
 */
export const SITE_TAGLINE = 'Reliable savings on digital tools, courses and online memberships';

/**
 * Longer description for home/about pages
 */
export const SITE_DESCRIPTION = 'A focused hub for discovering curated promo codes, discount offers and savings on digital products, software tools, online courses and memberships.';

/**
 * Default author/publisher name for content
 */
export const SITE_AUTHOR = 'DigitalPromoCodes Editorial Team';

/**
 * Social media handles (without @)
 */
export const SOCIAL_HANDLES = {
  twitter: '',
  facebook: '',
};

/**
 * Contact email
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'digitalpromocodescontact@gmail.com';
