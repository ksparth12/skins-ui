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
 * Depth: the card falls from a deep shade of your colour into a near-black shade of the same hue, with
 * a soft light of the same family from above, a fine light along the top edge and a darker rim. It is
 * dark in both themes, so white text always reads. Shadows stay neutral.
 */
// Every part reads its padding, gap and type sizes from these, so a size changes the whole card at once.
const SIZES: Record<Size, string> = {
  sm: "[--card-pad:1rem] [--card-gap:0.75rem] [--card-title:0.9375rem] [--card-text:0.8125rem]",
  md: "[--card-pad:1.25rem] [--card-gap:1rem] [--card-title:1.0625rem] [--card-text:0.875rem]",
  lg: "[--card-pad:1.75rem] [--card-gap:1.25rem] [--card-title:1.25rem] [--card-text:0.9375rem]",
};

const ROOT =
  "group/card relative isolate block " +
  "overflow-hidden rounded-[22px] bg-linear-to-b from-sk-hue-800 to-sk-hue-deep text-white ring-1 " +
  "ring-sk-hue-950/40 inset-shadow-[0_1px_0_0] inset-shadow-white/15 shadow-[0_1px_2px_0,0_24px_48px_-20px] " +
  "shadow-black/35 dark:shadow-black/70 before:pointer-events-none before:absolute before:inset-0 " +
  "before:-z-10 before:bg-radial-[ellipse_90%_55%_at_50%_0%] before:from-sk-hue-500/30 " +
  "before:to-transparent before:transition-opacity before:duration-(--sk-motion-base) before:ease-sk-out";

// Only a card with href gets these: the pointer, and the change under it.
const LINK =
  "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring " +
  "before:opacity-80 hover:before:opacity-100";

const BODY = "flex flex-col gap-(--card-gap) py-(--card-pad)";

const MEDIA =
  "relative mx-2 aspect-[16/10] overflow-hidden rounded-[14px] first:mt-[calc(0.5rem-var(--card-pad))] " +
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:inset-ring " +
  "after:inset-ring-white/10";

const TITLE =
  "font-sk-display text-(length:--card-title)/snug font-semibold tracking-tight text-white";

const MUTED = "text-white/72";

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
