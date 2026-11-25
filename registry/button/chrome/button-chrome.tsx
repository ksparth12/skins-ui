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
 * Chrome: anodised metal in your colour. Light falls softly from the top, a gentle shade sits just
 * under the middle and the bottom edge picks up a little light again, with no hard line anywhere. A
 * bright bevel along the top, a darker edge outside and a neutral drop shadow give it weight. On hover
 * a soft sheen passes over once, left to right; moving away resets it out of sight, so it never runs
 * backwards. Secondary is polished silver in light mode and gunmetal in dark mode.
 */
const METAL =
  "overflow-hidden " +
  // The reflection: one smooth top-to-bottom travel drawn from five stops a skin can retune.
  "bg-[image:linear-gradient(180deg,var(--chrome-top),var(--chrome-mid)_44%,var(--chrome-low)_58%,transparent_84%,var(--chrome-lift))] " +
  // Bevel, edge and drop, all neutral.
  "[box-shadow:inset_0_1px_0_var(--chrome-bevel),inset_0_-1px_0_var(--chrome-foot),0_0_0_1px_var(--chrome-edge),0_1px_2px_var(--chrome-drop),0_6px_12px_-6px_var(--chrome-drop)] " +
  "[--chrome-drop:color-mix(in_oklab,black_22%,transparent)] dark:[--chrome-drop:color-mix(in_oklab,black_70%,transparent)] " +
  // The sheen, the skin's signature: slower than any interface motion on purpose.
  "before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:z-0 before:w-1/3 before:-skew-x-12 " +
  "before:bg-linear-to-r before:from-transparent before:via-(--chrome-sheen) before:to-transparent before:transition-none " +
  "hover:not-data-disabled:before:translate-x-[450%] hover:not-data-disabled:before:transition-transform " +
  "hover:not-data-disabled:before:duration-700 hover:not-data-disabled:before:ease-sk-out motion-reduce:before:hidden";

// Anodised colour: shared by primary and danger, which differ only in their fill.
const ANODISED =
  "[--chrome-top:color-mix(in_oklab,white_30%,transparent)] [--chrome-mid:color-mix(in_oklab,white_6%,transparent)] " +
  "[--chrome-low:color-mix(in_oklab,black_14%,transparent)] [--chrome-lift:color-mix(in_oklab,white_12%,transparent)] " +
  "[--chrome-bevel:color-mix(in_oklab,white_45%,transparent)] [--chrome-foot:color-mix(in_oklab,white_14%,transparent)] " +
  "[--chrome-edge:color-mix(in_oklab,black_30%,transparent)] [--chrome-sheen:color-mix(in_oklab,white_28%,transparent)] " +
  "active:not-data-disabled:[--chrome-low:color-mix(in_oklab,black_22%,transparent)] " +
  "text-shadow-[0_-1px_0] text-shadow-black/25";

const VARIANTS: Record<Variant, string> = {
  primary:
    METAL + " " + ANODISED + " bg-sk-accent text-sk-accent-fg " +
    "hover:not-data-disabled:bg-sk-accent-hover active:not-data-disabled:bg-sk-accent-active",
  secondary:
    METAL + " bg-sk-surface text-sk-ink text-shadow-[0_1px_0] text-shadow-white/90 " +
    // Silver: a white face shaded by the same travel.
    "[--chrome-top:transparent] [--chrome-mid:color-mix(in_oklab,black_3%,transparent)] " +
    "[--chrome-low:color-mix(in_oklab,black_11%,transparent)] [--chrome-lift:color-mix(in_oklab,black_2%,transparent)] " +
    "[--chrome-bevel:white] [--chrome-foot:color-mix(in_oklab,white_70%,transparent)] " +
    "[--chrome-edge:color-mix(in_oklab,black_18%,transparent)] [--chrome-sheen:color-mix(in_oklab,white_85%,transparent)] " +
    "hover:not-data-disabled:[--chrome-mid:color-mix(in_oklab,black_5%,transparent)] " +
    "active:not-data-disabled:[--chrome-low:color-mix(in_oklab,black_16%,transparent)] " +
    // Gunmetal: a dark face lit from above.
    "dark:bg-sk-raised dark:text-shadow-[0_-1px_0] dark:text-shadow-black/60 " +
    "dark:[--chrome-top:color-mix(in_oklab,white_16%,transparent)] dark:[--chrome-mid:color-mix(in_oklab,white_6%,transparent)] " +
    "dark:[--chrome-low:color-mix(in_oklab,black_30%,transparent)] dark:[--chrome-lift:color-mix(in_oklab,white_7%,transparent)] " +
    "dark:[--chrome-bevel:color-mix(in_oklab,white_20%,transparent)] dark:[--chrome-foot:color-mix(in_oklab,white_6%,transparent)] " +
    "dark:[--chrome-edge:color-mix(in_oklab,black_80%,transparent)] dark:[--chrome-sheen:color-mix(in_oklab,white_14%,transparent)] " +
    "dark:hover:not-data-disabled:[--chrome-mid:color-mix(in_oklab,white_9%,transparent)] " +
    "dark:active:not-data-disabled:[--chrome-low:color-mix(in_oklab,black_45%,transparent)]",
  ghost:
    "text-sk-ink hover:not-data-disabled:bg-sk-hover active:not-data-disabled:bg-sk-press " +
    "hover:not-data-disabled:[box-shadow:inset_0_1px_0_white,0_0_0_1px_color-mix(in_oklab,black_8%,transparent)] " +
    "dark:hover:not-data-disabled:[box-shadow:inset_0_1px_0_color-mix(in_oklab,white_10%,transparent)]",
  danger:
    METAL + " " + ANODISED + " bg-sk-danger-solid text-sk-danger-solid-fg " +
    "hover:not-data-disabled:bg-sk-danger-solid-hover active:not-data-disabled:bg-sk-danger-solid-active",
};

const SIZES: Record<Size, { label: string; square: string; icon: string }> = {
  sm: { label: "h-8 gap-1.5 rounded-lg px-3.5 text-[13px]/5 font-semibold", square: "size-8 rounded-lg", icon: "size-3.5" },
  md: { label: "h-10 gap-2 rounded-xl px-5 text-sm/5 font-semibold", square: "size-10 rounded-xl", icon: "size-4" },
  lg: { label: "h-12 gap-2 rounded-[14px] px-6 text-[15px]/6 font-semibold", square: "size-12 rounded-[14px]", icon: "size-4.5" },
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
