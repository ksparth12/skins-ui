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

/* Minimal: just words. The current page is marked by a short line under it. */
export function Navbar({ brand, items = [], active, action, actionHref = "#", className, ...rest }: NavbarProps) {
  return (
    <header className={join("w-full", className)} {...rest}>
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-8 px-5">
        <span className="font-sk-display text-lg font-semibold text-sk-ink">{brand}</span>
        <nav aria-label="Main" className="flex min-w-0 items-center gap-6 overflow-x-auto">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.label === active ? "page" : undefined}
              className={join(
                "relative py-2 text-sm font-medium text-sk-muted transition-colors duration-100 hover:text-sk-ink",
                "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-sk-ink after:transition-transform after:duration-200 after:ease-out",
                "aria-[current=page]:text-sk-ink aria-[current=page]:after:scale-x-100 rounded-sm",
                focus,
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
        {action && (
          <a href={actionHref} className={join("ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-sm text-sm font-semibold text-sk-link", focus)}>
            {action}
            <span aria-hidden="true">&rarr;</span>
          </a>
        )}
      </div>
    </header>
  );
}
