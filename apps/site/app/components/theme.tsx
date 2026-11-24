import { useEffect, useState } from "react";
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

export function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    setDark(next);
  };
  return { dark, toggle };
}

export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Use light theme" : "Use dark theme"}
      className="inline-flex size-10 items-center justify-center rounded-lg text-sk-muted transition-colors duration-100 hover:bg-sk-hover hover:text-sk-ink active:bg-sk-press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
