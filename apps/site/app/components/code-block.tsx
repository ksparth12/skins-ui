import { Tabs } from "@base-ui/react/tabs";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { highlight } from "sugar-high";
import { CheckIcon, CopyIcon, FileTypeIcon } from "~/components/icons";
import { ManagerIcon } from "~/components/manager-icons";
import { Panel, PanelLabel } from "~/components/panel";
import { TabPill } from "~/components/tab-pill";

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
      className={`grid size-7 place-items-center rounded-md text-neutral-500 transition-colors duration-100 hover:bg-neutral-200/70 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/70 dark:hover:text-white ${focus}`}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={done ? "done" : "copy"}
          initial={{ opacity: 0, scale: 0.6, filter: "blur(2px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.6, filter: "blur(2px)" }}
          transition={{ type: "spring", duration: 0.2, bounce: 0 }}
          className="grid place-items-center"
        >
          {done ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">{done ? "Copied" : ""}</span>
    </button>
  );
}

export interface CodeBlockProps {
  code: string;
  /** A file name, or a title such as "Usage". */
  title: string;
  /** Longer code shows this many lines and a button to see the rest. */
  collapseAfter?: number;
  /** Passed to the outer plate, for example to let it fill a fixed area. */
  className?: string;
  /** Passed to the inner card. */
  innerClassName?: string;
  /** Fill the height it is given and scroll inside it, instead of collapsing long code. */
  scroll?: boolean;
}

/** Highlighted code in a panel: the file name and copy above, the code on the inner card. */
export function CodeBlock({ code, title, collapseAfter = 22, className, innerClassName, scroll = false }: CodeBlockProps) {
  const trimmed = code.replace(/\n$/, "");
  // Each line is its own block, so the line breaks between them are dropped.
  const html = useMemo(() => highlight(trimmed).replace(/\n/g, ""), [trimmed]);
  const lines = trimmed.split("\n").length;
  const collapsible = !scroll && lines > collapseAfter + 4;
  const [open, setOpen] = useState(false);
  const shut = collapsible && !open;

  return (
    <Panel className={className} innerClassName={innerClassName} header={<><PanelLabel icon={<FileTypeIcon name={title} className="size-4" />}>{title}</PanelLabel><CopyIconButton text={code} /></>}>
      {scroll ? (
        <div className="absolute inset-0 overflow-auto overscroll-contain scroll-fade-b">
          <pre className="code-block code-lines py-3.5 font-sk-mono text-[13px]/6" tabIndex={0}>
            <code dangerouslySetInnerHTML={{ __html: html }} />
          </pre>
        </div>
      ) : (
      <motion.div
        initial={false}
        animate={{ height: shut ? collapseAfter * LINE + 28 : "auto" }}
        transition={{ type: "spring", duration: 0.35, bounce: 0 }}
        className={`overflow-hidden ${shut ? "[mask-image:linear-gradient(to_bottom,black_50%,transparent)]" : ""}`}
      >
        <pre className="code-block code-lines overflow-x-auto py-3.5 font-sk-mono text-[13px]/6" tabIndex={0}>
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </motion.div>
      )}
      {collapsible && (
        <div className={shut ? "absolute inset-x-0 bottom-3 flex justify-center" : "flex justify-center pb-3"}>
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`h-8 rounded-lg bg-sk-accent px-3.5 text-[13px] font-semibold text-sk-accent-fg shadow-xs transition-colors duration-150 hover:bg-sk-accent-hover active:scale-[0.97] ${focus}`}
          >
            {open ? "Collapse" : "Expand"}
          </button>
        </div>
      )}
    </Panel>
  );
}

/* ---------------- Commands ---------------- */

export const MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;
export type Manager = (typeof MANAGERS)[number];
/** The first manager is the default until a reader picks another. */
const DEFAULT_MANAGER: Manager = MANAGERS[0];
const KEY = "sk-package-manager";
const listeners = new Set<() => void>();

/** The package manager is shared by every command block on the site, and remembered. */
function useManager(): [Manager, (m: Manager) => void] {
  const value = useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => (localStorage.getItem(KEY) as Manager | null) ?? DEFAULT_MANAGER,
    () => DEFAULT_MANAGER,
  );
  const set = (m: Manager) => {
    localStorage.setItem(KEY, m);
    listeners.forEach((fn) => fn());
  };
  return [MANAGERS.includes(value) ? value : DEFAULT_MANAGER, set];
}

/** One command, written for each package manager, with tabs to switch between them. */
export function CommandBlock({ commands }: { commands: Record<Manager, string> }) {
  const [manager, setManager] = useManager();
  return (
    <Tabs.Root value={manager} onValueChange={(v) => setManager(v as Manager)}>
      <Panel
        header={
          <>
            <Tabs.List aria-label="Package manager" className="relative flex items-center gap-0.5">
              {MANAGERS.map((m) => (
                <Tabs.Tab
                  key={m}
                  value={m}
                  className={`relative inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs text-neutral-500 transition-colors duration-150 hover:text-neutral-900 data-active:font-medium data-active:text-neutral-950 dark:text-neutral-400 dark:hover:text-white dark:data-active:text-white ${focus}`}
                >
                  {m === manager && <TabPill group="manager" />}
                  <span className="relative inline-flex items-center gap-1.5">
                    <ManagerIcon manager={m} active={m === manager} className="size-3.5 shrink-0 transition-colors duration-150" />
                    {m}
                  </span>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <CopyIconButton text={commands[manager]} label="Copy command" />
          </>
        }
      >
        {MANAGERS.map((m) => (
          <Tabs.Panel key={m} value={m}>
            <pre className="overflow-x-auto px-4 py-3.5 font-sk-mono text-[13px]/6 text-neutral-900 dark:text-neutral-100">
              <code>{commands[m]}</code>
            </pre>
          </Tabs.Panel>
        ))}
      </Panel>
    </Tabs.Root>
  );
}

const RUN: Record<Manager, string> = { pnpm: "pnpm dlx", npm: "npx", yarn: "yarn dlx", bun: "bunx --bun" };
const ADD: Record<Manager, string> = { pnpm: "pnpm add", npm: "npm install", yarn: "yarn add", bun: "bun add" };

export const runCommand = (args: string) =>
  Object.fromEntries(MANAGERS.map((m) => [m, `${RUN[m]} ${args}`])) as Record<Manager, string>;
export const addCommand = (packages: string[]) =>
  Object.fromEntries(MANAGERS.map((m) => [m, `${ADD[m]} ${packages.join(" ")}`])) as Record<Manager, string>;
