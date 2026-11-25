import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentPropsWithRef, MouseEvent, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export type ButtonProps = Omit<ComponentPropsWithRef<"button">, "children"> & {
  children?: ReactNode;
  /** Danger is only for actions that destroy something. */
  variant?: Variant;
  /** 32, 40 or 48 pixels tall. */
  size?: Size;
  /** Keeps the width, blocks clicks, shows a spinner and tells screen readers the button is busy. */
  loading?: boolean;
  /** An icon before the label. */
  icon?: ReactNode;
  /** An icon after the label. */
  iconRight?: ReactNode;
  /** Fills the width of its container. */
  fullWidth?: boolean;
  /** Renders a link that looks like the button. */
  href?: string;
};

/*
 * Sticker: a die-cut sticker. A thick white edge wraps the face, the label is bold, and a soft shadow
 * lifts it off the page. Pressing flattens it back down: it shrinks a touch and the shadow tightens.
 */
const CUT =
  "border-[3px] border-white shadow-[0_1px_2px_0,0_8px_18px_-6px] shadow-black/30 dark:shadow-black/70 " +
  "active:not-data-disabled:scale-[0.96] active:not-data-disabled:shadow-[0_1px_1px_0,0_3px_8px_-4px]";

const VARIANTS: Record<Variant, string> = {
  primary: CUT + " bg-sk-accent text-sk-accent-fg hover:not-data-disabled:bg-sk-accent-hover",
  secondary: CUT + " bg-sk-hue-100 text-black hover:not-data-disabled:bg-sk-hue-200",
  ghost:
    "border-[3px] border-transparent text-sk-ink hover:not-data-disabled:border-sk-border-strong hover:not-data-disabled:border-dashed " +
    "active:not-data-disabled:scale-[0.96]",
  danger: CUT + " bg-sk-danger-solid text-sk-danger-solid-fg hover:not-data-disabled:bg-sk-danger-solid-hover",
};

const SIZES: Record<Size, { label: string; square: string; icon: string }> = {
  sm: { label: "h-8 gap-1.5 rounded-xl px-3 text-[13px]/5 font-extrabold", square: "size-8 rounded-xl", icon: "size-3.5" },
  md: { label: "h-10 gap-2 rounded-[14px] px-4 text-sm/5 font-extrabold", square: "size-10 rounded-[14px]", icon: "size-4" },
  lg: { label: "h-12 gap-2 rounded-2xl px-5 text-[15px]/6 font-extrabold", square: "size-12 rounded-2xl", icon: "size-4.5" },
};

const BASE =
  "group/button relative isolate inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none " +
  "transition-[background-color,border-color,box-shadow,scale] duration-(--sk-motion-fast) ease-sk-out " +
  "active:not-data-disabled:transition-[scale,box-shadow] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring " +
  "data-disabled:cursor-not-allowed [&[data-disabled]:not([data-loading])]:opacity-45";

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

const pick = <T extends string>(value: T | undefined, allowed: readonly T[], fallback: T): T =>
  value && allowed.includes(value) ? value : fallback;

function Spinner({ className }: { className: string }) {
  return (
    <svg className={join("animate-spin motion-reduce:animate-none", className)} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M14.25 8A6.25 6.25 0 0 0 8 1.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Button({
  children,
  variant,
  size,
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = false,
  href,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const tone = pick(variant, ["primary", "secondary", "ghost", "danger"], "primary");
  const scale = SIZES[pick(size, ["sm", "md", "lg"], "md")];
  const hasLabel = children !== undefined && children !== null && children !== false && children !== "";
  const iconOnly = !hasLabel && Boolean(icon || iconRight);

  const classes = join(BASE, VARIANTS[tone], iconOnly ? scale.square : scale.label, fullWidth && "w-full", className);

  // The label sits above any light the skin draws on its face. While loading it fades out in place
  // (so the width holds) and the spinner fades in over it.
  const content = (
    <>
      <span className="relative z-[1] inline-flex items-center gap-[inherit] transition-opacity duration-(--sk-motion-base) ease-sk-out group-data-loading/button:opacity-0">
        {icon && <span className={join("inline-flex shrink-0 [&>svg]:size-full", scale.icon)}>{icon}</span>}
        {hasLabel && <span className="[text-box:trim-both_cap_alphabetic]">{children}</span>}
        {iconRight && <span className={join("inline-flex shrink-0 [&>svg]:size-full", scale.icon)}>{iconRight}</span>}
      </span>
      {loading && (
        <span className="absolute inset-0 z-[1] flex items-center justify-center transition-opacity duration-(--sk-motion-base) ease-sk-out starting:opacity-0">
          <Spinner className={scale.icon} />
        </span>
      )}
    </>
  );

  if (href !== undefined) {
    const inactive = disabled || loading;
    const { onClick, ...anchor } = rest as ComponentPropsWithRef<"a">;
    return (
      <a
        {...anchor}
        href={inactive ? undefined : href}
        role={inactive ? "link" : undefined}
        aria-disabled={inactive || undefined}
        aria-busy={loading || undefined}
        data-disabled={inactive ? "" : undefined}
        data-loading={loading ? "" : undefined}
        className={classes}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          // A disabled or busy link does nothing, not even its own click handler.
          if (inactive) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <BaseButton
      type={type}
      disabled={disabled || loading}
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      data-loading={loading ? "" : undefined}
      className={classes}
      {...rest}
    >
      {content}
    </BaseButton>
  );
}
