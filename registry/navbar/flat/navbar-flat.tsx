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
 * Flat: a full-width bar on the page surface, slightly see-through with a blur so content passing
 * under it stays legible, and a hairline along the bottom. The current page sits on a neutral tint.
 */
const BAR =
  "relative flex h-14 w-full items-center gap-6 border-b border-sk-hairline bg-sk-surface/85 px-5 " +
  "text-sk-ink backdrop-blur-md";

const BRAND =
  "shrink-0 rounded-md font-sk-display text-[17px] font-semibold tracking-tight focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

const LINK =
  "flex h-8 items-center rounded-lg px-3 text-sm font-medium text-sk-muted transition-colors " +
  "duration-(--sk-motion-fast) ease-sk-out hover:bg-sk-hover hover:text-sk-ink focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

// The current page: a neutral tint, never the accent, so the one coloured thing is the action.
const CURRENT =
  "bg-sk-menu-on text-sk-ink";

const ACTION =
  "inline-flex h-8 shrink-0 items-center rounded-md bg-sk-accent px-3 text-[13px] font-semibold " +
  "text-sk-accent-fg shadow-xs transition-[background-color,scale] duration-(--sk-motion-fast) ease-sk-out " +
  "hover:bg-sk-accent-hover active:scale-[0.97] active:bg-sk-accent-active dark:shadow-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

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
