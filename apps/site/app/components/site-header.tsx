import { Link, NavLink } from "react-router";
import { HuePicker } from "~/components/hue-picker";
import { GithubStar } from "~/components/github-star";
import { ThemeToggle } from "~/components/theme";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-sk-hairline bg-sk-floor/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-14 items-center gap-6 px-5">
        <Link to="/" className={`rounded-md font-sk-display text-[17px] font-semibold ${focus}`}>
          Skins UI
        </Link>
        <nav aria-label="Site" className="hidden sm:block">
          <NavLink
            to="/components"
            className={`rounded-md text-sm text-sk-muted transition-colors duration-100 hover:text-sk-ink aria-[current=page]:text-sk-ink ${focus}`}
          >
            Components
          </NavLink>
        </nav>
        <HeaderActions />
      </div>
    </header>
  );
}

/** The controls every page carries at its top right: colour, theme and the GitHub link. */
export function HeaderActions() {
  return (
        <div className="ml-auto flex items-center gap-3">
          <HuePicker />
          <ThemeToggle />
          <GithubStar />
        </div>
  );
}
