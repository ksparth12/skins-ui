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

/* Glass: a frosted track lit from above, and a bright glass thumb. */
const TRACK =
  "relative flex shrink-0 cursor-pointer rounded-full p-0.5 backdrop-blur-xl backdrop-saturate-150 " +
  "bg-white/35 inset-ring inset-ring-white/55 inset-shadow-[0_1px_2px_0] inset-shadow-black/10 " +
  "transition-colors duration-150 ease-out data-checked:bg-sk-indicator/85 data-checked:inset-ring-white/25 " +
  "dark:bg-white/10 dark:inset-ring-white/15 data-disabled:cursor-not-allowed " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";
const THUMB =
  "rounded-full bg-linear-to-b from-white to-white/80 inset-ring inset-ring-white shadow-[0_1px_3px_0] shadow-black/25 " +
  "transition-transform duration-200 ease-out";
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
