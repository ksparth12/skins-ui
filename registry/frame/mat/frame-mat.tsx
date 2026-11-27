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
 * Gallery mat: the way prints hang in a gallery. A thin dark frame holds a wide, pale mat, and the photo
 * shows through a window cut in the mat with a fine bevelled edge that catches the light. The caption is
 * a small label on the mat.
 */
const FIGURE =
  "relative m-2 w-80 max-w-full bg-sk-well p-[22px] pb-0 ring-8 ring-sk-ink " +
  "shadow-[0_1px_2px_0,0_22px_40px_-16px] shadow-black/40 dark:ring-black dark:shadow-black/80";

// The window the photo shows through.
const WINDOW =
  "relative overflow-hidden after:pointer-events-none after:absolute after:inset-0 " +
  "after:[box-shadow:inset_0_0_0_3px_white,inset_0_0_0_4px_color-mix(in_oklab,black_15%,transparent)] " +
  "dark:after:[box-shadow:inset_0_0_0_3px_color-mix(in_oklab,white_85%,black),inset_0_0_0_4px_color-mix(in_oklab,black_40%,transparent)]";

const CAPTION =
  "m-0 py-4 text-center text-xs tracking-wide text-sk-muted";

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
