// src/lib/graph.ts
import { normalizeSlug } from './slug-normalize';
// Import JSON directly - bundled with serverless functions, no filesystem read needed
import neighborsData from '@/data/graph/neighbors.json';

export type NeighborData = { recommendations: string[]; alternatives: string[]; explore?: string };
export type NeighborsMap = Record<string, NeighborData>;

const GRAPH_URL =
  (process.env.NEXT_PUBLIC_GRAPH_URL && process.env.NEXT_PUBLIC_GRAPH_URL.trim()) ||
  '/data/graph/neighbors.json';

const GRAPH_VER = process.env.NEXT_PUBLIC_GRAPH_VERSION || '';

// Dev-only mock slugs for styling the recommendations/alternatives sections
const DEV_MOCK_SLUGS = [
  'ai-video-labs',
  'korvato',
  'goldboys-gold',
  'deal-flip-formula-main',
  'penny-stock-mafia',
  'mf-capital',
  'high-ticket-incubator',
  'the-ai-agency-launchpad',
];

export async function loadNeighbors(): Promise<NeighborsMap> {
  // In development, return mock data so we can style recs/alternatives without network timeouts
  if (process.env.NODE_ENV === 'development') {
    // Create a wildcard entry that getNeighborSlugsFor can match against any slug
    // by using a Proxy that returns mock data for any key
    const mockData: NeighborsMap = {};

    // Pre-populate with known slugs, but also add a handler for unknown slugs
    const baseMockEntry: NeighborData = {
      recommendations: DEV_MOCK_SLUGS.slice(0, 4),
      alternatives: DEV_MOCK_SLUGS.slice(4, 8),
      explore: '/offers'
    };

    // Add mock entries for known slugs
    DEV_MOCK_SLUGS.forEach(slug => {
      mockData[slug] = baseMockEntry;
    });

    // Return a Proxy that returns mock data for ANY slug lookup
    return new Proxy(mockData, {
      get(target, prop: string) {
        if (prop in target) {
          return target[prop];
        }
        // Return mock data for any unknown slug too
        return baseMockEntry;
      }
    });
  }

  // Server-side: use imported JSON (bundled with serverless function)
  // This guarantees data is available on every cold start
  if (typeof window === 'undefined') {
    console.log('[graph] Using bundled neighbors data:', Object.keys(neighborsData).length, 'entries');
    return neighborsData as NeighborsMap;
  }

  // Client-side only: fetch from relative URL (same domain, no circular issue)
  const url = GRAPH_VER
    ? `${GRAPH_URL}${GRAPH_URL.includes('?') ? '&' : '?'}v=${encodeURIComponent(GRAPH_VER)}`
    : GRAPH_URL;

  console.debug('[graph] url in browser:', url);
  (window as any).__WHOP_GRAPH_URL = url;

  // Use 'force-cache' for stable SSR/hydration - Next.js will use same cached data
  const res = await fetch(url, { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Graph fetch failed ${res.status}`);

  const data = await res.json();
  const keys = Object.keys(data).length;

  // Debug logging (only when NEXT_PUBLIC_DEBUG is enabled)
  const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true';

  if (isDebug) {
    console.log('[graph] Loaded:', {
      url,
      keys,
      version: GRAPH_VER,
      sampleKeys: Object.keys(data).slice(0, 3),
      env: process.env.NODE_ENV
    });
  }

  (window as any).__graphDebug = {
    url,
    keys,
    version: GRAPH_VER,
    timestamp: new Date().toISOString()
  };

  return data;
}

export function getNeighborSlugsFor(
  neighbors: Record<string, { recommendations?: string[]; alternatives?: string[]; explore?: string }>,
  slug: string,
  kind: 'recommendations'|'alternatives'
): string[] {
  // Just lowercase, don't strip hyphens - graph keys may have trailing hyphens
  const s = slug.toLowerCase();
  const entry = neighbors[s] || neighbors[decodeURIComponent(s)] || neighbors[s.replace(/\s+/g,'-')];
  if (!entry) return [];
  const arr = (entry[kind] || []).filter(Boolean);
  return Array.from(new Set(arr)); // de-dup
}

export function getExploreFor(
  neighbors: Record<string, { recommendations?: string[]; alternatives?: string[]; explore?: string }>,
  slug: string
): string | null {
  // Just lowercase, don't strip hyphens - graph keys may have trailing hyphens
  const s = slug.toLowerCase();
  const entry = neighbors[s] || neighbors[decodeURIComponent(s)] || neighbors[s.replace(/\s+/g,'-')];
  return entry?.explore || null;
}