import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "~/components/icons";

const THEME_KEY = "sk-theme";
export const HUE_CSS_KEY = "sk-hue-css";
export const HUE_ID_KEY = "sk-hue";

/**
 * Runs before the first paint: applies the saved or system theme, and the saved Hue,
 * so a page never flashes the defaults.
 */
const script = `(() => {
  try {
    const saved = localStorage.getItem("${THEME_KEY}");
    const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
    const hue = localStorage.getItem("${HUE_CSS_KEY}");
    if (hue) {
      const style = document.createElement("style");
      style.id = "sk-hue";
      style.textContent = hue;
      document.head.appendChild(style);
    }
  } catch {}
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

const media = "(prefers-color-scheme: dark)";

/** Sets the theme in one frame: transitions are paused so every surface switches together. */
function apply(dark: boolean) {
  const root = document.documentElement;
  if (root.classList.contains("dark") === dark) return;
  const pause = document.createElement("style");
  pause.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(pause);
  root.classList.toggle("dark", dark);
  void getComputedStyle(root).colorScheme;
  requestAnimationFrame(() => pause.remove());
}

/** The class on <html> is the source of truth. A saved choice wins, otherwise the system theme. */
function subscribe(notify: () => void) {
  const system = matchMedia(media);
  const follow = () => {
    const saved = localStorage.getItem(THEME_KEY);
    apply(saved ? saved === "dark" : system.matches);
  };
  const onStorage = (e: StorageEvent) => e.key === THEME_KEY && follow();
  const watch = new MutationObserver(notify);
  watch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  system.addEventListener("change", follow);
  window.addEventListener("storage", onStorage);
  return () => {
    watch.disconnect();
    system.removeEventListener("change", follow);
    window.removeEventListener("storage", onStorage);
  };
}

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, () => document.documentElement.classList.contains("dark"), () => false);
  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    // Choosing the system's own theme clears the saved choice, so the site keeps following the system.
    if (next === matchMedia(media).matches) localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    apply(next);
  };
  return { dark, toggle };
}

/** Both icons are drawn and CSS picks one, so the first paint is right before React runs. */
export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark theme"
      aria-pressed={dark}
      className="inline-flex size-10 items-center justify-center rounded-lg text-sk-muted transition-colors duration-100 hover:bg-sk-hover hover:text-sk-ink active:bg-sk-press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring"
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </button>
  );
}
