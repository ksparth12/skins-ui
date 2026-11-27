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
 * Pixel: the message box of an old role-playing game. A deep shade of your colour with a notched outer
 * border drawn by four flat shadows (ink on a light page, white on a dark one) and a white inner line, a pixel font for the title in a light shade
 * of your colour, and white text. It looks the same in both themes, as the box would on screen. The
 * font is read from --sk-skin-font and falls back to monospace.
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
  "m-1 bg-sk-hue-950 text-white shadow-[0_-4px_0_0,0_4px_0_0,-4px_0_0_0,4px_0_0_0] shadow-sk-ink " +
  "inset-ring-2 inset-ring-white/85 dark:shadow-white";

const TITLE =
  "[--sk-skin-font:'Geist_Pixel',var(--sk-font-mono)] font-[family-name:var(--sk-skin-font)] text-base/5 " +
  "font-normal text-sk-hue-300";

const DESCRIPTION =
  "text-[13px]/5 text-white/80";

const CLOSE =
  "grid size-7 shrink-0 cursor-pointer place-items-center transition-colors duration-(--sk-motion-fast) " +
  "ease-sk-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring -mt-1 " +
  "-mr-1 text-white/60 hover:bg-white/12 hover:text-white";

const CONTENT =
  "flex items-start gap-3 overflow-hidden p-4 transition-opacity duration-(--sk-motion-base) " +
  "data-behind:opacity-0 data-expanded:opacity-100";

const TEXT =
  "grid min-w-0 flex-1 gap-1 gap-1.5";

// The icon takes the meaning of the toast: success, error, or a plain message.
const ICON: Record<string, string> = {
  success: "mt-0.5 size-5 text-[color-mix(in_oklab,var(--sk-success)_45%,white)]",
  error: "mt-0.5 size-5 text-[color-mix(in_oklab,var(--sk-danger)_50%,white)]",
  info: "mt-0.5 size-5 text-sk-hue-300",
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
