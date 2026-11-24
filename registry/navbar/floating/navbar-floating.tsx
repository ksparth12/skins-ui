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

/* Floating: a frosted pill that hovers over the page, lit from above. */
export function Navbar({ brand, items = [], active, action, actionHref = "#", className, ...rest }: NavbarProps) {
  return (
    <header className={join("flex w-full justify-center p-4", className)} {...rest}>
      <div
        className={join(
          "flex h-12 max-w-full items-center gap-4 rounded-full pr-1.5 pl-5 backdrop-blur-2xl backdrop-saturate-150",
          "bg-white/55 inset-ring inset-ring-white/70 inset-shadow-[0_1px_0_0] inset-shadow-white shadow-[0_2px_4px_0,0_12px_32px_-8px] shadow-black/15",
          "dark:bg-white/8 dark:inset-ring-white/12 dark:inset-shadow-white/15 dark:shadow-black/50",
        )}
      >
        <span className="font-sk-display text-[15px] font-semibold text-sk-ink">{brand}</span>
        <nav aria-label="Main" className="flex min-w-0 items-center overflow-x-auto">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.label === active ? "page" : undefined}
              className={join(
                "inline-flex h-8 items-center rounded-full px-3 text-[13px] font-medium text-sk-ink/65 transition-colors duration-100 hover:text-sk-ink",
                "aria-[current=page]:bg-white/60 aria-[current=page]:text-sk-ink dark:aria-[current=page]:bg-white/12",
                focus,
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
        {action && (
          <a href={actionHref} className={join("inline-flex h-9 shrink-0 items-center rounded-full bg-sk-accent px-4 text-[13px] font-semibold text-sk-accent-fg transition-colors duration-100 hover:bg-sk-accent-hover", focus)}>
            {action}
          </a>
        )}
      </div>
    </header>
  );
}
