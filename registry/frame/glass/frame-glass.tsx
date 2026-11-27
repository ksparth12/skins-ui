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
 * Glass: the photo held in a thick mount of frosted glass that blurs and brightens what is behind it.
 * Light falls from above: a bright rim along the top of the mount and a neutral shadow below. The
 * caption sits on the glass.
 */
const FIGURE =
  "relative isolate m-0 w-72 max-w-full overflow-hidden rounded-[28px] bg-white/40 p-2.5 backdrop-blur-xl " +
  "backdrop-saturate-150 inset-ring inset-ring-white/70 inset-shadow-[0_1px_0_0] inset-shadow-white " +
  "shadow-[0_1px_2px_0,0_24px_48px_-20px] shadow-black/30 dark:bg-black/30 dark:inset-ring-white/16 " +
  "dark:inset-shadow-white/30 dark:shadow-black/60";

// The window the photo shows through.
const WINDOW =
  "relative overflow-hidden rounded-[18px] after:pointer-events-none after:absolute after:inset-0 " +
  "after:rounded-[inherit] after:inset-ring after:inset-ring-white/25";

const CAPTION =
  "px-2 pt-3 pb-1.5 text-sm font-medium text-sk-ink";

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
