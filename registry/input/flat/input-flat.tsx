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

/* Flat: a sunken well at rest that lifts to the surface with a soft ring on focus. */
const LABEL = "text-[13px] font-semibold text-sk-ink";
const CONTROL =
  "w-full min-w-0 border border-sk-border bg-sk-well text-sk-ink shadow-sk-inset outline-none " +
  "transition-[border-color,background-color,box-shadow] duration-150 ease-out placeholder:text-sk-faint " +
  "hover:not-data-disabled:border-sk-border-strong focus:border-sk-ring focus:bg-sk-surface focus:ring-3 focus:ring-sk-ring/20 " +
  "data-invalid:border-sk-danger focus:data-invalid:ring-sk-danger/20 data-disabled:cursor-not-allowed data-disabled:opacity-50 " +
  "max-sm:text-base";
const SIZES = {
  sm: "h-8 rounded-md px-2.5 text-[13px]",
  md: "h-10 rounded-lg px-3 text-sm",
  lg: "h-12 rounded-lg px-3.5 text-[15px]",
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
