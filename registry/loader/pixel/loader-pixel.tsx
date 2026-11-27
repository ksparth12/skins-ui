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
 * Pixel: eight squares around the edge of a three by three frame light up in turn, clockwise, one hard
 * step at a time. The lit square is your colour; the others rest as faint ink.
 */
// Clockwise around the frame, starting top left; the middle square stays empty.
const CELLS = [0, 1, 2, 5, 8, 7, 6, 3];
const STEP = 0.11;

function Mark({ px }: { px: number }) {
  const gap = px <= 16 ? 1 : 2;
  return (
    <span aria-hidden="true" className="grid size-full grid-cols-3 grid-rows-3" style={{ gap }}>
      {Array.from({ length: 9 }, (_, i) => {
        const order = CELLS.indexOf(i);
        if (order < 0) return <span key={i} />;
        return (
          <motion.span
            key={i}
            className="bg-sk-accent"
            initial={{ opacity: 0.18 }}
            animate={{ opacity: [1, 0.55, 0.18, 0.18, 0.18, 0.18, 0.18, 0.18] }}
            transition={{ duration: STEP * 8, ease: "linear", times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 1], repeat: Infinity, delay: order * STEP, repeatType: "loop" }}
          />
        );
      })}
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
