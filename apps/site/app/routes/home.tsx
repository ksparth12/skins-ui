import { Link } from "react-router";
import { AppShell } from "~/components/app-shell";
import { registry, skinPath } from "~/lib/registry";

export function meta() {
  return [
    { title: "Skins UI" },
    { name: "description", content: "Every component in many complete looks. Pick a colour and every skin follows." },
  ];
}

const primary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sk-accent px-3.5 text-sm font-semibold text-sk-accent-fg shadow-xs transition-[background-color,scale] duration-100 ease-sk-out hover:bg-sk-accent-hover active:scale-[0.97] active:bg-sk-accent-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring dark:shadow-none";

export default function Home() {
  const first = registry.find((e) => e.skins.length > 0);
  return (
    <AppShell>
      <main className="mx-auto grid min-h-[calc(100dvh-7.5rem)] max-w-4xl place-content-center justify-items-center px-5 py-16 text-center lg:px-8">
        <h1 className="text-4xl/tight font-semibold tracking-tight text-balance sm:text-5xl/tight">Every component. Every skin.</h1>
        <p className="mt-3 text-base text-pretty text-sk-muted sm:text-lg">Every component in many complete looks. Pick a colour and every skin follows.</p>
        {/* Shown once there is a component to open. */}
        {first && (
          <Link to={skinPath(first.spec.name, first.skins[0]!.slug)} className={`mt-8 ${primary}`}>
            Browse components
          </Link>
        )}
      </main>
    </AppShell>
  );
}
