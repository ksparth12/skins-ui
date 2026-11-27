#!/usr/bin/env node
/**
 * Writes the share image of every public page to public/og, as 1200 x 630 JPEGs.
 * Each image is drawn by the dev server's /dev/og route and photographed in the installed Chrome.
 * Uses a dev server already running on port 7000, or starts one for the run.
 */
import { spawn, type ChildProcess } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium, type Browser } from "playwright-core";
import config from "../react-router.config.ts";
import { ogImageFile } from "../app/lib/site.ts";

const ORIGIN = "http://127.0.0.1:7000";
const site = fileURLToPath(new URL("..", import.meta.url));
const out = fileURLToPath(new URL("../public/og/", import.meta.url));
const WORKERS = 4;

const prerender = config.prerender as () => string[];
const paths = prerender();

const up = () =>
  fetch(`${ORIGIN}/dev/og?page=/`)
    .then((r) => r.ok)
    .catch(() => false);

async function startServer(): Promise<ChildProcess | null> {
  if (await up()) return null;
  const server = spawn("pnpm", ["exec", "react-router", "dev"], { cwd: site, stdio: "ignore", detached: true });
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 500));
    if (await up()) return server;
  }
  stop(server);
  throw new Error("The dev server did not start on port 7000.");
}

function stop(server: ChildProcess | null) {
  if (server?.pid) process.kill(-server.pid);
}

/** Skins that draw with WebGL or settle in over time get longer before the photo. */
const settle = (path: string) => (path.startsWith("/components/background/") ? 2500 : /^\/components\/(modal|toast)\//.test(path) ? 1800 : path.startsWith("/components/") ? 1200 : 600);

async function shoot(browser: Browser, queue: string[], done: { n: number }) {
  const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, colorScheme: "dark" });
  const page = await context.newPage();
  for (let path = queue.shift(); path; path = queue.shift()) {
    await page.goto(`${ORIGIN}/dev/og?page=${encodeURIComponent(path)}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(settle(path));
    await page.locator("#og").screenshot({ path: `${out}${ogImageFile(path)}`, type: "jpeg", quality: 90 });
    done.n++;
    process.stdout.write(`\r${done.n}/${paths.length}`);
  }
  await context.close();
}

const server = await startServer();
try {
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome" });
  try {
    // One visit first, so the dev server has bundled everything before the parallel run.
    const warm = await browser.newPage();
    await warm.goto(`${ORIGIN}/dev/og?page=/`, { waitUntil: "networkidle" });
    await warm.close();
    const queue = [...paths];
    const done = { n: 0 };
    await Promise.all(Array.from({ length: WORKERS }, () => shoot(browser, queue, done)));
    process.stdout.write(`\nWrote ${paths.length} share images to public/og.\n`);
  } finally {
    await browser.close();
  }
} finally {
  stop(server);
}
