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
 * Clay: a puffy track in a soft tint of your colour, shaded inside along the top, and a round thumb
 * with a broad highlight and a soft shadow below. Turning on fills the track with the indicator colour.
 */
const LABEL =
  "inline-flex items-center gap-3 font-medium text-sk-ink select-none has-data-disabled:cursor-not-allowed " +
  "has-data-disabled:opacity-45";

const TRACK =
  "relative flex shrink-0 cursor-pointer data-disabled:cursor-not-allowed focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring " +
  "transition-[translate,background-color,box-shadow] duration-(--sk-motion-base) ease-sk-out rounded-full " +
  "p-[3px] bg-sk-hue-100 inset-shadow-[0_2px_5px_0] inset-shadow-black/15 dark:bg-sk-hue-950 " +
  "dark:inset-shadow-black/50 data-checked:bg-sk-indicator";

const THUMB =
  "block transition-[translate,background-color,box-shadow] duration-(--sk-motion-base) ease-sk-out " +
  "relative rounded-full bg-white inset-shadow-[0_-2px_4px_0] inset-shadow-black/12 shadow-[0_3px_6px_-1px] " +
  "shadow-black/30 before:absolute before:inset-0 before:rounded-[inherit] " +
  "before:bg-radial-[ellipse_at_30%_20%] before:from-white before:to-transparent before:to-60% " +
  "dark:bg-sk-hue-50";

const SIZES: Record<Size, { track: string; thumb: string; text: string }> = {
  sm: { track: "h-6 w-10", thumb: "size-[18px] data-checked:translate-x-4", text: "text-[13px]" },
  md: { track: "h-7 w-12", thumb: "size-[22px] data-checked:translate-x-5", text: "text-sm" },
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
