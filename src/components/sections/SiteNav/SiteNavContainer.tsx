import { getCurrentMember } from '@/lib/members/auth';
import { SiteNav, type SiteNavProps } from './index';

export type SiteNavContainerProps = Omit<SiteNavProps, 'memberPseudonym'>;

/**
 * SiteNavContainer — Server-Component-Wrapper für SiteNav.
 *
 * Holt den Member-Status aus der Supabase-Session und übergibt das Pseudonym
 * an die Pille — eingeloggte User sehen ihren Brand-Namen in der Nav statt
 * „mit-glied", die Pille linkt direkt zum Eingang.
 *
 * Trade-off: Das macht alle Pages die das Layout nutzen dynamic (Cookies =
 * Dynamic Rendering). Akzeptiert für Member-UX. Optimization für später wäre
 * eine display-only Cookie aus dem Proxy.
 */
export async function SiteNavContainer(props: SiteNavContainerProps = {}) {
  const session = await getCurrentMember();
  return (
    <SiteNav
      {...props}
      memberPseudonym={session?.profile.pseudonym}
    />
  );
}
