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
 * Depth: each line falls from your colour into a deep shade of the same hue, top to bottom, with no
 * second colour anywhere. In dark mode it falls from a light shade to your colour so it still reads.
 */
const FONT =
  "font-sk-display font-semibold tracking-tight text-balance";

// The material sits on an inline span, so each line of a wrapped heading gets the whole effect.
const INK =
  "bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-box-decoration-break:clone] " +
  "[box-decoration-break:clone] bg-linear-to-b from-sk-hue-500 via-sk-hue-700 to-sk-hue-950 " +
  "dark:from-sk-hue-100 dark:via-sk-hue-300 dark:to-sk-hue-600";

export function Text({ as, size, className, children, ...rest }: TextProps) {
  const Tag = pick(as, ["h1", "h2", "h3", "p", "span"], "h2");
  return (
    <Tag {...rest} className={join(FONT, SIZES[pick(size, ["md", "lg", "xl"], "lg")], className)}>
      <span className={INK}>{children}</span>
    </Tag>
  );
}
