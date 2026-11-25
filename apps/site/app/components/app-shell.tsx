import { Dialog } from "@base-ui/react/dialog";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { GithubStar } from "~/components/github-star";
import { HuePicker } from "~/components/hue-picker";
import { ThemeToggle } from "~/components/theme";
import { Sponsors } from "~/components/sponsors";
import { CheckIcon, ClearIcon, MenuIcon, SearchIcon } from "~/components/icons";
import { findEntry, registry, skinPath } from "~/lib/registry";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";
/** The raised material of the docs panels: white or surface, a hairline edge and a faint drop. */
const surface =
  "bg-site-panel lg:ring-1 lg:ring-sk-hairline lg:shadow-[0_1px_0_rgb(0_0_0/0.04),0_2px_1px_-1px_rgb(0_0_0/0.05)] dark:lg:shadow-[0_1px_0_rgb(0_0_0/0.45),0_2px_1px_-1px_rgb(0_0_0/0.5)]";
const row = `flex h-8 items-center gap-2 rounded-lg px-2.5 text-[13px] transition-colors duration-100 hover:bg-sk-menu-on hover:text-sk-ink ${focus}`;

/** The controls at the top right of every page: colour, theme and the GitHub link. */
function HeaderActions() {
  return (
    <div className="ml-auto flex items-center gap-3">
      <HuePicker />
      <ThemeToggle />
      <GithubStar />
    </div>
  );
}

function Logo() {
  return (
    <Link to="/" className={`rounded-md font-sk-display text-[17px] font-semibold ${focus}`}>
      Skins UI
    </Link>
  );
}

/**
 * Every component. In the phone drawer the open one also shows its skins underneath;
 * on wide screens the skins have their own panel instead.
 */
