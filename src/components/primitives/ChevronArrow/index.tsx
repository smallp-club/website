interface ChevronArrowProps {
  direction: 'left' | 'right';
  className?: string;
}

/**
 * ChevronArrow — gemeinsame SVG-Pfeil-Form für Cursor + Mobile-Nav.
 * 24×24, 1.5 px stroke, rounded caps. Linke Variante via scaleX(-1).
 */
export function ChevronArrow({ direction, className }: ChevronArrowProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={direction === 'left' ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <path d="M4 12 H20" />
      <path d="M14 6 L20 12 L14 18" />
    </svg>
  );
}
