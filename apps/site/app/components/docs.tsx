import type { ReactNode } from "react";
import { Link } from "react-router";
import { AppShell } from "~/components/app-shell";
import { ArrowRightIcon } from "~/components/icons";
import { docs, findDoc, type DocPath } from "~/lib/docs";
import { pageMeta } from "~/lib/seo";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

export const docMeta = (path: DocPath) => {
  const doc = findDoc(path);
  return pageMeta({ title: `${doc.title} · Skins UI`, description: doc.description, path, imageAlt: `${doc.title}: ${doc.description}` });
};

/** A getting started page: title, one line under it, the content, then links to the pages either side. */
export function DocPage({ path, children }: { path: DocPath; children: ReactNode }) {
  const i = docs.findIndex((d) => d.path === path);
  const doc = docs[i]!;
  const prev = docs[i - 1];
  const next = docs[i + 1];
  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-5 pt-8 pb-16 lg:px-8 lg:pt-12">
        <h1 className="text-3xl/10 font-semibold sm:text-4xl/11">{doc.title}</h1>
        <p className="mt-2 text-base text-pretty text-sk-muted">{doc.description}</p>
        <div className="mt-4">{children}</div>
        <nav aria-label="Pages" className="mt-16 grid grid-cols-2 gap-3">
          {prev ? <Pager to={prev.path} label="Previous" title={prev.title} /> : <span />}
          {next && <Pager to={next.path} label="Next" title={next.title} end />}
        </nav>
      </main>
    </AppShell>
  );
}

function Pager({ to, label, title, end }: { to: string; label: string; title: string; end?: boolean }) {
  return (
    <Link
      to={to}
      className={`group grid gap-0.5 rounded-[14px] px-4 py-3 ring-1 ring-sk-border transition-colors duration-100 hover:bg-sk-hover hover:ring-sk-border-strong ${end ? "col-start-2 text-right" : ""} ${focus}`}
    >
      <span className="text-[13px] text-sk-muted">{label}</span>
      <span className={`flex items-center gap-1.5 text-[15px] font-medium ${end ? "justify-end" : ""}`}>
        {!end && <ArrowRightIcon className="size-3.5 rotate-180 text-sk-muted" />}
        {title}
        {end && <ArrowRightIcon className="size-3.5 text-sk-muted" />}
      </span>
    </Link>
  );
}

/** Body text. */
export function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px]/7 text-pretty text-neutral-700 dark:text-neutral-300">{children}</p>;
}

/** A name from code inside a sentence. */
export function C({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-black/[0.05] px-1.5 py-0.5 font-sk-mono text-[13px] text-sk-ink dark:bg-white/[0.08]">{children}</code>;
}

/** A link inside a sentence. Pages on this site open in place; others open as usual. */
export function A({ to, children }: { to: string; children: ReactNode }) {
  const cls = `rounded-sm font-medium text-sk-ink underline decoration-sk-border-strong underline-offset-4 transition-colors duration-100 hover:decoration-sk-ink ${focus}`;
  return to.startsWith("/") && !/\.(css|json)$/.test(to) ? (
    <Link to={to} className={cls}>{children}</Link>
  ) : (
    <a href={to} download={to.endsWith(".css") ? "" : undefined} className={cls}>{children}</a>
  );
}

/** A short list of points. */
export function List({ children }: { children: ReactNode }) {
  return <ul className="grid list-disc gap-2 pl-5 text-[15px]/7 text-neutral-700 marker:text-sk-faint dark:text-neutral-300">{children}</ul>;
}
