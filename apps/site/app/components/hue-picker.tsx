import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { DEFAULT_PRESET, createHue, presets, toCss } from "@skins/hue";
import { useEffect, useState } from "react";
import { HUE_CSS_KEY, HUE_ID_KEY } from "~/components/theme";

const swatchColour = Object.fromEntries(
  presets.map((p) => {
    const hue = createHue(p.color);
    return [p.id, hue.ramp.shades[hue.ramp.anchor]?.p3 ?? ""];
  }),
);

function applyHue(id: string) {
  const preset = presets.find((p) => p.id === id) ?? DEFAULT_PRESET;
  let style = document.getElementById("sk-hue");
  if (preset.id === DEFAULT_PRESET.id) {
    style?.remove();
    localStorage.removeItem(HUE_CSS_KEY);
    localStorage.removeItem(HUE_ID_KEY);
    return;
  }
  const css = toCss(createHue(preset.color), { neutrals: false });
  if (!style) {
    style = document.createElement("style");
    style.id = "sk-hue";
    document.head.appendChild(style);
  }
  style.textContent = css;
  localStorage.setItem(HUE_CSS_KEY, css);
  localStorage.setItem(HUE_ID_KEY, preset.id);
}

/** Preset colours. Picking one recolours every skin on the page. */
export function HuePicker() {
  const [value, setValue] = useState(DEFAULT_PRESET.id);
  useEffect(() => setValue(localStorage.getItem(HUE_ID_KEY) ?? DEFAULT_PRESET.id), []);

  return (
    <ToggleGroup
      aria-label="Colour"
      value={[value]}
      onValueChange={(next) => {
        const id = next[0];
        if (!id) return;
        setValue(id);
        applyHue(id);
      }}
      className="flex items-center gap-1.5"
    >
      {presets.map((p) => (
        <Toggle
          key={p.id}
          value={p.id}
          aria-label={p.name}
          title={p.name}
          style={{ backgroundColor: swatchColour[p.id] }}
          className="size-6 rounded-full inset-ring inset-ring-sk-border transition-shadow duration-150 ease-sk-out data-pressed:ring-2 data-pressed:ring-sk-ink data-pressed:ring-offset-2 data-pressed:ring-offset-sk-floor focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sk-ring"
        />
      ))}
    </ToggleGroup>
  );
}
