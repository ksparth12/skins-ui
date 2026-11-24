import type { ComponentPropsWithRef } from "react";

type Size = "sm" | "md" | "lg";

export type LoaderProps = ComponentPropsWithRef<"span"> & {
  size?: Size;
  /** Read by screen readers. */
  label?: string;
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

/* Ring: a faint track with one arc turning around it. Under reduced motion the arc rests. */
const SIZES: Record<Size, string> = { sm: "size-4", md: "size-6", lg: "size-9" };

export function Loader({ size = "md", label = "Loading", className, ...rest }: LoaderProps) {
  return (
    <span role="status" className={join("inline-flex text-sk-accent", SIZES[size] ?? SIZES.md, className)} {...rest}>
      <svg viewBox="0 0 24 24" fill="none" className="size-full animate-spin [animation-duration:900ms] motion-reduce:animate-none" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2.5" />
        <path d="M21.5 12A9.5 9.5 0 0 0 12 2.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
