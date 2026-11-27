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
 * Orbit: a bead of your colour circling a faint ring, followed by two smaller beads that fade behind it
 * like a short tail. The beads ride one turning frame, so they never drift apart.
 */
const TAIL = [
  { angle: 0, scale: 1, opacity: 1 },
  { angle: -26, scale: 0.72, opacity: 0.5 },
  { angle: -50, scale: 0.5, opacity: 0.22 },
];

function Mark({ px }: { px: number }) {
  const bead = Math.max(4, Math.round(px * 0.22));
  return (
    <>
      <span aria-hidden="true" className="absolute inset-[12%] rounded-full border border-sk-border-strong" />
      <motion.span
        aria-hidden="true"
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
      >
        {TAIL.map((t) => (
          <span key={t.angle} className="absolute inset-0" style={{ rotate: `${t.angle}deg` }}>
            <span
              className="absolute top-[12%] left-1/2 rounded-full bg-sk-accent"
              style={{ width: bead, height: bead, opacity: t.opacity, translate: "-50% -50%", scale: t.scale }}
            />
          </span>
        ))}
      </motion.span>
    </>
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
