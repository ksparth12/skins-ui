import type { Config } from "@react-router/dev/config";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const registry = new URL("../../registry/", import.meta.url).pathname;
const dirs = (path: string) => readdirSync(path).filter((name) => !name.startsWith(".") && name !== "node_modules" && statSync(join(path, name)).isDirectory());

/** Every skin page, found from the registry folders. */
const skinPages = () => dirs(registry).flatMap((component) => dirs(join(registry, component)).map((skin) => `/components/${component}/${skin}`));

export default {
  ssr: true,
  // Public pages are rendered once at build time and served as static files.
  prerender: () => ["/", "/docs", "/docs/installation", "/docs/theming", "/docs/tokens", ...skinPages()],
} satisfies Config;
