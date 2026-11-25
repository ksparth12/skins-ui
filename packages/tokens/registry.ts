/**
 * Writes the install registry the site serves at /r: one item for the tokens, one item per skin,
 * an index of every item, and skins.css for people who copy files by hand.
 *
 * REGISTRY_URL sets the address items use to point at each other (default https://skinsui.dev/r).
 */
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_PRESET, colorTokens, createHue, neutrals } from "../hue/src/index.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));
const registry = join(root, "registry");
const out = join(root, "apps/site/public/r");
const BASE = (process.env.REGISTRY_URL ?? "https://skinsui.dev/r").replace(/\/$/, "");
const SCHEMA = "https://ui.shadcn.com/schema/registry-item.json";
const THEME = "theme";

const dirs = (path: string) => readdirSync(path).filter((n) => !n.startsWith(".") && n !== "node_modules" && statSync(join(path, n)).isDirectory());
const json = (path: string) => JSON.parse(readFileSync(path, "utf8"));

/* ---------------- Tokens ---------------- */

const hue = createHue(DEFAULT_PRESET.color);
const isShadow = (k: string) => k.startsWith("shadow-") || k === "edge-light";
const prefixed = (pairs: Array<[string, string]>) => Object.fromEntries(pairs.map(([k, v]) => [`sk-${k}`, v]));
const modeVars = (mode: "light" | "dark") => prefixed([...Object.entries(neutrals[mode]), ...colorTokens(hue, hue[mode])]);
const wideVars = (mode: "light" | "dark") => Object.fromEntries(colorTokens(hue, hue[mode], true).map(([k, v]) => [`--sk-${k}`, v]));

const colourNames = [...Object.keys(neutrals.light).filter((k) => !isShadow(k)), ...colorTokens(hue, hue.light).map(([k]) => k)];
const shadowNames = Object.keys(neutrals.light).filter((k) => k.startsWith("shadow-")).map((k) => k.slice(7));

const themeItem = {
  $schema: SCHEMA,
  name: THEME,
  type: "registry:theme",
  title: "Skins UI tokens",
  description: "The colour, shadow, font and motion tokens every skin reads.",
  cssVars: {
    theme: {
      ...Object.fromEntries(colourNames.map((n) => [`color-sk-${n}`, `var(--sk-${n})`])),
      ...Object.fromEntries(shadowNames.map((n) => [`shadow-sk-${n}`, `var(--sk-shadow-${n})`])),
      "shadow-sk-edge-light": "var(--sk-edge-light)",
      "font-sk-sans": "var(--sk-font-sans)",
      "font-sk-display": "var(--sk-font-display)",
      "font-sk-mono": "var(--sk-font-mono)",
      "ease-sk-out": "var(--sk-ease-out)",
    },
    light: {
      "sk-font-sans": "ui-sans-serif, system-ui, sans-serif",
      "sk-font-display": "var(--sk-font-sans)",
      "sk-font-mono": 'ui-monospace, "SF Mono", Menlo, monospace',
      "sk-ease-out": "cubic-bezier(0.22, 1, 0.36, 1)",
      "sk-motion-fast": "100ms",
      "sk-motion-base": "150ms",
      "sk-motion-slow": "220ms",
      "sk-motion-fast-exit": "60ms",
      "sk-motion-base-exit": "120ms",
      "sk-motion-slow-exit": "160ms",
      ...modeVars("light"),
    },
    dark: modeVars("dark"),
  },
  css: {
    "@media (color-gamut: p3)": {
      ":root": wideVars("light"),
      ".dark": wideVars("dark"),
    },
  },
};

/* ---------------- Skins ---------------- */

interface Meta {
  name: string;
  title: string;
  description: string;
  dependencies: string[];
  author: string;
}

const skins = dirs(registry).flatMap((component) => {
  const specPath = join(registry, component, "component.json");
  try {
    statSync(specPath);
  } catch {
    return [];
  }
  const spec = json(specPath) as { title: string };
  return dirs(join(registry, component)).map((slug) => {
    const meta = json(join(registry, component, slug, "meta.json")) as Meta;
    const file = `${meta.name}.tsx`;
    return {
      $schema: SCHEMA,
      name: meta.name,
      type: "registry:component",
      title: `${meta.title} ${spec.title.toLowerCase()}`,
      description: meta.description,
      author: meta.author,
      dependencies: meta.dependencies,
      registryDependencies: [`${BASE}/${THEME}.json`],
      files: [
        {
          path: `registry/${component}/${slug}/${file}`,
          type: "registry:component",
          target: `@components/skins/${file}`,
          content: readFileSync(join(registry, component, slug, file), "utf8"),
        },
      ],
    };
  });
});

/* ---------------- Write ---------------- */

const items = [themeItem, ...skins];
const text = (value: unknown) => {
  const s = JSON.stringify(value, null, 2) + "\n";
  if (/[\u2013\u2014]/.test(s)) throw new Error("The registry contains a long dash");
  return s;
};

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const item of items) writeFileSync(join(out, `${item.name}.json`), text(item));
writeFileSync(
  join(out, "registry.json"),
  text({
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "skins-ui",
    homepage: "https://skinsui.dev",
    items: items.map(({ $schema: _, files, ...rest }) => ({ ...rest, ...(files ? { files: files.map(({ content: __, ...f }) => f) } : {}) })),
  }),
);
copyFileSync(join(root, "packages/tokens/skins.css"), join(out, "skins.css"));
console.log(`Wrote ${items.length} registry items to ${out}`);
