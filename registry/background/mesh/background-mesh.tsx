import type { ComponentPropsWithRef } from "react";

type Speed = "still" | "slow" | "medium";

export type BackgroundProps = ComponentPropsWithRef<"div"> & {
  /** Still draws one frame and stops. */
  speed?: Speed;
  /** A fine film grain over the colour. */
  grain?: boolean;
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

/*
 * Mesh: soft fields of one hue family drifting slowly over a calm base.
 * The middle stays quiet so content reads. Under reduced motion it holds still.
 */
const KEYFRAMES = `
@keyframes sk-mesh-a { 0%, 100% { translate: 0 0; } 50% { translate: 8% 6%; } }
@keyframes sk-mesh-b { 0%, 100% { translate: 0 0; } 50% { translate: -7% -5%; } }
@keyframes sk-mesh-c { 0%, 100% { translate: 0 0; } 50% { translate: 5% -7%; } }
`;

const DURATION: Record<Speed, number> = { still: 0, slow: 26, medium: 14 };

const FIELD = "absolute rounded-full blur-3xl will-change-transform motion-reduce:[animation:none!important]";

/** A fine, still film grain. */
function Grain() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full opacity-[0.18] mix-blend-overlay">
      <filter id="sk-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#sk-grain)" />
    </svg>
  );
}

export function Background({ speed = "slow", grain = false, className, children, ...rest }: BackgroundProps) {
  const seconds = DURATION[speed] ?? DURATION.slow;
  const run = (name: string, factor: number) =>
    seconds ? { animation: `${name} ${seconds * factor}s ease-in-out infinite` } : undefined;
  return (
    <div className={join("relative isolate size-full overflow-hidden bg-sk-hue-100 dark:bg-sk-hue-deep", className)} {...rest}>
      <style href="sk-background-mesh" precedence="default">{KEYFRAMES}</style>
      <div aria-hidden="true" className="absolute inset-0">
        <div className={join(FIELD, "-top-1/4 -left-1/6 size-[70%] bg-sk-hue-300/80 dark:bg-sk-hue-600/70")} style={run("sk-mesh-a", 1)} />
        <div className={join(FIELD, "-right-1/6 -bottom-1/3 size-[75%] bg-sk-hue-500/55 dark:bg-sk-hue-800/80")} style={run("sk-mesh-b", 1.3)} />
        <div className={join(FIELD, "top-1/3 right-1/5 size-[40%] bg-sk-hue-200/90 dark:bg-sk-hue-500/45")} style={run("sk-mesh-c", 0.8)} />
      </div>
      {grain && <Grain />}
      <div className="relative z-10 grid size-full place-items-center p-8 text-center font-sk-display text-3xl font-semibold text-sk-ink">{children}</div>
    </div>
  );
}
