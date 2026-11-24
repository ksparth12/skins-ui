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
 * Glass: a see-through pane that blurs what is behind it, lit from above.
 * Every variant shares the same material: a top highlight, a bright edge and a soft sheen
 * that grows on hover. Shadows stay neutral.
 */
const MATERIAL =
  "backdrop-blur-xl backdrop-saturate-150 bg-linear-to-b to-transparent " +
  "inset-shadow-[0_1px_0_0] inset-ring " +
  "shadow-[0_1px_2px_0,0_8px_20px_-8px] shadow-black/15 dark:shadow-black/40";

/* Ghost takes the material only while it is hovered, so at rest it is just its label. */
const GHOST_MATERIAL =
  "hover:not-data-disabled:backdrop-blur-xl hover:not-data-disabled:backdrop-saturate-150 " +
  "hover:not-data-disabled:inset-shadow-[0_1px_0_0] hover:not-data-disabled:inset-ring";

const VARIANTS: Record<Variant, string> = {
  primary:
    MATERIAL + " bg-sk-accent/80 text-sk-accent-fg from-white/25 inset-shadow-white/45 inset-ring-white/20 " +
    "hover:not-data-disabled:bg-sk-accent/90 hover:not-data-disabled:from-white/35 active:not-data-disabled:bg-sk-accent-active/90 active:not-data-disabled:from-white/15",
  secondary:
    MATERIAL + " bg-white/55 text-sk-ink from-white/60 inset-shadow-white/90 inset-ring-white/60 " +
    "hover:not-data-disabled:bg-white/70 active:not-data-disabled:bg-white/45 " +
    "dark:bg-white/8 dark:from-white/12 dark:inset-shadow-white/20 dark:inset-ring-white/12 " +
    "dark:hover:not-data-disabled:bg-white/14 dark:active:not-data-disabled:bg-white/6",
  ghost:
    GHOST_MATERIAL + " text-sk-ink inset-shadow-white/70 inset-ring-white/50 " +
    "hover:not-data-disabled:bg-white/40 active:not-data-disabled:bg-white/25 " +
    "dark:inset-shadow-white/15 dark:inset-ring-white/12 " +
    "dark:hover:not-data-disabled:bg-white/8 dark:active:not-data-disabled:bg-white/5",
  danger:
    MATERIAL + " bg-sk-danger-solid/92 text-sk-danger-solid-fg from-white/22 inset-shadow-white/40 inset-ring-white/20 " +
    "hover:not-data-disabled:bg-sk-danger-solid hover:not-data-disabled:from-white/30 active:not-data-disabled:bg-sk-danger-solid-active",
};

const SIZES: Record<Size, { label: string; square: string; icon: string }> = {
  sm: { label: "h-8 gap-1.5 rounded-lg px-3 text-[13px]/5", square: "size-8 rounded-lg", icon: "size-3.5" },
  md: { label: "h-10 gap-2 rounded-xl px-4 text-sm/5", square: "size-10 rounded-xl", icon: "size-4" },
  lg: { label: "h-12 gap-2 rounded-[14px] px-5 text-[15px]/6", square: "size-12 rounded-[14px]", icon: "size-4.5" },
};

const BASE =
  "group/button relative isolate inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,--tw-gradient-from,box-shadow,scale] duration-150 ease-out active:not-data-disabled:scale-[0.97] " +
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
