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
    <div className="flex min-h-12 items-center justify-between gap-6 border-b border-neutral-200/70 px-4 py-2 dark:border-neutral-800/70">
      <Label htmlFor={htmlFor} className="shrink-0 text-[13px] font-medium text-neutral-950/90 dark:text-white/90">
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
        className="flex min-w-0 flex-wrap items-center justify-end gap-0.5 rounded-lg bg-neutral-100 p-0.5 dark:bg-neutral-900"
      >
        {options.map((o) => (
          <Toggle
            key={o}
            value={o}
            className={`relative h-7 shrink-0 rounded-md px-2.5 text-xs font-medium text-neutral-500 transition-colors duration-150 ease-sk-out hover:text-neutral-900 data-pressed:text-neutral-950 dark:text-neutral-400 dark:hover:text-white dark:data-pressed:text-white ${focus}`}
          >
            {value === o && (
              <motion.span
                layoutId={`choice-${label}`}
                transition={{ type: "spring", duration: 0.25, bounce: 0 }}
                className="absolute inset-0 rounded-md bg-white shadow-xs ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/5"
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
        className={`relative flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-neutral-200 p-0.5 transition-colors duration-150 ease-sk-out data-checked:bg-neutral-950 dark:bg-neutral-800 dark:data-checked:bg-white ${focus}`}
      >
        <Switch.Thumb className="size-4 rounded-full bg-white shadow-xs transition-transform duration-200 ease-sk-out data-checked:translate-x-4 dark:bg-neutral-950 dark:data-checked:bg-neutral-950" />
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
        className="h-8 w-full max-w-72 min-w-0 rounded-md border border-neutral-200 bg-transparent px-2.5 text-[13px] text-neutral-950 outline-none transition-[border-color,box-shadow] duration-150 ease-sk-out hover:border-neutral-300 focus:border-neutral-400 focus:ring-3 focus:ring-neutral-400/20 dark:border-neutral-800 dark:text-white dark:hover:border-neutral-700 dark:focus:border-neutral-600 max-sm:text-base"
      />
    </Row>
  );
}

/** Rows in two columns on wide screens. */
export function Customize({ children }: { children: ReactNode }) {
  return <div className="-mb-px grid lg:grid-cols-2 lg:[&>*:nth-child(odd)]:border-r">{children}</div>;
}
