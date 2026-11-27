import { Switch as BaseSwitch } from "@base-ui/react/switch";
import type { ComponentPropsWithRef } from "react";

type Size = "sm" | "md";

export type SwitchProps = Omit<ComponentPropsWithRef<typeof BaseSwitch.Root>, "className"> & {
  /** The visible name of the setting. Without one, pass aria-label. */
  label?: string;
  /** Small or medium. The label grows with it. */
  size?: Size;
  className?: string;
};

/*
 * Brutal: a square track with a thick ink outline and a hard shadow in ink, and a solid ink block for a
 * thumb. Turning on fills the track with the indicator colour.
 */
const LABEL =
  "inline-flex items-center gap-3 font-medium text-sk-ink select-none has-data-disabled:cursor-not-allowed " +
  "has-data-disabled:opacity-45";

const TRACK =
  "relative flex shrink-0 cursor-pointer data-disabled:cursor-not-allowed focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring " +
  "transition-[translate,background-color,box-shadow] duration-(--sk-motion-base) ease-sk-out border-2 " +
  "border-sk-ink p-0.5 bg-sk-surface shadow-[3px_3px_0_0_var(--sk-ink)] data-checked:bg-sk-indicator";

const THUMB =
  "block transition-[translate,background-color,box-shadow] duration-(--sk-motion-base) ease-sk-out " +
  "bg-sk-ink";

const SIZES: Record<Size, { track: string; thumb: string; text: string }> = {
  sm: { track: "h-6 w-10", thumb: "size-4 data-checked:translate-x-4", text: "text-[13px]" },
  md: { track: "h-7 w-12", thumb: "size-5 data-checked:translate-x-5", text: "text-sm" },
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

export function Switch({ label, size, className, ...rest }: SwitchProps) {
  const s = SIZES[size === "sm" ? "sm" : "md"];
  return (
    <label className={join(LABEL, s.text, className)}>
      <BaseSwitch.Root {...rest} className={join(TRACK, s.track)}>
        <BaseSwitch.Thumb className={join(THUMB, s.thumb)} />
      </BaseSwitch.Root>
      {label}
    </label>
  );
}
