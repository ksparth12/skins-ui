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

/** Every prop of a component: a table on wide screens, cards on phones. */
export function PropsTable({ spec }: { spec: ComponentSpec }) {
  const props = spec.props;
  return (
    <section aria-labelledby="props" className="rounded-2xl bg-sk-well p-1.5 inset-ring inset-ring-sk-hairline">
      <div className="flex items-baseline justify-between px-3.5 pt-2.5 pb-3">
        <h2 id="props" className="text-[15px]">Props</h2>
        <span className="text-[13px] text-sk-muted">
          {props.length} {props.length === 1 ? "prop" : "props"}
        </span>
      </div>

      <div className="hidden overflow-hidden rounded-xl bg-sk-surface shadow-sk-card sm:block">
        <table className="w-full table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[30%]" />
            <col className="w-[16%]" />
            <col />
          </colgroup>
          <thead>
            <tr className="border-b border-sk-hairline text-[12px] text-sk-muted">
              <th scope="col" className="px-4 py-2.5 font-semibold">Prop</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">Type</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">Default</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((p) => (
              <tr key={p.name} className="border-b border-sk-hairline align-top transition-colors duration-100 last:border-0 hover:bg-sk-hover">
                <td className="px-4 py-3">
                  <code className="font-sk-mono text-[12.5px] font-medium text-sk-ink">{p.name}</code>
                </td>
                <td className="px-4 py-3 font-sk-mono text-[12.5px] break-words text-sk-link">{typeOf(p)}</td>
                <td className="px-4 py-3 font-sk-mono text-[12.5px] text-sk-muted">{defaultOf(p) ?? "None"}</td>
                <td className="px-4 py-3 text-[13px]/5 text-sk-muted">{p.description ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid gap-1.5 sm:hidden">
        {props.map((p) => (
          <li key={p.name} className="grid gap-1.5 rounded-xl bg-sk-surface p-4 shadow-sk-card">
            <div className="flex items-baseline justify-between gap-3">
              <code className="font-sk-mono text-[13px] font-medium text-sk-ink">{p.name}</code>
              <span className="font-sk-mono text-[12px] text-sk-muted">{defaultOf(p) ?? "None"}</span>
            </div>
            <code className="font-sk-mono text-[12px] break-words text-sk-link">{typeOf(p)}</code>
            {p.description && <p className="text-[13px]/5 text-sk-muted">{p.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
