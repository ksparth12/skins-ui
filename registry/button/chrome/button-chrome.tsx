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
 * Chrome: a polished metal surface. Light bands run across the face, and a band of light
 * sweeps over it on hover. Shadows stay neutral.
 */
const METAL =
  "overflow-hidden bg-linear-to-b from-white/40 via-black/10 via-55% to-white/20 " +
  "inset-shadow-[0_1px_0_0] inset-shadow-white/60 inset-ring inset-ring-black/20 " +
  "shadow-[0_1px_2px_0,0_4px_12px_-4px] shadow-black/25 dark:shadow-black/50 " +
  "before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/2 before:-skew-x-12 " +
  "before:bg-linear-to-r before:from-transparent before:via-white/50 before:to-transparent " +
  "before:transition-transform before:duration-700 before:ease-out hover:not-data-disabled:before:translate-x-[300%] motion-reduce:before:hidden";

const VARIANTS: Record<Variant, string> = {
  primary: METAL + " bg-sk-accent text-sk-accent-fg hover:not-data-disabled:bg-sk-accent-hover active:not-data-disabled:bg-sk-accent-active",
  secondary:
    METAL + " bg-sk-surface text-sk-ink from-white via-black/8 to-white/40 hover:not-data-disabled:via-black/12 " +
    "dark:bg-white/14 dark:from-white/25 dark:via-black/30 dark:to-white/10 dark:inset-shadow-white/25 dark:inset-ring-white/10",
  ghost:
    "text-sk-ink hover:not-data-disabled:bg-linear-to-b hover:not-data-disabled:from-white/50 hover:not-data-disabled:to-black/5 hover:not-data-disabled:inset-ring hover:not-data-disabled:inset-ring-black/10 " +
    "dark:hover:not-data-disabled:from-white/12 dark:hover:not-data-disabled:to-white/4 dark:hover:not-data-disabled:inset-ring-white/10",
  danger: METAL + " bg-sk-danger-solid text-sk-danger-solid-fg hover:not-data-disabled:bg-sk-danger-solid-hover active:not-data-disabled:bg-sk-danger-solid-active",
};

const SIZES: Record<Size, { label: string; square: string; icon: string }> = {
  sm: { label: "h-8 gap-1.5 rounded-md px-3 text-[13px]/5", square: "size-8 rounded-md", icon: "size-3.5" },
  md: { label: "h-10 gap-2 rounded-lg px-4 text-sm/5", square: "size-10 rounded-lg", icon: "size-4" },
  lg: { label: "h-12 gap-2 rounded-[10px] px-5 text-[15px]/6", square: "size-12 rounded-[10px]", icon: "size-4.5" },
};

const BASE =
  "group/button relative isolate inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,box-shadow,scale] duration-150 ease-out active:not-data-disabled:scale-[0.97] " +
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
