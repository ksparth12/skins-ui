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
 * Flat: a quiet grey track that fills with the indicator colour when on, and a white thumb with a
 * soft shadow. The calm default.
 */
const LABEL =
  "inline-flex items-center gap-3 font-medium text-sk-ink select-none has-data-disabled:cursor-not-allowed " +
  "has-data-disabled:opacity-45";

const TRACK =
  "relative flex shrink-0 cursor-pointer data-disabled:cursor-not-allowed focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring " +
  "transition-[translate,background-color,box-shadow] duration-(--sk-motion-base) ease-sk-out rounded-full " +
  "p-0.5 bg-black/14 dark:bg-white/18 data-checked:bg-sk-indicator";

const THUMB =
  "block transition-[translate,background-color,box-shadow] duration-(--sk-motion-base) ease-sk-out " +
  "rounded-full bg-white shadow-[0_1px_2px_0,0_1px_1px_0] shadow-black/20 data-checked:bg-sk-indicator-fg";

const SIZES: Record<Size, { track: string; thumb: string; text: string }> = {
  sm: { track: "h-5 w-9", thumb: "size-4 data-checked:translate-x-4", text: "text-[13px]" },
  md: { track: "h-6 w-11", thumb: "size-5 data-checked:translate-x-5", text: "text-sm" },
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
