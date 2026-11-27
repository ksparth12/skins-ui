import { Toast } from "@base-ui/react/toast";
import type { ReactNode } from "react";

export interface ToastProviderProps {
  children?: ReactNode;
  /** How many toasts can show at once. Older ones fold away behind the newest. */
  limit?: number;
  /** How long each toast stays, in milliseconds. Hovering keeps it. */
  timeout?: number;
}

/** Shows a toast from anywhere inside the provider: add({ title, description, type: "success" | "error" }). */
export const useToast = Toast.useToastManager;

/*
 * Glass: a frosted pane that blurs and brightens the page behind it. Light falls from above: a bright
 * rim on the top edge and a neutral shadow below. In the dark the pane is smoked rather than milky.
 */
// Stacking: older toasts fold behind the newest, a little smaller, and spread out when you hover or focus.
const STACK =
  "[--gap:0.75rem] [--peek:0.6rem] [--scale:calc(max(0,1-(var(--toast-index)*0.06)))] [--shrink:calc(1-var(--scale))] " +
  "[--height:var(--toast-frontmost-height,var(--toast-height))] " +
  "[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] " +
  "absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom select-none " +
  "h-(--height) data-expanded:h-(--toast-height) " +
  "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] " +
  "data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))] " +
  "data-starting-style:[transform:translateY(150%)] data-ending-style:opacity-0 data-limited:opacity-0 " +
  "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)] " +
  "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] " +
  "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] " +
  "[transition:transform_calc(var(--sk-motion-slow)*2)_var(--sk-ease-out),opacity_var(--sk-motion-slow),height_var(--sk-motion-base)] " +
  "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full";

const ROOT =
  "rounded-2xl bg-white/55 text-sk-ink backdrop-blur-xl backdrop-saturate-150 inset-ring " +
  "inset-ring-white/70 inset-shadow-[0_1px_0_0] inset-shadow-white shadow-[0_1px_2px_0,0_16px_32px_-12px] " +
  "shadow-black/25 dark:bg-black/40 dark:inset-ring-white/16 dark:inset-shadow-white/30 " +
  "dark:shadow-black/60";

const TITLE =
  "text-sm font-semibold";

const DESCRIPTION =
  "text-[13px]/5 text-sk-ink/72";

const CLOSE =
  "grid size-7 shrink-0 cursor-pointer place-items-center transition-colors duration-(--sk-motion-fast) " +
  "ease-sk-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring -mt-1 " +
  "-mr-1 rounded-full text-sk-ink/60 hover:bg-white/45 hover:text-sk-ink dark:hover:bg-white/10";

const CONTENT =
  "flex items-start gap-3 overflow-hidden p-3.5 transition-opacity duration-(--sk-motion-base) " +
  "data-behind:opacity-0 data-expanded:opacity-100";

const TEXT =
  "grid min-w-0 flex-1 gap-1";

// The icon takes the meaning of the toast: success, error, or a plain message.
const ICON: Record<string, string> = {
  success: "mt-0.5 size-5 text-sk-success",
  error: "mt-0.5 size-5 text-sk-danger",
  info: "mt-0.5 size-5 text-sk-ink/60",
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

function Icon({ type, always }: { type?: string; always?: boolean }) {
  const kind = type === "success" || type === "error" ? type : "info";
  if (kind === "info" && !always) return null;
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={join("shrink-0", ICON[kind])}>
      <circle cx="10" cy="10" r="7.5" />
      {kind === "success" && <path d="m6.8 10.2 2.2 2.2 4.2-4.6" />}
      {kind === "error" && <path d="M10 6.2v4.6M10 13.6v.1" />}
      {kind === "info" && <path d="M10 9.2v4.6M10 6.4v.1" />}
    </svg>
  );
}

function List() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((toast) => (
    <Toast.Root key={toast.id} toast={toast} className={join(STACK, ROOT)}>
      <Toast.Content className={CONTENT}>
        <Icon type={toast.type} />
        <div className={TEXT}>
          <Toast.Title className={TITLE} />
          <Toast.Description className={DESCRIPTION} />
        </div>
        <Toast.Close aria-label="Dismiss" className={CLOSE}>
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="size-3.5">
            <path d="m4.5 4.5 7 7m0-7-7 7" />
          </svg>
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}

export function ToastProvider({ children, limit = 3, timeout = 5000 }: ToastProviderProps) {
  return (
    <Toast.Provider limit={limit} timeout={timeout}>
      {children}
      <Toast.Portal>
        <Toast.Viewport className="fixed right-4 bottom-4 z-50 w-[calc(100vw-2rem)] sm:right-6 sm:bottom-6 sm:w-90">
          <List />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}
