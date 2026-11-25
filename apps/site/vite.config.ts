import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// Pre-bundle every Base UI part and Motion for the browser and the Worker, so a skin that uses a new part
// never makes the dev server re-bundle mid-request.
const prebundle = [
  "motion/react",
  "sugar-high",
  "@phosphor-icons/react/ssr",
  ...["button", "dialog", "field", "input", "popover", "switch", "tabs", "toggle", "toggle-group", "tooltip"].map((name) => `@base-ui/react/${name}`),
];

export default defineConfig({
  plugins: [cloudflare({ viteEnvironment: { name: "ssr" } }), tailwindcss(), reactRouter()],
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
