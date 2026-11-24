import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";

type Side = "top" | "right" | "bottom" | "left";

export type TooltipProps = {
  /** The element the tooltip describes. It must be focusable. */
  children: ReactElement;
  content: ReactNode;
  side?: Side;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Milliseconds to wait before opening on hover. */
  delay?: number;
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

/* Grows from the trigger and fades, a step quicker on the way out. */
const MOTION =
  "origin-[var(--transform-origin)] transition-[opacity,scale] duration-150 ease-out " +
  "data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-100 " +
  "data-instant:transition-none";

/* Glass: a frosted label lit from above. */
const POPUP =
  "rounded-lg px-2.5 py-1.5 text-xs/4 font-semibold text-sk-ink backdrop-blur-xl backdrop-saturate-150 " +
  "bg-white/70 inset-ring inset-ring-white/70 inset-shadow-[0_1px_0_0] inset-shadow-white shadow-[0_4px_16px_-4px] shadow-black/20 " +
  "dark:bg-white/12 dark:inset-ring-white/15 dark:inset-shadow-white/20 dark:shadow-black/50";

export function Tooltip({ children, content, side = "top", defaultOpen, open, onOpenChange, delay = 300 }: TooltipProps) {
  return (
    <BaseTooltip.Provider delay={delay}>
      <BaseTooltip.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        <BaseTooltip.Trigger render={children} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner side={side} sideOffset={8} className="z-50">
            <BaseTooltip.Popup className={join(POPUP, MOTION)}>{content}</BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}
