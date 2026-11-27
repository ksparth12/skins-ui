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
 * Glass: a frosted track that blurs what is behind it, lit by a bright rim, with a glossy bead for a
 * thumb. Turning on tints the pane with the indicator colour, so the backdrop still shows through.
 */
const LABEL =
  "inline-flex items-center gap-3 font-medium text-sk-ink select-none has-data-disabled:cursor-not-allowed " +
  "has-data-disabled:opacity-45";

const TRACK =
  "relative flex shrink-0 cursor-pointer data-disabled:cursor-not-allowed focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring " +
  "transition-[translate,background-color,box-shadow] duration-(--sk-motion-base) ease-sk-out rounded-full " +
  "p-0.5 bg-white/35 backdrop-blur-md backdrop-saturate-150 inset-ring inset-ring-white/60 " +
  "inset-shadow-[0_1px_2px_0] inset-shadow-black/15 dark:bg-black/25 dark:inset-ring-white/15 " +
  "data-checked:bg-sk-indicator/80 data-checked:inset-ring-white/30";

const THUMB =
  "block transition-[translate,background-color,box-shadow] duration-(--sk-motion-base) ease-sk-out " +
  "rounded-full bg-linear-to-b from-white to-white/80 inset-ring inset-ring-white " +
  "shadow-[0_1px_3px_0,0_4px_8px_-4px] shadow-black/35";

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
