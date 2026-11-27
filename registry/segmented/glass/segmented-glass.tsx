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
 * Glass: a frosted track that blurs what is behind it, with a glossy, brighter pane that slides under
 * the picked choice. Light falls from above: a bright rim on top of both.
 */
const TRACK =
  "inline-flex items-center rounded-full bg-white/35 backdrop-blur-md backdrop-saturate-150 inset-ring " +
  "inset-ring-white/60 inset-shadow-[0_1px_2px_0] inset-shadow-black/10 dark:bg-black/25 " +
  "dark:inset-ring-white/15";

const ITEM =
  "relative flex flex-1 cursor-pointer items-center justify-center whitespace-nowrap select-none " +
  "transition-colors duration-(--sk-motion-fast) ease-sk-out focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring rounded-full font-medium text-sk-ink/70 " +
  "hover:text-sk-ink data-pressed:text-sk-ink";

// The piece that slides under the picked choice.
const THUMB =
  "absolute inset-0 rounded-full bg-white/75 inset-ring inset-ring-white inset-shadow-[0_1px_0_0] " +
  "inset-shadow-white shadow-[0_1px_3px_0,0_4px_10px_-4px] shadow-black/25 dark:bg-white/18 " +
  "dark:inset-ring-white/20 dark:inset-shadow-white/30";

const SIZES: Record<Size, { track: string; item: string }> = {
  sm: { track: "h-8 p-0.5", item: "h-7 px-3 text-[13px]" },
  md: { track: "h-10 p-1", item: "h-8 px-3.5 text-sm" },
};

const SLIDE: Transition = { type: "spring", duration: 0.35, bounce: 0 };

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
