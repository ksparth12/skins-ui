import type { ComponentPropsWithRef, ReactNode } from "react";

export type CardProps = Omit<ComponentPropsWithRef<"article">, "title"> & {
  title?: ReactNode;
  description?: ReactNode;
  /** The label of the card's link. Leave empty for no link. */
  action?: string;
  href?: string;
  /** A picture area at the top. Pass an element to use your own picture. */
  media?: boolean | ReactNode;
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-3.5 transition-transform duration-150 ease-out group-hover/card:translate-x-0.5">
      <path d="M3.25 8h9.5M9 4.25 12.75 8 9 11.75" />
    </svg>
  );
}

/** The default picture: one hue falling into its deep shade. */
const PICTURE = "bg-[linear-gradient(in_oklch_165deg,var(--sk-hue-400),var(--sk-hue-700)_55%,var(--sk-hue-deep))]";

/* Layered: a tinted shell holding a raised panel, with the action resting in the shell below. */
const SHELL = "w-80 max-w-full rounded-[22px] bg-sk-well p-1.5 inset-ring inset-ring-sk-hairline";
const PANEL = "overflow-hidden rounded-2xl bg-sk-surface shadow-sk-card";
const MEDIA = "aspect-[16/9]";
const BODY = "grid gap-2 p-5";
const TITLE = "font-sk-display text-[17px]/6 font-semibold text-sk-ink";
const TEXT = "text-sm/6 text-sk-muted";
const LINK =
  "flex h-10 items-center justify-between rounded-xl px-3.5 text-sm font-semibold text-sk-ink transition-colors duration-100 hover:bg-sk-hover " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

export function Card({ title, description, action, href = "#", media = true, className, ...rest }: CardProps) {
  return (
    <article className={join(SHELL, "group/card", className)} {...rest}>
      <div className={PANEL}>
        {media && <div className={join(MEDIA, typeof media === "boolean" && PICTURE)}>{typeof media === "boolean" ? null : media}</div>}
        <div className={BODY}>
          {title && <h3 className={TITLE}>{title}</h3>}
          {description && <p className={TEXT}>{description}</p>}
        </div>
      </div>
      {action && (
        <a href={href} className={join(LINK, "mt-1.5")}>
          {action}
          <Arrow />
        </a>
      )}
    </article>
  );
}
