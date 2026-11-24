export interface Preset {
  id: string;
  name: string;
  color: string;
}

export const presets: readonly Preset[] = [
  { id: "blue", name: "Skins Blue", color: "oklch(0.575 0.243 261)" },
  { id: "indigo", name: "Indigo", color: "oklch(0.53 0.23 277)" },
  { id: "violet", name: "Violet", color: "oklch(0.55 0.25 296)" },
  { id: "teal", name: "Teal", color: "oklch(0.56 0.105 192)" },
  { id: "emerald", name: "Emerald", color: "oklch(0.57 0.15 158)" },
  { id: "amber", name: "Amber", color: "oklch(0.79 0.165 76)" },
  { id: "ember", name: "Ember", color: "oklch(0.61 0.205 40)" },
  { id: "rose", name: "Rose", color: "oklch(0.585 0.225 12)" },
  { id: "mono", name: "Mono", color: "oklch(0.2 0 0)" },
];

export const DEFAULT_PRESET = presets[0] as Preset;
