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
 * Neumorph: a groove pressed into the page and a soft raised thumb that slides along it. Light comes
 * from the upper left, so the groove is shaded at the top left and the thumb at the lower right. Turning
 * on fills the groove with the indicator colour, still pressed in. Shadows are only white and black.
 */
const LABEL =
  "inline-flex items-center gap-3 font-medium text-sk-ink select-none has-data-disabled:cursor-not-allowed " +
  "has-data-disabled:opacity-45 [--nm-lit:color-mix(in_oklab,white_90%,transparent)] " +
  "[--nm-shade:color-mix(in_oklab,black_20%,transparent)] " +
  "dark:[--nm-lit:color-mix(in_oklab,white_7%,transparent)] " +
  "dark:[--nm-shade:color-mix(in_oklab,black_80%,transparent)]";

const TRACK =
  "relative flex shrink-0 cursor-pointer data-disabled:cursor-not-allowed focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring " +
  "transition-[translate,background-color,box-shadow] duration-(--sk-motion-base) ease-sk-out rounded-full " +
  "p-[3px] bg-sk-surface dark:bg-sk-raised " +
  "[box-shadow:inset_2px_2px_5px_var(--nm-shade),inset_-2px_-2px_5px_var(--nm-lit)] " +
  "data-checked:bg-sk-indicator";

const THUMB =
  "block transition-[translate,background-color,box-shadow] duration-(--sk-motion-base) ease-sk-out " +
  "rounded-full bg-sk-surface " +
  "bg-[image:linear-gradient(145deg,white,color-mix(in_oklab,black_7%,transparent))] " +
  "[box-shadow:2px_2px_4px_var(--nm-shade),-1px_-1px_2px_var(--nm-lit)] dark:bg-sk-overlay " +
  "dark:bg-[image:linear-gradient(145deg,color-mix(in_oklab,white_10%,transparent),color-mix(in_oklab,black_20%,transparent))]";

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
