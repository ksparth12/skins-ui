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
 * Edge: a floating bar set 4px inside a thin neutral plate, like the Edge card. The plate is a soft
 * tint with a hairline edge; the bar inside carries its own edge and a faint drop, and its corners are
 * 4px smaller so the two stay concentric.
 */
const BAR =
  "relative mx-auto mt-3 w-[calc(100%-1.5rem)] max-w-3xl rounded-[18px] bg-black/8 p-1 text-sk-ink " +
  "inset-ring inset-ring-black/10 dark:bg-white/6 dark:inset-ring-white/8";

// The bar itself, set inside the plate.
const INNER =
  "flex h-12 items-center gap-4 rounded-[14px] bg-sk-surface pr-1.5 pl-4 " +
  "[box-shadow:0_0_0_1px_color-mix(in_oklab,black_10%,transparent),0_1px_3px_color-mix(in_oklab,black_12%,transparent)] " +
  "dark:bg-sk-raised " +
  "dark:[box-shadow:inset_0_1px_0_color-mix(in_oklab,white_6%,transparent),0_1px_2px_color-mix(in_oklab,black_50%,transparent)]";

const BRAND =
  "shrink-0 rounded-md font-sk-display text-[17px] font-semibold tracking-tight focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

const LINK =
  "flex h-8 items-center rounded-[9px] px-3 text-sm font-medium text-sk-muted transition-colors " +
  "duration-(--sk-motion-fast) ease-sk-out hover:bg-sk-hover hover:text-sk-ink focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

// The current page: a neutral tint, never the accent, so the one coloured thing is the action.
const CURRENT =
  "bg-sk-menu-on text-sk-ink";

const ACTION =
  "inline-flex h-9 shrink-0 items-center rounded-[10px] bg-sk-accent px-3.5 text-[13px] font-semibold " +
  "text-sk-accent-fg inset-shadow-[0_1px_0_0] inset-shadow-white/20 transition-[background-color,scale] " +
  "duration-(--sk-motion-fast) ease-sk-out hover:bg-sk-accent-hover active:scale-[0.97] " +
  "active:bg-sk-accent-active focus-visible:outline-2 focus-visible:outline-offset-2 " +
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
      <div className={INNER}>{row}</div>
    </header>
  );
}
