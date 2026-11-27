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
 * Chrome: polished metal letters. Each line is turned like a piece of steel, with soft bands of light
 * and shade running across it and no hard line anywhere. A fine edge under each letter gives the metal
 * its thickness, a soft drop lifts it off the page, and now and then a band of light slides across.
 * Bright silver in dark mode, graphite in light mode, so it reads on either.
 */
const FONT =
  "font-sk-display font-bold tracking-tight text-balance";

// The material sits on an inline span, so each line of a wrapped heading gets the whole effect.
const INK =
  "bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-box-decoration-break:clone] " +
  "[box-decoration-break:clone] bg-size-[250%_100%,100%_100%] " +
  "bg-[image:linear-gradient(105deg,transparent_42%,var(--chrome-band)_50%,transparent_58%),var(--chrome-metal)] " +
  "[filter:drop-shadow(0_1px_0_var(--chrome-edge))_drop-shadow(0_6px_10px_var(--chrome-drop))] " +
  "[--chrome-metal:linear-gradient(180deg,color-mix(in_oklab,white_37%,black)_14%,color-mix(in_oklab,white_53%,black)_36%,color-mix(in_oklab,white_13%,black)_52%,color-mix(in_oklab,white_37%,black)_66%,color-mix(in_oklab,white_20%,black)_80%,color-mix(in_oklab,white_44%,black)_94%)] " +
  "[--chrome-band:color-mix(in_oklab,white_35%,transparent)] [--chrome-edge:white] " +
  "[--chrome-drop:color-mix(in_oklab,black_12%,transparent)] " +
  "dark:[--chrome-metal:linear-gradient(180deg,white_14%,color-mix(in_oklab,white_97%,black)_36%,color-mix(in_oklab,white_65%,black)_52%,color-mix(in_oklab,white_88%,black)_66%,color-mix(in_oklab,white_58%,black)_80%,color-mix(in_oklab,white_92%,black)_94%)] " +
  "dark:[--chrome-band:color-mix(in_oklab,white_55%,transparent)] " +
  "dark:[--chrome-edge:color-mix(in_oklab,black_90%,transparent)] " +
  "dark:[--chrome-drop:color-mix(in_oklab,black_50%,transparent)]";

export function Text({ as, size, className, children, ...rest }: TextProps) {
  const Tag = pick(as, ["h1", "h2", "h3", "p", "span"], "h2");
  return (
    <Tag {...rest} className={join(FONT, SIZES[pick(size, ["md", "lg", "xl"], "lg")], className)}>
      <motion.span
        className={INK}
        // The light starts out of sight on the right and crosses slowly, then rests before the next pass.
        initial={{ backgroundPositionX: "100%" }}
        animate={{ backgroundPositionX: "0%" }}
        transition={{ duration: 3.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}
