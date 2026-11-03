import { unstable_cache } from 'next/cache';
import { getMemberCount } from './count';

/**
 * Memberzahl, gecached (1h, Tag `members`). Gleicher Cache-Key wie der
 * bisherige SiteFooterContainer, damit V1 und V2 denselben Wert teilen.
 */
export const getCachedMemberCount = unstable_cache(
  getMemberCount,
  ['site-footer:member-count'],
  { revalidate: 3600, tags: ['members'] },
);
