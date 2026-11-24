import { Switch } from "@base-ui/react/switch";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, type ReactNode } from "react";
import { ClearIcon } from "~/components/icons";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

/** A control row: the label and its prop name on the left, the control on the right. */
function Row({ label, prop, htmlFor, children }: { label: string; prop?: string; htmlFor?: string; children: ReactNode }) {
  const Label = htmlFor ? "label" : "span";
  return (
    <div className="flex min-h-14 items-center justify-between gap-6 border-b border-neutral-200/70 px-4 py-2 dark:border-neutral-800/70">
      <Label htmlFor={htmlFor} className="grid shrink-0 gap-0.5">
        <span className="text-[13px] font-medium text-neutral-950/90 dark:text-white/90">{label}</span>
        {prop && <span className="font-sk-mono text-[11px] text-neutral-400 dark:text-neutral-500">{prop}</span>}
      </Label>
      {children}
    </div>
  );
}

const display = (o: string) => (o.length > 2 ? o.charAt(0).toUpperCase() + o.slice(1) : o);

export function ChoiceControl({ label, prop, value, options, onChange }: { label: string; prop?: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <Row label={label} prop={prop}>
      <ToggleGroup
        aria-label={label}
        value={[value]}
        onValueChange={(next) => next[0] && onChange(next[0])}
        className="flex min-w-0 flex-wrap items-center justify-end gap-0.5 rounded-lg bg-neutral-100 p-0.5 ring-1 ring-neutral-200/60 ring-inset dark:bg-neutral-900 dark:ring-white/[0.06]"
      >
        {options.map((o) => (
          <Toggle
            key={o}
            value={o}
            className={`relative h-7 shrink-0 rounded-md px-2.5 text-xs font-medium text-neutral-500 transition-colors duration-150 ease-sk-out hover:text-neutral-900 data-pressed:text-neutral-950 dark:text-neutral-400 dark:hover:text-white dark:data-pressed:text-white ${focus}`}
          >
            {value === o && (
              <motion.span
                layoutId={`choice-${prop ?? label}`}
                transition={{ type: "spring", duration: 0.25, bounce: 0 }}
                className="absolute inset-0 rounded-md bg-white shadow-xs ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/[0.06]"
              />
            )}
            <span className="relative">{display(o)}</span>
          </Toggle>
        ))}
      </ToggleGroup>
    </Row>
  );
}

export function SwitchControl({ label, prop, checked, onChange }: { label: string; prop?: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <Row label={label} prop={prop} htmlFor={id}>
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v)}
        className={`relative flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-neutral-200 p-0.5 ring-1 ring-black/5 ring-inset transition-colors duration-150 ease-sk-out data-checked:bg-neutral-950 dark:bg-neutral-800 dark:ring-white/[0.06] dark:data-checked:bg-white ${focus}`}
      >
        <Switch.Thumb className="size-4 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.2)] transition-transform duration-200 ease-sk-out data-checked:translate-x-4 dark:bg-neutral-400 dark:data-checked:bg-neutral-950" />
      </Switch.Root>
    </Row>
  );
}

/** A soft filled field. Focus lifts it with a neutral ring; a clear button shows once there is text. */
export function TextControl({ label, prop, value, onChange }: { label: string; prop?: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  return (
    <Row label={label} prop={prop} htmlFor={id}>
      <div
        className={
          "relative flex h-8 w-full max-w-72 min-w-0 items-center rounded-lg bg-neutral-100 ring-1 ring-neutral-200/80 ring-inset " +
          "transition-[background-color,box-shadow] duration-150 ease-sk-out hover:ring-neutral-300 " +
          "focus-within:bg-white focus-within:ring-neutral-400 focus-within:shadow-[0_0_0_3px_rgb(163_163_163/0.18)] " +
          "dark:bg-neutral-900 dark:ring-white/[0.08] dark:hover:ring-white/[0.14] dark:focus-within:bg-neutral-950 dark:focus-within:ring-white/25 dark:focus-within:shadow-[0_0_0_3px_rgb(255_255_255/0.06)]"
        }
      >
        <input
          ref={input}
          id={id}
          value={value}
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full min-w-0 rounded-lg bg-transparent pr-8 pl-2.5 text-[13px] text-neutral-950 caret-sk-accent outline-none placeholder:text-neutral-400 dark:text-white max-sm:text-base"
        />
        <AnimatePresence initial={false}>
          {value && (
            <motion.button
              type="button"
              aria-label={`Clear ${label.toLowerCase()}`}
              onClick={() => {
                onChange("");
                input.current?.focus();
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.1 } }}
              transition={{ type: "spring", duration: 0.2, bounce: 0 }}
              className={`absolute right-1 grid size-6 place-items-center rounded-md text-neutral-400 transition-colors duration-100 hover:bg-neutral-200/80 hover:text-neutral-900 dark:text-neutral-500 dark:hover:bg-white/10 dark:hover:text-white ${focus}`}
            >
              <ClearIcon className="size-3" weight="bold" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </Row>
  );
}

/** Rows in two columns on wide screens. A last row on its own spans both. */
export function Customize({ children }: { children: ReactNode }) {
  return (
    <div className="-mb-px grid lg:grid-cols-2 lg:[&>*:last-child:nth-child(odd)]:col-span-2 lg:[&>*:nth-child(odd):not(:last-child)]:border-r">
      {children}
    </div>
  );
}
