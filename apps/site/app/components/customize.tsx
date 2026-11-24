import { Switch } from "@base-ui/react/switch";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { AnimatePresence, motion } from "motion/react";
import { useId, type ReactNode } from "react";
import { ResetIcon } from "~/components/icons";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

/** A control row: the label on the left, the control on the right, on one quiet track. */
function Row({ label, htmlFor, wide, children }: { label: string; htmlFor?: string; wide?: boolean; children: ReactNode }) {
  const Label = htmlFor ? "label" : "span";
  return (
    <div className={`flex min-h-12 items-center justify-between gap-4 rounded-xl bg-sk-surface px-3.5 py-2 shadow-sk-card ${wide ? "sm:col-span-2" : ""}`}>
      <Label htmlFor={htmlFor} className="shrink-0 text-[13px] font-medium text-sk-ink">
        {label}
      </Label>
      {children}
    </div>
  );
}

const display = (o: string) => (o.length > 2 ? o.charAt(0).toUpperCase() + o.slice(1) : o);

export function ChoiceControl({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <Row label={label} wide={options.length > 3}>
      <ToggleGroup
        aria-label={label}
        value={[value]}
        onValueChange={(next) => next[0] && onChange(next[0])}
        className="relative flex h-8 items-center gap-0.5 overflow-x-auto rounded-lg bg-sk-well p-0.5 inset-ring inset-ring-sk-hairline"
      >
        {options.map((o) => (
          <Toggle
            key={o}
            value={o}
            className={`relative h-7 shrink-0 rounded-md px-2.5 text-[13px] font-medium text-sk-muted transition-colors duration-150 ease-sk-out hover:text-sk-ink data-pressed:text-sk-ink ${focus}`}
          >
            {value === o && (
              <motion.span
                layoutId={`choice-${label}`}
                transition={{ type: "spring", duration: 0.25, bounce: 0 }}
                className="absolute inset-0 -z-0 rounded-md bg-sk-surface shadow-sk-card dark:bg-sk-raised"
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
    <Row label={label} htmlFor={id} wide>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full max-w-md min-w-0 rounded-md border border-sk-border bg-sk-well px-2.5 text-[13px] text-sk-ink outline-none transition-[border-color,background-color,box-shadow] duration-150 ease-sk-out hover:border-sk-border-strong focus:border-sk-ring focus:bg-sk-surface focus:ring-3 focus:ring-sk-ring/20 max-sm:text-base"
      />
    </Row>
  );
}

/** The panel under the preview. Reset appears once anything differs from the defaults. */
export function Customize({ changed, onReset, children }: { changed: boolean; onReset: () => void; children: ReactNode }) {
  return (
    <section aria-labelledby="customize" className="rounded-2xl bg-sk-well p-1.5 inset-ring inset-ring-sk-hairline">
      <div className="flex h-10 items-center justify-between px-3.5 pt-1">
        <h2 id="customize" className="text-[15px]">Customize</h2>
        <AnimatePresence initial={false}>
          {changed && (
            <motion.button
              type="button"
              onClick={onReset}
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4, transition: { duration: 0.12 } }}
              transition={{ type: "spring", duration: 0.2, bounce: 0 }}
              className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-sk-muted transition-colors duration-100 hover:bg-sk-hover hover:text-sk-ink ${focus}`}
            >
              <ResetIcon className="size-3.5" />
              Reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="grid gap-1.5 sm:grid-cols-2">{children}</div>
    </section>
  );
}
