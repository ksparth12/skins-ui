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
 * Pixel: a notched frame drawn with four flat shadows that fills with whole blocks of your colour, like a
 * loading bar in an old game. A block is either lit or not, never cut in half, and each one lights up
 * with a hard step. The value is set in a pixel font read from --sk-skin-font, falling back to monospace.
 */
const LABEL =
  "text-sm font-medium text-sk-ink";

const VALUE =
  "[--sk-skin-font:'Geist_Pixel',var(--sk-font-mono)] font-[family-name:var(--sk-skin-font)] text-sm " +
  "text-sk-ink tabular-nums";

const TRACK =
  "relative m-[3px] flex h-6 gap-[3px] bg-sk-well p-[3px] " +
  "shadow-[0_-3px_0_0,0_3px_0_0,-3px_0_0_0,3px_0_0_0] shadow-sk-ink";

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

// Whole blocks: the value is rounded to the nearest block, so one is never shown cut in half.
const BLOCKS = 12;

const BLOCK =
  "h-full flex-1 bg-black/8 transition-[background-color,box-shadow] duration-(--sk-motion-fast) ease-[steps(2)] dark:bg-white/8 " +
  "data-lit:bg-sk-accent data-lit:inset-shadow-[0_-3px_0_0] data-lit:inset-shadow-black/30";

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
        {Array.from({ length: BLOCKS }, (_, i) => (
          <span key={i} aria-hidden="true" data-lit={i < Math.round((clamped / 100) * BLOCKS) ? "" : undefined} className={BLOCK} />
        ))}
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
