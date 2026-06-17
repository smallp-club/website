import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware Routing-Helper für small p club.
 *
 * Liefert Link / usePathname / useRouter / redirect / getPathname Versionen,
 * die `localePrefix: 'as-needed'` respektieren — DE-Pfade ohne `/de/` Prefix,
 * EN-Pfade mit `/en/`. Nutze diese Helper in allen UI-Components statt der
 * rohen `next/navigation`-Pendants, damit der Sprachstand der App erhalten
 * bleibt und Sub-Route-Matching ohne manuellen Locale-Strip funktioniert.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
