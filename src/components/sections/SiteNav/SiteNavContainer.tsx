import { SiteNav, type SiteNavProps } from './index';

export type SiteNavContainerProps = SiteNavProps;

/**
 * SiteNavContainer — Server-Component-Wrapper für SiteNav.
 *
 * Aktuell keine async Server-Daten nötig (SiteNav ist statisch). Der
 * Wrapper existiert für Pattern-Konsistenz mit SiteFooterContainer und
 * als Aufhängepunkt für künftige Server-State (z. B. unread-Member-
 * Notifications, Locale-Switcher-Daten).
 *
 * Layouts importieren SiteNavContainer. SiteNav bleibt direkt importierbar
 * für Library-Preview und Tests.
 */
export function SiteNavContainer(props: SiteNavContainerProps = {}) {
  return <SiteNav {...props} />;
}
