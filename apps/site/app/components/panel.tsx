import type { ReactNode } from "react";

/**
 * The site's one container: a soft shell with a slim header row, holding an inner card.
 * Light: a pale grey shell around a white card. Dark: a faint shell around a black card.
 */
export function Panel({ header, children, className = "", innerClassName = "" }: { header?: ReactNode; children: ReactNode; className?: string; innerClassName?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[10px] bg-neutral-200/50 pt-0.5 shadow-[inset_0_1px_0_0_rgb(225_225_225),inset_0_2px_0_0_rgb(255_255_255)] dark:bg-neutral-900/60 dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.125)] ${className}`}
    >
      {header && <div className="relative z-20 flex min-h-8 items-center justify-between gap-3 px-2 py-0.5">{header}</div>}
      <div className={`relative isolate overflow-hidden rounded-[10px] bg-white [clip-path:inset(0_round_10px)] after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-[10px] after:inset-ring after:inset-ring-neutral-200 dark:bg-black dark:after:inset-ring-0 ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}

/** A label in a panel header: small, quiet, with an optional icon. */
export function PanelLabel({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className="flex h-7 min-w-0 items-center gap-1.5 px-2 text-neutral-500 dark:text-neutral-400">
      {icon}
      <span className="truncate text-xs">{children}</span>
    </span>
  );
}