function ComponentTree({ component, skin, nested, onNavigate }: { component: string; skin: string; nested?: boolean; onNavigate?: () => void }) {
  return (
    <nav aria-label="Components">
      <ul className="grid gap-0.5">
        {registry.map((e) => {
          const open = e.spec.name === component;
          return (
            <li key={e.spec.name}>
              <Link
                to={skinPath(e.spec.name, e.skins[0]?.slug ?? "")}
                onClick={onNavigate}
                aria-current={open && !nested ? "true" : undefined}
                className={`${row} justify-between ${open ? `font-medium text-sk-ink ${nested ? "" : "bg-sk-menu-on"}` : "text-sk-muted"}`}
              >
                {e.spec.title}
                <span className="text-xs font-normal text-sk-muted tabular-nums">{e.skins.length}</span>
              </Link>
              {open && nested && (
                <ul aria-label={`${e.spec.title} skins`} className="relative my-0.5 grid gap-0.5 pl-5 before:absolute before:inset-y-1 before:left-[15px] before:w-px before:bg-sk-hairline">
                  {e.skins.map((s) => {
                    const on = s.slug === skin;
                    return (
                      <li key={s.slug}>
                        <Link
                          to={skinPath(e.spec.name, s.slug)}
                          onClick={onNavigate}
                          aria-current={on ? "page" : undefined}
                          className={`${row} ${on ? "bg-sk-menu-on font-medium text-sk-ink" : "text-sk-muted"}`}
                        >
                          {s.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Skins drawn for one mode say so; skins that work in both need no note. */
const onlyMode = (modes: string[]) => (modes.length === 1 ? (modes[0] === "dark" ? "Dark only" : "Light only") : "");

/**
 * The open component's skins in their own panel: a title, a filter, then one full-width row per skin
 * with its tags underneath. The list scrolls inside the panel, so it holds any number of skins.
 */
function SkinList({ component, skin }: { component: string; skin: string }) {
  const entry = findEntry(component);
  const [query, setQuery] = useState("");
  if (!entry) return null;
  const q = query.trim().toLowerCase();
  const shown = q ? entry.skins.filter((s) => s.title.toLowerCase().includes(q) || s.tags.some((t) => t.includes(q))) : entry.skins;

  return (
    <section aria-label={`${entry.spec.title} skins`} className="flex h-full min-h-0 flex-col">
      <div className="grid shrink-0 gap-3 px-4 pt-4 pb-3">
        <div className="flex items-baseline justify-between px-1">
          <h2 className="text-[15px] font-medium text-sk-ink">{entry.spec.title}</h2>
          <span className="text-xs text-sk-muted tabular-nums">{entry.skins.length} skins</span>
        </div>
        <label className="flex h-8 items-center gap-2 rounded-[10px] bg-black/[0.04] px-2.5 text-sk-muted ring-1 ring-transparent transition-[background-color,box-shadow] duration-150 ease-sk-out focus-within:bg-transparent focus-within:ring-sk-border-strong hover:bg-black/[0.06] dark:bg-white/[0.05] dark:hover:bg-white/[0.07] dark:focus-within:bg-transparent">
          <SearchIcon className="size-3.5 shrink-0" />
          <span className="sr-only">Filter skins</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="Filter by name or tag"
            spellCheck={false}
            autoComplete="off"
            className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-sk-ink outline-none placeholder:text-sk-muted max-sm:text-base [&::-webkit-search-cancel-button]:hidden"
          />
        </label>
      </div>
      <ul className="grid min-h-0 flex-1 content-start gap-0.5 overflow-y-auto overscroll-contain px-2 pb-2 scroll-fade-b">
        {shown.map((s) => {
          const on = s.slug === skin;
          return (
            <li key={s.slug}>
              <Link
                to={skinPath(entry.spec.name, s.slug)}
                aria-current={on ? "page" : undefined}
                className={`flex items-center gap-3 rounded-[10px] px-3 py-2 transition-colors duration-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sk-ring ${on ? "bg-sk-menu-on" : "hover:bg-sk-hover"}`}
              >
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <span className={`truncate text-[13px] font-medium ${on ? "text-sk-ink" : "text-sk-ink/85"}`}>{s.title}</span>
                  <span className="truncate text-xs text-sk-muted">{[onlyMode(s.modes), ...s.tags].filter(Boolean).join(", ")}</span>
                </span>
                {on && <CheckIcon className="size-3.5 shrink-0 text-sk-muted" />}
              </Link>
            </li>
          );
        })}
        {shown.length === 0 && <li className="px-3 py-8 text-center text-[13px] text-sk-muted">No skins match "{query.trim()}".</li>}
      </ul>
    </section>
  );
}

/** On phones the tree lives in a drawer behind a menu button. */
function MobileMenu({ component, skin }: { component: string; skin: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger aria-label="Open menu" className={`-ml-1.5 grid size-8 place-items-center rounded-lg text-sk-muted hover:bg-sk-hover hover:text-sk-ink lg:hidden ${focus}`}>
        <MenuIcon className="size-5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-site-floor p-2.5 shadow-sk-modal transition-transform duration-200 ease-sk-out data-ending-style:-translate-x-full data-starting-style:-translate-x-full ">
          <div className="flex h-12 items-center justify-between px-2.5">
            <Dialog.Title render={<Logo />} />
            <Dialog.Close aria-label="Close menu" className={`grid size-8 place-items-center rounded-lg text-sk-muted hover:bg-sk-hover hover:text-sk-ink ${focus}`}>
              <ClearIcon className="size-4" />
            </Dialog.Close>
          </div>
          <div className="mt-2">
            <ComponentTree component={component} skin={skin} nested onNavigate={() => setOpen(false)} />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * The docs frame: a sidebar resting on the page floor, and one raised panel holding the page.
 * On wide screens the frame stays put and only the panel's content scrolls.
 * On phones the panel fills the screen, the page scrolls as usual and the sidebar moves into a drawer.
 */
export function AppShell({ component = "", skin = "", children }: { component?: string; skin?: string; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  // The panel is its own scroller, so a new page starts it at the top as the window would.
  useEffect(() => {
    panel.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className={`min-h-dvh bg-site-floor lg:grid lg:h-dvh lg:gap-2 lg:overflow-hidden lg:pr-2 ${component ? "lg:grid-cols-[224px_272px_minmax(0,1fr)]" : "lg:grid-cols-[224px_minmax(0,1fr)]"}`}>
      <aside className="hidden h-dvh flex-col overflow-y-auto overscroll-contain px-2.5 pb-3 [scrollbar-width:thin] lg:flex">
        <div className="flex h-14 shrink-0 items-center px-2.5">
          <Logo />
        </div>
        <ComponentTree component={component} skin={skin} />
      </aside>
      {component && (
        <div className="hidden min-h-0 py-2 lg:block">
          <div className={`h-full overflow-hidden lg:rounded-[18px] ${surface}`}>
            <SkinList key={component} component={component} skin={skin} />
          </div>
        </div>
      )}
      <div className="min-w-0 lg:h-dvh lg:py-2">
        <div
          ref={panel}
          className={`min-h-dvh lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:rounded-[18px] lg:[scrollbar-width:thin] ${surface}`}
        >
          <header className="flex h-14 items-center gap-3 px-5 lg:px-7">
            {/* The menu only appears once there is a component to list. */}
            {registry.length > 0 && <MobileMenu component={component} skin={skin} />}
            <span className="lg:hidden">
              <Logo />
            </span>
            <div className="hidden md:block">
              <Sponsors />
            </div>
            <HeaderActions />
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
