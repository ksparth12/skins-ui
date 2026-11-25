import { Link } from "react-router";
import { AppShell } from "~/components/app-shell";
import { registry, skinPath } from "~/lib/registry";

export function meta() {
  return [
    { title: "Skins UI" },
    { name: "description", content: "Every skin of a component shares the same props, so changing its look is a one-line edit." },
  ];
}

const primary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sk-accent px-3.5 text-sm font-semibold text-sk-accent-fg shadow-xs transition-[background-color,scale] duration-100 ease-sk-out hover:bg-sk-accent-hover active:scale-[0.97] active:bg-sk-accent-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring dark:shadow-none";

const secondary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sk-surface px-3.5 text-sm font-semibold text-sk-ink shadow-xs inset-ring inset-ring-black/12 transition-[background-color,scale] duration-100 ease-sk-out hover:bg-sk-hover active:scale-[0.97] active:bg-sk-press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring dark:bg-white/10 dark:shadow-none dark:inset-ring-0 dark:hover:bg-white/15 dark:active:bg-white/20";

export default function Home() {
  const first = registry.find((e) => e.skins.length > 0);
  return (
    <AppShell>
      <main className="mx-auto grid min-h-[calc(100dvh-7.5rem)] max-w-4xl place-content-center justify-items-center px-5 py-16 text-center lg:px-8">
        <h1 className="text-4xl/tight font-semibold tracking-tight text-balance sm:text-5xl/tight">Swap the skin, keep the code.</h1>
        <p className="mt-3 text-base text-pretty text-sk-muted sm:text-lg">Every skin of a component shares the same props, so changing its look is a one-line edit.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {/* Shown once there is a component to open. */}
          {first && (
            <Link to={skinPath(first.spec.name, first.skins[0]!.slug)} className={primary}>
              Browse components
            </Link>
          )}
          <Link to="/docs/installation" className={first ? secondary : primary}>
            Get started
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
