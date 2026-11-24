import { useMemo, useState } from "react";
import { CopyButton, Segmented, StackedRow, SwitchControl, TextControl } from "~/components/controls";
import type { ComponentSpec, Skin } from "~/lib/registry";

type Values = Record<string, string | boolean>;
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

const defaultsOf = (spec: ComponentSpec): Values =>
  Object.fromEntries(spec.props.filter((p) => p.default !== undefined).map((p) => [p.name, p.default as string | boolean]));

function usage(spec: ComponentSpec, values: Values, label: string, icon: IconPlace): string {
  const defaults = defaultsOf(spec);
  const attrs: string[] = [];
  for (const p of spec.props) {
    const v = values[p.name];
    if (v === undefined || v === defaults[p.name]) continue;
    if (p.type === "boolean" && v === true) attrs.push(p.name);
    else if (p.type === "enum") attrs.push(`${p.name}="${v}"`);
  }
  if (icon === "before" || icon === "only") attrs.push("icon={<PlusIcon />}");
  if (icon === "after") attrs.push("iconRight={<ArrowIcon />}");
  if (icon === "only") attrs.push(`aria-label="${label || "Add"}"`);
  const open = `<${spec.export}${attrs.length ? " " + attrs.join(" ") : ""}`;
  return icon === "only" ? `${open} />` : `${open}>${label}</${spec.export}>`;
}

const panel = "rounded-2xl bg-sk-surface shadow-sk-card";

export function Playground({ spec, skin }: { spec: ComponentSpec; skin: Skin }) {
  const [values, setValues] = useState<Values>(() => defaultsOf(spec));
  const [label, setLabel] = useState(spec.children?.default ?? "");
  const [icon, setIcon] = useState<IconPlace>("none");
  const set = (name: string, v: string | boolean) => setValues((prev) => ({ ...prev, [name]: v }));
  const { Component } = skin;
  const hasIcons = spec.props.some((p) => p.name === "icon") && spec.props.some((p) => p.name === "iconRight");

  const live = {
    ...values,
    icon: icon === "before" || icon === "only" ? <PlusIcon /> : undefined,
    iconRight: icon === "after" ? <ArrowIcon /> : undefined,
    "aria-label": icon === "only" ? label || "Add" : undefined,
  };
  const code = useMemo(() => usage(spec, values, label, icon), [spec, values, label, icon]);
  const importLine = `import { ${spec.export} } from "@/components/skins/${skin.name}";`;

  const enumProps = spec.props.filter((p) => p.type === "enum");
  const boolProps = spec.props.filter((p) => p.type === "boolean");
  const variantProp = enumProps.find((p) => p.name === "variant");
  const sizeProp = enumProps.find((p) => p.name === "size");

  return (
    <div className="grid gap-6">
      <div className={`${panel} grid overflow-hidden lg:grid-cols-[1fr_340px]`}>
        <div className="grid min-h-72 place-items-center bg-sk-floor/40 p-10">
          <div className={values.fullWidth ? "w-full max-w-sm" : undefined}>
            <Component {...live}>{icon === "only" ? undefined : label}</Component>
          </div>
        </div>
        <div className="grid content-start gap-1 border-t border-sk-hairline p-5 lg:border-t-0 lg:border-l">
          {spec.children && <TextControl label={spec.children.label} value={label} onChange={setLabel} />}
          {enumProps.map((p) => (
            <StackedRow key={p.name} label={p.name[0]?.toUpperCase() + p.name.slice(1)}>
              <Segmented label={p.name} value={String(values[p.name])} options={p.options ?? []} onChange={(v) => set(p.name, v)} />
            </StackedRow>
          ))}
          {hasIcons && (
            <StackedRow label="Icon">
              <Segmented label="Icon" value={icon} options={["none", "before", "after", "only"]} onChange={(v) => setIcon(v as IconPlace)} />
            </StackedRow>
          )}
          {boolProps.map((p) => (
            <SwitchControl key={p.name} label={p.name === "fullWidth" ? "Full width" : p.name[0]?.toUpperCase() + p.name.slice(1)} checked={Boolean(values[p.name])} onChange={(v) => set(p.name, v)} />
          ))}
        </div>
      </div>

      {variantProp && sizeProp && (
        <section aria-labelledby="every-look" className={`${panel} p-6`}>
          <h2 id="every-look" className="text-lg">Every variant and size</h2>
          <div className="mt-5 grid gap-4 overflow-x-auto">
            {(sizeProp.options ?? []).map((size) => (
              <div key={size} className="flex items-center gap-3">
                <span className="w-8 shrink-0 text-[13px] text-sk-muted">{size}</span>
                {(variantProp.options ?? []).map((variant) => (
                  <Component key={variant} variant={variant} size={size}>
                    {variant[0]?.toUpperCase() + variant.slice(1)}
                  </Component>
                ))}
                <Component size={size} loading>Saving</Component>
                <Component size={size} disabled>Disabled</Component>
                <Component size={size} icon={<PlusIcon />} aria-label="Add" />
              </div>
            ))}
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
