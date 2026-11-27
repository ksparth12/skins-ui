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
 * Clay: a soft, puffy body in a soft tint of your colour. A broad highlight sits on its upper left, a
 * shade gathers along the bottom edge inside and a soft shadow falls below. The picture is set inside
 * with rounder corners. A link card deepens its tint under the pointer and squeezes in a little when
 * pressed.
 */
// Every part reads its padding, gap and type sizes from these, so a size changes the whole card at once.
const SIZES: Record<Size, string> = {
  sm: "[--card-pad:1rem] [--card-gap:0.75rem] [--card-title:0.9375rem] [--card-text:0.8125rem]",
  md: "[--card-pad:1.25rem] [--card-gap:1rem] [--card-title:1.0625rem] [--card-text:0.875rem]",
  lg: "[--card-pad:1.75rem] [--card-gap:1.25rem] [--card-title:1.25rem] [--card-text:0.9375rem]",
};

const ROOT =
  "group/card relative isolate block " +
  "rounded-[28px] bg-sk-hue-100 text-sk-ink inset-shadow-[0_-8px_16px_0] inset-shadow-black/10 " +
  "shadow-[0_2px_4px_0,0_20px_40px_-14px] shadow-black/22 before:pointer-events-none before:absolute " +
  "before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-radial-[ellipse_at_25%_0%] " +
  "before:from-white/80 before:to-transparent before:to-55% transition-[background-color,scale] " +
  "duration-(--sk-motion-fast) ease-sk-out dark:bg-sk-hue-950 dark:inset-shadow-black/40 " +
  "dark:shadow-black/70 dark:before:from-white/10";

// Only a card with href gets these: the pointer, and the change under it.
const LINK =
  "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring " +
  "hover:bg-sk-hue-200 active:scale-[0.99] dark:hover:bg-sk-hue-900";

const BODY = "flex flex-col gap-(--card-gap) py-(--card-pad)";

const MEDIA =
  "relative mx-2.5 aspect-[16/10] overflow-hidden rounded-[20px] first:mt-[calc(0.625rem-var(--card-pad))] " +
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] " +
  "after:inset-shadow-[0_-4px_10px_0] after:inset-shadow-black/15";

const TITLE =
  "font-sk-display text-(length:--card-title)/snug font-semibold tracking-tight text-sk-ink";

const MUTED = "text-sk-ink/70 dark:text-sk-muted";

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
