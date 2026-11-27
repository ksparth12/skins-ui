import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { motion, type Transition } from "motion/react";
import { useId, useState, type ComponentPropsWithRef } from "react";

type Size = "sm" | "md";

export type SegmentedControlProps = Omit<ComponentPropsWithRef<"div">, "defaultValue" | "onChange"> & {
  /** The choices, in order. Two to five short words work best. */
  options?: string[];
  /** The picked choice, when you control it. Pair it with onValueChange. */
  value?: string;
  /** The choice picked when it first renders. The first one if you leave it out. */
  defaultValue?: string;
  /** Called with the new choice whenever it changes. */
  onValueChange?: (value: string) => void;
  /** 32 or 40 pixels tall. */
  size?: Size;
};

/*
 * Pixel: a notched strip drawn with four flat shadows, with a block of your colour that jumps to the
 * picked choice in hard steps. Labels are set in a pixel font read from --sk-skin-font, falling back to
 * monospace.
 */
const TRACK =
  "m-[3px] inline-flex items-center bg-sk-well shadow-[0_-3px_0_0,0_3px_0_0,-3px_0_0_0,3px_0_0_0] " +
  "shadow-sk-ink [--sk-skin-font:'Geist_Pixel',var(--sk-font-mono)] font-[family-name:var(--sk-skin-font)]";

const ITEM =
  "relative flex flex-1 cursor-pointer items-center justify-center whitespace-nowrap select-none " +
  "transition-colors duration-(--sk-motion-fast) ease-sk-out focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring font-normal text-sk-muted hover:text-sk-ink " +
  "data-pressed:text-sk-accent-fg";

// The piece that slides under the picked choice.
const THUMB =
  "absolute inset-0 bg-sk-accent inset-shadow-[0_-3px_0_0] inset-shadow-black/30";

const SIZES: Record<Size, { track: string; item: string }> = {
  sm: { track: "h-8 p-[3px]", item: "h-[26px] px-3 text-[13px]" },
  md: { track: "h-10 p-[3px]", item: "h-[34px] px-3.5 text-sm" },
};

const SLIDE: Transition = { type: "tween", duration: 0.24, ease: (t: number) => Math.floor(t * 4) / 4 };

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

export function SegmentedControl({ options = [], value, defaultValue, onValueChange, size, className, ...rest }: SegmentedControlProps) {
  const id = useId();
  const [own, setOwn] = useState(defaultValue ?? options[0]);
  const current = value ?? own;
  const s = SIZES[size === "sm" ? "sm" : "md"];
  return (
    <ToggleGroup
      {...rest}
      value={current === undefined ? [] : [current]}
      onValueChange={(next) => {
        // A segmented control always keeps one choice; pressing the picked one again does nothing.
        const picked = next[0];
        if (picked === undefined) return;
        setOwn(picked);
        onValueChange?.(picked);
      }}
      className={join(TRACK, s.track, className)}
    >
      {options.map((option) => (
        <Toggle key={option} value={option} className={join(ITEM, s.item)}>
          {current === option && <motion.span aria-hidden="true" layoutId={`${id}-thumb`} className={THUMB} transition={SLIDE} />}
          <span className="relative">{option}</span>
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
