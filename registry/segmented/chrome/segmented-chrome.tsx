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
 * Chrome: a groove cut into the surface, shaded at the top and caught by light at the bottom edge, with a
 * polished metal slider that moves under the picked choice. The slider is polished steel: bright at the top,
 * easing into a soft shade below, with no hard line.
 */
const TRACK =
  "inline-flex items-center rounded-[11px] bg-sk-surface " +
  "bg-[image:linear-gradient(180deg,color-mix(in_oklab,black_14%,transparent),color-mix(in_oklab,black_4%,transparent))] " +
  "[box-shadow:inset_0_1px_2px_color-mix(in_oklab,black_28%,transparent),0_1px_0_color-mix(in_oklab,white_80%,transparent)] " +
  "dark:bg-sk-raised " +
  "dark:[box-shadow:inset_0_1px_2px_color-mix(in_oklab,black_70%,transparent),0_1px_0_color-mix(in_oklab,white_8%,transparent)]";

const ITEM =
  "relative flex flex-1 cursor-pointer items-center justify-center whitespace-nowrap select-none " +
  "transition-colors duration-(--sk-motion-fast) ease-sk-out focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring rounded-lg font-semibold text-sk-muted " +
  "hover:text-sk-ink data-pressed:text-black";

// The piece that slides under the picked choice.
const THUMB =
  "absolute inset-0 rounded-lg " +
  "bg-[image:linear-gradient(180deg,white_8%,color-mix(in_oklab,white_95%,black)_38%,color-mix(in_oklab,white_86%,black)_62%,color-mix(in_oklab,white_93%,black)_92%)] " +
  "[box-shadow:inset_0_1px_0_white,0_0_0_1px_color-mix(in_oklab,black_22%,transparent),0_2px_4px_color-mix(in_oklab,black_25%,transparent)]";

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
