import { motion } from "motion/react";
import type { ComponentPropsWithRef } from "react";

type Size = "sm" | "md" | "lg";

export type LoaderProps = ComponentPropsWithRef<"span"> & {
  size?: Size;
  /** Read by screen readers. */
  label?: string;
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");
/* Dots: three dots rising and settling in turn. Under reduced motion they rest. */
const SIZES: Record<Size, { dot: string; gap: string; lift: number }> = {
  sm: { dot: "size-1", gap: "gap-1", lift: 3 },
  md: { dot: "size-1.5", gap: "gap-1.5", lift: 4 },
  lg: { dot: "size-2.5", gap: "gap-2", lift: 6 },
};

export function Loader({ size = "md", label = "Loading", className, ...rest }: LoaderProps) {
  const s = SIZES[size] ?? SIZES.md;
  return (
    <span role="status" className={join("inline-flex items-center", s.gap, className)} {...rest}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className={join("rounded-full bg-sk-accent", s.dot)}
          animate={{ y: [0, -s.lift, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
}
