import { SITE_NAME, SITE_URL, ogImageFile } from "~/lib/site";

interface PageMeta {
  /** The full title, as the browser tab shows it. */
  title: string;
  description: string;
  path: string;
  /** What the share image shows, for people who cannot see it. */
  imageAlt: string;
}

/** Every tag a page needs to look right in search results and when its link is shared. */
export function pageMeta({ title, description, path, imageAlt }: PageMeta) {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: `${SITE_URL}/og/${ogImageFile(path)}` },
    { property: "og:image:type", content: "image/jpeg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
