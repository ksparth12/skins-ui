/**
 * Folds: three glossy sheets curving over each other like a wallpaper, drawn in the current Hue.
 * Each sheet has its own fall of colour, a bright hairline where its edge catches the light and a long
 * soft shadow on the sheet behind, so glass in front has real edges to bend. The sheets drift slowly in
 * different directions and hold still under reduced motion. Dark mode falls into the deep shades; light
 * mode uses the middle of the ramp, deep enough that frosted glass still shows its edges.
 */
export function Folds() {
  const sheet = "absolute aspect-square rounded-full";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-linear-35 from-sk-hue-300 to-sk-hue-100 [container-type:size] dark:from-sk-hue-900 dark:to-sk-hue-deep">
      <div
        className={`${sheet} -top-[58%] -right-[34%] w-[max(112%,160cqh)] bg-linear-205 from-sk-hue-400 via-sk-hue-300 to-sk-hue-200 shadow-[-30px_40px_90px] shadow-black/10 inset-shadow-[0_2px_1px] inset-shadow-white/70 motion-safe:animate-[folds-a_26s_ease-in-out_infinite_alternate] dark:from-sk-hue-700 dark:via-sk-hue-900 dark:to-sk-hue-deep dark:shadow-black/55 dark:inset-shadow-white/20`}
      />
      <div
        className={`${sheet} -top-[10%] -left-[34%] w-[max(96%,124cqh)] bg-linear-140 from-sk-hue-100 via-sk-hue-300 to-sk-hue-500 shadow-[30px_36px_100px] shadow-black/12 inset-shadow-[0_2px_1px] inset-shadow-white motion-safe:animate-[folds-b_30s_ease-in-out_infinite_alternate] dark:from-sk-hue-500 dark:via-sk-hue-700 dark:to-sk-hue-deep dark:shadow-black/60 dark:inset-shadow-white/30`}
      />
      <div
        className={`${sheet} -bottom-[86%] left-[6%] w-[max(104%,150cqh)] bg-linear-165 from-sk-hue-50 via-sk-hue-200 to-sk-hue-400 shadow-[0_-36px_100px] shadow-black/12 inset-shadow-[0_2px_1px] inset-shadow-white motion-safe:animate-[folds-c_34s_ease-in-out_infinite_alternate] dark:from-sk-hue-400 dark:via-sk-hue-600 dark:to-sk-hue-900 dark:shadow-black/60 dark:inset-shadow-white/30`}
      />
      {/* A soft key light from above and a gentle vignette, so the sheets sit in one lit space. */}
      <div className="absolute inset-0 bg-radial-[70%_50%_at_50%_0%] from-white/25 to-transparent to-70% dark:from-white/8" />
    </div>
  );
}
