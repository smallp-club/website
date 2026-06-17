import type { SVGProps } from 'react';

/**
 * ArrowRight — Phosphor Thin (256×256 viewBox, stroke 8).
 *
 * Nachgebaut nach phosphoricons.com (MIT). Kein React-Package-Install nötig,
 * läuft auf Server-Components. Skaliert via CSS width/height oder mit `font-size`
 * über `1em` Sizing.
 *
 * Brand-Default-Weight für small p club: Thin (geometric, editorial-fein,
 * matcht Chillax Light/Extralight).
 *
 * Wenn weitere Phosphor-Icons dazukommen, wandert dieser File in eine
 * gemeinsame `<Icon>`-Library unter `src/components/icons/`.
 */
export function ArrowRightThin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <line x1="40" y1="128" x2="216" y2="128" />
      <polyline points="144,56 216,128 144,200" />
    </svg>
  );
}
