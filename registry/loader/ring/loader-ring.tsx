import { motion } from "motion/react";
import type { ComponentPropsWithRef } from "react";

type Size = "sm" | "md" | "lg";

export type LoaderProps = Omit<ComponentPropsWithRef<"span">, "children"> & {
  /** 16, 24 or 40 pixels, to sit in a button, a field or a page. */
  size?: Size;
  /** Read by screen readers. Say what is loading when you can. */
  label?: string;
};

const PIXELS: Record<Size, number> = { sm: 16, md: 24, lg: 40 };

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

/*
 * Ring: a thin arc of your colour turning steadily on a faint track. The stroke thickens a little as
 * the loader grows, so it reads at every size.
 */
function Mark({ px }: { px: number }) {
  const stroke = px <= 16 ? 2 : px <= 24 ? 2.5 : 3;
  const r = 12 - stroke / 2;
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
    >
      <circle cx="12" cy="12" r={r} fill="none" strokeWidth={stroke} className="stroke-sk-border-strong" />
      <circle
        cx="12"
        cy="12"
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="28 100"
        className="stroke-sk-accent"
      />
    </motion.svg>
  );
}

export function Loader({ size, label = "Loading", className, style, ...rest }: LoaderProps) {
  const px = PIXELS[size === "sm" || size === "lg" ? size : "md"];
  return (
    <span {...rest} role="status" className={join("relative inline-flex shrink-0 items-center justify-center", className)} style={{ width: px, height: px, ...style }}>
      <Mark px={px} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
