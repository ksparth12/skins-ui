import { Tabs } from "@base-ui/react/tabs";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { Tooltip } from "@base-ui/react/tooltip";
import { useEffect, useMemo, useRef, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import { CodeBlock, CommandBlock, addCommand, runCommand } from "~/components/code-block";
import { ChoiceControl, Customize, SwitchControl, TextControl } from "~/components/customize";
import { DesktopIcon, ExpandIcon, MoonIcon, PhoneIcon, ReplayIcon, SunIcon, TabletIcon } from "~/components/icons";
import { PropsTable } from "~/components/props-table";
import type { ComponentSpec, PropSpec, Skin } from "~/lib/registry";

type Values = Record<string, unknown>;
type IconPlace = "none" | "before" | "after" | "only";
type StageMode = "light" | "dark";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";
const REGISTRY_URL = "https://skinsui.dev/r";
const MIN_WIDTH = 320;

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M8 3.25v9.5M3.25 8h9.5" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.25 8h9.5M9 4.25 12.75 8 9 11.75" />
    </svg>
  );
}

/** Gallery entries name icons by placeholder, since JSON cannot hold elements. */
const withIcons = (props: Values): Values =>
  Object.fromEntries(Object.entries(props).map(([k, v]) => [k, v === "__plus__" ? <PlusIcon /> : v === "__arrow__" ? <ArrowIcon /> : v]));

const titleCase = (s: string) => {
  const words = s.replace(/([A-Z])/g, " $1").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/** The values the playground starts with: the demo value when there is one, otherwise the default. */
const startOf = (spec: ComponentSpec): Values =>
  Object.fromEntries(spec.props.filter((p) => (p.demo ?? p.default) !== undefined).map((p) => [p.name, p.demo ?? p.default]));

/** The component's own defaults, which usage code leaves out. */
const realDefaultsOf = (spec: ComponentSpec): Values =>
  Object.fromEntries(spec.props.filter((p) => p.default !== undefined).map((p) => [p.name, p.default]));

/** A neutral element the playground hands to components that wrap a trigger. */
function DemoTrigger({ children, ...props }: ComponentPropsWithRef<"button">) {
  return (
    <button
      {...props}
      type="button"
      className="inline-flex h-9 items-center rounded-lg bg-sk-surface px-3 text-sm font-medium text-sk-ink shadow-sk-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring"
    >
      {children}
    </button>
  );
}

function jsxValue(p: PropSpec, v: unknown): string | null {
  if (p.type === "boolean") return v === true ? p.name : `${p.name}={false}`;
  if (p.type === "enum" || p.type === "string") return `${p.name}="${String(v)}"`;
  return null;
}

function usage(spec: ComponentSpec, values: Values, text: string, icon: IconPlace): string {
  const defaults = realDefaultsOf(spec);
  const attrs: string[] = [];
  for (const p of spec.props) {
    const v = values[p.name];
    if (v === undefined || v === defaults[p.name] || p.type === "node" || p.type === "data") continue;
    const a = jsxValue(p, v);
    if (a) attrs.push(a);
  }
  if (icon === "before" || icon === "only") attrs.push("icon={<PlusIcon />}");
  if (icon === "after") attrs.push("iconRight={<ArrowIcon />}");
  if (icon === "only") attrs.push(`aria-label="${text || "Add"}"`);
  const tag = spec.export;
  const control = spec.children?.control ?? "none";
  const open = attrs.length > 2 ? `<${tag}\n  ${attrs.join("\n  ")}\n` : `<${tag}${attrs.length ? " " + attrs.join(" ") : ""}`;
  if (control === "none" || icon === "only" || !text) return `${open}${attrs.length > 2 ? "" : " "}/>`;
  const child = control === "trigger" ? `<button>${text}</button>` : text;
  return `${open}>${child}</${tag}>`;
}

/** An icon button with a tooltip, for the stage toolbar. */
function ToolButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        render={<button type="button" aria-label={label} onClick={onClick} />}
        className={`grid size-8 place-items-center rounded-md text-sk-muted transition-colors duration-100 hover:bg-sk-hover hover:text-sk-ink active:bg-sk-press ${focus}`}
      >
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={8} className="z-50">
          <Tooltip.Popup className="rounded-md bg-sk-ink px-2 py-1 text-xs font-semibold text-sk-floor transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            {label}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

/** A small group of icon toggles, one of which is chosen. */
function IconChoice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<{ value: T; label: string; icon: ReactNode; disabled?: boolean }>; onChange: (v: T) => void }) {
  return (
    <ToggleGroup aria-label={label} value={[value]} onValueChange={(next) => next[0] && onChange(next[0] as T)} className="flex items-center gap-0.5 rounded-lg bg-sk-well p-0.5 inset-ring inset-ring-sk-hairline">
      {options.map((o) => (
        <Tooltip.Root key={o.value}>
          <Tooltip.Trigger
            render={<Toggle value={o.value} aria-label={o.label} disabled={o.disabled} />}
            className={`grid size-7 place-items-center rounded-md text-sk-muted transition-[background-color,color,box-shadow] duration-150 hover:text-sk-ink data-pressed:bg-sk-surface data-pressed:text-sk-ink data-pressed:shadow-sk-card disabled:opacity-35 dark:data-pressed:bg-sk-raised ${focus}`}
          >
            {o.icon}
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner sideOffset={8} className="z-50">
              <Tooltip.Popup className="rounded-md bg-sk-ink px-2 py-1 text-xs font-semibold text-sk-floor transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
                {o.label}
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      ))}
    </ToggleGroup>
  );
}

