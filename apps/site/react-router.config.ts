import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // Public pages are rendered once at build time and served as static files.
  prerender: ["/"],
} satisfies Config;
