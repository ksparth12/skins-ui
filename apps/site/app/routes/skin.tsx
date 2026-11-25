import { Link, data } from "react-router";
import type { Route } from "./+types/skin";
import { Playground } from "~/components/playground";
import { AppShell } from "~/components/app-shell";
import { ChevronIcon } from "~/components/icons";
import { findEntry } from "~/lib/registry";

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

const crumb = "rounded-sm transition-colors duration-100 hover:text-sk-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

export default function SkinPage({ loaderData }: Route.ComponentProps) {
  const entry = findEntry(loaderData.component)!;
  const skin = entry.skins.find((s) => s.slug === loaderData.skin)!;

  return (
    <AppShell component={entry.spec.name} skin={skin.slug}>
      <main className="mx-auto max-w-4xl px-5 pt-8 pb-16 lg:px-8 lg:pt-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-[13px] text-sk-muted">
            <li>
              <Link to="/components" className={crumb}>Components</Link>
            </li>
            <li aria-hidden="true"><ChevronIcon className="size-3" /></li>
            <li>
              <Link to={`/components/${entry.spec.name}`} className={crumb}>{entry.spec.title}</Link>
            </li>
            <li aria-hidden="true"><ChevronIcon className="size-3" /></li>
            <li aria-current="page" className="text-sk-ink">{skin.title}</li>
          </ol>
        </nav>
        <h1 className="mt-3 text-3xl/10 font-semibold sm:text-4xl/11">
          {skin.title} {entry.spec.title.toLowerCase()}
        </h1>
        <p className="mt-2 text-base text-pretty text-sk-muted">{skin.description}</p>
        <div className="mt-10">
          <Playground key={skin.name} spec={entry.spec} skin={skin} />
        </div>
      </main>
    </AppShell>
  );
}
