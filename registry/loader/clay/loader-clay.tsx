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
 * Clay: three soft, puffy beads in shades of your colour that rise and settle one after another. Each has
 * a broad highlight on top and a shade gathered underneath. They ease in and out with no bounce.
 */
const BEADS = ["bg-sk-hue-300", "bg-sk-accent", "bg-sk-hue-700"];

function Mark({ px }: { px: number }) {
  const bead = Math.round(px * 0.28);
  const lift = Math.max(2, Math.round(px * 0.16));
  return (
    <span aria-hidden="true" className="flex size-full items-center justify-center" style={{ gap: Math.max(2, Math.round(px * 0.07)) }}>
      {BEADS.map((colour, i) => (
        <motion.span
          key={colour}
          className={join(
            "relative rounded-full inset-shadow-[0_-2px_3px_0] inset-shadow-black/20",
            "before:absolute before:inset-0 before:rounded-[inherit] before:bg-radial-[ellipse_at_35%_25%] before:from-white/70 before:to-transparent before:to-60%",
            colour,
          )}
          style={{ width: bead, height: bead }}
          animate={{ y: [0, -lift, 0] }}
          transition={{ duration: 0.9, ease: "easeInOut", repeat: Infinity, delay: i * 0.15, repeatDelay: 0.15 }}
        />
      ))}
    </span>
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
