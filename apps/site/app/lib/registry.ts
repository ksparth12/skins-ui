import type { ComponentType } from "react";

export interface PropSpec {
  name: string;
  type: "enum" | "boolean" | "node" | "string";
  options?: string[];
  default?: string | boolean;
  description?: string;
}

export interface ComponentSpec {
  name: string;
  title: string;
  description: string;
  export: string;
  children?: { control: "text"; label: string; default: string };
  props: PropSpec[];
  states: string[];
}

export interface SkinMeta {
  name: string;
  component: string;
  title: string;
  description: string;
  tags: string[];
  modes: Array<"light" | "dark">;
  dependencies: string[];
  author: string;
  featured?: boolean;
  /** What the site draws behind the preview. */
  preview?: { backdrop?: "hue" };
}

export interface Skin extends SkinMeta {
  slug: string;
  file: string;
  source: string;
  Component: ComponentType<Record<string, unknown>>;
}

export interface Entry {
  spec: ComponentSpec;
  skins: Skin[];
}

const specs = import.meta.glob<ComponentSpec>("../../../../registry/*/component.json", { eager: true, import: "default" });
const metas = import.meta.glob<SkinMeta>("../../../../registry/*/*/meta.json", { eager: true, import: "default" });
const modules = import.meta.glob<Record<string, ComponentType<Record<string, unknown>>>>("../../../../registry/*/*/*.tsx", { eager: true });
const sources = import.meta.glob<string>("../../../../registry/*/*/*.tsx", { eager: true, query: "?raw", import: "default" });

const folderOf = (path: string) => path.split("/").slice(-3, -1) as [string, string];

function load(): Entry[] {
  const entries = Object.values(specs).map((spec) => ({ spec, skins: [] as Skin[] }));
  for (const [path, meta] of Object.entries(metas)) {
    const [component, slug] = folderOf(path);
    const entry = entries.find((e) => e.spec.name === component);
    if (!entry) continue;
    const file = `${meta.name}.tsx`;
    const modulePath = path.replace("meta.json", file);
    const Component = modules[modulePath]?.[entry.spec.export];
    const source = sources[modulePath];
    if (!Component || source === undefined) throw new Error(`${meta.name}: ${file} must export ${entry.spec.export}`);
    entry.skins.push({ ...meta, slug, file, source, Component });
  }
  for (const e of entries) e.skins.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || a.title.localeCompare(b.title));
  return entries.sort((a, b) => a.spec.title.localeCompare(b.spec.title));
}

export const registry = load();

export const findEntry = (component: string | undefined) => registry.find((e) => e.spec.name === component);

export const skinPath = (component: string, slug: string) => `/components/${component}/${slug}`;
