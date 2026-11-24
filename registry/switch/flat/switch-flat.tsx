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

/* Flat: a quiet grey track that fills with the indicator colour when on. */
const TRACK =
  "relative flex shrink-0 cursor-pointer rounded-full bg-sk-border-strong p-0.5 transition-colors duration-150 ease-out " +
  "data-checked:bg-sk-indicator data-disabled:cursor-not-allowed " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";
const THUMB = "rounded-full bg-white shadow-[0_1px_2px_0] shadow-black/25 transition-transform duration-200 ease-out";
const SIZES = {
  sm: { track: "h-5 w-8", thumb: "size-4 data-checked:translate-x-3" },
  md: { track: "h-6 w-10", thumb: "size-5 data-checked:translate-x-4" },
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
