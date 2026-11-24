import { describe, expect, it } from "vitest";
import { contrast, createHue, neutrals, presets, toCss } from "./index.ts";

const failures = (input: string) => {
  const hue = createHue(input);
  return [...hue.light.checks, ...hue.dark.checks].filter((c) => !c.pass).map((c) => `${c.pair} ${c.ratio.toFixed(2)}`);
};

describe("presets", () => {
  for (const preset of presets) {
    it(`${preset.name} passes every contrast check in light and dark`, () => {
      expect(failures(preset.color)).toEqual([]);
    });
  }

  it("keeps the chosen colour on the accent fill when it is readable", () => {
    const hue = createHue("oklch(0.575 0.243 261)");
    const anchor = hue.ramp.shades[hue.ramp.anchor];
    expect(hue.light.accent.hex).toBe(anchor?.hex);
    expect(hue.light.accentFg).toBe("#ffffff");
  });
});

describe("any colour", () => {
  const cases: string[] = [];
  for (let h = 0; h < 360; h += 15)
    for (const L of [0.3, 0.45, 0.6, 0.75, 0.9])
      for (const C of [0.05, 0.15, 0.3]) cases.push(`oklch(${L} ${C} ${h})`);

  it(`passes every contrast check across ${cases.length} colours`, () => {
    const bad = cases.flatMap((c) => failures(c).map((f) => `${c}: ${f}`));
    expect(bad).toEqual([]);
  });

  it("reads hex input", () => {
    expect(failures("#146bff")).toEqual([]);
    expect(failures("#fc0")).toEqual([]);
  });
});

describe("neutrals", () => {
  for (const mode of ["light", "dark"] as const) {
    it(`${mode}: status text reads on its soft background, and danger fills carry a white label`, () => {
      const n = neutrals[mode];
      for (const k of ["danger", "success", "warning", "info"] as const) {
        expect(contrast(n[k], n[`${k}-soft`]), k).toBeGreaterThanOrEqual(4.5);
      }
      for (const k of ["danger-solid", "danger-solid-hover", "danger-solid-active"] as const) {
        expect(contrast(n["danger-solid-fg"], n[k]), k).toBeGreaterThanOrEqual(4.5);
      }
    });
  }
});

describe("css", () => {
  it("writes prefixed tokens with a wide gamut block", () => {
    const css = toCss(createHue("#146bff"));
    expect(css).toContain("--sk-accent:");
    expect(css).toContain("--sk-floor:");
    expect(css).toContain("@media (color-gamut: p3)");
    expect(css).not.toMatch(/[\u2013\u2014]/);
  });
});
