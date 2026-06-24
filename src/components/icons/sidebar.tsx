/**
 * Sidebar-Icons für den Mit-Glied-Bereich.
 *
 * Phosphor-Inspired Thin/Light-Weight, custom-gezeichnet damit kein
 * Package-Install nötig ist. Alle in 24×24 viewBox, currentColor stroke 1.5,
 * round line-caps + line-joins. Skaliert sauber bis 32px Icon-Größe.
 */

import type { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function IconBase({ size = 20, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ===== Member-Bereich ===== */

export function DashboardIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </IconBase>
  );
}

export function CardIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M7 11.5h4" />
      <path d="M7 15h6" />
    </IconBase>
  );
}

export function NoteIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 3.5H6.5A1.5 1.5 0 0 0 5 5v14a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V8.5L14 3.5Z" />
      <path d="M14 3.5V8.5h5" />
      <path d="M8.5 13h7" />
      <path d="M8.5 16.5h5" />
    </IconBase>
  );
}

export function ToolboxIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 9.5h18v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-9Z" />
      <path d="M9 9.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v3.5" />
      <path d="M3 13.5h6m6 0h6" />
      <rect x="9" y="11.5" width="6" height="4" rx="0.5" />
    </IconBase>
  );
}

export function DatabaseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      <path d="M5 5.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
      <path d="M5 11.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
    </IconBase>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </IconBase>
  );
}

/* ===== Admin-Bereich ===== */

export function ShieldIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6l8-3Z" />
      <path d="M8.5 12l2.5 2.5L16 9.5" />
    </IconBase>
  );
}

export function InboxIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 13.5l1.5-8a1.5 1.5 0 0 1 1.5-1.2h10a1.5 1.5 0 0 1 1.5 1.2L20 13.5" />
      <path d="M4 13.5h4.5l1 2.5h5l1-2.5H20v5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-5Z" />
    </IconBase>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="5" y="4.5" width="14" height="16" rx="1.5" />
      <rect x="8.5" y="2.5" width="7" height="4" rx="1" />
      <path d="M8.5 11h7" />
      <path d="M8.5 14.5h5" />
      <path d="M8.5 18h6" />
    </IconBase>
  );
}

export function ProhibitIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M6 6l12 12" />
    </IconBase>
  );
}

export function WavesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 8.5c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 2-2" />
      <path d="M3 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 2-2" />
      <path d="M3 19.5c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 2-2" />
    </IconBase>
  );
}

/* ===== UI-Helfer ===== */

export function ChevronDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 9l6 6 6-6" />
    </IconBase>
  );
}

export function SignOutIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M15 4.5h3A1.5 1.5 0 0 1 19.5 6v12A1.5 1.5 0 0 1 18 19.5h-3" />
      <path d="M10.5 7.5L14.5 12 10.5 16.5" />
      <path d="M14.5 12H4" />
    </IconBase>
  );
}
