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
 * Brutal: one thick ink frame with a hard shadow, split into choices by solid ink lines. The picked
 * choice fills its whole cell with your colour, edge to edge, and the block slides between cells. Labels
 * are bold capitals.
 */
const TRACK =
  "inline-flex items-stretch border-2 border-sk-ink bg-sk-surface shadow-[4px_4px_0_0_var(--sk-ink)]";

const ITEM =
  "relative flex flex-1 cursor-pointer items-center justify-center whitespace-nowrap select-none " +
  "transition-colors duration-(--sk-motion-fast) ease-sk-out focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring border-l-2 border-sk-ink first:border-l-0 " +
  "text-xs font-bold tracking-wider uppercase text-sk-ink hover:bg-sk-hue-50 data-pressed:text-sk-accent-fg " +
  "dark:hover:bg-sk-raised";

// The piece that slides under the picked choice.
const THUMB =
  "absolute inset-0 bg-sk-accent";

const SIZES: Record<Size, { track: string; item: string }> = {
  sm: { track: "h-8", item: "h-full px-3" },
  md: { track: "h-10", item: "h-full px-4" },
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
