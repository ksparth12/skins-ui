import type { ComponentPropsWithRef } from "react";

type As = "h1" | "h2" | "h3" | "p" | "span";
type Size = "md" | "lg" | "xl";

export type TextProps = ComponentPropsWithRef<"h2"> & {
  /** The element it renders, so the outline of the page stays right. */
  as?: As;
  /** 32, 48 or 72 pixels. */
  size?: Size;
};

const SIZES: Record<Size, string> = {
  md: "text-[2rem]/[1.15]",
  lg: "text-5xl/[1.1]",
  xl: "text-7xl/[1.05]",
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

const pick = <T extends string>(value: T | undefined, allowed: readonly T[], fallback: T): T =>
  value && allowed.includes(value) ? value : fallback;

/*
 * Letterpress: letters pressed into the page. A soft shade sits along the top of each stroke and light
 * catches the lower edge, so the type reads as cut in rather than printed on. Best on a plain surface.
 */
const FONT =
  "font-sk-display font-semibold tracking-tight text-balance text-sk-ink/80 " +
  "[text-shadow:0_1px_0_color-mix(in_oklab,white_90%,transparent),0_-1px_0_color-mix(in_oklab,black_22%,transparent)] " +
  "dark:text-sk-ink/75 dark:[text-shadow:0_-1px_0_black,0_1px_0_color-mix(in_oklab,white_10%,transparent)]";

// The material sits on an inline span, so each line of a wrapped heading gets the whole effect.
const INK =
  "";

export function Text({ as, size, className, children, ...rest }: TextProps) {
  const Tag = pick(as, ["h1", "h2", "h3", "p", "span"], "h2");
  return (
    <Tag {...rest} className={join(FONT, SIZES[pick(size, ["md", "lg", "xl"], "lg")], className)}>
      <span className={INK}>{children}</span>
    </Tag>
  );
}