const WIDTHS = { full: null, tablet: 768, phone: 390 } as const;
type WidthPreset = keyof typeof WIDTHS;

/** The stage frame: its width follows a preset, or a drag on its edge, or the arrow keys. */
function ResizableFrame({ width, onWidth, children }: { width: number | null; onWidth: (w: number | null) => void; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [max, setMax] = useState(1200);
  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setMax(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const current = Math.min(width ?? max, max);
  const set = (w: number) => onWidth(w >= max - 2 ? null : Math.max(MIN_WIDTH, Math.round(w)));

  return (
    <div ref={outer} className="relative flex justify-center">
      <div className="relative w-full transition-[max-width] duration-200 ease-sk-out" style={{ maxWidth: width ?? undefined, transitionDuration: dragging ? "0ms" : undefined }}>
        {children}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Preview width"
          aria-valuemin={MIN_WIDTH}
          aria-valuemax={max}
          aria-valuenow={Math.round(current)}
          tabIndex={0}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 50 : 10;
            if (e.key === "ArrowLeft") set(current - step);
            else if (e.key === "ArrowRight") set(current + step);
            else return;
            e.preventDefault();
          }}
          onPointerDown={(e) => {
            const start = e.clientX;
            const from = current;
            setDragging(true);
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            const move = (ev: PointerEvent) => set(from + (ev.clientX - start) * 2);
            const up = () => {
              setDragging(false);
              window.removeEventListener("pointermove", move);
              window.removeEventListener("pointerup", up);
            };
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up);
          }}
          className={`group absolute top-1/2 -right-3 hidden h-16 w-3 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center rounded-full sm:flex ${focus}`}
        >
          <span className={`h-10 w-1 rounded-full transition-colors duration-100 ${dragging ? "bg-sk-ink" : "bg-sk-border-strong group-hover:bg-sk-muted"}`} />
        </div>
        {dragging && (
          <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded-md bg-sk-ink px-2 py-1 font-sk-mono text-xs text-sk-floor tabular-nums">
            {Math.round(current)}px
          </div>
        )}
      </div>
    </div>
  );
}

