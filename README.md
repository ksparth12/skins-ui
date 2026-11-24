# Skins UI

Every component, in many complete looks.

Skins UI is a React component library where each component comes in many skins: glass, brutalist, retro and more. Every skin of a component shares one API, so changing the look is a one-line change. Pick a colour, and every skin follows it with readable text in light and dark.

## Status

Early development. The foundations are in place: the colour system, design tokens and the documentation site. The first components are next.

## Develop

Requires Node 26 and pnpm.

```bash
pnpm install
pnpm dev        # the site at http://127.0.0.1:7000
pnpm test       # colour system tests
pnpm check      # repository rules
pnpm typecheck
```

## Repository

| Path | What it holds |
|---|---|
| `apps/site` | The documentation site |
| `registry` | Every skin, one folder each |
| `packages/hue` | Turns one colour into a full, contrast checked colour system |
| `packages/tokens` | The design tokens every skin reads |
| `packages/checks` | Automated rules every change must pass |

Design rules for every skin are in [DESIGN.md](DESIGN.md).

## License

[MIT](LICENSE)
