import type { ReactNode } from "react";

/** Every section sits 56px below the one above it, with 20px between its heading and its content. */
export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-14 grid scroll-mt-20 grid-cols-1 gap-5">
      <h2 id={id} className="font-sk-sans text-2xl font-medium tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

/** One numbered step, joined to the next by a line. */
export function Step({ n, title, last, children }: { n: number; title: string; last?: boolean; children?: ReactNode }) {
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
