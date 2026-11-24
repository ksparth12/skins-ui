import { Dialog } from "@base-ui/react/dialog";
import type { ReactNode } from "react";

export type ModalProps = {
  /** The label of the button that opens the modal. */
  triggerLabel?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  /** Danger colours the confirm button for actions that destroy something. */
  tone?: "default" | "danger";
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Runs when the confirm button is pressed. The modal then closes. */
  onConfirm?: () => void;
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

/* The backdrop fades; the panel fades and grows from 96%, and leaves a step quicker. */
const BACKDROP_MOTION =
  "transition-opacity duration-200 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-150";
const POPUP_MOTION =
  "transition-[opacity,scale] duration-200 ease-out data-starting-style:scale-[0.96] data-starting-style:opacity-0 " +
  "data-ending-style:scale-[0.96] data-ending-style:opacity-0 data-ending-style:duration-150";

/* Flat: a white panel on a dimmed page, with the actions on the right. */
const BACKDROP = "bg-black/40 dark:bg-black/60";
const POPUP = "rounded-[20px] bg-sk-overlay p-6 shadow-sk-modal outline-none";
const TITLE = "font-sk-display text-lg/6 font-semibold text-sk-ink";
const TEXT = "mt-2 text-sm/6 text-sk-muted";
const BUTTON =
  "inline-flex h-10 items-center justify-center rounded-lg px-3.5 text-sm font-semibold transition-[background-color,scale] duration-100 ease-out active:scale-[0.97] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";
const PRIMARY = "bg-sk-accent text-sk-accent-fg hover:bg-sk-accent-hover";
const SECONDARY = "bg-sk-surface text-sk-ink inset-ring inset-ring-black/12 hover:bg-sk-hover dark:bg-white/10 dark:inset-ring-0 dark:hover:bg-white/15";
const DANGER = "bg-sk-danger-solid text-sk-danger-solid-fg hover:bg-sk-danger-solid-hover";

export function Modal({
  triggerLabel = "Open",
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  defaultOpen,
  open,
  onOpenChange,
  onConfirm,
}: ModalProps) {
  return (
    <Dialog.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger className={join(BUTTON, tone === "danger" ? DANGER : SECONDARY)}>{triggerLabel}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={join("fixed inset-0 z-50", BACKDROP, BACKDROP_MOTION)} />
        <Dialog.Popup className={join("fixed top-1/2 left-1/2 z-50 w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2", POPUP, POPUP_MOTION)}>
          <Dialog.Title className={TITLE}>{title}</Dialog.Title>
          {description && <Dialog.Description className={TEXT}>{description}</Dialog.Description>}
          <div className="mt-6 flex justify-end gap-2.5">
            <Dialog.Close className={join(BUTTON, SECONDARY)}>{cancelLabel}</Dialog.Close>
            <Dialog.Close className={join(BUTTON, tone === "danger" ? DANGER : PRIMARY)} onClick={onConfirm}>
              {confirmLabel}
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
