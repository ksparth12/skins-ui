import { PlusIcon } from "~/components/icons";

interface Sponsor {
  name: string;
  url: string;
  /** A mark with no tile of its own, set on a black tile so it matches the app icons beside it. */
  mark?: string;
  /** A square app icon that brings its own tile, shown edge to edge. */
  icon?: string;
}

const SPONSORS: Sponsor[] = [
  { name: "Wensity UI", url: "https://ui.wensity.com", mark: "/sponsors/wensity.svg" },
  { name: "Skimbly", url: "https://skimbly.com", icon: "/sponsors/skimbly.png" },
];

/** Every sponsor tile is the same rounded square, sitting on a thin grey edge so dark icons stay visible. */
const tile = "grid size-8 shrink-0 place-items-center rounded-lg";

/** The sponsors, in the top bar beside the page's own controls: each one's icon, then the open slot. */
export function Sponsors() {
  return (
    <nav aria-label="Sponsors" className="flex items-center gap-1.5">
      <span className="mr-1.5 text-[13px] text-sk-muted">Sponsored by</span>
      {SPONSORS.map((s) => (
        <a
          key={s.name}
          href={s.url}
          target="_blank"
          rel="sponsored noopener"
          title={s.name}
          aria-label={`${s.name}, sponsor`}
          className={`${tile} bg-black/[0.08] transition-colors duration-100 hover:bg-black/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring dark:bg-white/[0.14] dark:hover:bg-white/[0.22]`}
        >
          {s.icon ? (
            <img src={s.icon} alt="" width={30} height={30} decoding="async" className="size-[30px] rounded-[7px]" />
          ) : s.mark ? (
            <span className="grid size-[30px] place-items-center rounded-[7px] bg-black">
              <img src={s.mark} alt="" width={20} height={20} decoding="async" className="size-5" />
            </span>
          ) : null}
        </a>
      ))}
      {/* The open slot. Sponsoring opens later, so for now it only marks the space. */}
      <span role="img" aria-label="Open sponsor slot" title="Open sponsor slot" className={`${tile} border border-dashed border-sk-ink/25 text-sk-ink/55`}>
        <PlusIcon className="size-3" />
      </span>
    </nav>
  );
}
