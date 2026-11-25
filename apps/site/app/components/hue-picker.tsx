import { Popover } from "@base-ui/react/popover";
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
  const css = toCss(createHue(preset.color), { neutrals: false, light: ':root, .light, [data-theme="light"]' });
  if (!style) {
    style = document.createElement("style");
    style.id = "sk-hue";
    document.head.appendChild(style);
  }
  style.textContent = css;
  localStorage.setItem(HUE_CSS_KEY, css);
  localStorage.setItem(HUE_ID_KEY, preset.id);
}

function useHueChoice() {
  const [value, setValue] = useState(DEFAULT_PRESET.id);
  useEffect(() => setValue(localStorage.getItem(HUE_ID_KEY) ?? DEFAULT_PRESET.id), []);
  const choose = (id: string) => {
    setValue(id);
    applyHue(id);
  };
  return [value, choose] as const;
}

const swatch =
  "size-6 rounded-full inset-ring inset-ring-sk-border transition-shadow duration-150 ease-sk-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sk-ring";

function Swatches({ value, onChange, offset }: { value: string; onChange: (id: string) => void; offset: string }) {
  return (
    <ToggleGroup aria-label="Colour" value={[value]} onValueChange={(next) => next[0] && onChange(next[0])} className="flex items-center gap-1.5">
      {presets.map((p) => (
        <Toggle
          key={p.id}
          value={p.id}
          aria-label={p.name}
          title={p.name}
          style={{ backgroundColor: swatchColour[p.id] }}
          className={`${swatch} data-pressed:ring-2 data-pressed:ring-sk-ink data-pressed:ring-offset-2 ${offset}`}
        />
      ))}
    </ToggleGroup>
  );
}

/** Preset colours. Picking one recolours every skin on the page. Phones get one swatch that opens the set. */
export function HuePicker() {
  const [value, choose] = useHueChoice();
  const current = presets.find((p) => p.id === value) ?? DEFAULT_PRESET;
  return (
    <>
      <div className="hidden md:block">
        <Swatches value={value} onChange={choose} offset="data-pressed:ring-offset-site-panel" />
      </div>
      <Popover.Root>
        <Popover.Trigger
          aria-label={`Colour: ${current.name}`}
          className="grid size-8 place-items-center rounded-lg transition-colors duration-100 hover:bg-sk-hover active:bg-sk-press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring md:hidden"
        >
          <span className="size-5 rounded-full inset-ring inset-ring-sk-border" style={{ backgroundColor: swatchColour[current.id] }} />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner side="bottom" align="end" sideOffset={8} className="z-50">
            <Popover.Popup className="origin-(--transform-origin) rounded-xl bg-sk-overlay p-3 shadow-sk-popover transition-[opacity,scale] duration-150 ease-sk-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
              <Swatches value={value} onChange={choose} offset="data-pressed:ring-offset-sk-overlay" />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}
