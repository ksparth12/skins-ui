import type { ComponentPropsWithRef } from "react";

type Size = "sm" | "md" | "lg";

export type LoaderProps = ComponentPropsWithRef<"span"> & {
  size?: Size;
  /** Read by screen readers. */
  label?: string;
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

/* Bar: a track with a soft band sliding across it. Under reduced motion the band rests in the middle. */
const SIZES: Record<Size, string> = { sm: "h-1 w-24", md: "h-1.5 w-40", lg: "h-2 w-64" };

const KEYFRAMES = `@keyframes sk-loader-bar { from { translate: -100% 0; } to { translate: 250% 0; } }`;

export function Loader({ size = "md", label = "Loading", className, ...rest }: LoaderProps) {
  return (
    <span role="status" className={join("relative inline-block overflow-hidden rounded-full bg-sk-accent-subtle", SIZES[size] ?? SIZES.md, className)} {...rest}>
      <style href="sk-loader-bar" precedence="default">{KEYFRAMES}</style>
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-linear-to-r from-transparent via-sk-accent to-transparent [animation:sk-loader-bar_1.3s_cubic-bezier(0.45,0,0.55,1)_infinite] motion-reduce:left-[30%] motion-reduce:animate-none"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
