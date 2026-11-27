import { Progress as BaseProgress } from "@base-ui/react/progress";
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
 * Depth: the fill runs from a deep shade of your colour up into the colour itself at its leading edge,
 * so the bar looks brightest where the work is happening. The track is a faint tint of the same hue.
 */
const LABEL =
  "text-sm font-medium text-sk-ink";

const VALUE =
  "font-sk-mono text-xs text-sk-muted tabular-nums";

const TRACK =
  "relative h-2.5 overflow-hidden rounded-full bg-sk-hue-500/12 dark:bg-sk-hue-400/14";

// The fill's width follows the value; it is the one place a width is allowed to move.
const FILL =
  "h-full rounded-full bg-linear-to-r from-sk-hue-900 via-sk-hue-700 to-sk-accent inset-shadow-[0_1px_0_0] " +
  "inset-shadow-white/20 transition-[width] duration-(--sk-motion-slow) ease-sk-out";

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
        <BaseProgress.Indicator className={FILL}></BaseProgress.Indicator>
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
