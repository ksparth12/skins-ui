import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

// Pre-bundle every Base UI part and Motion for the browser and the Worker, so a skin that uses a new part
// never makes the dev server re-bundle mid-request.
const prebundle = [
  "motion/react",
  "sugar-high",
  "@phosphor-icons/react/ssr",
  ...["button", "dialog", "field", "input", "popover", "progress", "slider", "switch", "tabs", "toast", "toggle", "toggle-group", "tooltip"].map((name) => `@base-ui/react/${name}`),
];

/**
 * The registry lives outside this app, where Vite does not look by default. Watching it means a new
 * skin folder shows up, and a skin's new classes reach the stylesheet, without restarting the server.
 */
const registry = fileURLToPath(new URL("../../registry", import.meta.url));
function watchRegistry(): Plugin {
  return {
    name: "skins:watch-registry",
    configureServer(server) {
      server.watcher.add(registry);
    },
  };
}

export default defineConfig({
  plugins: [watchRegistry(), cloudflare({ viteEnvironment: { name: "ssr" } }), tailwindcss(), reactRouter()],
  server: {
    host: "127.0.0.1",
    port: 7000,
    strictPort: true,
  },
  resolve: {
    tsconfigPaths: true,
    dedupe: ["react", "react-dom", "@base-ui/react", "motion"],
  },
  optimizeDeps: {
    include: prebundle,
  },
  environments: {
    ssr: {
      optimizeDeps: { include: prebundle },
    },
  },
});
