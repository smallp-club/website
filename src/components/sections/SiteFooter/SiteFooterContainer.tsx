import { unstable_cache } from 'next/cache';
import { SiteFooter, type SiteFooterProps } from './index';
import { getMemberCount } from '@/lib/members/count';

/**
 * Cache-Wrapper für die Memberzahl. ISR-style mit 1h-Revalidate und Tag
 * für gezielte Invalidation (z.B. nach neuem Member-Signup via Webhook).
 */
const getCachedMemberCount = unstable_cache(
  getMemberCount,
  ['site-footer:member-count'],
  { revalidate: 3600, tags: ['members'] }
);

export type SiteFooterContainerProps = Omit<SiteFooterProps, 'memberCount'>;

/**
 * SiteFooterContainer — Server-Component-Wrapper für SiteFooter.
 *
 * Holt die Memberzahl server-side (gecached, 1h Revalidate) und reicht
 * sie als Prop an die Client-Komponente weiter. Wird in Layouts statt
 * SiteFooter direkt verwendet — Page-Level kennt nur SiteFooterContainer.
 *
 * SiteFooter bleibt direkt importierbar für Library-Preview und Tests
 * mit beliebigen Member-Counts.
 *
 * @example
 * // In einem Layout (Server-Component):
 * import { SiteFooterContainer } from '@/components/sections/SiteFooter/SiteFooterContainer';
 *
 * export default function Layout({ children }) {
 *   return (
 *     <>
 *       {children}
 *       <SiteFooterContainer />
 *     </>
 *   );
 * }
 */
export async function SiteFooterContainer(
  props: SiteFooterContainerProps = {}
) {
  const memberCount = await getCachedMemberCount();
  return <SiteFooter memberCount={memberCount} {...props} />;
}
