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
 * Neumorph: soft and pushed out of the page. Light comes from the upper left: the face curves from lit
 * to shaded, a thin bright rim catches the top-left edge and a soft shade falls to the lower right. The
 * picture sits in a well pressed into the face. A link card sinks in while pressed. Shadows are only
 * white and black.
 */
// Every part reads its padding, gap and type sizes from these, so a size changes the whole card at once.
const SIZES: Record<Size, string> = {
  sm: "[--card-pad:1rem] [--card-gap:0.75rem] [--card-title:0.9375rem] [--card-text:0.8125rem]",
  md: "[--card-pad:1.25rem] [--card-gap:1rem] [--card-title:1.0625rem] [--card-text:0.875rem]",
  lg: "[--card-pad:1.75rem] [--card-gap:1.25rem] [--card-title:1.25rem] [--card-text:0.9375rem]",
};

const ROOT =
  "group/card relative isolate block " +
  "rounded-[26px] bg-sk-surface text-sk-ink [--nm-a:transparent] " +
  "[--nm-b:color-mix(in_oklab,black_6%,transparent)] [--nm-rim:white] " +
  "[--nm-lit:color-mix(in_oklab,white_90%,transparent)] " +
  "[--nm-shade:color-mix(in_oklab,black_17%,transparent)] " +
  "[--nm-edge:color-mix(in_oklab,black_6%,transparent)] " +
  "bg-[image:linear-gradient(145deg,var(--nm-a),var(--nm-b))] " +
  "[box-shadow:inset_1px_1px_0_var(--nm-rim),inset_-1px_-1px_0_var(--nm-edge),-8px_-8px_20px_var(--nm-lit),12px_12px_30px_var(--nm-shade)] " +
  "transition-[box-shadow] duration-(--sk-motion-base) ease-sk-out dark:bg-sk-surface " +
  "dark:[--nm-a:color-mix(in_oklab,white_9%,transparent)] " +
  "dark:[--nm-b:color-mix(in_oklab,black_35%,transparent)] " +
  "dark:[--nm-rim:color-mix(in_oklab,white_13%,transparent)] " +
  "dark:[--nm-lit:color-mix(in_oklab,white_4%,transparent)] " +
  "dark:[--nm-shade:color-mix(in_oklab,black_90%,transparent)] " +
  "dark:[--nm-edge:color-mix(in_oklab,black_70%,transparent)]";

// Only a card with href gets these: the pointer, and the change under it.
const LINK =
  "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring " +
  "active:[box-shadow:inset_4px_4px_10px_var(--nm-shade),inset_-3px_-3px_8px_var(--nm-rim)]";

const BODY = "flex flex-col gap-(--card-gap) py-(--card-pad)";

const MEDIA =
  "relative mx-3 aspect-[16/10] overflow-hidden rounded-[17px] p-1.5 " +
  "first:mt-[calc(0.75rem-var(--card-pad))] " +
  "[box-shadow:inset_3px_3px_8px_var(--nm-shade),inset_-3px_-3px_8px_var(--nm-lit)] [&>img]:rounded-[11px]";

const TITLE =
  "font-sk-display text-(length:--card-title)/snug font-semibold tracking-tight text-sk-ink";

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
