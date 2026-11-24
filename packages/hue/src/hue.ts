import { contrast, maxChroma, parseColor, toHex, toOklchString, type Oklch } from "./color.ts";
import { neutrals, surfacesOf, type Mode } from "./neutrals.ts";

/** One generated colour: its OKLCH value (fitted to P3) and an sRGB hex fallback. */
export interface Shade extends Oklch {
  hex: string;
  p3: string;
  /** True when the P3 value reaches noticeably further than the sRGB one. */
  wide: boolean;
}

export interface Ramp {
  source: Oklch;
  mono: boolean;
  /** Index of the shade that holds the chosen colour. */
  anchor: number;
  shades: Shade[];
  deep: Shade;
  neighbours: [Shade, Shade];
}

export const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const CURVE = [0.975, 0.945, 0.895, 0.825, 0.735, 0.655, 0.575, 0.495, 0.415, 0.335, 0.255];
const CHROMA = [0.1, 0.2, 0.38, 0.6, 0.82, 0.96, 1, 0.94, 0.82, 0.66, 0.5];
const DEEP = { L: 0.175, chroma: 0.42 };
const NEIGHBOUR_SPREAD = 16;

const at = <T>(list: readonly T[], i: number): T => list[Math.min(list.length - 1, Math.max(0, i))] as T;

function shade(L: number, C: number, H: number): Shade {
  const p3C = Math.min(C, maxChroma(L, H, "p3") * 0.985);
  const srgbC = Math.min(C, maxChroma(L, H, "srgb"));
  return { L, C: p3C, H, hex: toHex({ L, C: srgbC, H }), p3: toOklchString({ L, C: p3C, H }), wide: p3C - srgbC > 0.004 };
}

/** Eleven shades of one hue, the chosen colour held at its nearest shade. */
export function createRamp(input: string | Oklch): Ramp {
  const source = typeof input === "string" ? parseColor(input) : input;
  const mono = source.C < 0.02;
  const H = mono ? 0 : source.H;

  let anchor = 0;
  CURVE.forEach((l, i) => {
    if (Math.abs(l - source.L) < Math.abs(at(CURVE, anchor) - source.L)) anchor = i;
  });
  const offset = source.L - at(CURVE, anchor);
  const lightness = CURVE.map((l, i) => l + offset * Math.max(0, 1 - Math.abs(i - anchor) * 0.34));
  for (let i = 1; i < lightness.length; i++) lightness[i] = Math.min(at(lightness, i), at(lightness, i - 1) - 0.02);

  const chromaAt = (i: number) => (mono ? 0 : (source.C * at(CHROMA, i)) / at(CHROMA, anchor));
  const shades = lightness.map((L, i) => shade(L, chromaAt(i), H));
  const deep = shade(DEEP.L, mono ? 0 : (source.C * DEEP.chroma) / at(CHROMA, anchor), H);
  const mid = at(shades, 5);
  const neighbour = (turn: number) => shade(mid.L, mono ? 0 : mid.C, (H + turn + 360) % 360);

  return { source, mono, anchor, shades, deep, neighbours: [neighbour(-NEIGHBOUR_SPREAD), neighbour(NEIGHBOUR_SPREAD)] };
}

const WHITE = "#ffffff";
const INK = "#0b0b0e";

/** White when it reads at 4.5:1, otherwise near black, otherwise whichever reads better. */
function labelFor(fill: string): string {
  const onWhite = contrast(WHITE, fill);
  const onInk = contrast(INK, fill);
  if (onWhite >= 4.5) return WHITE;
  if (onInk >= 4.5) return INK;
  return onWhite >= onInk ? WHITE : INK;
}

/** Moves a shade's lightness in small steps until `ok` passes or the budget is spent. */
function nudge(from: Shade, direction: 1 | -1, ok: (s: Shade) => boolean, budget = 0.12): Shade {
  let current = from;
  for (let d = 0.005; !ok(current) && d <= budget + 1e-9; d += 0.005) {
    current = shade(Math.min(0.99, Math.max(0.05, from.L + direction * d)), from.C, from.H);
  }
  return current;
}

const shift = (from: Shade, dL: number) => shade(Math.min(0.99, Math.max(0.05, from.L + dL)), from.C, from.H);

