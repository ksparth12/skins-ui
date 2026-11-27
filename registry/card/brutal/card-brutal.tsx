import type { ComponentPropsWithRef } from "react";

type Size = "sm" | "md" | "lg";

export type CardProps = ComponentPropsWithRef<"div"> & {
  /** Padding of 16, 20 or 28 pixels, with type and gaps to match. */
  size?: Size;
  /** Makes the whole card a link. Use it only when the card holds no other buttons or links. */
  href?: string;
};

export type CardMediaProps = ComponentPropsWithRef<"div"> & {
  /** The picture. Leave it out to put your own children in the frame. */
  src?: string;
  /** Describes the picture. Use an empty string when it is only decoration. */
  alt?: string;
};

/*
 * Brutal: square corners, a thick ink outline and a big hard shadow in ink. The title is bold and set in
 * capitals. A link card tints its fill under the pointer, and pressing pushes the card flat into its
 * shadow.
 */
// Every part reads its padding, gap and type sizes from these, so a size changes the whole card at once.
const SIZES: Record<Size, string> = {
  sm: "[--card-pad:1rem] [--card-gap:0.75rem] [--card-title:0.9375rem] [--card-text:0.8125rem]",
  md: "[--card-pad:1.25rem] [--card-gap:1rem] [--card-title:1.0625rem] [--card-text:0.875rem]",
  lg: "[--card-pad:1.75rem] [--card-gap:1.25rem] [--card-title:1.25rem] [--card-text:0.9375rem]",
};

const ROOT =
  "group/card relative isolate block " +
  "border-2 border-sk-ink bg-sk-surface text-sk-ink shadow-[6px_6px_0_0_var(--sk-ink)] " +
  "transition-[background-color,translate,box-shadow] duration-(--sk-motion-fast) ease-sk-out";

// Only a card with href gets these: the pointer, and the change under it.
const LINK =
  "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring " +
  "hover:bg-sk-hue-50 active:translate-x-1.5 active:translate-y-1.5 active:shadow-[0_0_0_0_var(--sk-ink)] " +
  "dark:hover:bg-sk-raised";

const BODY = "flex flex-col gap-(--card-gap) py-(--card-pad)";

const MEDIA =
  "relative aspect-[16/10] overflow-hidden border-b-2 border-sk-ink bg-sk-hue-100 first:-mt-(--card-pad)";

const TITLE =
  "font-sk-display text-(length:--card-title)/tight font-bold tracking-wide uppercase text-sk-ink";

const MUTED = "text-sk-ink/75";

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

const pick = <T extends string>(value: T | undefined, allowed: readonly T[], fallback: T): T =>
  value && allowed.includes(value) ? value : fallback;

export function Card({ size, href, className, children, ...rest }: CardProps) {
  const classes = join(ROOT, BODY, SIZES[pick(size, ["sm", "md", "lg"], "md")], href !== undefined && LINK, className);
  const body = children;
  if (href !== undefined) {
    return (
      <a {...(rest as ComponentPropsWithRef<"a">)} href={href} className={classes}>
        {body}
      </a>
    );
  }
  return (
    <div {...rest} className={classes}>
      {body}
    </div>
  );
}

export function CardMedia({ src, alt = "", className, children, ...rest }: CardMediaProps) {
  return (
    <div {...rest} className={join(MEDIA, className)}>
      {src ? <img src={src} alt={alt} className="size-full object-cover" /> : children}
    </div>
  );
}

export function CardHeader({ className, ...rest }: ComponentPropsWithRef<"div">) {
  return <div {...rest} className={join("grid gap-1.5 px-(--card-pad)", className)} />;
}

export function CardTitle({ className, ...rest }: ComponentPropsWithRef<"h3">) {
  return <h3 {...rest} className={join(TITLE, "text-balance", className)} />;
}

export function CardDescription({ className, ...rest }: ComponentPropsWithRef<"p">) {
  return <p {...rest} className={join("text-(length:--card-text)/relaxed text-pretty", MUTED, className)} />;
}

export function CardContent({ className, ...rest }: ComponentPropsWithRef<"div">) {
  return <div {...rest} className={join("px-(--card-pad) text-(length:--card-text)", className)} />;
}

export function CardFooter({ className, ...rest }: ComponentPropsWithRef<"div">) {
  return <div {...rest} className={join("flex flex-wrap items-center gap-3 px-(--card-pad) text-(length:--card-text)", MUTED, className)} />;
}
