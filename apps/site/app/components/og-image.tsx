/**
 * The image a page shows when its link is shared, at 1200 x 630.
 * Skin pages put the skin itself on a dark stage that fills the frame, with its name underneath.
 * The home and docs pages set their words on a field of the Hue that falls into its deepest shade.
 * Skins are drawn live with their starting values, the same way the preview stage draws them.
 */
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Folds } from "~/components/folds";
import { Mark } from "~/components/logo";
import { DemoTrigger, pairedButton, startOf } from "~/components/playground";
import { demos } from "~/demos";
import { docs } from "~/lib/docs";
import { findEntry, registry, skinPath, type Entry, type Skin } from "~/lib/registry";
import { SITE_DOMAIN } from "~/lib/site";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const HOME_TITLE = "Swap the skin, keep the code.";

type OgPage = { kind: "home" } | { kind: "doc"; title: string; description: string } | { kind: "skin"; entry: Entry; skin: Skin };

/** What the image at a page path shows, or null when the page has none. */
export function ogPageFor(path: string): OgPage | null {
  if (path === "/") return { kind: "home" };
  const doc = docs.find((d) => d.path === path);
  if (doc) return { kind: "doc", title: doc.title, description: doc.description };
  for (const entry of registry) {
    const skin = entry.skins.find((s) => skinPath(entry.spec.name, s.slug) === path);
    if (skin) return { kind: "skin", entry, skin };
  }
  return null;
}

const display = { fontFamily: "var(--sk-font-display)", fontWeight: 600 } as const;

/** The logo. On a field of the Hue its accent half takes the deep shade, so it never melts into the field. */
function Brand({ size, onHue = false }: { size: number; onHue?: boolean }) {
  const style = onHue ? ({ "--sk-accent": "var(--sk-hue-deep)" } as CSSProperties) : undefined;
  return (
    <div className="flex items-center" style={{ gap: size * 0.3, ...style }}>
      <Mark size={size} />
      <span className="tracking-tight" style={{ ...display, fontSize: size * 0.8 }}>
        Skins UI
      </span>
    </div>
  );
}

/**
 * Scales its content to fit the box, centred. It grows to `max`, and further for small things like
 * loaders, until they take about a third of its width or half its height.
 */
function Fit({ width, height, pad, max, wide, children }: { width: number; height: number; pad: number; max: number; wide?: number; children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w && h) setK(Math.min((width - pad * 2) / w, (height - pad * 2) / h, Math.max(max, Math.min((0.32 * width) / w, (0.45 * height) / h))));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height, pad, max]);
  return (
    <div className="absolute top-1/2 left-1/2" style={{ transform: `translate(-50%, -50%) scale(${k})` }}>
      <div ref={inner} style={{ width: wide ?? "max-content" }}>
        {children}
      </div>
    </div>
  );
}

/** The skin with its starting values. */
function SkinContent({ entry, skin }: { entry: Entry; skin: Skin }) {
  const spec = entry.spec;
  const values = startOf(spec);
  const demo = demos[spec.name];
  const button = demo ? pairedButton(spec, skin) : undefined;
  const control = spec.children?.control ?? "none";
  const label = spec.children?.default ?? "";
  const { Component } = skin;
  if (demo && button) return <>{demo.render({ parts: skin.parts, values, skin: skin.slug, Button: button.Component })}</>;
  return <Component {...values}>{control === "none" ? undefined : control === "trigger" ? <DemoTrigger>{label}</DemoTrigger> : label}</Component>;
}

/**
 * A skin on its own stage. Backgrounds are laid out smaller and scaled up to fill the stage. Everything
 * else is fitted, wide things (bars, cards, toasts) at a set layout width.
 */
