import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Legacy colors (keeping for backward compatibility)
        background: '#1a1b23',
        container: '#2a2d3a',
        text: '#f1f1f1',
        accent: '#6366f1',
        'menu-item': '#a7a9b4',
        'promo-bg': '#2a2d3a',
        'promo-border': '#3f4451',
        
        // Theme-aware colors using CSS variables
        theme: {
          primary: 'var(--background-color)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
          text: {
            primary: 'var(--text-color)',
            secondary: 'var(--text-secondary)',
            muted: 'var(--text-muted)',
          },
          accent: {
            DEFAULT: 'var(--accent-color)',
            hover: 'var(--accent-hover)',
          },
          success: {
            DEFAULT: 'var(--success-color)',
            hover: 'var(--success-hover)',
          },
          border: {
            DEFAULT: 'var(--border-color)',
            hover: 'var(--border-hover)',
          },
          card: {
            bg: 'var(--card-bg)',
            border: 'var(--card-border)',
          },
          input: {
            bg: 'var(--input-bg)',
            border: 'var(--input-border)',
            focus: 'var(--input-focus)',
          },
        },
      },
      boxShadow: {
        header: '2px 0 3px 0 #00000085',
        promo: '0 0 4px 0 #1a1b27ad',
        'theme-header': 'var(--header-shadow)',
        'theme-promo': 'var(--promo-shadow)',
      },
      borderRadius: {
        large: '12px',
        button: '6px',
      },
      transitionProperty: {
        'theme': 'background-color, color, border-color',
      },
    },
  },
  plugins: [],
};

export default config; 