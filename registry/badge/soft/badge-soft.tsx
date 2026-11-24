import type { ComponentPropsWithRef } from "react";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";
type Size = "sm" | "md";

export type BadgeProps = ComponentPropsWithRef<"span"> & {
  tone?: Tone;
  /** 20 or 24 pixels tall. */
  size?: Size;
  /** A small dot before the label. */
  dot?: boolean;
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");
const pick = <T extends string>(value: T | undefined, allowed: readonly T[], fallback: T): T =>
  value && allowed.includes(value) ? value : fallback;

/* Soft: a tinted fill and its own darker text. No outline. */
const BASE = "inline-flex shrink-0 items-center gap-1.5 font-semibold whitespace-nowrap";

const TONES: Record<Tone, string> = {
  neutral: "bg-sk-well text-sk-muted",
  accent: "bg-sk-accent-subtle text-sk-accent-subtle-fg",
  success: "bg-sk-success-soft text-sk-success",
  warning: "bg-sk-warning-soft text-sk-warning",
  danger: "bg-sk-danger-soft text-sk-danger",
};

const SIZES: Record<Size, string> = {
  sm: "h-5 rounded-[5px] px-1.5 text-[11px]/4",
  md: "h-6 rounded-md px-2 text-xs/4",
};

export function Badge({ tone, size, dot = false, className, children, ...rest }: BadgeProps) {
  const t = pick(tone, ["neutral", "accent", "success", "warning", "danger"], "accent");
  const s = pick(size, ["sm", "md"], "md");
  return (
    <span className={join(BASE, TONES[t], SIZES[s], className)} {...rest}>
      {dot && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />}
      <span className="[text-box:trim-both_cap_alphabetic]">{children}</span>
    </span>
  );
}
