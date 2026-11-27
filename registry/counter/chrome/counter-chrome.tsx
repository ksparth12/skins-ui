import { motion, type Transition } from "motion/react";
import type { ComponentPropsWithRef } from "react";

type Size = "md" | "lg" | "xl";

export type CounterProps = Omit<ComponentPropsWithRef<"span">, "children"> & {
  /** The number to show. Each digit rolls when it changes. */
  value?: number;
  /** Text before the number, such as a currency sign. */
  prefix?: string;
  /** Text after the number, such as a unit. */
  suffix?: string;
  /** 32, 48 or 72 pixels. */
  size?: Size;
};

const SIZES: Record<Size, string> = { md: "text-[2rem]", lg: "text-5xl", xl: "text-7xl" };
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const FORMAT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

/*
 * Chrome: polished metal digits, the same metal as the Chrome text: soft bands of light with no hard line,
 * a fine edge under each digit and a soft drop. Graphite in light mode, bright silver in dark mode.
 */
const ROOT =
  "inline-flex items-center leading-none font-sk-display font-bold tabular-nums tracking-tight " +
  "[filter:drop-shadow(0_1px_0_white)_drop-shadow(0_6px_10px_color-mix(in_oklab,black_12%,transparent))] " +
  "dark:[filter:drop-shadow(0_1px_0_color-mix(in_oklab,black_90%,transparent))_drop-shadow(0_6px_10px_color-mix(in_oklab,black_50%,transparent))]";

// Each digit sits in its own cell, with a window a little over one line tall that the column of digits rolls behind.
const CELL =
  "relative inline-block";

const GLYPH =
  "bg-clip-text text-transparent [-webkit-background-clip:text] " +
  "bg-[image:linear-gradient(180deg,color-mix(in_oklab,white_37%,black)_14%,color-mix(in_oklab,white_53%,black)_36%,color-mix(in_oklab,white_13%,black)_52%,color-mix(in_oklab,white_37%,black)_66%,color-mix(in_oklab,white_20%,black)_80%,color-mix(in_oklab,white_44%,black)_94%)] " +
  "dark:bg-[image:linear-gradient(180deg,white_14%,color-mix(in_oklab,white_97%,black)_36%,color-mix(in_oklab,white_65%,black)_52%,color-mix(in_oklab,white_88%,black)_66%,color-mix(in_oklab,white_58%,black)_80%,color-mix(in_oklab,white_92%,black)_94%)]";

// Signs, separators, the prefix and the suffix: they do not roll.
const MARK =
  "leading-[1.15] bg-clip-text text-transparent [-webkit-background-clip:text] " +
  "bg-[image:linear-gradient(180deg,color-mix(in_oklab,white_37%,black)_14%,color-mix(in_oklab,white_53%,black)_36%,color-mix(in_oklab,white_13%,black)_52%,color-mix(in_oklab,white_37%,black)_66%,color-mix(in_oklab,white_20%,black)_80%,color-mix(in_oklab,white_44%,black)_94%)] " +
  "dark:bg-[image:linear-gradient(180deg,white_14%,color-mix(in_oklab,white_97%,black)_36%,color-mix(in_oklab,white_65%,black)_52%,color-mix(in_oklab,white_88%,black)_66%,color-mix(in_oklab,white_58%,black)_80%,color-mix(in_oklab,white_92%,black)_94%)]";

const ROLL: Transition = { type: "spring", duration: 0.7, bounce: 0 };

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

const pick = <T extends string>(value: T | undefined, allowed: readonly T[], fallback: T): T =>
  value && allowed.includes(value) ? value : fallback;

function Digit({ digit }: { digit: number }) {
  return (
    <span className={CELL}>
      <span className="relative block h-[1.15em] overflow-hidden">
        {/* The first value shows without rolling; only later changes move. */}
        <motion.span className="flex flex-col" initial={false} animate={{ y: `${-digit * 10}%` }} transition={ROLL}>
          {DIGITS.map((n) => (
            <span key={n} className={join("block h-[1.15em] text-center leading-[1.15]", GLYPH)}>
              {n}
            </span>
          ))}
        </motion.span>
      </span>
    </span>
  );
}

export function Counter({ value = 0, prefix, suffix, size, className, ...rest }: CounterProps) {
  const text = FORMAT.format(value);
  const chars = text.split("");
  return (
    <span {...rest} className={join(ROOT, SIZES[pick(size, ["md", "lg", "xl"], "lg")], className)}>
      <span className="sr-only">
        {prefix}
        {text}
        {suffix}
      </span>
      <span aria-hidden="true" className="inline-flex items-center">
        {prefix && <span className={MARK}>{prefix}</span>}
        {chars.map((c, i) => {
          // Keyed from the right, so a new leading digit never makes the others jump.
          const place = chars.length - i;
          return /\d/.test(c) ? <Digit key={`d${place}`} digit={Number(c)} /> : <span key={`m${place}`} className={MARK}>{c}</span>;
        })}
        {suffix && <span className={join(MARK, "ml-[0.12em]")}>{suffix}</span>}
      </span>
    </span>
  );
}
