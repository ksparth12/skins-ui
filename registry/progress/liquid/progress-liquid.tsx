import { Progress as BaseProgress } from "@base-ui/react/progress";
import { motion } from "motion/react";
import type { ComponentPropsWithRef } from "react";

export type ProgressProps = Omit<ComponentPropsWithRef<typeof BaseProgress.Root>, "className" | "children"> & {
  /** How far along it is, from 0 to 100. */
  value?: number;
  /** Says what is in progress. Without one, pass aria-label. */
  label?: string;
  /** Shows the percentage beside the label. */
  showValue?: boolean;
  className?: string;
};

/*
 * Liquid: a glass tube filling with your colour. The tube has a bright rim and a shade inside along the
 * top; the liquid carries a glossy highlight and a soft light that flows through it slowly, so it never
 * looks still while it works.
 */
const LABEL =
  "text-sm font-medium text-sk-ink";

const VALUE =
  "font-sk-mono text-xs text-sk-muted tabular-nums";

const TRACK =
  "relative h-4 overflow-hidden rounded-full bg-white/50 p-[3px] inset-ring inset-ring-black/8 " +
  "inset-shadow-[0_2px_3px_0] inset-shadow-black/12 dark:bg-white/6 dark:inset-ring-white/10 " +
  "dark:inset-shadow-black/50";

// The fill's width follows the value; it is the one place a width is allowed to move.
const FILL =
  "relative h-full overflow-hidden rounded-full bg-linear-to-b from-sk-hue-400 to-sk-accent " +
  "transition-[width] duration-(--sk-motion-slow) ease-sk-out before:absolute before:inset-x-1 " +
  "before:top-px before:h-1/2 before:rounded-full before:bg-linear-to-b before:from-white/55 " +
  "before:to-white/0";

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

export function Progress({ value = 0, label, showValue = false, className, ...rest }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <BaseProgress.Root {...rest} value={clamped} className={join("grid w-72 max-w-full gap-2.5", className)}>
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-4">
          {label && <BaseProgress.Label className={LABEL}>{label}</BaseProgress.Label>}
          {showValue && <BaseProgress.Value className={join(VALUE, "ml-auto")} />}
        </div>
      )}
      <BaseProgress.Track className={TRACK}>
        <BaseProgress.Indicator className={FILL}>
          <motion.span aria-hidden="true" className="absolute inset-y-0 w-1/2 bg-linear-to-r from-transparent via-white/30 to-transparent" initial={{ x: "-100%" }} animate={{ x: "300%" }} transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.6 }} />
        </BaseProgress.Indicator>
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
