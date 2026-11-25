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
