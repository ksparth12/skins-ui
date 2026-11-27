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
 * Liquid: two drops of your colour that pull apart and melt back into one, like ink in water. A blur
 * and a sharp alpha threshold join them where they touch, so the neck between them stretches and
 * snaps smoothly.
 */
function Mark({ px }: { px: number }) {
  const id = `sk-liquid-${px}`;
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className="size-full overflow-visible">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
        </filter>
      </defs>
      <g filter={`url(#${id})`} className="fill-sk-accent">
        <motion.circle cy="20" r="8" animate={{ cx: [14, 26, 14] }} transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }} />
        <motion.circle cy="20" r="6.5" animate={{ cx: [27, 13, 27] }} transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }} />
      </g>
    </svg>
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
