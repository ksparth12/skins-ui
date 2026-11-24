import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentPropsWithRef, ReactNode } from "react";

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
 * Pixel: notched corners, a stepped bevel and a pixel font. Pressing drops it one step.
 * The font is read from --sk-skin-font; it falls back to the monospace font.
 */
const NOTCH =
  "[--sk-skin-font:'Geist_Pixel',var(--sk-font-mono)] font-[family-name:var(--sk-skin-font)] " +
  "shadow-[0_-3px_0_0,0_3px_0_0,-3px_0_0_0,3px_0_0_0] shadow-sk-ink " +
  "inset-shadow-[0_-3px_0_0] inset-shadow-black/30 " +
  "transition-[background-color,translate] duration-100 ease-[steps(2)] " +
  "active:not-data-disabled:translate-y-[3px] active:not-data-disabled:inset-shadow-[0_3px_0_0]";

const VARIANTS: Record<Variant, string> = {
  primary: NOTCH + " bg-sk-accent text-sk-accent-fg hover:not-data-disabled:bg-sk-accent-hover",
  secondary: NOTCH + " bg-sk-surface text-sk-ink inset-shadow-black/12 hover:not-data-disabled:bg-sk-well",
  ghost:
    "[--sk-skin-font:'Geist_Pixel',var(--sk-font-mono)] font-[family-name:var(--sk-skin-font)] text-sk-ink " +
    "hover:not-data-disabled:bg-sk-hover hover:not-data-disabled:shadow-[0_-3px_0_0,0_3px_0_0,-3px_0_0_0,3px_0_0_0] hover:not-data-disabled:shadow-sk-border-strong",
  danger: NOTCH + " bg-sk-danger-solid text-sk-danger-solid-fg hover:not-data-disabled:bg-sk-danger-solid-hover",
};

const SIZES: Record<Size, { label: string; square: string; icon: string }> = {
  sm: { label: "h-8 gap-2 px-3 text-[13px]/5 tracking-wide", square: "size-8", icon: "size-3.5" },
  md: { label: "h-10 gap-2 px-4 text-[15px]/5 tracking-wide", square: "size-10", icon: "size-4" },
  lg: { label: "h-12 gap-2.5 px-5 text-[17px]/6 tracking-wide", square: "size-12", icon: "size-4.5" },
};

const BASE =
  "group/button relative mx-[3px] inline-flex shrink-0 items-center justify-center rounded-none font-normal whitespace-nowrap select-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-sk-ring " +
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

  const content = (
    <>
      <span className="inline-flex items-center gap-[inherit] transition-opacity duration-150 group-data-loading/button:opacity-0">
        {icon && <span className={join("inline-flex shrink-0 [&>svg]:size-full", scale.icon)}>{icon}</span>}
        {hasLabel && <span className="[text-box:trim-both_cap_alphabetic]">{children}</span>}
        {iconRight && <span className={join("inline-flex shrink-0 [&>svg]:size-full", scale.icon)}>{iconRight}</span>}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className={scale.icon} />
        </span>
      )}
    </>
  );

  if (href !== undefined) {
    const inactive = disabled || loading;
    return (
      <a
        href={inactive ? undefined : href}
        role={inactive ? "link" : undefined}
        aria-disabled={inactive || undefined}
        aria-busy={loading || undefined}
        data-disabled={inactive ? "" : undefined}
        data-loading={loading ? "" : undefined}
        className={classes}
        {...(rest as ComponentPropsWithRef<"a">)}
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
