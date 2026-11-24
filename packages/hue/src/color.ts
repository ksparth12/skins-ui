/** A colour in OKLCH: lightness 0 to 1, chroma from 0, hue in degrees. */
export interface Oklch {
  L: number;
  C: number;
  H: number;
}

export type Gamut = "srgb" | "p3";

type Rgb = [number, number, number];

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function toLms({ L, C, H }: Oklch): Rgb {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  return [
    (L + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    (L - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    (L - 0.0894841775 * a - 1.291485548 * b) ** 3,
  ];
}

function toLinearRgb(color: Oklch, gamut: Gamut): Rgb {
  const [l, m, s] = toLms(color);
  return gamut === "p3"
    ? [
        3.1281105 * l - 2.2570749 * m + 0.1292977 * s,
        -1.0911282 * l + 2.4132668 * m - 0.3221382 * s,
        -0.0260136 * l - 0.5080276 * m + 1.5340323 * s,
      ]
    : [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
      ];
}

const inGamut = (rgb: Rgb) => rgb.every((v) => v >= -1e-5 && v <= 1 + 1e-5);

/** The highest chroma a lightness and hue can reach inside a gamut. */
export function maxChroma(L: number, H: number, gamut: Gamut): number {
  let lo = 0;
  let hi = 0.5;
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(toLinearRgb({ L, C: mid, H }, gamut))) lo = mid;
    else hi = mid;
  }
  return lo;
}

/** An sRGB hex value for a colour, with chroma reduced until it fits. */
export function toHex({ L, C, H }: Oklch): string {
  const fitted = { L, C: Math.min(C, maxChroma(L, H, "srgb")), H };
  return (
    "#" +
    toLinearRgb(fitted, "srgb")
      .map((v) => Math.round(Math.min(1, Math.max(0, toGamma(Math.max(0, v)))) * 255))
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

function hexToOklch(hex: string): Oklch {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((x) => x + x).join("");
  const [r, g, b] = [0, 2, 4].map((i) => toLinear(parseInt(h.slice(i, i + 2), 16) / 255)) as Rgb;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(A, B), H: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}

/** Reads `#rgb`, `#rrggbb` or `oklch(L C H)` (L as 0 to 1 or a percentage). */
export function parseColor(input: string): Oklch {
  const value = input.trim();
  const oklch = value.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)/i);
  if (oklch) {
    const [, l = "0", pct, c = "0", h = "0"] = oklch;
    return { L: pct ? parseFloat(l) / 100 : parseFloat(l), C: parseFloat(c), H: parseFloat(h) };
  }
  if (/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) return hexToOklch(value);
  throw new Error(`Unreadable colour: ${input}`);
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => toLinear(parseInt(h.slice(i, i + 2), 16) / 255)) as Rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colours. */
export function contrast(a: string, b: string): number {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y) as [number, number];
  return (high + 0.05) / (low + 0.05);
}

const round = (n: number, digits = 3) => Number(n.toFixed(digits));

/** A CSS `oklch()` value, with an optional alpha. */
export function toOklchString({ L, C, H }: Oklch, alpha?: number): string {
  return `oklch(${round(L)} ${round(C)} ${round(H, 1)}${alpha === undefined ? "" : ` / ${alpha}`})`;
}
