import type { ComponentPropsWithRef } from "react";

type Ratio = "landscape" | "square" | "portrait";

export type FrameProps = Omit<ComponentPropsWithRef<"figure">, "children"> & {
  /** The photo. */
  src?: string;
  /** Describes the photo. Use an empty string when it is only decoration. */
  alt?: string;
  /** A short line under the photo. Leave it empty for none. */
  caption?: string;
  /** 4 by 3, 1 by 1 or 3 by 4. The photo is cropped to fit. */
  ratio?: Ratio;
};

const RATIOS: Record<Ratio, string> = { landscape: "aspect-[4/3]", square: "aspect-square", portrait: "aspect-[3/4]" };

/*
 * Polaroid: an instant print. A white border, deeper along the bottom where the caption goes, a faint
 * paper edge and a soft shadow, set at a slight tilt as if it had been dropped on the table. The print
 * stays white in dark mode, as paper would.
 */
const FIGURE =
  "relative m-0 w-72 max-w-full -rotate-2 bg-white p-3 pb-0 shadow-[0_1px_2px_0,0_18px_30px_-14px] " +
  "shadow-black/30 ring-1 ring-black/6 dark:shadow-black/70";

// The window the photo shows through.
const WINDOW =
  "relative overflow-hidden bg-black/5 after:pointer-events-none after:absolute after:inset-0 " +
  "after:inset-shadow-[0_0_0_1px] after:inset-shadow-black/10";

const CAPTION =
  "flex h-14 items-center justify-center px-2 text-center text-sm font-medium text-black/75";

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

const pick = <T extends string>(value: T | undefined, allowed: readonly T[], fallback: T): T =>
  value && allowed.includes(value) ? value : fallback;

export function Frame({ src, alt = "", caption, ratio, className, ...rest }: FrameProps) {
  return (
    <figure {...rest} className={join(FIGURE, className)}>
      <div className={join(WINDOW, RATIOS[pick(ratio, ["landscape", "square", "portrait"], "landscape")])}>
        {src && <img src={src} alt={alt} className="size-full object-cover" />}
      </div>
      {caption && <figcaption className={CAPTION}>{caption}</figcaption>}
    </figure>
  );
}
