/** The sitemap: every public page, built from the same lists the site is made from. */
import { docs } from "~/lib/docs";
import { registry, skinPath } from "~/lib/registry";
import { SITE_URL } from "~/lib/site";

export function loader() {
  const paths = ["/", ...docs.map((d) => d.path), ...registry.flatMap((e) => e.skins.map((s) => skinPath(e.spec.name, s.slug)))];
  const urls = paths.map((p) => `  <url><loc>${SITE_URL}${p === "/" ? "" : p}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
