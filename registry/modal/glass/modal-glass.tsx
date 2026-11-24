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

/* Glass: a frosted panel over a blurred page. */
const BACKDROP = "bg-black/15 backdrop-blur-sm dark:bg-black/40";
const POPUP =
  "rounded-[24px] p-6 outline-none backdrop-blur-2xl backdrop-saturate-150 " +
  "bg-white/60 inset-ring inset-ring-white/70 inset-shadow-[0_1px_0_0] inset-shadow-white shadow-[0_8px_16px_-4px,0_32px_64px_-16px] shadow-black/20 " +
  "dark:bg-white/10 dark:inset-ring-white/15 dark:inset-shadow-white/20 dark:shadow-black/60";
const TITLE = "font-sk-display text-lg/6 font-semibold text-sk-ink";
const TEXT = "mt-2 text-sm/6 text-sk-ink/70";
const BUTTON =
  "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-[background-color,scale] duration-150 ease-out active:scale-[0.97] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";
const PRIMARY = "bg-sk-accent/85 text-sk-accent-fg inset-ring inset-ring-white/20 hover:bg-sk-accent";
const SECONDARY = "bg-white/50 text-sk-ink inset-ring inset-ring-white/60 hover:bg-white/70 dark:bg-white/10 dark:inset-ring-white/12 dark:hover:bg-white/15";
const DANGER = "bg-sk-danger-solid/90 text-sk-danger-solid-fg inset-ring inset-ring-white/20 hover:bg-sk-danger-solid";

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
