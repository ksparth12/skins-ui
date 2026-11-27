import type { ComponentPropsWithRef } from "react";

export interface NavItem {
  label: string;
  href: string;
}

export type NavbarProps = Omit<ComponentPropsWithRef<"header">, "children"> & {
  /** The site name at the start of the bar. It links home. */
  brand?: string;
  /** The main pages, each with a label and an href. Shown from 640 pixels wide. */
  items?: NavItem[];
  /** The label of the current page. */
  active?: string;
  /** The label of the main action. Leave it empty for none. */
  action?: string;
  /** Where the main action goes. */
  actionHref?: string;
};

/*
 * Brutal: a floating block with square corners, a thick ink outline and a hard shadow in ink. Links are
 * bold capitals; the current page is a tinted block with its own outline. The action presses flat into
 * its shadow.
 */
const BAR =
  "relative mx-3 mt-3 flex h-14 items-center gap-5 border-2 border-sk-ink bg-sk-surface pr-2 pl-4 " +
  "text-sk-ink shadow-[5px_5px_0_0_var(--sk-ink)]";

const BRAND =
  "shrink-0 font-sk-display text-lg font-black tracking-tight uppercase focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

const LINK =
  "flex h-9 items-center border-2 border-transparent px-2.5 text-xs font-bold tracking-wider uppercase " +
  "transition-colors duration-(--sk-motion-fast) ease-sk-out hover:border-sk-ink focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

// The current page: a neutral tint, never the accent, so the one coloured thing is the action.
const CURRENT =
  "border-sk-ink bg-sk-hue-100 text-black dark:bg-sk-hue-200";

const ACTION =
  "inline-flex h-10 shrink-0 items-center border-2 border-sk-ink bg-sk-accent px-4 text-xs font-bold " +
  "tracking-wider text-sk-accent-fg uppercase shadow-[3px_3px_0_0_var(--sk-ink)] " +
  "transition-[translate,box-shadow,background-color] duration-(--sk-motion-fast) ease-sk-out " +
  "hover:bg-sk-accent-hover active:translate-x-[3px] active:translate-y-[3px] " +
  "active:shadow-[0_0_0_0_var(--sk-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-sk-ring";

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

export function Navbar({ brand, items = [], active, action, actionHref = "#", className, ...rest }: NavbarProps) {
  const row = (
    <>
      <a href="/" className={BRAND}>
        {brand}
      </a>
      <nav aria-label="Main" className="hidden min-w-0 flex-1 sm:block">
        <ul className="flex items-center gap-1">
          {items.map((item) => {
            const current = item.label === active;
            return (
              <li key={item.href + item.label}>
                <a href={item.href} aria-current={current ? "page" : undefined} className={join(LINK, current && CURRENT)}>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      {action && (
        <a href={actionHref} className={join(ACTION, "ml-auto sm:ml-0")}>
          {action}
        </a>
      )}
    </>
  );
  return (
    <header {...rest} className={join(BAR, className)}>
      {row}
    </header>
  );
}
