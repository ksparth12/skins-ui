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
 * Flat: a thin, rounded track on a neutral tint that fills with your colour. The fill eases to each new
 * value.
 */
const LABEL =
  "text-sm font-medium text-sk-ink";

const VALUE =
  "font-sk-mono text-xs text-sk-muted tabular-nums";

const TRACK =
  "relative h-2 overflow-hidden rounded-full bg-black/8 dark:bg-white/12";

// The fill's width follows the value; it is the one place a width is allowed to move.
const FILL =
  "h-full rounded-full bg-sk-accent transition-[width] duration-(--sk-motion-slow) ease-sk-out";

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
