import { DEFAULT_PRESET, STOPS, colorTokens, createHue, neutrals, presets } from "@skins/hue";
import { useMemo } from "react";
import { C, DocPage, P, docMeta } from "~/components/docs";
import { useHueChoice } from "~/components/hue-picker";
import { Panel, PanelLabel } from "~/components/panel";
import { Section } from "~/components/section";

export const meta = () => docMeta("/docs/tokens");

type Kind = "colour" | "shadow" | "text";
interface Token {
  name: string;
  use: string;
}
interface Group {
  id: string;
  title: string;
  intro: string;
  kind: Kind;
  tokens: Token[];
}

const groups: Group[] = [
  {
    id: "surfaces",
    title: "Surfaces",
    intro: "The grounds a skin is drawn on, from the page itself up to things that float above it.",
    kind: "colour",
    tokens: [
      { name: "floor", use: "The page behind everything." },
      { name: "surface", use: "Cards, inputs and secondary buttons." },
      { name: "raised", use: "Something lifted above a surface." },
      { name: "overlay", use: "Menus, popovers, tooltips and dialogs." },
      { name: "well", use: "A recessed area, such as a track or a code block." },
    ],
  },
  {
    id: "text",
    title: "Text",
    intro: "Ink passes AA on every surface. Faint is for things that are not text, such as placeholders and dividers.",
    kind: "colour",
    tokens: [
      { name: "ink", use: "Body text and labels." },
      { name: "muted", use: "Secondary text and descriptions." },
      { name: "faint", use: "Disabled marks and quiet icons." },
    ],
  },
  {
    id: "lines",
    title: "Lines",
    intro: "See-through, so they read the same on any surface.",
    kind: "colour",
    tokens: [
      { name: "hairline", use: "The lightest edge, between parts of one thing." },
      { name: "border", use: "The usual edge of a control or card." },
      { name: "border-strong", use: "An edge that needs to be found, such as a focused field." },
    ],
  },
  {
    id: "states",
    title: "States",
    intro: "Tints laid over whatever is below, so hover and press work on every surface.",
    kind: "colour",
    tokens: [
      { name: "hover", use: "Under the pointer." },
      { name: "press", use: "While held down." },
      { name: "menu-on", use: "The highlighted row in a menu or list." },
    ],
  },
  {
    id: "accent",
    title: "Accent",
    intro: "Made from your Hue colour. These change when you pick a new one.",
    kind: "colour",
    tokens: [
      { name: "accent", use: "Primary buttons and other solid accent fills." },
      { name: "accent-hover", use: "The accent fill under the pointer." },
      { name: "accent-active", use: "The accent fill while pressed." },
      { name: "accent-fg", use: "Text and icons on the accent fill." },
      { name: "accent-subtle", use: "A soft accent tint, for badges and notices." },
      { name: "accent-subtle-fg", use: "Text on the soft tint." },
      { name: "accent-border", use: "An accent edge." },
      { name: "indicator", use: "Switch tracks and checkboxes, at 3:1 on the page." },
      { name: "indicator-fg", use: "The thumb or check mark on an indicator." },
      { name: "link", use: "Links in text." },
      { name: "ring", use: "The keyboard focus ring." },
    ],
  },
  {
    id: "status",
    title: "Status",
    intro: "Fixed colours that never follow Hue, so a warning always looks like a warning.",
    kind: "colour",
    tokens: [
      { name: "danger", use: "Error text and icons." },
      { name: "danger-soft", use: "A soft error background." },
      { name: "danger-solid", use: "Buttons that destroy something." },
      { name: "danger-solid-hover", use: "The danger fill under the pointer." },
      { name: "danger-solid-active", use: "The danger fill while pressed." },
      { name: "danger-solid-fg", use: "Text on the danger fill." },
      { name: "success", use: "Success text and icons." },
      { name: "success-soft", use: "A soft success background." },
      { name: "warning", use: "Warning text and icons." },
      { name: "warning-soft", use: "A soft warning background." },
      { name: "info", use: "Info text and icons." },
      { name: "info-soft", use: "A soft info background." },
    ],
  },
  {
    id: "shadows",
    title: "Shadows",
    intro: "Each comes with its own hairline edge. Use them as Tailwind shadows, such as shadow-sk-card.",
    kind: "shadow",
    tokens: [
      { name: "shadow-ring", use: "Only the hairline edge." },
      { name: "shadow-card", use: "Cards resting on the page." },
      { name: "shadow-raised", use: "Something lifted, such as a dragged item." },
      { name: "shadow-popover", use: "Menus, popovers and tooltips." },
      { name: "shadow-modal", use: "Dialogs." },
      { name: "shadow-inset", use: "A recessed field or track." },
      { name: "edge-light", use: "A faint highlight along the top edge." },
    ],
  },
  {
    id: "motion",
    title: "Motion",
    intro: "Three speeds, and a quicker exit for each. Bigger things move slower.",
    kind: "text",
    tokens: [
      { name: "motion-fast", use: "Colour changes, presses and small icons." },
      { name: "motion-base", use: "Controls changing state, such as a switch." },
      { name: "motion-slow", use: "Panels, popovers and dialogs." },
      { name: "motion-fast-exit", use: "Leaving at the fast speed." },
      { name: "motion-base-exit", use: "Leaving at the base speed." },
      { name: "motion-slow-exit", use: "Leaving at the slow speed." },
      { name: "ease-out", use: "The curve for anything appearing or moving." },
    ],
  },
  {
    id: "fonts",
    title: "Fonts",
    intro: "Skins use your fonts. Set these to change them.",
    kind: "text",
    tokens: [
      { name: "font-sans", use: "Body text and labels." },
      { name: "font-display", use: "Headings. Falls back to the sans font." },
      { name: "font-mono", use: "Code and numbers that line up." },
    ],
  },
];

