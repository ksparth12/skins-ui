import { useId } from "react";

/** The seam between the two halves: one smooth S from the right edge to the left. */
export const SEAM = "M29 11C18 11 14 21 3 21";

/**
 * The Skins UI mark: one tile in two materials, joined along a curve.
 * The upper half takes the Hue accent and the lower half the ink, so it follows the colour you pick.
 */
export function Mark({ size = 20, className }: { size?: number; className?: string }) {
  const id = `seam${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="3 3 26 26" aria-hidden="true" className={className}>
      <clipPath id={`${id}c`}>
        <rect x="3" y="3" width="26" height="26" rx="7" />
      </clipPath>
      <mask id={`${id}m`} maskUnits="userSpaceOnUse" x="3" y="3" width="26" height="26">
        <rect x="3" y="3" width="26" height="26" fill="#fff" />
        <path d={SEAM} fill="none" stroke="#000" strokeWidth="2.25" />
      </mask>
      <g clipPath={`url(#${id}c)`} mask={`url(#${id}m)`}>
        <path d="M3 3H29V11C18 11 14 21 3 21Z" fill="var(--sk-accent)" />
        <path d="M29 11C18 11 14 21 3 21V29H29Z" fill="currentColor" />
      </g>
    </svg>
  );
}
