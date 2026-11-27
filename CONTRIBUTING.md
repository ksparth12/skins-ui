# Contributing

Thanks for helping. The most useful thing you can send is a new skin: a component you already know, drawn in a style it doesn't have yet. Fixes to existing skins, the site and the docs are welcome too.

Every skin is reviewed for quality and fit before it ships. Not every skin is merged, and some are merged after changes. That review is what keeps the whole set worth using.

## Before you start

- **A new skin for an existing component:** go ahead and build it.
- **A new component, or a change to a component's props:** open an issue first. Every skin of a component shares one API, so these changes touch every skin.
- **A bug:** open an issue with the steps to see it, or send the fix.

## Set up

You need Node 26 and pnpm.

```bash
git clone https://github.com/<you>/skins-ui.git
cd skins-ui
pnpm install
pnpm dev
```

The site runs at http://127.0.0.1:7000. Every skin has its own page there, with a live preview and controls for every prop.

## How a skin is put together

Each component has a folder in `registry`, and each of its skins is a folder inside it:

```
registry/
  switch/
    component.json          the shared API: props, defaults, how the preview shows it
    glass/
      switch-glass.tsx      the skin
      meta.json             its name, description, tags and modes
```

### The skin file

`<component>-<skin>.tsx` exports the name given in `component.json` under `export` (for a switch, `Switch`), takes exactly the props listed there with the same defaults, and forwards `ref`, `className` and the native attributes of its root element.

It is one self-contained file. It may import React, Motion, Base UI and the packages listed in its `meta.json`. It never imports from the site, the router or another skin.

### meta.json

```json
{
  "name": "switch-glass",
  "component": "switch",
  "title": "Glass",
  "description": "A frosted track that tints with your colour, and a glossy bead of a thumb.",
  "tags": ["glass", "material"],
  "modes": ["light", "dark"],
  "dependencies": ["@base-ui/react"],
  "author": "your-github-username"
}
```

| Field | What it holds |
|---|---|
| `name` | `<component>-<skin>`, the same as the file name |
| `component` | The component folder it belongs to |
| `title` | The style's name. A style that already exists on another component keeps that name, look and feel. |
| `description` | One sentence that ends with a full stop, 80 characters at most |
| `tags` | Styles people can filter by, such as `glass`, `brutalist` or `retro` |
| `modes` | `light`, `dark`, or both. Each mode is drawn on its own, never made by inverting the other. |
| `dependencies` | Every package the skin imports, apart from React |
| `author` | Your GitHub username |

A new skin folder shows up on the running site straight away. A new component folder needs one restart of `pnpm dev`.

## The rules

The full standard is the Skin Contract in [DESIGN.md](DESIGN.md). In short:

- **Colour comes from tokens.** No hex, `rgb()`, `oklch()` or built-in palette classes such as `bg-blue-500`. Brand colour comes from the Hue tokens, so your skin follows whatever colour someone picks.
- **Same API as every other skin of the component.** Same props, same defaults.
- **Built on Base UI** for anything interactive: dialogs, menus, switches, toasts and the rest.
- **Keyboard and screen readers work.** The focus ring shows only for keyboard focus, and every control has an accessible name.
- **Motion never bounces,** and it calms down or stops when reduced motion is on.
- **Effects earn their place.** Glow, grids, noise and similar effects are fine when they are the point of the skin and made with care.
- **Icons, fonts and images are yours to share:** open licensed icons and fonts, and images you have the rights to.

`pnpm check` enforces the parts a machine can check: colours from tokens, no imports from the site or other skins, the description length, no credentials in the repository, and no long dashes in any text (use a comma, a colon or a full stop instead).

## Before you open a pull request

Look at your skin on its page in the site and check:

- [ ] It looks right in light and dark, or in the one mode it declares.
- [ ] It works at phone width (390px) and laptop width (1280px).
- [ ] Every prop in the controls changes it the way it should.
- [ ] It works with only a keyboard.
- [ ] It behaves with reduced motion turned on.

Then run:

```bash
pnpm check
pnpm typecheck
pnpm build
```

Send one skin per pull request, with a screenshot in each mode it supports. The pull request template has the full checklist.

## License

By contributing, you agree that your work is released under the [MIT License](LICENSE).
