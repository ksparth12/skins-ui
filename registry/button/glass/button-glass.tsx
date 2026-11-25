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
 * Glass: a frosted pill that blurs and brightens what is behind it. Light falls from above: a bright
 * rim on the top edge, a soft sheen across the upper half and a neutral shadow below.
 * The coloured fills rest one shade deep so the label stays readable over any backdrop.
 */
const MATERIAL =
  "backdrop-blur-md backdrop-saturate-150 inset-ring inset-shadow-[0_1px_0_0] " +
  "shadow-[0_1px_2px_0,0_12px_28px_-12px] shadow-black/25 dark:shadow-black/55 " +
  "before:pointer-events-none before:absolute before:inset-x-px before:top-px before:h-1/2 before:rounded-t-[inherit] " +
  "before:bg-linear-to-b before:from-white/18 before:to-transparent";

const VARIANTS: Record<Variant, string> = {
  primary:
    MATERIAL + " bg-sk-accent-hover/85 text-sk-accent-fg inset-ring-white/25 inset-shadow-white/50 " +
    "hover:not-data-disabled:bg-sk-accent-active/85 active:not-data-disabled:bg-sk-accent-active",
  secondary:
    MATERIAL + " bg-white/45 text-sk-ink inset-ring-white/70 inset-shadow-white " +
    "hover:not-data-disabled:bg-white/60 active:not-data-disabled:bg-white/35 " +
    // In the dark the pane is smoked rather than milky, so its white label holds over bright colour.
    "dark:bg-black/28 dark:inset-ring-white/16 dark:inset-shadow-white/30 " +
    "dark:hover:not-data-disabled:bg-black/36 dark:active:not-data-disabled:bg-black/44",
  ghost:
    "text-sk-ink hover:not-data-disabled:bg-white/35 hover:not-data-disabled:backdrop-blur-md active:not-data-disabled:bg-white/25 " +
    "dark:hover:not-data-disabled:bg-white/10 dark:active:not-data-disabled:bg-white/6",
  danger:
    MATERIAL + " bg-sk-danger-solid-hover/88 text-sk-danger-solid-fg inset-ring-white/25 inset-shadow-white/45 " +
    "hover:not-data-disabled:bg-sk-danger-solid-active/88 active:not-data-disabled:bg-sk-danger-solid-active",
};

const SIZES: Record<Size, { label: string; square: string; icon: string }> = {
  sm: { label: "h-8 gap-1.5 rounded-full px-3.5 text-[13px]/5 font-medium", square: "size-8 rounded-full", icon: "size-3.5" },
  md: { label: "h-10 gap-2 rounded-full px-5 text-sm/5 font-medium", square: "size-10 rounded-full", icon: "size-4" },
  lg: { label: "h-12 gap-2 rounded-full px-6 text-[15px]/6 font-medium", square: "size-12 rounded-full", icon: "size-4.5" },
};

const BASE =
  "group/button relative isolate inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none " +
  "transition-[background-color,box-shadow,scale] duration-(--sk-motion-fast) ease-sk-out " +
  "active:not-data-disabled:scale-[0.97] active:not-data-disabled:transition-[scale] " +
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