/** Walks along the ramp from `start` until `ok` passes. */
function walk(ramp: Ramp, start: number, step: 1 | -1, ok: (s: Shade) => boolean): Shade {
  let i = start;
  while (i > 0 && i < ramp.shades.length - 1 && !ok(at(ramp.shades, i))) i += step;
  return at(ramp.shades, i);
}

export interface Check {
  pair: string;
  ratio: number;
  need: number;
  pass: boolean;
}

export interface Roles {
  mode: Mode;
  accent: Shade;
  accentHover: Shade;
  accentActive: Shade;
  accentFg: string;
  indicator: Shade;
  indicatorFg: string;
  accentSubtle: Shade;
  accentSubtleFg: Shade;
  accentBorder: Shade;
  link: Shade;
  ring: Shade;
  checks: Check[];
}

/** The roles skins use, each tested against every surface it can sit on. */
export function createRoles(ramp: Ramp, mode: Mode): Roles {
  const light = mode === "light";
  const n = neutrals[mode];
  const surfaces = surfacesOf(mode);
  const worst = (hex: string) => Math.min(...surfaces.map((s) => contrast(hex, s)));
  const step = light ? 1 : -1; // along the ramp, towards more contrast with the page
  const darker = light ? -1 : 1; // in lightness, towards more contrast with the page

  let accent = at(ramp.shades, ramp.mono ? (light ? 9 : 1) : ramp.anchor);
  accent = nudge(accent, darker, (s) => worst(s.hex) >= 1.6, 0.4);
  let accentFg = labelFor(accent.hex);
  if (contrast(accentFg, accent.hex) < 4.5) {
    accent = nudge(accent, accentFg === WHITE ? -1 : 1, (s) => contrast(accentFg, s.hex) >= 4.5);
  }
  accentFg = labelFor(accent.hex);
  const away = accentFg === WHITE ? -1 : 1;
  const accentHover = shift(accent, away * 0.045);
  const accentActive = shift(accent, away * 0.085);

  const indicator = nudge(accent, darker, (s) => worst(s.hex) >= 3, 0.5);
  const indicatorFg = labelFor(indicator.hex);

  const { source, mono } = ramp;
  const accentSubtle = light
    ? shade(0.945, mono ? 0 : Math.min(source.C * 0.2, 0.042), mono ? 0 : source.H)
    : shade(0.245, mono ? 0 : Math.min(source.C * 0.32, 0.07), mono ? 0 : source.H);
  const accentSubtleFg = walk(ramp, light ? 7 : 3, step, (s) => contrast(s.hex, accentSubtle.hex) >= 4.5);
  const link = walk(ramp, light ? 6 : 3, step, (s) => worst(s.hex) >= 4.5);
  const ring = walk(ramp, light ? 5 : 4, step, (s) => worst(s.hex) >= 3);
  const accentBorder = at(ramp.shades, light ? 3 : 7);

  const checks: Check[] = [
    { pair: "label on accent", ratio: contrast(accentFg, accent.hex), need: 4.5 },
    { pair: "label on accent hover", ratio: contrast(accentFg, accentHover.hex), need: 4.5 },
    { pair: "label on accent active", ratio: contrast(accentFg, accentActive.hex), need: 4.5 },
    { pair: "indicator on every surface", ratio: worst(indicator.hex), need: 3 },
    { pair: "label on indicator", ratio: contrast(indicatorFg, indicator.hex), need: 4.5 },
    { pair: "subtle text on subtle", ratio: contrast(accentSubtleFg.hex, accentSubtle.hex), need: 4.5 },
    { pair: "link on every surface", ratio: worst(link.hex), need: 4.5 },
    { pair: "ring on every surface", ratio: worst(ring.hex), need: 3 },
    { pair: "ink on every surface", ratio: Math.min(...surfaces.map((s) => contrast(n.ink, s))), need: 4.5 },
    { pair: "muted on every surface", ratio: Math.min(...surfaces.map((s) => contrast(n.muted, s))), need: 4.5 },
  ].map((c) => ({ ...c, pass: c.ratio >= c.need - 1e-9 }));

  return {
    mode, accent, accentHover, accentActive, accentFg, indicator, indicatorFg,
    accentSubtle, accentSubtleFg, accentBorder, link, ring, checks,
  };
}

export interface Hue {
  ramp: Ramp;
  light: Roles;
  dark: Roles;
}

export function createHue(input: string | Oklch): Hue {
  const ramp = createRamp(input);
  return { ramp, light: createRoles(ramp, "light"), dark: createRoles(ramp, "dark") };
}
