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
 * Pixel: letters in a pixel font, in your colour, with two hard shadows stepping back into deeper shades
 * of it, like a sign cut from layered plastic. The font is read from --sk-skin-font and falls back to
 * monospace.
 */
const FONT =
  "[--sk-skin-font:'Geist_Pixel',var(--sk-font-mono)] font-[family-name:var(--sk-skin-font)] font-normal " +
  "text-balance text-sk-accent " +
  "[text-shadow:0.05em_0.05em_0_var(--sk-hue-800),0.1em_0.1em_0_var(--sk-hue-950)] dark:text-sk-hue-400 " +
  "dark:[text-shadow:0.05em_0.05em_0_var(--sk-hue-700),0.1em_0.1em_0_var(--sk-hue-900)]";

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
