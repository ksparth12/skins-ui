import { motion } from "motion/react";
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
 * Sheen: plain ink, with a soft light in your colour passing through the letters now and then. Between
 * passes the text is exactly your ink, so it reads like any heading. Reduced motion keeps it still.
 */
const FONT =
  "font-sk-display font-semibold tracking-tight text-balance";

// The material sits on an inline span, so each line of a wrapped heading gets the whole effect.
const INK =
  "bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-box-decoration-break:clone] " +
  "[box-decoration-break:clone] bg-size-[250%_100%] " +
  "bg-[image:linear-gradient(105deg,var(--sk-ink)_40%,var(--sheen)_50%,var(--sk-ink)_60%)] " +
  "[--sheen:var(--sk-hue-500)] dark:[--sheen:var(--sk-hue-300)]";

export function Text({ as, size, className, children, ...rest }: TextProps) {
  const Tag = pick(as, ["h1", "h2", "h3", "p", "span"], "h2");
  return (
    <Tag {...rest} className={join(FONT, SIZES[pick(size, ["md", "lg", "xl"], "lg")], className)}>
      <motion.span
        className={INK}
        // The light starts out of sight on the right and crosses slowly, then rests before the next pass.
        initial={{ backgroundPositionX: "100%" }}
        animate={{ backgroundPositionX: "0%" }}
        transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.4 }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}
