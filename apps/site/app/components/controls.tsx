import { Switch } from "@base-ui/react/switch";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { useId, useState } from "react";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

/** A row label and its control, in the playground panel. */
export function ControlRow({ label, children, htmlFor }: { label: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-4">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-sk-muted">{label}</label>
      ) : (
        <span className="text-[13px] font-medium text-sk-muted">{label}</span>
      )}
      {children}
    </div>
  );
}

/** A label above a control that fills the row. */
export function StackedRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 py-2">
      <span className="text-[13px] font-medium text-sk-muted">{label}</span>
      {children}
    </div>
  );
}

/** Words read as words; short codes such as sizes stay as written. */
const display = (o: string) => (o.length > 2 ? o[0]?.toUpperCase() + o.slice(1) : o);

/** One choice from a few, on a sunken track with a raised piece for the chosen option. */
export function Segmented({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <ToggleGroup
      aria-label={label}
      value={[value]}
      onValueChange={(next) => next[0] && onChange(next[0])}
      className="flex h-8 w-full items-center gap-0.5 rounded-lg bg-sk-well p-0.5 inset-ring inset-ring-sk-hairline"
    >
      {options.map((o) => (
        <Toggle
          key={o}
          value={o}
          className={`h-7 min-w-0 flex-auto rounded-md px-2 text-[13px] font-medium text-sk-muted transition-[background-color,color,box-shadow] duration-150 ease-sk-out hover:text-sk-ink data-pressed:bg-sk-surface data-pressed:text-sk-ink data-pressed:shadow-sk-card dark:data-pressed:bg-sk-raised ${focus}`}
        >
          {display(o)}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}

export function SwitchControl({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <ControlRow label={label} htmlFor={id}>
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v)}
        className={`relative flex h-6 w-10 shrink-0 cursor-pointer rounded-full bg-sk-border-strong p-0.5 transition-colors duration-150 ease-sk-out data-checked:bg-sk-indicator ${focus}`}
      >
        <Switch.Thumb className="size-5 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.25)] transition-transform duration-200 ease-sk-out data-checked:translate-x-4" />
      </Switch.Root>
    </ControlRow>
  );
}

export function TextControl({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <ControlRow label={label} htmlFor={id}>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-48 rounded-md border border-sk-border bg-sk-well px-2.5 text-[13px] text-sk-ink outline-none transition-[border-color,background-color,box-shadow] duration-150 ease-sk-out placeholder:text-sk-faint hover:border-sk-border-strong focus:border-sk-ring focus:bg-sk-surface focus:ring-3 focus:ring-sk-ring/20"
      />
    </ControlRow>
  );
}

/** Copies text, and shows a check for a moment. */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1600);
      }}
      className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-sk-muted transition-colors duration-100 hover:bg-sk-hover hover:text-sk-ink active:bg-sk-press ${focus}`}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {done ? <path d="M3.5 8.5l3 3 6-7" /> : <><rect x="5.5" y="5.5" width="8" height="8" rx="2" /><path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" /></>}
      </svg>
      <span aria-live="polite">{done ? "Copied" : label}</span>
    </button>
  );
}
