import { Link } from "react-router";
import { HuePicker } from "~/components/hue-picker";
import { ThemeToggle } from "~/components/theme";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-sk-hairline bg-sk-floor/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-14 items-center gap-6 px-5">
        <Link to="/" className="rounded-md font-sk-display text-[17px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sk-ring">
          Skins UI
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <HuePicker />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
