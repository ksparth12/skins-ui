import { Switch } from "@base-ui/react/switch";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { motion } from "motion/react";
import { useId, type ReactNode } from "react";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

/** A control row: the label on the left, the control on the right, divided by a hairline. */
function Row({ label, htmlFor, children }: { label: string; htmlFor?: string; children: ReactNode }) {
  const Label = htmlFor ? "label" : "span";
  return (
    <div className="flex min-h-14 items-center justify-between gap-6 border-b border-sk-border px-5 py-2.5">
      <Label htmlFor={htmlFor} className="shrink-0 text-[14px] text-sk-muted">
        {label}
      </Label>
      {children}
    </div>
  );
}

const display = (o: string) => (o.length > 2 ? o.charAt(0).toUpperCase() + o.slice(1) : o);

export function ChoiceControl({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <Row label={label}>
      <ToggleGroup
        aria-label={label}
        value={[value]}
        onValueChange={(next) => next[0] && onChange(next[0])}
        className="flex min-w-0 flex-wrap items-center justify-end gap-1"
      >
        {options.map((o) => (
          <Toggle
            key={o}
            value={o}
            className={`relative h-8 shrink-0 rounded-md px-2.5 text-[13px] font-medium text-sk-muted transition-colors duration-150 ease-sk-out hover:text-sk-ink data-pressed:text-sk-ink ${focus}`}
          >
            {value === o && (
              <motion.span
                layoutId={`choice-${label}`}
                transition={{ type: "spring", duration: 0.25, bounce: 0 }}
                className="absolute inset-0 rounded-md border border-sk-border bg-sk-well"
              />
            )}
            <span className="relative">{display(o)}</span>
          </Toggle>
        ))}
      </ToggleGroup>
    </Row>
  );
}

export function SwitchControl({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <Row label={label} htmlFor={id}>
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v)}
        className={`relative flex h-6 w-10 shrink-0 cursor-pointer rounded-full bg-sk-border-strong p-0.5 transition-colors duration-150 ease-sk-out data-checked:bg-sk-indicator ${focus}`}
      >
        <Switch.Thumb className="size-5 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.25)] transition-transform duration-200 ease-sk-out data-checked:translate-x-4" />
      </Switch.Root>
    </Row>
  );
}

export function TextControl({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <Row label={label} htmlFor={id}>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full max-w-80 min-w-0 rounded-md border border-sk-border bg-sk-floor px-3 text-[14px] text-sk-ink outline-none transition-[border-color,box-shadow] duration-150 ease-sk-out hover:border-sk-border-strong focus:border-sk-ring focus:ring-3 focus:ring-sk-ring/20 max-sm:text-base"
      />
    </Row>
  );
}

/** One bordered panel; rows sit in two columns on wide screens. */
export function Customize({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-sk-border bg-sk-surface">
      <div className="-mb-px grid lg:grid-cols-2 lg:[&>*:nth-child(odd)]:border-r">{children}</div>
    </div>
  );
}
