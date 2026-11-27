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
 * Glass: a frosted pane floating over the page, which blurs behind a light dim. Light falls from above:
 * a bright rim along the top edge, a soft sheen across the upper half and a neutral shadow below.
 */
const BACKDROP =
  "fixed inset-0 z-50 bg-black/25 backdrop-blur-sm transition-opacity duration-(--sk-motion-slow) " +
  "ease-sk-out data-ending-style:duration-(--sk-motion-slow-exit) data-starting-style:opacity-0 " +
  "data-ending-style:opacity-0";

const POPUP =
  "fixed top-1/2 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 isolate " +
  "overflow-hidden rounded-[26px] bg-white/55 p-6 text-sk-ink outline-none backdrop-blur-2xl " +
  "backdrop-saturate-150 inset-ring inset-ring-white/70 inset-shadow-[0_1px_0_0] inset-shadow-white " +
  "shadow-[0_1px_2px_0,0_32px_64px_-24px] shadow-black/35 before:pointer-events-none before:absolute " +
  "before:inset-x-px before:top-px before:-z-10 before:h-1/2 before:rounded-t-[inherit] " +
  "before:bg-linear-to-b before:from-white/25 before:to-transparent dark:bg-black/45 " +
  "dark:inset-ring-white/16 dark:inset-shadow-white/30 dark:shadow-black/70 " +
  "transition-[opacity,scale,translate] duration-(--sk-motion-slow) ease-sk-out " +
  "data-ending-style:duration-(--sk-motion-slow-exit) data-starting-style:scale-95 " +
  "data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0";

const TITLE =
  "font-sk-display text-lg/7 font-semibold tracking-tight";

const DESCRIPTION =
  "mt-1.5 text-sm/6 text-pretty text-sk-ink/72";

const BUTTON =
  "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-sm " +
  "font-semibold transition-[background-color,scale] duration-(--sk-motion-fast) ease-sk-out " +
  "active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

const SECONDARY =
  "bg-white/45 text-sk-ink inset-ring inset-ring-white/70 hover:bg-white/60 dark:bg-white/10 " +
  "dark:inset-ring-white/15 dark:hover:bg-white/15";

const PRIMARY: Record<Tone, string> = {
  default:
    "bg-sk-accent-hover/90 text-sk-accent-fg inset-ring inset-ring-white/25 inset-shadow-[0_1px_0_0] " +
    "inset-shadow-white/45 hover:bg-sk-accent-active/90",
  danger:
    "bg-sk-danger-solid-hover/90 text-sk-danger-solid-fg inset-ring inset-ring-white/25 " +
    "inset-shadow-[0_1px_0_0] inset-shadow-white/40 hover:bg-sk-danger-solid-active/90",
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
