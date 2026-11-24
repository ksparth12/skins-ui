import { Panel } from "~/components/panel";
import type { ComponentSpec, PropSpec } from "~/lib/registry";

function typeOf(p: PropSpec): string {
  if (p.type === "enum") return (p.options ?? []).map((o) => `"${o}"`).join(" | ");
  if (p.type === "node") return "ReactNode";
  if (p.type === "data") return "array";
  return p.type;
}

function defaultOf(p: PropSpec): string | null {
  if (p.default === undefined || p.default === "" || p.type === "data") return null;
  return typeof p.default === "string" ? `"${p.default}"` : String(p.default);
}

const cell = "px-4 py-3 align-top text-[13px] font-medium break-words text-neutral-950/90 dark:text-white/90";
const muted = "font-normal text-neutral-500 dark:text-neutral-400";
/** One column layout shared by the header strip and the rows, so they always line up. */
const COLUMNS = ["Prop", "Type", "Default", "Description"] as const;
const WIDTHS = ["w-[20%]", "w-[26%]", "w-[18%]", ""];

/** Every prop of a component. Column headings sit in the panel's header strip; the rows sit on the card. */
export function PropsTable({ spec }: { spec: ComponentSpec }) {
  const props = spec.props;
  return (
    <Panel
      header={
        <div aria-hidden="true" className="-mx-1.5 hidden w-[calc(100%+0.75rem)] sm:flex">
          {COLUMNS.map((c, i) => (
            <span key={c} className={`${WIDTHS[i] || "flex-1"} px-4 py-1.5 font-sk-mono text-xs text-neutral-500 dark:text-neutral-400`}>{c}</span>
          ))}
        </div>
      }
    >
      <table className="hidden w-full table-fixed text-left sm:table">
        <colgroup>
          {WIDTHS.map((w, i) => <col key={i} className={w} />)}
        </colgroup>
        <thead className="sr-only">
          <tr>
            {COLUMNS.map((c) => <th key={c} scope="col">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-b border-neutral-200/70 last:border-0 dark:border-neutral-800/70">
              <td className={cell}>{p.name}</td>
              <td className={`${cell} ${muted} font-sk-mono text-xs`}>{typeOf(p)}</td>
              <td className={`${cell} ${muted} font-sk-mono text-xs`}>{defaultOf(p) ?? "None"}</td>
              <td className={`${cell} ${muted}`}>{p.description ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="sm:hidden">
        {props.map((p) => (
          <li key={p.name} className="grid gap-1.5 border-b border-neutral-200/70 px-4 py-3.5 last:border-0 dark:border-neutral-800/70">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] font-medium">{p.name}</span>
              <span className="font-sk-mono text-xs text-neutral-500 dark:text-neutral-400">{defaultOf(p) ?? "None"}</span>
            </div>
            <code className="font-sk-mono text-xs break-words text-neutral-500 dark:text-neutral-400">{typeOf(p)}</code>
            {p.description && <p className="text-[13px] text-neutral-500 dark:text-neutral-400">{p.description}</p>}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