/** Values that are the same in both modes. */
const fixed: Record<string, string> = {
  "motion-fast": "100ms",
  "motion-base": "150ms",
  "motion-slow": "220ms",
  "motion-fast-exit": "60ms",
  "motion-base-exit": "120ms",
  "motion-slow-exit": "160ms",
  "ease-out": "cubic-bezier(0.22, 1, 0.36, 1)",
  "font-sans": "ui-sans-serif, system-ui, sans-serif",
  "font-display": "var(--sk-font-sans)",
  "font-mono": 'ui-monospace, "SF Mono", Menlo, monospace',
};

/** Every value for the chosen Hue: the fixed neutrals plus the colours made from it. */
function useValues() {
  const [id] = useHueChoice();
  return useMemo(() => {
    const preset = presets.find((p) => p.id === id) ?? DEFAULT_PRESET;
    const hue = createHue(preset.color);
    const mode = (m: "light" | "dark") => ({ ...neutrals[m], ...Object.fromEntries(colorTokens(hue, hue[m])) }) as Record<string, string>;
    return { light: mode("light"), dark: mode("dark"), name: preset.name };
  }, [id]);
}

/** A chip of the colour, drawn inside the mode it belongs to so see-through tokens show over the right floor. */
function Swatch({ mode, name }: { mode: "light" | "dark"; name: string }) {
  return (
    <span aria-hidden="true" className={`${mode} grid size-8 shrink-0 place-items-center rounded-lg bg-sk-floor inset-ring inset-ring-sk-hairline`}>
      <span className="size-5 rounded-[5px] inset-ring inset-ring-sk-hairline" style={{ backgroundColor: `var(--sk-${name})` }} />
    </span>
  );
}

const cell = "px-4 py-3 align-middle text-[13px]";
const mono = "font-sk-mono text-xs text-neutral-500 dark:text-neutral-400";

function Value({ mode, name, kind, value }: { mode: "light" | "dark"; name: string; kind: Kind; value: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      {kind === "colour" && <Swatch mode={mode} name={name} />}
      <span className={`${mono} min-w-0 break-words`}>{value}</span>
    </span>
  );
}

