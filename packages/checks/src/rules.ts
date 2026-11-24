export interface Finding {
  file: string;
  line: number;
  rule: string;
  message: string;
}

export interface Rule {
  id: string;
  /** Which files the rule reads, by repository path. */
  applies: (path: string) => boolean;
  check: (path: string, text: string) => Finding[];
}

const TEXT = /\.(md|mdx|ts|tsx|js|mjs|json|jsonc|css|html|txt|ya?ml)$/;

function eachLine(path: string, text: string, rule: string, test: (line: string) => string | null): Finding[] {
  return text.split("\n").flatMap((line, i) => {
    const message = test(line);
    return message ? [{ file: path, line: i + 1, rule, message }] : [];
  });
}

const LONG_DASH = new RegExp("[\\u2013\\u2014]");

const RAW_COLOUR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\(/;
const PALETTE_CLASS =
  /\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|shadow|decoration|caret|accent|divide|placeholder)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;

export const rules: Rule[] = [
  {
    id: "no-long-dash",
    applies: (p) => TEXT.test(p),
    check: (p, t) => eachLine(p, t, "no-long-dash", (l) => (LONG_DASH.test(l) ? "Use a comma, a colon, a full stop or brackets." : null)),
  },
  {
    id: "colour-from-tokens",
    applies: (p) => p.startsWith("registry/") && /\.(tsx|ts|css)$/.test(p),
    check: (p, t) =>
      eachLine(p, t, "colour-from-tokens", (l) => {
        if (RAW_COLOUR.test(l)) return "Colours come from tokens, not raw values.";
        if (PALETTE_CLASS.test(l)) return "Colours come from tokens, not built-in palette classes.";
        return null;
      }),
  },
  {
    id: "skin-imports",
    applies: (p) => p.startsWith("registry/") && /\.tsx?$/.test(p),
    check: (p, t) =>
      eachLine(p, t, "skin-imports", (l) =>
        /from\s+["'](?:react-router|@react-router\/|~\/|@skins\/site|\.\.\/)/.test(l) ? "A skin imports nothing from the site, the router or other skins." : null,
      ),
  },
];
