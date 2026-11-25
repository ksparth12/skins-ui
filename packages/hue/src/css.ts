import type { Hue, Roles, Shade } from "./hue.ts";
import { STOPS } from "./hue.ts";
import { neutrals, type Mode } from "./neutrals.ts";

export interface CssOptions {
  /** Token prefix, without dashes. */
  prefix?: string;
  /** Selector for light values. */
  light?: string;
  /** Selector for dark values. */
  dark?: string;
  /** Include the neutral tokens. Off when only the colour changes. */
  neutrals?: boolean;
}

/** The colour tokens of one mode as [name, value] pairs, names without the prefix. */
export function colorTokens(hue: Hue, roles: Roles, wide = false): Array<[string, string]> {
  const v = (s: Shade) => (wide ? s.p3 : s.hex);
  const { ramp } = hue;
  return [
    ...ramp.shades.map((s, i): [string, string] => [`hue-${STOPS[i]}`, v(s)]),
    ["hue-deep", v(ramp.deep)],
    ["hue-2", v(ramp.neighbours[0])],
    ["hue-3", v(ramp.neighbours[1])],
    ["accent", v(roles.accent)],
    ["accent-hover", v(roles.accentHover)],
    ["accent-active", v(roles.accentActive)],
    ["indicator", v(roles.indicator)],
    ["accent-subtle", v(roles.accentSubtle)],
    ["accent-subtle-fg", v(roles.accentSubtleFg)],
    ["accent-border", v(roles.accentBorder)],
    ["link", v(roles.link)],
    ["ring", v(roles.ring)],
    // The label colours are white or near-black, the same on every screen.
    ...(wide ? [] : ([["accent-fg", roles.accentFg], ["indicator-fg", roles.indicatorFg]] as Array<[string, string]>)),
  ];
}

const colorVars = (hue: Hue, roles: Roles, p: string, wide: boolean) => colorTokens(hue, roles, wide).map(([k, val]) => `--${p}-${k}: ${val};`);

const neutralVars = (mode: Mode, p: string) => Object.entries(neutrals[mode]).map(([k, val]) => `--${p}-${k}: ${val};`);

const block = (selector: string, lines: string[], indent = "") =>
  `${indent}${selector} {\n${lines.map((l) => `${indent}  ${l}`).join("\n")}\n${indent}}`;

/** CSS custom properties for a Hue: sRGB values for every screen, OKLCH values on wide gamut screens. */
export function toCss(hue: Hue, options: CssOptions = {}): string {
  const p = options.prefix ?? "sk";
  const light = options.light ?? ":root";
  const dark = options.dark ?? '.dark, [data-theme="dark"]';
  const withNeutrals = options.neutrals ?? true;
  return [
    block(light, [...(withNeutrals ? neutralVars("light", p) : []), ...colorVars(hue, hue.light, p, false)]),
    block(dark, [...(withNeutrals ? neutralVars("dark", p) : []), ...colorVars(hue, hue.dark, p, false)]),
    `@media (color-gamut: p3) {\n${block(light, colorVars(hue, hue.light, p, true), "  ")}\n${block(dark, colorVars(hue, hue.dark, p, true), "  ")}\n}`,
  ].join("\n\n");
}
