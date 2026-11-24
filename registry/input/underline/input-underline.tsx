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

/* Underline: no box, just a line that draws itself in the ring colour on focus. */
const LABEL = "text-[13px] font-semibold text-sk-muted";
const CONTROL =
  "w-full min-w-0 border-0 border-b border-sk-border-strong bg-transparent px-0 text-sk-ink outline-none " +
  "bg-linear-to-r from-sk-ring to-sk-ring bg-no-repeat bg-[length:0%_2px] bg-bottom " +
  "transition-[background-size,border-color] duration-200 ease-out placeholder:text-sk-faint " +
  "hover:not-data-disabled:border-sk-ink focus:bg-[length:100%_2px] " +
  "data-invalid:border-sk-danger data-invalid:from-sk-danger data-invalid:to-sk-danger data-disabled:cursor-not-allowed data-disabled:opacity-50 " +
  "max-sm:text-base";
const SIZES = {
  sm: "h-8 text-[13px]",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
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
