import type { ComponentPropsWithRef } from "react";

type Size = "sm" | "md" | "lg";

export type LoaderProps = ComponentPropsWithRef<"span"> & {
  size?: Size;
  /** Read by screen readers. */
  label?: string;
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

/* Orbit: two dots circling a faint ring at different speeds. Under reduced motion they rest. */
const SIZES: Record<Size, string> = { sm: "size-5", md: "size-8", lg: "size-12" };

export function Loader({ size = "md", label = "Loading", className, ...rest }: LoaderProps) {
  return (
    <span role="status" className={join("relative inline-block", SIZES[size] ?? SIZES.md, className)} {...rest}>
      <span aria-hidden="true" className="absolute inset-[12%] rounded-full border-[1.5px] border-sk-accent/20" />
      <span aria-hidden="true" className="absolute inset-0 animate-spin [animation-duration:1.2s] motion-reduce:animate-none">
        <span className="absolute top-0 left-1/2 size-[22%] -translate-x-1/2 rounded-full bg-sk-accent" />
      </span>
      <span aria-hidden="true" className="absolute inset-0 animate-spin [animation-duration:2.1s] [animation-direction:reverse] motion-reduce:animate-none">
        <span className="absolute bottom-[6%] left-1/2 size-[14%] -translate-x-1/2 rounded-full bg-sk-hue-300 dark:bg-sk-hue-400" />
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
