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
 * Pixel: a notched window with a stepped bevel along the bottom and a pixel font for the title, like a
 * dialog in an old game. It appears in hard steps rather than a fade. The font is read from
 * --sk-skin-font and falls back to monospace.
 */
const BACKDROP =
  "fixed inset-0 z-50 bg-black/45 transition-opacity duration-(--sk-motion-base) ease-[steps(3)] " +
  "data-starting-style:opacity-0 data-ending-style:opacity-0";

const POPUP =
  "fixed top-1/2 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 " +
  "bg-sk-surface p-6 text-sk-ink outline-none shadow-[0_-4px_0_0,0_4px_0_0,-4px_0_0_0,4px_0_0_0] " +
  "shadow-sk-ink inset-shadow-[0_-4px_0_0] inset-shadow-black/12 dark:inset-shadow-black/45 " +
  "transition-[opacity,scale] duration-(--sk-motion-base) ease-[steps(3)] data-starting-style:scale-90 " +
  "data-starting-style:opacity-0 data-ending-style:opacity-0";

const TITLE =
  "[--sk-skin-font:'Geist_Pixel',var(--sk-font-mono)] font-[family-name:var(--sk-skin-font)] text-xl/7 " +
  "font-normal";

const DESCRIPTION =
  "mt-2 text-sm/6 text-pretty text-sk-muted";

const BUTTON =
  "[--sk-skin-font:'Geist_Pixel',var(--sk-font-mono)] font-[family-name:var(--sk-skin-font)] inline-flex " +
  "h-10 shrink-0 cursor-pointer items-center justify-center m-[3px] px-4 text-sm font-normal " +
  "shadow-[0_-3px_0_0,0_3px_0_0,-3px_0_0_0,3px_0_0_0] shadow-sk-ink inset-shadow-[0_-3px_0_0] " +
  "inset-shadow-black/30 transition-[background-color,translate] duration-(--sk-motion-fast) " +
  "ease-[steps(2)] active:translate-y-[3px] active:inset-shadow-[0_3px_0_0] focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

const SECONDARY =
  "bg-sk-surface text-sk-ink inset-shadow-black/12 hover:bg-sk-well";

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
