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
 * Chrome: a machined groove with a bar of anodised metal in your colour sliding along it. Light falls
 * from the top: a bright bevel along the bar, a soft shade just under its middle and a lift at the foot.
 * The groove is cut into the surface, shaded at the top and caught by light at the bottom edge.
 */
const LABEL =
  "text-sm font-medium text-sk-ink";

const VALUE =
  "font-sk-mono text-xs text-sk-muted tabular-nums";

const TRACK =
  "relative h-3.5 overflow-hidden rounded-full bg-sk-surface p-0.5 " +
  "bg-[image:linear-gradient(180deg,color-mix(in_oklab,black_18%,transparent),color-mix(in_oklab,black_4%,transparent))] " +
  "[box-shadow:inset_0_1px_2px_color-mix(in_oklab,black_30%,transparent),0_1px_0_color-mix(in_oklab,white_80%,transparent)] " +
  "dark:bg-sk-raised " +
  "dark:[box-shadow:inset_0_1px_2px_color-mix(in_oklab,black_70%,transparent),0_1px_0_color-mix(in_oklab,white_8%,transparent)]";

// The fill's width follows the value; it is the one place a width is allowed to move.
const FILL =
  "h-full rounded-full bg-sk-accent transition-[width] duration-(--sk-motion-slow) ease-sk-out " +
  "bg-[image:linear-gradient(180deg,color-mix(in_oklab,white_38%,transparent),color-mix(in_oklab,white_6%,transparent)_45%,color-mix(in_oklab,black_16%,transparent)_58%,color-mix(in_oklab,white_10%,transparent))] " +
  "[box-shadow:inset_0_1px_0_color-mix(in_oklab,white_50%,transparent),0_0_0_1px_color-mix(in_oklab,black_25%,transparent)]";

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
