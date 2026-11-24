#!/usr/bin/env node
/** Runs every repository rule over tracked and new files, and exits non-zero on any finding. */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { rules, type Finding } from "./rules.ts";

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8" })
  .split("\n")
  .filter(Boolean)
  .filter((p) => p !== "pnpm-lock.yaml");

const findings: Finding[] = [];
for (const path of files) {
  const active = rules.filter((r) => r.applies(path));
  if (!active.length) continue;
  let text: string;
  try {
    text = readFileSync(`${root}/${path}`, "utf8");
  } catch {
    continue;
  }
  for (const rule of active) findings.push(...rule.check(path, text));
}

for (const f of findings) console.log(`${f.file}:${f.line}  ${f.rule}  ${f.message}`);
console.log(findings.length ? `\n${findings.length} finding${findings.length === 1 ? "" : "s"}` : `All checks passed (${files.length} files).`);
process.exit(findings.length ? 1 : 0);
