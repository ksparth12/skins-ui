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

/* Flat: a small ink chip with the page colour as its text. */
const POPUP = "rounded-md bg-sk-ink px-2 py-1 text-xs/4 font-semibold text-sk-floor shadow-sk-popover";

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
