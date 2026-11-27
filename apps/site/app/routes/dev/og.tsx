/**
 * Draws one page's share image and nothing else, for `pnpm og` to photograph.
 * Served by the dev server only: /dev/og?page=/components/card/glass
 *
 * Modals and toasts open in a layer over the whole window, so here their trigger is pressed and the
 * layer is moved onto the stage: a backdrop the size of the stage, the dialog or toast centred on it.
 */
import { useEffect } from "react";
import { data, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { OG_HEIGHT, OG_WIDTH, OgImage, ogPageFor } from "~/components/og-image";

export function loader({ request }: LoaderFunctionArgs) {
  const path = new URL(request.url).searchParams.get("page") ?? "/";
  if (!ogPageFor(path)) throw data(null, { status: 404 });
  return { path };
}

export const meta = () => [{ title: "Share image" }, { name: "robots", content: "noindex" }];

export default function OgRender() {
  const { path } = useLoaderData<typeof loader>();
  const page = ogPageFor(path)!;
  const overlay = page.kind === "skin" && (page.entry.spec.name === "modal" || page.entry.spec.name === "toast");

  useEffect(() => {
    if (!overlay) return;
    const stage = document.querySelector<HTMLElement>("[data-og-stage]");
    const trigger = stage?.querySelector<HTMLElement>("button");
    if (!stage || !trigger) return;
    trigger.click();
    const timer = setTimeout(() => {
      trigger.style.visibility = "hidden";
      const r = stage.getBoundingClientRect();
      const layers = [...document.querySelectorAll<HTMLElement>("body *")].filter((el) => !stage.contains(el) && getComputedStyle(el).position === "fixed");
      for (const el of layers) {
        const box = el.getBoundingClientRect();
        if (box.width >= window.innerWidth && box.height >= window.innerHeight) {
          Object.assign(el.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, right: "auto", bottom: "auto", borderRadius: "24px" });
        } else {
          Object.assign(el.style, { left: `${r.left + r.width / 2}px`, top: `${r.top + r.height / 2}px`, right: "auto", bottom: "auto", margin: "0", translate: "none", scale: "none", transform: "translate(-50%, -50%) scale(1.5)", transition: "none" });
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [overlay]);

  return (
    <div id="og" style={{ width: OG_WIDTH, height: OG_HEIGHT }}>
      <OgImage page={page} />
    </div>
  );
}
