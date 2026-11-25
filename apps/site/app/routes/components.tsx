import { data, redirect } from "react-router";
import type { Route } from "./+types/components";
import { findEntry, registry, skinPath } from "~/lib/registry";

/** /components and /components/:component open the first skin. */
export function loader({ params }: Route.LoaderArgs) {
  // Until the first component ships, the components link leads home.
  if (!params.component && !registry.some((e) => e.skins.length > 0)) return redirect("/");
  const entry = params.component ? findEntry(params.component) : registry.find((e) => e.skins.length > 0);
  const first = entry?.skins[0];
  if (!entry || !first) throw data(null, { status: 404 });
  return redirect(skinPath(entry.spec.name, first.slug));
}
