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
 * Glass: a frosted pill that floats a little below the top of the page and blurs whatever passes under
 * it. Light falls from above: a bright rim on top and a soft neutral shadow below. The current page is
 * a brighter pane inside the pill.
 */
const BAR =
  "relative mx-auto mt-3 flex h-14 w-[calc(100%-1.5rem)] max-w-3xl items-center gap-4 rounded-full " +
  "bg-white/45 pr-2 pl-5 text-sk-ink backdrop-blur-xl backdrop-saturate-150 inset-ring inset-ring-white/70 " +
  "inset-shadow-[0_1px_0_0] inset-shadow-white shadow-[0_1px_2px_0,0_16px_32px_-16px] shadow-black/25 " +
  "dark:bg-black/30 dark:inset-ring-white/16 dark:inset-shadow-white/30 dark:shadow-black/60";

const BRAND =
  "shrink-0 rounded-full font-sk-display text-[17px] font-semibold tracking-tight focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

const LINK =
  "flex h-9 items-center rounded-full px-3.5 text-sm font-medium text-sk-ink/70 transition-colors " +
  "duration-(--sk-motion-fast) ease-sk-out hover:bg-white/35 hover:text-sk-ink dark:hover:bg-white/10 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

// The current page: a neutral tint, never the accent, so the one coloured thing is the action.
const CURRENT =
  "bg-white/60 text-sk-ink inset-ring inset-ring-white/80 dark:bg-white/14 dark:inset-ring-white/12";

const ACTION =
  "inline-flex h-10 shrink-0 items-center rounded-full bg-sk-accent-hover/85 px-4 text-sm font-semibold " +
  "text-sk-accent-fg inset-ring inset-ring-white/25 inset-shadow-[0_1px_0_0] inset-shadow-white/50 " +
  "transition-[background-color,scale] duration-(--sk-motion-fast) ease-sk-out hover:bg-sk-accent-active/85 " +
  "active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

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
