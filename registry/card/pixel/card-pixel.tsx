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
 * Pixel: notched corners, a stepped bevel along the bottom and a pixel font for the title. The notches
 * come from four flat shadows, one per side, so the corners stay open without clipping the focus ring.
 * A link card presses down one step. The font is read from --sk-skin-font and falls back to monospace.
 */
// Every part reads its padding, gap and type sizes from these, so a size changes the whole card at once.
const SIZES: Record<Size, string> = {
  sm: "[--card-pad:1rem] [--card-gap:0.75rem] [--card-title:0.9375rem] [--card-text:0.8125rem]",
  md: "[--card-pad:1.25rem] [--card-gap:1rem] [--card-title:1.0625rem] [--card-text:0.875rem]",
  lg: "[--card-pad:1.75rem] [--card-gap:1.25rem] [--card-title:1.25rem] [--card-text:0.9375rem]",
};

const ROOT =
  "group/card relative isolate block " +
  "bg-sk-surface text-sk-ink shadow-[0_-4px_0_0,0_4px_0_0,-4px_0_0_0,4px_0_0_0] shadow-sk-ink " +
  "inset-shadow-[0_-4px_0_0] inset-shadow-black/12 dark:inset-shadow-black/45 " +
  "transition-[background-color,translate] duration-(--sk-motion-fast) ease-[steps(2)]";

// Only a card with href gets these: the pointer, and the change under it.
const LINK =
  "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring " +
  "hover:bg-sk-well active:translate-y-1";

const BODY = "flex flex-col gap-(--card-gap) py-(--card-pad)";

const MEDIA =
  "relative aspect-[16/10] overflow-hidden border-b-4 border-sk-ink bg-sk-well first:-mt-(--card-pad)";

const TITLE =
  "[--sk-skin-font:'Geist_Pixel',var(--sk-font-mono)] font-[family-name:var(--sk-skin-font)] " +
  "text-(length:--card-title)/snug font-normal text-sk-ink";

const MUTED = "text-sk-muted";

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
