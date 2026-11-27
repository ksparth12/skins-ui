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
 * Pixel: a notched track drawn with four flat shadows, one per side, and a square thumb with a stepped
 * bevel. The thumb moves in two steps rather than gliding. Turning on fills the track with the
 * indicator colour.
 */
const LABEL =
  "inline-flex items-center gap-3 font-medium text-sk-ink select-none has-data-disabled:cursor-not-allowed " +
  "has-data-disabled:opacity-45";

const TRACK =
  "relative flex shrink-0 cursor-pointer data-disabled:cursor-not-allowed focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring " +
  "transition-[translate,background-color,box-shadow] duration-(--sk-motion-base) ease-[steps(3)] m-[3px] " +
  "p-[3px] bg-sk-well shadow-[0_-3px_0_0,0_3px_0_0,-3px_0_0_0,3px_0_0_0] shadow-sk-ink " +
  "data-checked:bg-sk-indicator";

const THUMB =
  "block transition-[translate,background-color,box-shadow] duration-(--sk-motion-base) ease-[steps(3)] " +
  "bg-sk-ink inset-shadow-[0_-3px_0_0] inset-shadow-black/35 data-checked:bg-sk-indicator-fg " +
  "data-checked:inset-shadow-black/20";

const SIZES: Record<Size, { track: string; thumb: string; text: string }> = {
  sm: { track: "h-5 w-9", thumb: "size-[14px] data-checked:translate-x-4", text: "text-[13px]" },
  md: { track: "h-6 w-11", thumb: "size-[18px] data-checked:translate-x-5", text: "text-sm" },
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
