import type { SVGProps } from 'react';

interface ChevronArrowProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  direction: 'left' | 'right';
}

/**
 * ChevronArrow — pfeil-mit-langem-schaft (24×24, stroke 1.5, rounded caps).
 *
 * Custom-Shape (kein Phosphor) für Cursor-Glyph und Touch-Pagination im CardFan.
 * Direction wird über gespiegelte Pfad-Daten gerendert, nicht über CSS-Transform —
 * vermeidet Inline-Style und transformiert nicht den Stroke-Cap-Look.
 */
export function ChevronArrow({ direction, ...props }: ChevronArrowProps) {
  const tip = direction === 'right' ? 'M14 6 L20 12 L14 18' : 'M10 6 L4 12 L10 18';
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M4 12 H20" />
      <path d={tip} />
    </svg>
  );
}
