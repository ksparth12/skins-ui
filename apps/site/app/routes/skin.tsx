import { Link, NavLink, data } from "react-router";
import type { Route } from "./+types/skin";
import { Playground } from "~/components/playground";
import { SiteHeader } from "~/components/site-header";
import { findEntry, registry, skinPath } from "~/lib/registry";

export function loader({ params }: Route.LoaderArgs) {
  const entry = findEntry(params.component);
  const skin = entry?.skins.find((s) => s.slug === params.skin);
  if (!entry || !skin) throw data(null, { status: 404 });
  return { component: entry.spec.name, skin: skin.slug };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const entry = findEntry(loaderData?.component);
  const skin = entry?.skins.find((s) => s.slug === loaderData?.skin);
  if (!entry || !skin) return [{ title: "Skins UI" }];
  return [{ title: `${skin.title} ${entry.spec.title.toLowerCase()} · Skins UI` }, { name: "description", content: skin.description }];
}

const row =
  "flex h-8 items-center rounded-lg px-2.5 text-sm text-sk-muted transition-colors duration-100 hover:bg-sk-menu-on hover:text-sk-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring aria-[current=page]:bg-sk-menu-on aria-[current=page]:text-sk-ink aria-[current=page]:font-medium";

const modesText = (modes: string[]) => (modes.length === 2 ? "Light and dark" : modes[0] === "dark" ? "Dark only" : "Light only");

export default function SkinPage({ loaderData }: Route.ComponentProps) {
  const entry = findEntry(loaderData.component)!;
  const skin = entry.skins.find((s) => s.slug === loaderData.skin)!;

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <div className="grid lg:grid-cols-[220px_240px_1fr]">
        <nav aria-label="Components" className="hidden border-r border-sk-hairline p-3 lg:block">
          <ul className="grid gap-0.5">
            {registry.map((e) => (
              <li key={e.spec.name}>
                <Link
                  to={skinPath(e.spec.name, e.skins[0]?.slug ?? "")}
                  aria-current={e.spec.name === entry.spec.name ? "page" : undefined}
                  className={`${row} justify-between`}
                >
                  {e.spec.title}
                  <span className="text-[12px] text-sk-muted tabular-nums">{e.skins.length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={`${entry.spec.title} skins`} className="hidden border-r border-sk-hairline p-3 lg:block">
          <ul className="grid gap-0.5">
            {entry.skins.map((s) => (
              <li key={s.slug}>
                <NavLink to={skinPath(entry.spec.name, s.slug)} className={row} end>
                  {s.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 px-5 py-10 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl/10 font-semibold sm:text-4xl/10">
              {skin.title} {entry.spec.title.toLowerCase()}
            </h1>
            <p className="mt-3 max-w-3xl text-base text-pretty text-neutral-500 dark:text-neutral-400">{skin.description}</p>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              {modesText(skin.modes)} · {skin.tags.join(", ")}
            </p>
            <div className="mt-10">
              <Playground key={skin.name} spec={entry.spec} skin={skin} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
