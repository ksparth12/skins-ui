import { Tabs } from "@base-ui/react/tabs";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { Tooltip } from "@base-ui/react/tooltip";
import { useEffect, useMemo, useRef, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import { CodeBlock, CommandBlock, addCommand, runCommand } from "~/components/code-block";
import { Panel, PanelLabel } from "~/components/panel";
import { TabPill } from "~/components/tab-pill";
import { ChoiceControl, Customize, SwitchControl, TextControl } from "~/components/customize";
import { ArrowRightIcon as ArrowIcon, DesktopIcon, ExpandIcon, EyeIcon, PhoneIcon, PlusIcon, ReplayIcon, ResetIcon, TabletIcon, TerminalIcon } from "~/components/icons";
import { PropsTable } from "~/components/props-table";
import type { ComponentSpec, PropSpec, Skin } from "~/lib/registry";

type Values = Record<string, unknown>;
type IconPlace = "none" | "before" | "after" | "only";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";
const REGISTRY_URL = "https://skinsui.dev/r";
const MIN_WIDTH = 320;
/** The stage's edge, drawn over its content so skins that fill the stage never hide it. */
const frameEdge = "pointer-events-none absolute inset-0 z-10 rounded-[inherit] ring-1 ring-black/10 ring-inset dark:ring-white/[0.07]";


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
        className={`grid size-7 place-items-center rounded-md text-neutral-500 transition-colors duration-100 hover:bg-neutral-200/70 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/70 dark:hover:text-white ${focus}`}
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
function IconChoice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<{ value: T; label: string; icon: ReactNode }>; onChange: (v: T) => void }) {
  return (
    <ToggleGroup aria-label={label} value={[value]} onValueChange={(next) => next[0] && onChange(next[0] as T)} className="flex items-center gap-0.5">
      {options.map((o) => (
        <Tooltip.Root key={o.value}>
          <Tooltip.Trigger
            render={<Toggle value={o.value} aria-label={o.label} />}
            className={`grid size-7 place-items-center rounded-md text-neutral-500 transition-[background-color,color] duration-150 hover:text-neutral-900 data-pressed:bg-neutral-200/70 data-pressed:text-neutral-950 dark:text-neutral-400 dark:hover:text-white dark:data-pressed:bg-neutral-800/70 dark:data-pressed:text-white ${focus}`}
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
  const stage = useRef<HTMLDivElement>(null);

  const set = (name: string, v: unknown) => setValues((prev) => ({ ...prev, [name]: v }));
  const { Component } = skin;
  const backdrop = skin.preview?.backdrop === "hue" ? "stage-hue" : undefined;
  const hasIcons = spec.props.some((p) => p.name === "icon") && spec.props.some((p) => p.name === "iconRight");
  const fill = spec.preview?.layout === "fill";
  const control = spec.children?.control ?? "none";
  // The stage follows the site theme. A skin drawn for one mode only always shows in that mode.
  const modeClass = skin.modes.length === 1 ? skin.modes[0] : "";
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
  const reset = () => {
    setValues(defaults);
    setText(spec.children?.default ?? "");
    setIcon("none");
  };

  const tab = `relative inline-flex h-[30px] items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-neutral-500 transition-colors duration-150 hover:text-neutral-900 data-active:text-neutral-950 dark:text-neutral-400 dark:hover:text-white dark:data-active:text-white ${focus}`;

  return (
    <Tooltip.Provider delay={400}>
      <div className="grid grid-cols-1">
        <Tabs.Root value={view} onValueChange={(v) => setView(v as "preview" | "code")}>
          <div className="flex items-center justify-between gap-3 pb-3">
                <Tabs.List aria-label="View" className="relative flex items-center gap-0.5 rounded-full bg-black/[0.04] p-[3px] dark:bg-white/5">
                  <Tabs.Tab value="preview" className={tab}>
                    {view === "preview" && <TabPill group="view" round />}
                    <span className="relative inline-flex items-center gap-1.5">
                      <EyeIcon className="size-3.5" />
                      Preview
                    </span>
                  </Tabs.Tab>
                  <Tabs.Tab value="code" className={tab}>
                    {view === "code" && <TabPill group="view" round />}
                    <span className="relative inline-flex items-center gap-1.5">
                      <TerminalIcon className="size-3.5" />
                      Code
                    </span>
                  </Tabs.Tab>
                </Tabs.List>
                <div className={`flex items-center gap-0.5 transition-opacity duration-150 ${view === "preview" ? "" : "pointer-events-none invisible opacity-0"}`} aria-hidden={view !== "preview"}>
                  <IconChoice
                    label="Stage width"
                    value={preset}
                    onChange={(v) => {
                      setPreset(v);
                      setWidth(WIDTHS[v]);
                    }}
                    options={[
                      { value: "full", label: "Full width", icon: <DesktopIcon className="size-3.5" /> },
                      { value: "tablet", label: "Tablet, 768px", icon: <TabletIcon className="size-3.5" /> },
                      { value: "phone", label: "Phone, 390px", icon: <PhoneIcon className="size-3.5" /> },
                    ]}
                  />
                  <span aria-hidden="true" className="mx-1 h-3.5 w-px bg-neutral-300 dark:bg-neutral-700" />
                  <ToolButton label="Replay" onClick={() => setReplay((n) => n + 1)}>
                    <ReplayIcon className="size-3.5" />
                  </ToolButton>
                  <ToolButton label="Full screen" onClick={() => stage.current?.requestFullscreen?.()}>
                    <ExpandIcon className="size-3.5" />
                  </ToolButton>
                </div>
          </div>
            <Tabs.Panel value="preview" className="outline-none">
              <ResizableFrame width={width} onWidth={(w) => { setWidth(w); setPreset(w === null ? "full" : w === 768 ? "tablet" : w === 390 ? "phone" : preset); }}>
                <div
                  ref={stage}
                  className={`relative grid overflow-hidden rounded-[18px] ${modeClass} ${fill ? "" : "place-items-center px-6 py-14 sm:px-12"} ${backdrop ?? "bg-site-stage"}`}
                  style={{ minHeight: spec.preview?.height ?? 352 }}
                >
                  <span aria-hidden="true" className={frameEdge} />
                  <div className={fill ? "absolute inset-0" : values.fullWidth ? "w-full max-w-sm" : "max-w-full"}>
                    <Component key={`${replay}:${JSON.stringify(values)}`} {...live}>
                      {icon === "only" ? undefined : renderChildren(text)}
                    </Component>
                  </div>
                </div>
              </ResizableFrame>
            </Tabs.Panel>
            <Tabs.Panel value="code" className="outline-none">
              <CodeBlock title="usage.tsx" code={usageFile} />
            </Tabs.Panel>
        </Tabs.Root>

        <Section id="customize" title="Customize">
          <Panel
            header={
              <>
                <PanelLabel>Props</PanelLabel>
                {changed && (
                  <button type="button" onClick={reset} className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-neutral-500 transition-colors duration-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white ${focus}`}>
                    <ResetIcon className="size-3.5" />
                    Reset
                  </button>
                )}
              </>
            }
          >
            <Customize>
              {control !== "none" && spec.children && <TextControl label={spec.children.label} value={text} onChange={setText} />}
              {controls.filter((p) => p.type === "string").map((p) => (
                <TextControl key={p.name} label={titleCase(p.name)} value={String(values[p.name] ?? "")} onChange={(v) => set(p.name, v)} />
              ))}
              {controls.filter((p) => p.type === "enum").map((p) => (
                <ChoiceControl key={p.name} label={titleCase(p.name)} value={String(values[p.name])} options={p.options ?? []} onChange={(v) => set(p.name, v)} />
              ))}
              {hasIcons && <ChoiceControl label="Icon" value={icon} options={["none", "before", "after", "only"]} onChange={(v) => setIcon(v as IconPlace)} />}
              {controls.filter((p) => p.type === "boolean").map((p) => (
                <SwitchControl key={p.name} label={titleCase(p.name)} checked={Boolean(values[p.name])} onChange={(v) => set(p.name, v)} />
              ))}
            </Customize>
          </Panel>
        </Section>

        <Section id="installation" title="Installation">
          <Install skin={skin} />
        </Section>

        <Section id="usage" title="Usage">
          <CodeBlock title="usage.tsx" code={usageFile} />
        </Section>

        <Section id="props" title="Props">
          <PropsTable spec={spec} />
        </Section>
      </div>
    </Tooltip.Provider>
  );
}

/** Every section sits 56px below the one above it, with 20px between its heading and its content. */
function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-14 grid scroll-mt-20 grid-cols-1 gap-5">
      <h2 id={id} className="font-sk-sans text-2xl font-medium tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

/** Installation: one command, or the manual steps. */
function Install({ skin }: { skin: Skin }) {
  const deps = skin.dependencies;
  const [method, setMethod] = useState<"cli" | "manual">("cli");
  const underline = `relative inline-flex h-7 items-center rounded-md px-3 text-[13px] font-medium text-neutral-500 transition-colors duration-150 hover:text-neutral-900 data-active:text-neutral-950 dark:text-neutral-400 dark:hover:text-white dark:data-active:text-white ${focus}`;
  return (
    <Tabs.Root value={method} onValueChange={(v) => setMethod(v as "cli" | "manual")} className="grid grid-cols-1 gap-3">
      <Tabs.List aria-label="Installation method" className="relative flex w-fit items-center gap-0.5 rounded-lg bg-neutral-100 p-0.5 ring-1 ring-neutral-200/70 ring-inset dark:bg-neutral-900 dark:ring-white/[0.06]">
        <Tabs.Tab value="cli" className={underline}>
          {method === "cli" && <TabPill group="install" />}
          <span className="relative">CLI</span>
        </Tabs.Tab>
        <Tabs.Tab value="manual" className={underline}>
          {method === "manual" && <TabPill group="install" />}
          <span className="relative">Manual</span>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="cli" className="outline-none">
        <CommandBlock commands={runCommand(`shadcn@latest add ${REGISTRY_URL}/${skin.name}.json`)} />
      </Tabs.Panel>
      <Tabs.Panel value="manual" className="outline-none">
        <ol className="grid grid-cols-1">
          <Step n={1} title="Install the packages">
            {deps.length ? <CommandBlock commands={addCommand(deps)} /> : <p className="text-sm text-neutral-500 dark:text-neutral-400">Nothing beyond React and Tailwind CSS.</p>}
          </Step>
          <Step n={2} title="Add the tokens once, after Tailwind">
            <CodeBlock title="app.css" code={`@import "tailwindcss";\n@import "./skins.css";\n`} />
          </Step>
          <Step n={3} title="Copy and paste the following code into your project">
            <CodeBlock title={`${skin.name}.tsx`} code={skin.source} collapseAfter={14} />
          </Step>
          <Step n={4} title="Update the import paths to match your project setup" last />
        </ol>
      </Tabs.Panel>
    </Tabs.Root>
  );
}

/** One numbered step, joined to the next by a line. */
function Step({ n, title, last, children }: { n: number; title: string; last?: boolean; children?: ReactNode }) {
  return (
    <li className="relative grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3">
      <span className="z-10 grid size-7 place-items-center rounded-lg bg-neutral-100 text-xs font-medium ring-1 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-white/[0.08]">{n}</span>
      {!last && <span aria-hidden="true" className="absolute top-7 bottom-0 left-3.5 w-px bg-neutral-200 dark:bg-neutral-800" />}
      <div className={`grid grid-cols-1 gap-4 ${last ? "" : "pb-8"}`}>
        <h3 className="flex min-h-7 items-center font-sk-sans text-[15px] font-medium text-neutral-950/90 dark:text-white/90">{title}</h3>
        {children}
      </div>
    </li>
  );
}
