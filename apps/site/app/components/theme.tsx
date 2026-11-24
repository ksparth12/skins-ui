import { useEffect, useState } from "react";

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
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        {dark ? (
          <>
            <circle cx="8" cy="8" r="3" />
            <path d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.4 3.4l.85.85M11.75 11.75l.85.85M3.4 12.6l.85-.85M11.75 4.25l.85-.85" />
          </>
        ) : (
          <path d="M13.5 9.6A5.6 5.6 0 0 1 6.4 2.5a5.6 5.6 0 1 0 7.1 7.1Z" />
        )}
      </svg>
    </button>
  );
}
