import { useMemo, useState, type ComponentPropsWithRef } from "react";
import { CopyButton, Segmented, StackedRow, SwitchControl, TextControl } from "~/components/controls";
import type { ComponentSpec, PropSpec, Skin } from "~/lib/registry";

type Values = Record<string, unknown>;
type IconPlace = "none" | "before" | "after" | "only";

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

const defaultsOf = (spec: ComponentSpec): Values =>
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
  const defaults = defaultsOf(spec);
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
  const open = `<${spec.export}${attrs.length ? " " + attrs.join(" ") : ""}`;
  const control = spec.children?.control ?? "none";
  if (control === "none" || icon === "only" || !text) return `${open} />`;
  const child = control === "trigger" ? `<button>${text}</button>` : text;
  return `${open}>${child}</${spec.export}>`;
}

const panel = "rounded-2xl bg-sk-surface shadow-sk-card";

export function Playground({ spec, skin }: { spec: ComponentSpec; skin: Skin }) {
  const [values, setValues] = useState<Values>(() => defaultsOf(spec));
  const [text, setText] = useState(spec.children?.default ?? "");
  const [icon, setIcon] = useState<IconPlace>("none");
  const set = (name: string, v: unknown) => setValues((prev) => ({ ...prev, [name]: v }));
  const { Component } = skin;
  const backdrop = skin.preview?.backdrop === "hue" ? "stage-hue" : undefined;
  const hasIcons = spec.props.some((p) => p.name === "icon") && spec.props.some((p) => p.name === "iconRight");
  const fill = spec.preview?.layout === "fill";
  const control = spec.children?.control ?? "none";
  // Dark-only and light-only skins always preview in the mode they were drawn for.
  const forcedMode = skin.modes.length === 1 ? skin.modes[0] : undefined;
  const modeClass = forcedMode === "dark" ? "dark" : forcedMode === "light" ? "light-only" : "";
  // Restart the preview when a control changes, so props that set a starting state (defaultChecked) apply.
  const previewKey = JSON.stringify(values);

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
  const importLine = `import { ${spec.export} } from "@/components/skins/${skin.name}";`;

  const controls = spec.props.filter((p) => !p.hidden);
  const strings = controls.filter((p) => p.type === "string");
  const enums = controls.filter((p) => p.type === "enum");
  const bools = controls.filter((p) => p.type === "boolean");
  const gallery = spec.gallery;
  const optionsOf = (name?: string) => (name ? (spec.props.find((p) => p.name === name)?.options ?? []) : []);
  const rows = gallery?.rows ? optionsOf(gallery.rows) : [""];
  const cols = optionsOf(gallery?.columns);

  return (
    <div className="grid gap-6">
      <div className={`${panel} grid overflow-hidden lg:grid-cols-[1fr_340px]`}>
        <div className={`relative grid ${fill ? "" : "place-items-center p-10"} ${modeClass} ${backdrop ?? (forcedMode ? "bg-sk-floor" : "bg-sk-floor/40")}`} style={{ minHeight: spec.preview?.height ?? 288 }}>
          <div className={fill ? "absolute inset-0" : values.fullWidth ? "w-full max-w-sm" : "max-w-full"}>
            <Component key={previewKey} {...live}>{icon === "only" ? undefined : renderChildren(text)}</Component>
          </div>
        </div>
        <div className="grid content-start gap-1 border-t border-sk-hairline p-5 lg:border-t-0 lg:border-l">
          {control !== "none" && spec.children && <TextControl label={spec.children.label} value={text} onChange={setText} />}
          {strings.map((p) => (
            <TextControl key={p.name} label={titleCase(p.name)} value={String(values[p.name] ?? "")} onChange={(v) => set(p.name, v)} />
          ))}
          {enums.map((p) => (
            <StackedRow key={p.name} label={titleCase(p.name)}>
              <Segmented label={p.name} value={String(values[p.name])} options={p.options ?? []} onChange={(v) => set(p.name, v)} />
            </StackedRow>
          ))}
          {hasIcons && (
            <StackedRow label="Icon">
              <Segmented label="Icon" value={icon} options={["none", "before", "after", "only"]} onChange={(v) => setIcon(v as IconPlace)} />
            </StackedRow>
          )}
          {bools.map((p) => (
            <SwitchControl key={p.name} label={titleCase(p.name)} checked={Boolean(values[p.name])} onChange={(v) => set(p.name, v)} />
          ))}
        </div>
      </div>

      {gallery && (
        <section aria-labelledby="gallery" className={`${panel} p-6`}>
          <h2 id="gallery" className="text-lg">{gallery.title}</h2>
          <div className={`mt-5 grid gap-4 overflow-x-auto ${modeClass} ${backdrop ? `${backdrop} -mx-6 -mb-6 rounded-b-2xl p-6` : forcedMode ? "-mx-6 -mb-6 rounded-b-2xl bg-sk-floor p-6 text-sk-ink" : ""}`}>
            {rows.map((row) => {
              const rowProps = gallery.rows ? { [gallery.rows]: row } : {};
              return (
                <div key={row || "row"} className="flex flex-wrap items-center gap-3">
                  {gallery.rows && <span className={`w-8 shrink-0 text-[13px] ${backdrop ? "font-medium text-sk-ink" : "text-sk-muted"}`}>{row}</span>}
                  {cols.map((col) => (
                    <Component key={col} {...defaultsOf(spec)} {...rowProps} {...(gallery.columns ? { [gallery.columns]: col } : {})}>
                      {renderChildren(gallery.labels === "value" ? titleCase(col) : text)}
                    </Component>
                  ))}
                  {(gallery.extras ?? []).map((extra) => (
                    <Component key={extra.label} {...defaultsOf(spec)} {...rowProps} {...withIcons(extra.props)}>
                      {extra.iconOnly ? undefined : renderChildren(extra.label)}
                    </Component>
                  ))}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section aria-labelledby="usage" className={`${panel} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-sk-hairline px-5 py-2">
          <h2 id="usage" className="text-[15px]">Usage</h2>
          <CopyButton text={`${importLine}\n\n${code}`} />
        </div>
        <pre className="overflow-x-auto p-5 font-sk-mono text-[13px]/6 text-sk-ink">
          <code>{importLine}{"\n\n"}{code}</code>
        </pre>
      </section>

      <section aria-labelledby="source" className={`${panel} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-sk-hairline px-5 py-2">
          <h2 id="source" className="text-[15px]">{skin.file}</h2>
          <CopyButton text={skin.source} />
        </div>
        <pre className="max-h-[32rem] overflow-auto p-5 font-sk-mono text-[12.5px]/6 text-sk-ink">
          <code>{skin.source}</code>
        </pre>
      </section>
    </div>
  );
}