export function Playground({ spec, skin }: { spec: ComponentSpec; skin: Skin }) {
  const defaults = useMemo(() => startOf(spec), [spec]);
  const [values, setValues] = useState<Values>(defaults);
  const [text, setText] = useState(spec.children?.default ?? "");
  const [icon, setIcon] = useState<IconPlace>("none");
  const [replay, setReplay] = useState(0);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [preset, setPreset] = useState<WidthPreset>("full");
  const [width, setWidth] = useState<number | null>(null);
  const forced = skin.modes.length === 1 ? skin.modes[0] : undefined;
  const [mode, setMode] = useState<StageMode | null>(forced ?? null);
  const stage = useRef<HTMLDivElement>(null);

  // Follow the site theme until a stage mode is chosen.
  useEffect(() => {
    if (forced || mode) return;
    const read = () => setMode(document.documentElement.classList.contains("dark") ? "dark" : "light");
    read();
  }, [forced, mode]);

  const set = (name: string, v: unknown) => setValues((prev) => ({ ...prev, [name]: v }));
  const { Component } = skin;
  const backdrop = skin.preview?.backdrop === "hue" ? "stage-hue" : undefined;
  const hasIcons = spec.props.some((p) => p.name === "icon") && spec.props.some((p) => p.name === "iconRight");
  const fill = spec.preview?.layout === "fill";
  const control = spec.children?.control ?? "none";
  const stageMode = forced ?? mode ?? "light";
  const modeClass = stageMode === "dark" ? "dark" : "light-only";
  const changed = JSON.stringify(values) !== JSON.stringify(defaults) || text !== (spec.children?.default ?? "") || icon !== "none";

  const renderChildren = (label: string) => {
    if (control === "none") return undefined;
    if (control === "trigger") return <DemoTrigger>{label}</DemoTrigger>;
    return label;
  };

  const live: Values = {
    ...values,
    ...(hasIcons
      ? {
          icon: icon === "before" || icon === "only" ? <PlusIcon /> : undefined,
          iconRight: icon === "after" ? <ArrowIcon /> : undefined,
          "aria-label": icon === "only" ? text || "Add" : undefined,
        }
      : {}),
  };
  const code = useMemo(() => usage(spec, values, text, icon), [spec, values, text, icon]);
  const usageFile = `import { ${spec.export} } from "@/components/skins/${skin.name}";\n\n${code}\n`;

  const controls = spec.props.filter((p) => !p.hidden);
  const gallery = spec.gallery;
  const optionsOf = (name?: string) => (name ? (spec.props.find((p) => p.name === name)?.options ?? []) : []);
  const rows = gallery?.rows ? optionsOf(gallery.rows) : [""];
  const cols = optionsOf(gallery?.columns);
  const reset = () => {
    setValues(defaults);
    setText(spec.children?.default ?? "");
    setIcon("none");
  };

  const tab = `relative z-10 inline-flex h-8 items-center rounded-md px-3 text-[13px] font-semibold text-sk-muted transition-colors duration-150 hover:text-sk-ink data-active:text-sk-ink ${focus}`;

  return (
    <Tooltip.Provider delay={400}>
      <Tabs.Root value={view} onValueChange={(v) => setView(v as "preview" | "code")} className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs.List aria-label="View" className="relative flex items-center gap-0.5 rounded-lg bg-sk-well p-0.5 inset-ring inset-ring-sk-hairline">
            <Tabs.Tab value="preview" className={tab}>Preview</Tabs.Tab>
            <Tabs.Tab value="code" className={tab}>Code</Tabs.Tab>
            <Tabs.Indicator className="absolute top-0.5 left-0 h-8 w-(--active-tab-width) translate-x-(--active-tab-left) rounded-md bg-sk-surface shadow-sk-card transition-[translate,width] duration-200 ease-sk-out dark:bg-sk-raised" />
          </Tabs.List>
          <div className={`flex items-center gap-2 transition-opacity duration-150 ${view === "preview" ? "" : "pointer-events-none invisible opacity-0"}`} aria-hidden={view !== "preview"}>
            <IconChoice
              label="Stage colours"
              value={stageMode}
              onChange={(v) => setMode(v)}
              options={[
                { value: "light", label: "Light stage", icon: <SunIcon />, disabled: forced === "dark" },
                { value: "dark", label: "Dark stage", icon: <MoonIcon />, disabled: forced === "light" },
              ]}
            />
            <IconChoice
              label="Stage width"
              value={preset}
              onChange={(v) => {
                setPreset(v);
                setWidth(WIDTHS[v]);
              }}
              options={[
                { value: "full", label: "Full width", icon: <DesktopIcon /> },
                { value: "tablet", label: "Tablet, 768px", icon: <TabletIcon /> },
                { value: "phone", label: "Phone, 390px", icon: <PhoneIcon /> },
              ]}
            />
            <ToolButton label="Replay" onClick={() => setReplay((n) => n + 1)}>
              <ReplayIcon />
            </ToolButton>
            {fill && (
              <ToolButton label="Full screen" onClick={() => stage.current?.requestFullscreen?.()}>
                <ExpandIcon />
              </ToolButton>
            )}
          </div>
        </div>

        <Tabs.Panel value="preview" className="grid gap-4 outline-none">
          <ResizableFrame width={width} onWidth={(w) => { setWidth(w); setPreset(w === null ? "full" : w === 768 ? "tablet" : w === 390 ? "phone" : preset); }}>
            <div
              ref={stage}
              className={`relative grid overflow-hidden rounded-2xl inset-ring inset-ring-sk-hairline ${modeClass} ${fill ? "" : "place-items-center p-10"} ${backdrop ?? "bg-sk-floor"}`}
              style={{ minHeight: spec.preview?.height ?? 320 }}
            >
              <div className={fill ? "absolute inset-0" : values.fullWidth ? "w-full max-w-sm" : "max-w-full"}>
                <Component key={`${replay}:${JSON.stringify(values)}`} {...live}>
                  {icon === "only" ? undefined : renderChildren(text)}
                </Component>
              </div>
            </div>
          </ResizableFrame>

          <Customize changed={changed} onReset={reset}>
            {control !== "none" && spec.children && <TextControl label={spec.children.label} value={text} onChange={setText} />}
            {controls.filter((p) => p.type === "string").map((p) => (
              <TextControl key={p.name} label={titleCase(p.name)} value={String(values[p.name] ?? "")} onChange={(v) => set(p.name, v)} />
            ))}
            {controls.filter((p) => p.type === "enum" && (p.options?.length ?? 0) > 3).map((p) => (
              <ChoiceControl key={p.name} label={titleCase(p.name)} value={String(values[p.name])} options={p.options ?? []} onChange={(v) => set(p.name, v)} />
            ))}
            {hasIcons && <ChoiceControl label="Icon" value={icon} options={["none", "before", "after", "only"]} onChange={(v) => setIcon(v as IconPlace)} />}
            {controls.filter((p) => p.type === "enum" && (p.options?.length ?? 0) <= 3).map((p) => (
              <ChoiceControl key={p.name} label={titleCase(p.name)} value={String(values[p.name])} options={p.options ?? []} onChange={(v) => set(p.name, v)} />
            ))}
            {controls.filter((p) => p.type === "boolean").map((p) => (
              <SwitchControl key={p.name} label={titleCase(p.name)} checked={Boolean(values[p.name])} onChange={(v) => set(p.name, v)} />
            ))}
          </Customize>

          {gallery && (
            <section aria-labelledby="gallery" className="rounded-2xl bg-sk-well p-1.5 inset-ring inset-ring-sk-hairline">
              <h2 id="gallery" className="px-3.5 pt-2.5 pb-3 text-[15px]">{gallery.title}</h2>
              <div className={`grid gap-4 overflow-x-auto rounded-xl p-6 shadow-sk-card ${modeClass} ${backdrop ?? "bg-sk-floor"}`}>
                {rows.map((row) => {
                  const rowProps = gallery.rows ? { [gallery.rows]: row } : {};
                  return (
                    <div key={row || "row"} className="flex flex-wrap items-center gap-3">
                      {gallery.rows && <span className="w-8 shrink-0 font-sk-mono text-[12px] text-sk-muted">{row}</span>}
                      {cols.map((col) => (
                        <Component key={col} {...defaults} {...rowProps} {...(gallery.columns ? { [gallery.columns]: col } : {})}>
                          {renderChildren(gallery.labels === "value" ? titleCase(col) : text)}
                        </Component>
                      ))}
                      {(gallery.extras ?? []).map((extra) => (
                        <Component key={extra.label} {...defaults} {...rowProps} {...withIcons(extra.props)}>
                          {extra.iconOnly ? undefined : renderChildren(extra.label)}
                        </Component>
                      ))}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <PropsTable spec={spec} />
        </Tabs.Panel>

        <Tabs.Panel value="code" className="grid gap-8 outline-none">
          <Install skin={skin} />
          <section aria-labelledby="usage" className="grid gap-3">
            <div className="flex items-baseline justify-between">
              <h2 id="usage" className="text-lg">Usage</h2>
              <p className="text-[13px] text-sk-muted">Follows your choices in Customize.</p>
            </div>
            <CodeBlock title="Usage" code={usageFile} collapseAfter={40} />
          </section>
        </Tabs.Panel>
      </Tabs.Root>
    </Tooltip.Provider>
  );
}

/** Installation: one command, or the manual steps. */
function Install({ skin }: { skin: Skin }) {
  const deps = skin.dependencies;
  const step = "grid gap-3 border-l border-sk-hairline pl-6 relative before:absolute before:-left-[13px] before:top-0 before:grid before:size-6 before:place-items-center before:rounded-full before:bg-sk-well before:text-[12px] before:font-semibold before:text-sk-ink before:inset-ring before:inset-ring-sk-hairline";
  const underline = `relative h-9 px-1 text-sm font-semibold text-sk-muted transition-colors duration-100 hover:text-sk-ink data-active:text-sk-ink ${focus}`;
  return (
    <section aria-labelledby="install" className="grid gap-4">
      <h2 id="install" className="text-lg">Installation</h2>
      <Tabs.Root defaultValue="cli" className="grid gap-5">
        <Tabs.List aria-label="Installation method" className="relative flex gap-5 border-b border-sk-hairline">
          <Tabs.Tab value="cli" className={underline}>Command</Tabs.Tab>
          <Tabs.Tab value="manual" className={underline}>Manual</Tabs.Tab>
          <Tabs.Indicator className="absolute bottom-[-1px] left-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) rounded-full bg-sk-ink transition-[translate,width] duration-200 ease-sk-out" />
        </Tabs.List>
        <Tabs.Panel value="cli" className="outline-none">
          <CommandBlock commands={runCommand(`shadcn@latest add ${REGISTRY_URL}/${skin.name}.json`)} />
        </Tabs.Panel>
        <Tabs.Panel value="manual" className="grid gap-8 pl-3 outline-none [counter-reset:step]">
          <div className={`${step} before:content-['1']`}>
            <h3 className="text-[15px]">Install the dependencies</h3>
            {deps.length ? (
              <CommandBlock commands={addCommand(deps)} />
            ) : (
              <p className="text-sm text-sk-muted">Nothing beyond React and Tailwind CSS.</p>
            )}
          </div>
          <div className={`${step} before:content-['2']`}>
            <h3 className="text-[15px]">Add the tokens</h3>
            <p className="text-sm text-sk-muted">Every skin reads its colours from one stylesheet. Add it once, after Tailwind.</p>
            <CodeBlock title="app.css" code={`@import "tailwindcss";\n@import "./skins.css";\n`} lineNumbers={false} />
          </div>
          <div className={`${step} before:content-['3']`}>
            <h3 className="text-[15px]">Copy the source</h3>
            <CodeBlock title={`components/skins/${skin.file}`} code={skin.source} collapseAfter={14} />
          </div>
        </Tabs.Panel>
      </Tabs.Root>
    </section>
  );
}
