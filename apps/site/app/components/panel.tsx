import type { ReactNode } from "react";

/**
 * The site's one container: a plate with a thin edge and a slim header row, holding an inner card
 * inset on every side. Corners stay concentric: 14px outside, 4px gap, 10px inside.
 */
export function Panel({ header, children, className = "", innerClassName = "" }: { header?: ReactNode; children: ReactNode; className?: string; innerClassName?: string }) {
  return (
    <div className={`rounded-[14px] bg-neutral-100/80 p-1 ring-1 ring-neutral-200/80 dark:bg-neutral-900/50 dark:ring-white/[0.08] ${className}`}>
      {header && <div className="relative z-20 flex min-h-8 items-center justify-between gap-3 px-1.5 pb-1">{header}</div>}
      <div
        className={`relative isolate overflow-hidden rounded-[10px] bg-site-stage ring-1 ring-neutral-200/80 dark:ring-white/[0.08] ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}

/** A label in a panel header: small, quiet, with an optional icon. */
export function PanelLabel({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className="flex h-7 min-w-0 items-center gap-2 px-1.5 text-neutral-500 dark:text-neutral-400">
      {icon}
      <span className="truncate font-sk-mono text-xs">{children}</span>
    </span>
  );
}
