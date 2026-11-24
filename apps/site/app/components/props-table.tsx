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

/** Every prop of a component: a table on wide screens, a list on phones. */
export function PropsTable({ spec }: { spec: ComponentSpec }) {
  const props = spec.props;
  return (
    <Panel>
      <table className="hidden w-full table-fixed text-left sm:table">
        <colgroup>
          <col className="w-[20%]" />
          <col className="w-[26%]" />
          <col className="w-[18%]" />
          <col />
        </colgroup>
        <thead>
          <tr className="border-b border-neutral-200/70 font-sk-mono text-xs text-neutral-500 dark:border-neutral-800/70 dark:text-neutral-400">
            <th scope="col" className="px-4 py-2 font-medium">Prop</th>
            <th scope="col" className="px-4 py-2 font-medium">Type</th>
            <th scope="col" className="px-4 py-2 font-medium">Default</th>
            <th scope="col" className="px-4 py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-b border-neutral-200/70 last:border-0 dark:border-neutral-800/70">
              <td className={cell}>{p.name}</td>
              <td className={`${cell} font-sk-mono text-xs font-normal text-neutral-500 dark:text-neutral-400`}>{typeOf(p)}</td>
              <td className={`${cell} font-sk-mono text-xs font-normal text-neutral-500 dark:text-neutral-400`}>{defaultOf(p) ?? "None"}</td>
              <td className={`${cell} font-normal text-neutral-500 dark:text-neutral-400`}>{p.description ?? ""}</td>
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
