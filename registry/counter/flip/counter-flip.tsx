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
 * Flip: each digit sits on its own tile, split across the middle by a fine line like the cards of a
 * flip board. The upper half of each tile catches a little more light than the lower. Tiles stay dark
 * in both themes.
 */
const ROOT =
  "inline-flex items-center gap-[0.08em] leading-none font-sk-display font-semibold tabular-nums " +
  "tracking-tight";

// Each digit sits in its own cell, with a window a little over one line tall that the column of digits rolls behind.
const CELL =
  "relative inline-block rounded-[0.14em] bg-sk-ink px-[0.14em] py-[0.12em] text-sk-floor " +
  "shadow-[0_1px_2px_0,0_6px_12px_-6px] shadow-black/40 " +
  "bg-[image:linear-gradient(180deg,color-mix(in_oklab,white_8%,transparent)_50%,transparent_50%)] " +
  "after:pointer-events-none after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-black/60 " +
  "dark:bg-sk-raised dark:text-sk-ink dark:ring-1 dark:ring-white/8";

const GLYPH =
  "";

// Signs, separators, the prefix and the suffix: they do not roll.
const MARK =
  "px-[0.04em] leading-[1.15] text-sk-ink";

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
