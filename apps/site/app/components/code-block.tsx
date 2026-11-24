import { Tabs } from "@base-ui/react/tabs";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { highlight } from "sugar-high";
import { CheckIcon, CopyIcon, FileIcon, TerminalIcon } from "~/components/icons";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";
const LINE = 24;

/** Copies text and swaps its icon for a check for a moment. */
export function CopyIconButton({ text, label = "Copy code" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={done ? "Copied" : label}
      title={done ? "Copied" : label}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1600);
      }}
      className={`relative grid size-8 place-items-center rounded-md text-sk-muted transition-colors duration-100 hover:bg-sk-hover hover:text-sk-ink active:bg-sk-press ${focus}`}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={done ? "done" : "copy"}
          initial={{ opacity: 0, scale: 0.6, filter: "blur(2px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.6, filter: "blur(2px)" }}
          transition={{ type: "spring", duration: 0.2, bounce: 0 }}
          className={`grid place-items-center ${done ? "text-sk-success" : ""}`}
        >
          {done ? <CheckIcon /> : <CopyIcon />}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">{done ? "Copied" : ""}</span>
    </button>
  );
}

/** The frame every block of code sits in: a header bar and a body. */
function Frame({ header, children }: { header: ReactNode; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl bg-sk-well inset-ring inset-ring-sk-hairline">
      <div className="flex h-10 items-center justify-between gap-3 border-b border-sk-hairline pr-1 pl-3.5">{header}</div>
      {children}
    </div>
  );
}

export interface CodeBlockProps {
  code: string;
  /** A file name, or a title such as "Usage". */
  title: string;
  kind?: "file" | "terminal";
  lineNumbers?: boolean;
  /** Longer code shows this many lines and a button to see the rest. */
  collapseAfter?: number;
}

/** Highlighted code with a header, copy, line numbers, and a collapsed state for long files. */
export function CodeBlock({ code, title, kind = "file", lineNumbers = true, collapseAfter = 16 }: CodeBlockProps) {
  // Each line is its own block, so the line breaks between them are dropped.
  const html = useMemo(() => highlight(code.replace(/\n$/, "")).replace(/\n/g, ""), [code]);
  const lines = code.replace(/\n$/, "").split("\n").length;
  const collapsible = lines > collapseAfter + 4;
  const [open, setOpen] = useState(false);
  const shut = collapsible && !open;

  return (
    <Frame
      header={
        <>
          <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-sk-muted">
            {kind === "terminal" ? <TerminalIcon className="shrink-0" /> : <FileIcon className="shrink-0" />}
            <span className="truncate">{title}</span>
          </span>
          <CopyIconButton text={code} />
        </>
      }
    >
      <div className="relative">
        <motion.div
          initial={false}
          animate={{ height: shut ? collapseAfter * LINE + 32 : "auto" }}
          transition={{ type: "spring", duration: 0.35, bounce: 0 }}
          className={`overflow-hidden ${shut ? "[mask-image:linear-gradient(to_bottom,black_55%,transparent)]" : ""}`}
        >
          <pre className={`code-block overflow-x-auto py-4 font-sk-mono text-[13px]/6 ${lineNumbers ? "code-lines" : "px-4"}`} tabIndex={0}>
            <code dangerouslySetInnerHTML={{ __html: html }} />
          </pre>
        </motion.div>
        {collapsible && (
          <div className={shut ? "absolute inset-x-0 bottom-4 flex justify-center" : "flex justify-center pb-4"}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={`inline-flex h-8 items-center rounded-md bg-sk-surface px-3 text-[13px] font-semibold text-sk-ink shadow-sk-card transition-colors duration-100 hover:bg-sk-raised ${focus}`}
            >
              {open ? "Show less" : `Show all ${lines} lines`}
            </button>
          </div>
        )}
      </div>
    </Frame>
  );
}

/* ---------------- Commands ---------------- */

export const MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
export type Manager = (typeof MANAGERS)[number];
const KEY = "sk-package-manager";
const listeners = new Set<() => void>();

/** The package manager is shared by every command block on the site, and remembered. */
function useManager(): [Manager, (m: Manager) => void] {
  const value = useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => (localStorage.getItem(KEY) as Manager | null) ?? "pnpm",
    () => "pnpm" as Manager,
  );
  const set = (m: Manager) => {
    localStorage.setItem(KEY, m);
    listeners.forEach((fn) => fn());
  };
  return [MANAGERS.includes(value) ? value : "pnpm", set];
}

/** One command, written for each package manager, with tabs to switch between them. */
export function CommandBlock({ commands }: { commands: Record<Manager, string> }) {
  const [manager, setManager] = useManager();
  return (
    <Tabs.Root value={manager} onValueChange={(v) => setManager(v as Manager)}>
      <Frame
        header={
          <>
            <Tabs.List aria-label="Package manager" className="relative flex h-10 items-center gap-1">
              <TerminalIcon className="mr-1.5 shrink-0 text-sk-muted" />
              {MANAGERS.map((m) => (
                <Tabs.Tab
                  key={m}
                  value={m}
                  className={`relative h-10 px-1.5 text-[13px] font-medium text-sk-muted transition-colors duration-100 hover:text-sk-ink data-active:text-sk-ink ${focus}`}
                >
                  {m}
                </Tabs.Tab>
              ))}
              <Tabs.Indicator className="absolute bottom-[-1px] left-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) rounded-full bg-sk-ink transition-[translate,width] duration-200 ease-sk-out" />
            </Tabs.List>
            <CopyIconButton text={commands[manager]} label="Copy command" />
          </>
        }
      >
        {MANAGERS.map((m) => (
          <Tabs.Panel key={m} value={m}>
            <pre className="overflow-x-auto px-4 py-3.5 font-sk-mono text-[13px]/6 text-sk-ink">
              <code>{commands[m]}</code>
            </pre>
          </Tabs.Panel>
        ))}
      </Frame>
    </Tabs.Root>
  );
}

const RUN: Record<Manager, string> = { pnpm: "pnpm dlx", npm: "npx", yarn: "yarn dlx", bun: "bunx --bun" };
const ADD: Record<Manager, string> = { pnpm: "pnpm add", npm: "npm install", yarn: "yarn add", bun: "bun add" };

export const runCommand = (args: string) =>
  Object.fromEntries(MANAGERS.map((m) => [m, `${RUN[m]} ${args}`])) as Record<Manager, string>;
export const addCommand = (packages: string[]) =>
  Object.fromEntries(MANAGERS.map((m) => [m, `${ADD[m]} ${packages.join(" ")}`])) as Record<Manager, string>;
