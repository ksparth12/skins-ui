import { useId } from "react";
import { Link } from "react-router";
import { SEAM } from "~/components/logo";
import { registry, skinPath } from "~/lib/registry";

export type ErrorKind = "404" | "500";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";
const base = `inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition-[background-color,scale] duration-100 ease-sk-out active:scale-[0.97] ${focus}`;
const primary = `${base} bg-sk-accent text-sk-accent-fg shadow-xs hover:bg-sk-accent-hover active:bg-sk-accent-active dark:shadow-none`;
const secondary = `${base} bg-sk-surface text-sk-ink inset-ring inset-ring-black/12 hover:bg-sk-hover dark:bg-white/10 dark:inset-ring-0 dark:hover:bg-white/[0.14]`;

const copy = {
  "404": { title: "This page doesn't exist", text: "The address may be wrong, or the page has moved." },
  "500": { title: "Something went wrong", text: "This page couldn't load. Try again, or start from the home page." },
} as const;

/** The first component's first skin, when there is one. */
const firstSkin = () => {
  const entry = registry.find((e) => e.skins.length > 0);
  return entry ? skinPath(entry.spec.name, entry.skins[0]!.slug) : null;
};

/** The Skins UI mark with its two halves pulled apart along the seam. */
function SplitMark({ size }: { size: number }) {
  const id = `split${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="overflow-visible">
      <clipPath id={`${id}c`}>
        <rect x="3" y="3" width="26" height="26" rx="7" />
      </clipPath>
      <g transform="translate(-1.1 -1.9) rotate(-3 16 16)">
        <path clipPath={`url(#${id}c)`} d={`M3 3H29V11${SEAM.slice(SEAM.indexOf("C"))}Z`} fill="var(--sk-accent)" />
      </g>
      <g transform="translate(1.1 1.9) rotate(3 16 16)">
        <path clipPath={`url(#${id}c)`} d={`${SEAM}V29H29Z`} fill="currentColor" />
      </g>
    </svg>
  );
}

/**
 * The site's own error page: the logo come apart, a heading, one line and the way out.
 * A missing page offers home and the components; a failure offers a retry and home.
 * While developing, a failure also shows the real error underneath.
 */
export function ErrorPage({ kind, detail }: { kind: ErrorKind; detail?: string }) {
  const { title, text } = copy[kind];
  const browse = firstSkin();
  return (
    <main className="grid min-h-[calc(100dvh-7.5rem)] place-content-center justify-items-center px-5 py-16 text-center">
      <SplitMark size={88} />
      <h1 className="mt-9 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base text-pretty text-sk-muted">{text}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
        {kind === "500" ? (
          <>
            <button type="button" onClick={() => window.location.reload()} className={primary}>
              Try again
            </button>
            <Link to="/" className={secondary}>
              Go home
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className={primary}>
              Go home
            </Link>
            {browse && (
              <Link to={browse} className={secondary}>
                Browse components
              </Link>
            )}
          </>
        )}
      </div>
      {detail && (
        <pre className="mt-10 max-h-72 w-full max-w-2xl overflow-auto rounded-xl bg-sk-well p-4 text-left font-sk-mono text-xs/5 text-sk-muted ring-1 ring-sk-hairline">
          {detail}
        </pre>
      )}
    </main>
  );
}
