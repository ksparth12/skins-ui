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
 * Brutal: the photo in a thick ink border with a big hard shadow in ink, and a caption bar below it set
 * in bold capitals on a tint of your colour.
 */
const FIGURE =
  "relative m-0 w-72 max-w-full border-2 border-sk-ink bg-sk-surface shadow-[6px_6px_0_0_var(--sk-ink)]";

// The window the photo shows through.
const WINDOW =
  "relative overflow-hidden";

const CAPTION =
  "border-t-2 border-sk-ink bg-sk-hue-100 px-3 py-2.5 text-xs font-bold tracking-wider text-black uppercase " +
  "dark:bg-sk-hue-200";

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
