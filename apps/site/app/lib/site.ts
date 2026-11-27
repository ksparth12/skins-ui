/** Where the source lives. */
export const GITHUB_REPO = "ksparth12/skins-ui";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;
const API_URL = `https://api.github.com/repos/${GITHUB_REPO}`;

/** The repository's star count, or null when GitHub can't say (repo not public yet, offline, rate limited). */
export async function fetchStars(signal?: AbortSignal): Promise<number | null> {
  try {
    // GitHub refuses server requests without a User-Agent; browsers send their own.
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    if (typeof window === "undefined") headers["User-Agent"] = "skins-ui-site";
    const res = await fetch(API_URL, { headers, signal });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: unknown };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

/** Where the site is served. */
export const SITE_DOMAIN = "skinsui.dev";
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const SITE_NAME = "Skins UI";

/** The default Hue in sRGB, for places that take one fixed colour: the browser bar and link previews. */
export const BRAND_COLOUR = "#146bff";

/** The share image file for a page path: `/` is home.jpg, `/components/card/glass` is components-card-glass.jpg. */
export const ogImageFile = (path: string) => `${path === "/" ? "home" : path.slice(1).replaceAll("/", "-")}.jpg`;