function Stage({ entry, skin, width, height }: { entry: Entry; skin: Skin; width: number; height: number }) {
  const fill = entry.spec.name === "background";
  const folds = skin.preview?.backdrop === "folds";
  const modeClass = skin.modes.length === 1 ? skin.modes[0] : "";
  const wide = entry.spec.preview?.layout === "fill" ? 720 : demos[entry.spec.name] || startOf(entry.spec).fullWidth ? 380 : undefined;
  const base = Math.max(400, width / 1.6);
  const k = width / base;
  return (
    <div data-og-stage className={`relative shrink-0 overflow-hidden rounded-[24px] ${modeClass} ${folds ? "" : "bg-site-stage"}`} style={{ width, height }}>
      {folds && <Folds />}
      {fill ? (
        <div className="absolute top-0 left-0 origin-top-left" style={{ width: base, height: height / k, transform: `scale(${k})` }}>
          <SkinContent entry={entry} skin={skin} />
        </div>
      ) : (
        <Fit width={width} height={height} pad={36} max={2.6} wide={wide}>
          <SkinContent entry={entry} skin={skin} />
        </Fit>
      )}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/[0.07] ring-inset" />
    </div>
  );
}

const HOME_BUTTONS = ["flat", "chrome", "brutal", "clay", "pixel"];

function HomeButtons() {
  const all = findEntry("button")?.skins ?? [];
  const buttons = HOME_BUTTONS.map((s) => all.find((b) => b.slug === s)).filter((b): b is Skin => Boolean(b));
  return (
    <div className="flex origin-top-left items-center" style={{ gap: 18, transform: "scale(1.55)" }}>
      {buttons.map((b) => (
        <b.Component key={b.slug} variant="primary" size="md">
          {b.title}
        </b.Component>
      ))}
    </div>
  );
}

/** One hue in OKLCH, from its middle shade down to the near-black of itself, lit softly from above. */
const DEEP_FIELD =
  "radial-gradient(110% 70% at 30% -10%, color-mix(in oklch, var(--sk-hue-400) 45%, transparent), transparent 65%), linear-gradient(170deg, var(--sk-hue-600) 0%, var(--sk-hue-800) 32%, var(--sk-hue-950) 66%, var(--sk-hue-deep) 100%)";

export function OgImage({ page }: { page: OgPage }) {
  const size = { width: OG_WIDTH, height: OG_HEIGHT };

  if (page.kind === "skin") {
    const stageHeight = OG_HEIGHT - 40 - 112;
    return (
      <div className="dark relative flex flex-col overflow-hidden bg-site-floor text-sk-ink" style={{ ...size, padding: 40, paddingBottom: 0 }}>
        <Stage entry={page.entry} skin={page.skin} width={OG_WIDTH - 80} height={stageHeight} />
        <div className="flex flex-1 items-center justify-between" style={{ paddingInline: 8 }}>
          <Brand size={38} />
          <span className="tracking-tight" style={{ ...display, fontSize: 38 }}>
            {page.skin.title} {page.entry.spec.title.toLowerCase()}
          </span>
        </div>
      </div>
    );
  }

  const home = page.kind === "home";
  return (
    <div className="dark relative flex flex-col overflow-hidden text-white" style={{ ...size, padding: 72 }}>
      <div className="absolute inset-0" style={{ background: DEEP_FIELD }} />
      <div className="relative flex items-center justify-between">
        <Brand size={46} onHue />
        <span className="text-white/70" style={{ fontSize: 26 }}>
          {SITE_DOMAIN}
        </span>
      </div>
      <h1 className="relative mt-auto tracking-tight text-balance" style={{ ...display, fontSize: home ? 84 : 112, lineHeight: home ? 1.04 : 1, maxWidth: 960 }}>
        {home ? HOME_TITLE : page.title}
      </h1>
      {home ? (
        <div className="relative mt-14" style={{ height: 76 }}>
          <HomeButtons />
        </div>
      ) : (
        <p className="relative mt-6 text-pretty text-white/70" style={{ fontSize: 34, lineHeight: 1.3, maxWidth: 900 }}>
          {page.description}
        </p>
      )}
    </div>
  );
}
