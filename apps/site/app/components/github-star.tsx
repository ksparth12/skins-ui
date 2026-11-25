import { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router";
import { GithubIcon } from "~/components/icons";
import { GITHUB_URL, fetchStars } from "~/lib/site";

const STARS_KEY = "sk-stars";
const FRESH_FOR = 10 * 60 * 1000;

/** The cut star in a 24 unit box: an outline plus ten facets, each shaded by a light from the top left. */
const CUT_STAR = (() => {
  const c = { x: 12, y: 12.75 };
  const outer = 11.4;
  const inner = outer * 0.46;
  const height = 3.6;
  const at = (r: number, deg: number) => ({ x: c.x + r * Math.cos((deg * Math.PI) / 180), y: c.y + r * Math.sin((deg * Math.PI) / 180) });
  const tips = Array.from({ length: 5 }, (_, i) => at(outer, -90 + i * 72));
  const dips = Array.from({ length: 5 }, (_, i) => at(inner, -54 + i * 72));
  const f = (n: number) => n.toFixed(3);
  const unit = (v: { x: number; y: number; z: number }) => {
    const l = Math.hypot(v.x, v.y, v.z) || 1;
    return { x: v.x / l, y: v.y / l, z: v.z / l };
  };
  const light = unit({ x: -0.55, y: -0.85, z: 1 });
  const outline = tips.map((t, i) => `${i === 0 ? "M" : "L"}${f(t.x)} ${f(t.y)}L${f(dips[i]!.x)} ${f(dips[i]!.y)}`).join("") + "Z";
  const facets = tips.flatMap((tip, i) =>
    [
      [dips[(i + 4) % 5]!, tip],
      [tip, dips[i]!],
    ].map(([a, b]) => {
      const u = { x: a!.x - c.x, y: a!.y - c.y, z: -height };
      const v = { x: b!.x - c.x, y: b!.y - c.y, z: -height };
      let n = { x: u.y * v.z - u.z * v.y, y: u.z * v.x - u.x * v.z, z: u.x * v.y - u.y * v.x };
      if (n.z < 0) n = { x: -n.x, y: -n.y, z: -n.z };
      n = unit(n);
      return { d: `M${f(c.x)} ${f(c.y)}L${f(a!.x)} ${f(a!.y)}L${f(b!.x)} ${f(b!.y)}Z`, dot: n.x * light.x + n.y * light.y + n.z * light.z };
    }),
  );
  const mean = facets.reduce((sum, facet) => sum + facet.dot, 0) / facets.length;
  return {
    outline,
    facets: facets.map(({ d, dot }) => {
      const s = (dot - mean) * 2.4;
      return { d, hi: Math.min(1, Math.max(0, s)), lo: Math.min(1, Math.max(0, -s)) };
    }),
  };
})();

/** Gold is the star's own colour, the same in every theme and Hue, like status colours. */
const GOLD = { base: "#F5B21C", hi: "#FFF3C4", lo: "#A8590A", edge: "#8C4A07" };

/** A plain outline star at rest. On hover the gold cut star wipes in from the left, the way a rating fills. */
function CutStar() {
  return (
    <span aria-hidden="true" className="relative block size-4 shrink-0">
      <svg viewBox="0 0 24 24" className="absolute inset-0 size-full overflow-visible transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none">
        <path d={CUT_STAR.outline} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
      <span className="absolute -inset-px block [clip-path:inset(-25%_100%_-25%_-25%)] drop-shadow-[0_0.6px_1px_rgb(140_74_7/0.4)] transition-[clip-path] duration-300 ease-sk-out group-hover:[clip-path:inset(-25%)] group-focus-visible:[clip-path:inset(-25%)] motion-reduce:transition-none">
        <svg viewBox="0 0 24 24" className="absolute inset-0 size-full overflow-visible">
          <path d={CUT_STAR.outline} fill={GOLD.base} />
          {CUT_STAR.facets.map((facet) => (
            <path key={`h${facet.d}`} d={facet.d} fill={GOLD.hi} fillOpacity={facet.hi} />
          ))}
          <g opacity={0.8}>
            {CUT_STAR.facets.map((facet) => (
              <path key={`l${facet.d}`} d={facet.d} fill={GOLD.lo} fillOpacity={facet.lo} />
            ))}
          </g>
          <path d={CUT_STAR.outline} fill="none" stroke={GOLD.edge} strokeOpacity={0.45} strokeWidth={0.5} strokeLinejoin="round" />
        </svg>
      </span>
    </span>
  );
}

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/**
 * The count arrives with the page (fetched when it was built or served) and is refreshed in the browser
 * at most every ten minutes. While GitHub can't give one, the count is simply left out.
 */
function useStars(): number | null {
  const fromPage = (useRouteLoaderData("root") as { stars?: number | null } | undefined)?.stars ?? null;
  const [stars, setStars] = useState(fromPage);
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STARS_KEY) ?? "null") as { n: number; at: number } | null;
      if (saved && Date.now() - saved.at < FRESH_FOR) {
        setStars(saved.n);
        return;
      }
    } catch {}
    const ctrl = new AbortController();
    fetchStars(ctrl.signal).then((n) => {
      if (n === null) return;
      setStars(n);
      sessionStorage.setItem(STARS_KEY, JSON.stringify({ n, at: Date.now() }));
    });
    return () => ctrl.abort();
  }, []);
  return stars;
}

/** The GitHub link: the mark, then a star and the live count. A quiet secondary button, never the loudest thing. */
export function GithubStar() {
  const stars = useStars();
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={stars === null ? "Star on GitHub" : `Star on GitHub, ${stars.toLocaleString("en")} stars`}
      className="group inline-flex h-8 items-center gap-2 rounded-md bg-white px-2.5 text-[13px] font-medium text-sk-ink shadow-xs inset-ring inset-ring-black/12 transition-colors duration-100 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring dark:bg-white/10 dark:shadow-none dark:inset-ring-0 dark:hover:bg-white/[0.14] dark:active:bg-white/[0.18]"
    >
      <GithubIcon className="size-4" />
      <span aria-hidden="true" className="h-3.5 w-px bg-sk-border" />
      <span className="text-sk-muted transition-colors duration-150 group-hover:text-sk-ink">
        <CutStar />
      </span>
      {stars === null ? <span className="max-sm:hidden">Star</span> : <span className="tabular-nums">{compact.format(stars)}</span>}
    </a>
  );
}
