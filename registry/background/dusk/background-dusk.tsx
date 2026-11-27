import { motion } from "motion/react";
import type { ComponentPropsWithRef } from "react";

type Speed = "still" | "slow" | "medium";

export type BackgroundProps = ComponentPropsWithRef<"div"> & {
  /** Still draws one frame and stops. Reduced motion always holds still. */
  speed?: Speed;
  /** A fine film grain over the colour. */
  grain?: boolean;
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

/*
 * Dusk: the sky just after sunset, in one hue. Your colour sits low on the horizon and the field falls
 * upward into a near-black shade of itself, with a soft light that drifts slowly along the horizon.
 * Plain CSS gradients and one moving layer, so it costs almost nothing to draw.
 */
const DURATION: Record<Exclude<Speed, "still">, number> = { slow: 28, medium: 14 };

function Grain() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full opacity-[0.16] mix-blend-overlay">
      <filter id="sk-dusk-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#sk-dusk-grain)" />
    </svg>
  );
}

export function Background({ speed = "slow", grain = false, className, children, ...rest }: BackgroundProps) {
  const moving = speed === "slow" || speed === "medium";
  return (
    <div
      {...rest}
      className={join(
        "relative isolate size-full overflow-hidden bg-linear-to-t from-sk-hue-700 via-sk-hue-900 via-45% to-sk-hue-deep",
        className,
      )}
    >
      <motion.div
        aria-hidden="true"
        className="absolute -inset-x-1/4 -bottom-1/3 h-2/3 rounded-[50%] bg-radial from-sk-hue-400/55 via-sk-hue-600/25 via-45% to-transparent to-70%"
        initial={false}
        animate={moving ? { x: ["-8%", "8%", "-8%"] } : { x: "0%" }}
        transition={moving ? { duration: DURATION[speed], ease: "easeInOut", repeat: Infinity } : { duration: 0 }}
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-sk-hue-deep/60 to-transparent" />
      {grain && <Grain />}
      <div className="relative z-10 grid size-full place-items-center p-8 text-center font-sk-display text-3xl font-semibold text-balance text-white">
        {children}
      </div>
    </div>
  );
}
