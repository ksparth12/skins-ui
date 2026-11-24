import type { ComponentPropsWithRef, ReactNode } from "react";

export type NavItem = { label: string; href: string };

export type NavbarProps = ComponentPropsWithRef<"header"> & {
  brand?: ReactNode;
  items?: NavItem[];
  /** The label of the current page. */
  active?: string;
  /** The label of the main action. Leave empty for none. */
  action?: string;
  actionHref?: string;
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");
const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

/* Flat: a full width bar with a hairline under it. The current page sits on a soft tint. */
export function Navbar({ brand, items = [], active, action, actionHref = "#", className, ...rest }: NavbarProps) {
  return (
    <header className={join("w-full border-b border-sk-hairline bg-sk-floor/80 backdrop-blur-xl", className)} {...rest}>
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-5">
        <span className="font-sk-display text-base font-semibold text-sk-ink">{brand}</span>
        <nav aria-label="Main" className="flex min-w-0 items-center gap-0.5 overflow-x-auto">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.label === active ? "page" : undefined}
              className={join(
                "inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium text-sk-muted transition-colors duration-100 hover:text-sk-ink",
                "aria-[current=page]:bg-sk-menu-on aria-[current=page]:text-sk-ink",
                focus,
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
        {action && (
          <a href={actionHref} className={join("ml-auto inline-flex h-8 shrink-0 items-center rounded-md bg-sk-accent px-3 text-[13px] font-semibold text-sk-accent-fg transition-colors duration-100 hover:bg-sk-accent-hover", focus)}>
            {action}
          </a>
        )}
      </div>
    </header>
  );
}
