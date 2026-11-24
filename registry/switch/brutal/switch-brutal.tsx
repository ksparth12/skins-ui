import { Switch as BaseSwitch } from "@base-ui/react/switch";
import type { ComponentPropsWithRef } from "react";

type Size = "sm" | "md";

export type SwitchProps = Omit<ComponentPropsWithRef<typeof BaseSwitch.Root>, "className"> & {
  /** The visible name of the setting. */
  label?: string;
  /** 20 or 24 pixels tall. */
  size?: Size;
  className?: string;
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

/* Brutal: an ink outlined track with a square thumb and a hard shadow. */
const TRACK =
  "relative flex shrink-0 cursor-pointer rounded-md border-2 border-sk-ink bg-sk-surface p-0.5 shadow-[2px_2px_0_0] shadow-sk-ink " +
  "transition-colors duration-100 data-checked:bg-sk-indicator data-disabled:cursor-not-allowed " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sk-ring";
const THUMB = "rounded-[3px] border-2 border-sk-ink bg-sk-surface transition-transform duration-150 ease-out";
const SIZES = {
  sm: { track: "h-6 w-10", thumb: "size-4 data-checked:translate-x-4" },
  md: { track: "h-7 w-12", thumb: "size-5 data-checked:translate-x-5" },
};

export function Switch({ label, size, className, ...rest }: SwitchProps) {
  const s = SIZES[size === "sm" ? "sm" : "md"];
  return (
    <label className={join("inline-flex items-center gap-3 text-sm font-medium text-sk-ink select-none has-data-disabled:opacity-45", className)}>
      <BaseSwitch.Root className={join(TRACK, s.track)} {...rest}>
        <BaseSwitch.Thumb className={join(THUMB, s.thumb)} />
      </BaseSwitch.Root>
      {label}
    </label>
  );
}
