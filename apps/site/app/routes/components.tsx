import { data, redirect } from "react-router";
import type { Route } from "./+types/components";
import { findEntry, registry, skinPath } from "~/lib/registry";

/** /components and /components/:component open the first skin. */
export function loader({ params }: Route.LoaderArgs) {
  const entry = params.component ? findEntry(params.component) : registry[0];
  const first = entry?.skins[0];
  if (!entry || !first) throw data(null, { status: 404 });
  return redirect(skinPath(entry.spec.name, first.slug));
}
