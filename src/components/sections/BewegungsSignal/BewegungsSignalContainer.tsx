import { unstable_cache } from 'next/cache';
import { BewegungsSignal, type BewegungsSignalProps } from './index';
import { getMemberCount } from '@/lib/members/count';

/**
 * Cache-Wrapper für die Memberzahl. Teilt sich die `members`-Tag-Familie mit
 * SiteFooterContainer — eine Invalidation greift überall gleichzeitig.
 */
const getCachedMemberCount = unstable_cache(
  getMemberCount,
  ['bewegungs-signal:member-count'],
  { revalidate: 3600, tags: ['members'] }
);

export type BewegungsSignalContainerProps = Omit<BewegungsSignalProps, 'memberCount'>;

/**
 * BewegungsSignalContainer — Server-Wrapper, holt Memberzahl serverseitig.
 *
 * Brand-Doktrin (MEMBER_CONCEPT.md §4 Säule 1): Memberzahl gehört in
 * BewegungsSignal-Section UND Footer. Beide Container nutzen denselben
 * Cache-Tag, sodass eine Invalidation (z.B. nach Verify-Bootstrap) beide
 * Stellen gleichzeitig aktualisiert.
 */
export async function BewegungsSignalContainer(
  props: BewegungsSignalContainerProps = {}
) {
  const memberCount = await getCachedMemberCount();
  return <BewegungsSignal memberCount={memberCount} {...props} />;
}
