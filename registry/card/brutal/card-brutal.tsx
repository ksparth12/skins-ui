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

/* Brutal: an ink outline, a hard offset shadow and a bordered picture. */
const SHELL = "w-80 max-w-full overflow-hidden rounded-xl border-2 border-sk-ink bg-sk-surface shadow-[5px_5px_0_0] shadow-sk-ink";
const MEDIA = "aspect-[16/9] border-b-2 border-sk-ink";
const BODY = "grid gap-2 p-5";
const TITLE = "font-sk-display text-lg/6 font-bold text-sk-ink";
const TEXT = "text-sm/6 text-sk-ink/75";
const LINK =
  "mt-2 inline-flex w-fit items-center gap-1.5 rounded-md border-2 border-sk-ink bg-sk-accent px-3 py-1.5 text-sm font-bold text-sk-accent-fg " +
  "shadow-[2px_2px_0_0] shadow-sk-ink transition-[translate,box-shadow] duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sk-ring";

export function Card({ title, description, action, href = "#", media = true, className, ...rest }: CardProps) {
  return (
    <article className={join(SHELL, "group/card", className)} {...rest}>
      {media && <div className={join(MEDIA, typeof media === "boolean" && PICTURE)}>{typeof media === "boolean" ? null : media}</div>}
      <div className={BODY}>
        {title && <h3 className={TITLE}>{title}</h3>}
        {description && <p className={TEXT}>{description}</p>}
        {action && (
          <a href={href} className={LINK}>
            {action}
            <Arrow />
          </a>
        )}
      </div>
    </article>
  );
}
