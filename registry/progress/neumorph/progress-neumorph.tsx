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
 * Neumorph: a groove pressed into the page, with a soft raised bar of your colour sliding along it.
 * Light comes from the upper left, so the groove is shaded at the top left and the bar at the lower
 * right. Shadows are only white and black.
 */
const LABEL =
  "text-sm font-medium text-sk-ink";

const VALUE =
  "font-sk-mono text-xs text-sk-muted tabular-nums";

const TRACK =
  "relative h-5 rounded-full bg-sk-surface p-1 dark:bg-sk-raised " +
  "[--nm-lit:color-mix(in_oklab,white_90%,transparent)] " +
  "[--nm-shade:color-mix(in_oklab,black_18%,transparent)] " +
  "dark:[--nm-lit:color-mix(in_oklab,white_6%,transparent)] " +
  "dark:[--nm-shade:color-mix(in_oklab,black_80%,transparent)] " +
  "[box-shadow:inset_2px_2px_5px_var(--nm-shade),inset_-2px_-2px_5px_var(--nm-lit)]";

// The fill's width follows the value; it is the one place a width is allowed to move.
const FILL =
  "h-full rounded-full bg-sk-accent transition-[width] duration-(--sk-motion-slow) ease-sk-out " +
  "bg-[image:linear-gradient(145deg,color-mix(in_oklab,white_22%,transparent),color-mix(in_oklab,black_12%,transparent))] " +
  "[box-shadow:1px_1px_3px_var(--nm-shade),inset_1px_1px_0_color-mix(in_oklab,white_35%,transparent)]";

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
