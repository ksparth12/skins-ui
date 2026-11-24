import { Link } from "react-router";
import { SiteHeader } from "~/components/site-header";

export function meta() {
  return [
    { title: "Skins UI" },
    { name: "description", content: "Every component, in many complete looks. Pick a colour and every skin follows it." },
  ];
}

const primary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3.5 text-sm/5 font-semibold whitespace-nowrap [text-box:trim-both_cap_alphabetic] bg-sk-accent text-sk-accent-fg shadow-xs transition-[background-color,scale] duration-100 ease-sk-out hover:bg-sk-accent-hover active:scale-[0.97] active:bg-sk-accent-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring dark:shadow-none";
const secondary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3.5 text-sm/5 font-semibold whitespace-nowrap [text-box:trim-both_cap_alphabetic] bg-sk-surface text-sk-ink shadow-xs inset-ring inset-ring-black/12 transition-[background-color,scale] duration-100 ease-sk-out hover:bg-sk-hover active:scale-[0.97] active:bg-sk-press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring dark:bg-white/10 dark:shadow-none dark:inset-ring-0 dark:hover:bg-white/15 dark:active:bg-white/20";
const badge = "inline-flex h-6 items-center rounded-md px-2 text-xs font-semibold";

export default function Home() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pt-24 pb-32">
        <h1 className="text-5xl/[1.05] tracking-[-0.01em] sm:text-7xl/[1.02]">
          <span className="block">Every component.</span>
          <span className="block">Every skin.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg/7 text-sk-muted">
          Every component, in many complete looks. Pick a colour above and everything below follows it, in light and dark.
        </p>

        <section aria-label="Sample" className="mt-16 grid max-w-xl gap-6 rounded-2xl bg-sk-surface p-6 shadow-sk-card">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/components" className={primary}>Browse components</Link>
            <button type="button" className={secondary}>Preview</button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`${badge} bg-sk-accent-subtle text-sk-accent-subtle-fg`}>New skin</span>
            <span className={`${badge} bg-sk-success-soft text-sk-success`}>Passed</span>
            <span className={`${badge} bg-sk-danger-soft text-sk-danger`}>Failed</span>
          </div>
        </section>
      </main>
    </div>
  );
}