/** Each shadow on a real card, once on the light floor and once on the dark one. The top highlight is not a shadow, so it stays in the table. */
function ShadowShowcase({ tokens }: { tokens: Token[] }) {
  const shadows = tokens.filter((t) => t.name.startsWith("shadow-"));
  return (
    <Panel innerClassName="grid sm:grid-cols-2">
      {(["light", "dark"] as const).map((mode) => (
        <div key={mode} className={`${mode} bg-sk-floor p-6`}>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3">
            {shadows.map((t) => (
              <li key={t.name} className="grid gap-2.5">
                <span
                  aria-hidden="true"
                  className={`h-14 rounded-xl ${t.name === "shadow-inset" ? "bg-sk-well" : "bg-sk-surface"}`}
                  style={{ boxShadow: `var(--sk-${t.name})` }}
                />
                <span className="truncate font-sk-mono text-xs text-sk-muted">{t.name.replace("shadow-", "")}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Panel>
  );
}

function TokenTable({ group }: { group: Group }) {
  const values = useValues();
  const both = group.kind === "colour";
  const columns = both ? ["Token", "Light", "Dark", "Use"] : group.kind === "shadow" ? ["Token", "Use"] : ["Token", "Value", "Use"];
  const widths = both ? ["w-[32%]", "w-[19%]", "w-[19%]", ""] : group.kind === "shadow" ? ["w-[32%]", ""] : ["w-[32%]", "w-[30%]", ""];
  const valueOf = (mode: "light" | "dark", name: string) => fixed[name] ?? values[mode][name] ?? "";

  return (
    <Panel
      header={
        <>
          <span className="sm:hidden">
            <PanelLabel>{group.tokens.length} tokens</PanelLabel>
          </span>
          <div aria-hidden="true" className="-mx-1.5 hidden w-[calc(100%+0.75rem)] sm:flex">
            {columns.map((c, i) => (
              <span key={c} className={`${widths[i] || "flex-1"} px-4 py-1.5 ${mono}`}>
                {c}
              </span>
            ))}
          </div>
        </>
      }
    >
      <table className="hidden w-full table-fixed text-left sm:table">
        <colgroup>
          {widths.map((w, i) => (
            <col key={i} className={w} />
          ))}
        </colgroup>
        <thead className="sr-only">
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {group.tokens.map((t) => (
            <tr key={t.name} className="border-b border-neutral-200/70 last:border-0 dark:border-neutral-800/70">
              <td className={`${cell} font-sk-mono text-xs font-medium break-words text-neutral-950/90 dark:text-white/90`}>--sk-{t.name}</td>
              {group.kind !== "shadow" && (
                <td className={cell}>
                  <Value mode="light" name={t.name} kind={group.kind} value={valueOf("light", t.name)} />
                </td>
              )}
              {both && (
                <td className={cell}>
                  <Value mode="dark" name={t.name} kind={group.kind} value={valueOf("dark", t.name)} />
                </td>
              )}
              <td className={`${cell} text-neutral-500 dark:text-neutral-400`}>{t.use}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="sm:hidden">
        {group.tokens.map((t) => (
          <li key={t.name} className="grid gap-2.5 border-b border-neutral-200/70 px-4 py-3.5 last:border-0 dark:border-neutral-800/70">
            <span className="font-sk-mono text-xs font-medium">--sk-{t.name}</span>
            {group.kind !== "shadow" && (
              <div className="grid grid-cols-2 gap-3">
                <Value mode="light" name={t.name} kind={group.kind} value={valueOf("light", t.name)} />
                {both && <Value mode="dark" name={t.name} kind={group.kind} value={valueOf("dark", t.name)} />}
              </div>
            )}
            <p className="text-[13px] text-neutral-500 dark:text-neutral-400">{t.use}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

const SCALE = [...STOPS.map(String), "deep", "2", "3"];

/** The eleven shades, the near-black and the two close neighbours, the same in both modes. */
function Scale() {
  const values = useValues();
  return (
    <Panel>
      <ul className="grid grid-cols-7 gap-x-2 gap-y-4 p-4 sm:grid-cols-14">
        {SCALE.map((s) => (
          <li key={s} className="grid justify-items-center gap-1.5">
            <span
              aria-hidden="true"
              className="aspect-square w-full max-w-10 rounded-lg inset-ring inset-ring-sk-hairline"
              style={{ backgroundColor: `var(--sk-hue-${s})` }}
            />
            <span className={mono} title={values.light[`hue-${s}`]}>
              {s}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export default function Tokens() {
  const values = useValues();
  return (
    <DocPage path="/docs/tokens">
      <div className="mt-10 grid gap-4">
        <P>
          Every token is a CSS variable named <C>--sk-*</C>. Colours are also Tailwind colours, so <C>--sk-muted</C> becomes <C>text-sk-muted</C>,{" "}
          <C>bg-sk-muted</C> and the rest. Hue values below show {values.name}, the colour you picked.
        </P>
      </div>
      {groups.map((g) => (
        <Section key={g.id} id={g.id} title={g.title}>
          <P>{g.intro}</P>
          {g.id === "accent" && <Scale />}
          {g.kind === "shadow" && <ShadowShowcase tokens={g.tokens} />}
          <TokenTable group={g} />
        </Section>
      ))}
    </DocPage>
  );
}
