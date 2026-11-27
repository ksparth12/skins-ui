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
 * Neumorph: a soft panel pushed out of the page, with the photo pressed into a well in its face. Light
 * comes from the upper left. Shadows are only white and black.
 */
const FIGURE =
  "relative m-0 w-72 max-w-full rounded-[28px] bg-sk-surface p-3.5 dark:bg-sk-raised " +
  "[--nm-lit:color-mix(in_oklab,white_90%,transparent)] " +
  "[--nm-shade:color-mix(in_oklab,black_17%,transparent)] " +
  "dark:[--nm-lit:color-mix(in_oklab,white_5%,transparent)] " +
  "dark:[--nm-shade:color-mix(in_oklab,black_90%,transparent)] " +
  "bg-[image:linear-gradient(145deg,transparent,color-mix(in_oklab,black_6%,transparent))] " +
  "dark:bg-[image:linear-gradient(145deg,color-mix(in_oklab,white_9%,transparent),color-mix(in_oklab,black_35%,transparent))] " +
  "[box-shadow:inset_1px_1px_0_color-mix(in_oklab,white_80%,transparent),-8px_-8px_20px_var(--nm-lit),12px_12px_30px_var(--nm-shade)] " +
  "dark:[box-shadow:inset_1px_1px_0_color-mix(in_oklab,white_13%,transparent),-6px_-6px_16px_var(--nm-lit),12px_12px_30px_var(--nm-shade)]";

// The window the photo shows through.
const WINDOW =
  "relative overflow-hidden rounded-[18px] p-1.5 " +
  "[box-shadow:inset_3px_3px_8px_var(--nm-shade),inset_-3px_-3px_8px_var(--nm-lit)] [&>img]:rounded-[12px]";

const CAPTION =
  "px-1.5 pt-3.5 pb-0.5 text-sm font-medium text-sk-muted";

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
