import { Dialog } from "@base-ui/react/dialog";
import type { ReactNode } from "react";

type Tone = "default" | "danger";

export interface ModalProps {
  /** The label of the button that opens it. */
  triggerLabel?: string;
  /** The heading, read out when it opens. */
  title?: string;
  /** The line under the title. */
  description?: string;
  /** Anything else to show between the description and the actions. */
  children?: ReactNode;
  /** The label of the main action. */
  confirmLabel?: string;
  /** The label of the button that closes it. */
  cancelLabel?: string;
  /** Danger colours the main action red, for things that can't be undone. */
  tone?: Tone;
  /** Called when the main action is pressed, just before it closes. */
  onConfirm?: () => void;
  /** Open when it first renders. */
  defaultOpen?: boolean;
  /** Controls whether it is open. Pair it with onOpenChange. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/*
 * Brutal: a square sheet with a thick ink outline and a big hard shadow in ink, over a flat dim with no
 * blur. The title is bold capitals. It drops in from slightly above; the buttons press flat into their
 * shadows.
 */
const BACKDROP =
  "fixed inset-0 z-50 bg-black/30 dark:bg-black/60 transition-opacity duration-(--sk-motion-slow) " +
  "ease-sk-out data-ending-style:duration-(--sk-motion-slow-exit) data-starting-style:opacity-0 " +
  "data-ending-style:opacity-0";

const POPUP =
  "fixed top-1/2 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 border-2 " +
  "border-sk-ink bg-sk-surface p-6 text-sk-ink shadow-[8px_8px_0_0_var(--sk-ink)] outline-none " +
  "transition-[opacity,translate] duration-(--sk-motion-slow) ease-sk-out " +
  "data-ending-style:duration-(--sk-motion-slow-exit) data-starting-style:-translate-y-[calc(50%+12px)] " +
  "data-starting-style:opacity-0 data-ending-style:opacity-0";

const TITLE =
  "font-sk-display text-lg/7 font-bold tracking-wide uppercase";

const DESCRIPTION =
  "mt-2 text-sm/6 text-pretty text-sk-ink/75";

const BUTTON =
  "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center border-2 border-sk-ink px-4 text-xs " +
  "font-bold tracking-wider uppercase shadow-[3px_3px_0_0_var(--sk-ink)] " +
  "transition-[translate,box-shadow,background-color] duration-(--sk-motion-fast) ease-sk-out " +
  "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_0_var(--sk-ink)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

const SECONDARY =
  "bg-sk-hue-100 text-black hover:bg-sk-hue-200 dark:bg-sk-hue-200 dark:hover:bg-sk-hue-300";

const PRIMARY: Record<Tone, string> = {
  default:
    "bg-sk-accent text-sk-accent-fg hover:bg-sk-accent-hover",
  danger:
    "bg-sk-danger-solid text-sk-danger-solid-fg hover:bg-sk-danger-solid-hover",
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

export function Modal({
  triggerLabel = "Open",
  title,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone,
  onConfirm,
  defaultOpen,
  open,
  onOpenChange,
}: ModalProps) {
  const t: Tone = tone === "danger" ? "danger" : "default";
  return (
    <Dialog.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}>
      <Dialog.Trigger className={join(BUTTON, PRIMARY[t])}>{triggerLabel}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={BACKDROP} />
        <Dialog.Popup className={POPUP}>
          {title && <Dialog.Title className={TITLE}>{title}</Dialog.Title>}
          {description && <Dialog.Description className={DESCRIPTION}>{description}</Dialog.Description>}
          {children}
          <div className="mt-6 flex flex-wrap justify-end gap-2.5">
            <Dialog.Close className={join(BUTTON, SECONDARY)}>{cancelLabel}</Dialog.Close>
            <Dialog.Close className={join(BUTTON, PRIMARY[t])} onClick={onConfirm}>
              {confirmLabel}
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
