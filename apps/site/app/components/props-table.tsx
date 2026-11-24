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

/** Every prop of a component: a table on wide screens, a list on phones. */
export function PropsTable({ spec }: { spec: ComponentSpec }) {
  const props = spec.props;
  return (
    <div className="overflow-hidden rounded-2xl border border-sk-border bg-sk-surface">
      <table className="hidden w-full table-fixed text-left sm:table">
        <colgroup>
          <col className="w-[20%]" />
          <col className="w-[28%]" />
          <col className="w-[18%]" />
          <col />
        </colgroup>
        <thead className="bg-sk-well/60 dark:bg-white/[0.02]">
          <tr className="border-b border-sk-border font-sk-mono text-[12.5px] text-sk-muted">
            <th scope="col" className="px-5 py-3 font-normal">Prop</th>
            <th scope="col" className="px-5 py-3 font-normal">Type</th>
            <th scope="col" className="px-5 py-3 font-normal">Default</th>
            <th scope="col" className="px-5 py-3 font-normal">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-b border-sk-border align-top last:border-0">
              <td className="px-5 py-4 font-sk-mono text-[13px] text-sk-ink">{p.name}</td>
              <td className="px-5 py-4 font-sk-mono text-[13px] break-words text-sk-muted">{typeOf(p)}</td>
              <td className="px-5 py-4 font-sk-mono text-[13px] break-words text-sk-muted">{defaultOf(p) ?? "None"}</td>
              <td className="px-5 py-4 text-[14px]/6 text-sk-muted">{p.description ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="sm:hidden">
        {props.map((p) => (
          <li key={p.name} className="grid gap-1.5 border-b border-sk-border px-5 py-4 last:border-0">
            <div className="flex items-baseline justify-between gap-3">
              <code className="font-sk-mono text-[13px] text-sk-ink">{p.name}</code>
              <span className="font-sk-mono text-[12px] text-sk-muted">{defaultOf(p) ?? "None"}</span>
            </div>
            <code className="font-sk-mono text-[12px] break-words text-sk-muted">{typeOf(p)}</code>
            {p.description && <p className="text-[14px]/6 text-sk-muted">{p.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
