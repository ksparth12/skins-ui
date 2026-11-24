import { Field } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentPropsWithRef } from "react";

type Size = "sm" | "md" | "lg";

export type InputProps = Omit<ComponentPropsWithRef<"input">, "size"> & {
  label?: string;
  /** A short hint under the field. */
  description?: string;
  /** Shown instead of the description, and marks the field invalid. */
  error?: string;
  /** 32, 40 or 48 pixels tall. */
  size?: Size;
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

/* Glass: a frosted field lit from above. Focus brightens the pane and draws the ring. */
const LABEL = "text-[13px] font-semibold text-sk-ink";
const CONTROL =
  "w-full min-w-0 text-sk-ink outline-none backdrop-blur-xl backdrop-saturate-150 " +
  "bg-white/45 inset-ring inset-ring-white/60 inset-shadow-[0_1px_0_0] inset-shadow-white/80 " +
  "dark:bg-white/8 dark:inset-ring-white/12 dark:inset-shadow-white/15 " +
  "transition-[background-color,box-shadow] duration-150 ease-out placeholder:text-sk-ink/45 " +
  "hover:not-data-disabled:bg-white/55 dark:hover:not-data-disabled:bg-white/12 " +
  "focus:bg-white/70 focus:ring-2 focus:ring-sk-ring dark:focus:bg-white/14 " +
  "data-invalid:ring-2 data-invalid:ring-sk-danger data-disabled:cursor-not-allowed data-disabled:opacity-50 " +
  "max-sm:text-base";
const SIZES = {
  sm: "h-8 rounded-lg px-2.5 text-[13px]",
  md: "h-10 rounded-xl px-3 text-sm",
  lg: "h-12 rounded-[14px] px-3.5 text-[15px]",
};

export function Input({ label, description, error, size, disabled, className, ...rest }: InputProps) {
  const s = SIZES[size === "sm" || size === "lg" ? size : "md"];
  const invalid = Boolean(error);
  return (
    <Field.Root invalid={invalid} disabled={disabled} className={join("grid w-72 max-w-full gap-1.5", className)}>
      {label && <Field.Label className={LABEL}>{label}</Field.Label>}
      <BaseInput className={join(CONTROL, s)} {...rest} />
      {invalid ? (
        <p role="alert" className="text-[13px]/5 text-sk-danger">{error}</p>
      ) : (
        description && <Field.Description className="text-[13px]/5 text-sk-muted">{description}</Field.Description>
      )}
    </Field.Root>
  );
}
