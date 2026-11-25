/** The getting started pages, in reading order. */
export const docs = [
  { path: "/docs", title: "Introduction", description: "Skins UI is a set of React components, each drawn in many different styles." },
  { path: "/docs/installation", title: "Installation", description: "Add a skin with one command, or copy the files by hand." },
  { path: "/docs/theming", title: "Theming", description: "Pick one colour and every skin follows it, in light and dark." },
  { path: "/docs/tokens", title: "Tokens", description: "Every token a skin reads, with its light and dark value." },
] as const;

export type DocPath = (typeof docs)[number]["path"];

export const findDoc = (path: DocPath) => docs.find((d) => d.path === path)!;
