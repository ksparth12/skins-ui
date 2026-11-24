# Design

How Skins UI looks, moves and behaves. Every skin and every page of the site follows this file. When something here and a skin disagree, the skin changes.

## Principles

1. **One component, many skins, one API.** Every skin of a component takes the same props. Swapping a skin is a one-line change.
2. **Quiet by default.** Content is the loudest thing on screen. Surfaces recede, colour is used where it carries meaning, and effects earn their place.
3. **One colour in, a whole system out.** Pick a colour and every skin follows it, with readable text guaranteed in light and dark.
4. **Motion explains, never decorates.** Things glide to show where they went and fade to show they arrived. Nothing bounces.
5. **Every skin respects the person using it.** Keyboard, screen readers, touch, reduced motion and contrast are part of the skin, not extras.

## The Skin Contract

A skin is accepted when all of these are true.

**API**
- It takes exactly the props of its component's shared API, with the same names, types and defaults.
- An unknown or missing prop value falls back to the default. A skin never renders unstyled.
- It forwards `ref`, `className` and the native attributes of its root element.

**Colour**
- Every colour comes from a token. No hex, `rgb()`, `oklch()` or built-in palette class (such as `bg-blue-500`) in skin source.
- Brand colour comes from Hue roles. Status colours come from status tokens.
- It declares the modes it supports in `meta.json`: `light`, `dark`, or both. Each supported mode is designed on its own. A skin is never made by inverting another mode.

**Motion**
- It follows the Motion Laws below and stops or reduces motion under `prefers-reduced-motion`.

**Interaction**
- Interactive behaviour (dialogs, menus, popovers, tooltips, switches, selects, sliders) is built on Base UI and styled through its data attributes.
- It works with a keyboard, shows the focus ring only for keyboard focus, and gives every control an accessible name.
- Touch targets are at least 40px, or grow to 40px on coarse pointers.

**Dependencies**
- It depends on React, Tailwind CSS and the packages listed in its `meta.json`, nothing else.
- It never imports anything from the site, the router or another skin.
- Icons come from an open licensed set. Fonts shipped with a skin use the SIL Open Font License.

**Effects**
- Glow, grids, scanlines, noise and similar effects are allowed only when they are the point of the skin, and they must be crafted with care. An effect added for decoration is removed in review.

## Hue

Hue turns one colour into a full colour system.

### From one colour to a ramp

- The colour is read in OKLCH, so every hue gets shades of the same perceived lightness.
- Eleven shades are generated, `--sk-hue-50` (lightest) to `--sk-hue-950` (darkest), along a fixed lightness curve. The hue stays constant.
- The chosen colour itself sits in the ramp at its nearest shade, unchanged.
- Chroma follows the chosen colour, eases off at the lightest and darkest shades, and never exceeds what the screen can show.
- `--sk-hue-deep` is the colour falling into a near black shade of itself, for rich backgrounds.
- `--sk-hue-2` and `--sk-hue-3` are close neighbours, 16 degrees either side, for skins that need a second shade of the same family.
- A grey input produces a neutral ramp.

### Wide colour

Every shade is written twice: an sRGB value for every screen, and an OKLCH value inside `@media (color-gamut: p3)` that reaches further on wide gamut screens.

### Roles

Skins use roles, not ramp shades. Ramp shades are for gradients and materials.

| Role | Use |
|---|---|
| `--sk-accent` | Filled primary actions. The chosen colour whenever its label is readable on it |
| `--sk-accent-hover`, `--sk-accent-active` | Hover and press. Always move away from the label colour, so the label only gets clearer |
| `--sk-accent-fg` | Text and icons on the accent. White, or near black when white is not readable |
| `--sk-indicator`, `--sk-indicator-fg` | Switch on, checkbox, slider fill, chosen state outline. At least 3:1 against every surface |
| `--sk-accent-subtle`, `--sk-accent-subtle-fg` | Soft tinted backgrounds and their text, such as an accent badge |
| `--sk-accent-border` | An edge drawn in the accent family |
| `--sk-link` | Accent text on any surface |
| `--sk-ring` | The keyboard focus ring |

### Contrast is guaranteed

Every role is tested against every surface it can sit on when the colours are generated.

| Pair | Minimum |
|---|---|
| Label on accent, hover and active | 4.5:1 |
| Indicator against every surface | 3:1 |
| Label on indicator | 4.5:1 |
| Subtle text on its subtle background | 4.5:1 |
| Link on every surface | 4.5:1 |
| Focus ring against every surface | 3:1 |

A role that falls short is first nudged in lightness, then moved along the ramp, until it passes. No choice of colour can produce an unreadable control.

### What Hue never changes

- Status colours. Red always means danger.
- Neutrals. Pages, surfaces, text and borders stay neutral, so every colour keeps its role.
- Highlights in menus and lists, which are always a neutral tint.

### Changing colour

When the colour changes, every role glides to its new value over the slow motion speed. Under reduced motion the change is instant.

### Gradients

A gradient in a skin uses one hue: a mid shade falling smoothly through the ramp into `--sk-hue-deep`, interpolated in OKLCH, with at most a soft light in the same family. Mixing in other hues is not allowed.

## Tokens

All tokens carry the `--sk-` prefix so they never collide with the tokens of the app a skin is installed into. Tailwind utilities use the same names: `bg-sk-accent`, `text-sk-ink`, `shadow-sk-card`.

Dark values apply when an ancestor has the class `dark` or the attribute `data-theme="dark"`. The class `light` or `data-theme="light"` brings light values back inside a dark page.

### Surfaces

| Token | Use |
|---|---|
| `--sk-floor` | The page |
| `--sk-surface` | Cards, panels, fields at rest |
| `--sk-raised` | Things above a card |
| `--sk-overlay` | Menus, popovers, dialogs |
| `--sk-well` | Sunken areas inside a surface: tracks, wells, inactive fields |

In dark mode each step up is lighter than the one below. In light mode raised things stay white and the shadow carries the lift.

### Text

| Token | Use |
|---|---|
| `--sk-ink` | Text, titles, icons in use |
| `--sk-muted` | Second lines, hints, icons at rest. 4.5:1 on every surface |
| `--sk-faint` | Placeholders only |

### Edges and interaction

| Token | Use |
|---|---|
| `--sk-hairline` | The quietest edge, between rows |
| `--sk-border` | Edges at rest |
| `--sk-border-strong` | Edges on hover and of empty checkboxes |
| `--sk-hover`, `--sk-press` | See-through tints for hover and press on any surface |
| `--sk-menu-on` | The highlighted row in a menu or list |
| `--sk-edge-light` | A soft top highlight for material skins |

Edges and tints are see-through, so they read correctly on tinted surfaces.

### Status

`--sk-danger`, `--sk-success`, `--sk-warning`, `--sk-info`, each with a `-soft` background. The text colour is readable on its own soft background in both modes.

### Depth

| Token | Use |
|---|---|
| `--sk-shadow-ring` | A hairline ring only |
| `--sk-shadow-card` | Cards and fields |
| `--sk-shadow-raised` | Raised cards, hovered secondary buttons |
| `--sk-shadow-popover` | Menus and popovers |
| `--sk-shadow-modal` | Dialogs |
| `--sk-shadow-inset` | Sunken fields and tracks |

Shadows are neutral. A coloured shadow or glow under a control is not allowed.

### Shape

| Use | Radius |
|---|---|
| Badges, small controls (32px) | 6px |
| Controls (40px): buttons, fields, selects | 8px |
| Menus, popovers | 12px |
| Cards | 16px |
| Dialogs | 20px |

Nested corners are concentric: the inner radius equals the outer radius minus the gap between them.

### Size

- Controls sit on one height ladder: **32, 40, 48**. Controls side by side share a height.
- Spacing follows a 4px grid. Most gaps are 8 or 12; card padding is 16 or 20; sections are 64 apart.
- Icons are 16px by default, 14px in small controls, 20px in empty states. Outline only, `currentColor`, 1.5 stroke.

## Type

| Role | Font | Settings |
|---|---|---|
| Headings | Cal Sans | Weight 600, optical sizing on |
| Interface and body | Cal Sans Text UI | Weight 450 for body, 550 for labels, 600 for buttons |
| Code and numbers in code | Geist Mono | |

- Skins do not ship a text font. They read `--sk-font-sans`, `--sk-font-display` and `--sk-font-mono`, which default to the fonts of the app they are installed into.
- A skin whose look depends on a font (a pixel skin, for example) sets `--sk-skin-font`, falling back to `--sk-font-sans`, and lists the font in `meta.json`.
- Sentence case everywhere. No small uppercase labels above headings. No italics in interface text.
- Body text is never set at weight 400 at small sizes.
- Numbers that line up in columns use tabular figures.
- Fields use 16px text on phones so the browser does not zoom.

## Components

### Buttons

| Variant | Look |
|---|---|
| Primary | Solid `--sk-accent`, `--sk-accent-fg` label, semibold, an extra small neutral shadow in light mode |
| Secondary | `--sk-surface` with a faint inner ring in light mode; a soft see-through fill in dark mode |
| Ghost | No fill; `--sk-hover` on hover, `--sk-press` on press |
| Danger | Solid danger colour, used only for actions that destroy something |

- Sizes: 32px (6px radius), 40px (8px radius, default), 48px (8px radius).
- Hover and press change the fill only. Press also scales to 0.97. No movement, no bounce, no glow.
- A loading button keeps its width, blocks clicks and shows a spinner in place of its leading icon.
- One primary button per view.

### Fields

- A sunken well at rest, `--sk-border` edge. Hover firms the edge. Focus turns the field to `--sk-surface` with a `--sk-ring` edge and a soft ring around it. Invalid turns the edge to danger.
- Every field has a visible label. Hints and errors sit under the field.

### Menus and lists

- The highlighted row (pointer or keyboard) takes `--sk-menu-on` with full ink text. Never the accent, never a ring.
- A chosen item shows a small muted check at the end of its row.
- Rows are 32px. Destructive rows use the danger colour for their text.

### Badges

- 24px tall, 6px radius, 12px semibold text, a soft fill, no outline.
- Accent badges use `--sk-accent-subtle` and `--sk-accent-subtle-fg`. Status badges use the status pairs.

### Focus

- One ring everywhere: a 2px `--sk-ring` outline, 2px outside the element, following its corners.
- Keyboard focus only (`:focus-visible`). A mouse click or a tap never shows it.
- A control that draws its own focused edge (a field) turns off the outline of what is inside it, so there is never a double ring.

## Motion Laws

### Speeds

| Speed | Spring | Exit | CSS | For |
|---|---|---|---|---|
| Fast | 0.08s | 0.06s | 100ms | Press, colour changes, small swaps in place |
| Base | 0.16s | 0.12s | 150ms | Popups, gliding highlights, list items, panels |
| Slow | 0.24s | 0.16s | 220ms | Drawers, large moves, Hue changes |

- The bigger the thing that moves, the slower it moves.
- Enters are springs with no bounce, so an interrupted animation turns around from where it is. Exits are quicker eased tweens.
- Easing for anything appearing: a quick start and a long settle, `cubic-bezier(0.22, 1, 0.36, 1)`.
- Durations come from the speed tokens. A duration typed by hand is a bug.

### Rules

- Content on screen at first load never animates in. Only later changes animate.
- Animate `transform`, `opacity` and colours. Widths and heights animate only when they show data, such as a progress bar.
- Size changes glide. Content that replaces other content cross-fades in the same place, so nothing jumps.
- Cards, sections and tiles do not animate in on load or on scroll.
- Hover never moves or scales a card, link or button.
- Popups open by fading in, growing from 96% and sliding a few pixels from the side they open on. They close a step quicker.
- Under `prefers-reduced-motion`, movement stops. Colour and opacity changes may stay, without movement. Animated backgrounds pause on a pleasing still frame.
- Animated backgrounds also pause when off screen or when the tab is hidden.

### Library

Motion powers anything that glides, morphs, reflows or follows a gesture. Plain CSS is fine for a single colour or opacity change. When Motion makes something even slightly better, use Motion.

## Backgrounds

Background skins fill the whole frame behind content.

- A full field with calm areas where content can sit. Never a single object on a plain field.
- One colour family from Hue, travelling smoothly into its deep shade, with no banding.
- Slow, continuous motion. No flicker and no shimmering noise.
- Grain, when used, is its own prop, off by default.
- Shader colours come from Hue through `useHue()`, and change with it.

## Accessibility

- Contrast as listed above, in both modes, for every preset.
- Every interactive element is reachable and usable with a keyboard, in a sensible order.
- Overlays trap focus while open and hand it back when closed.
- Icon only controls have an accessible name.
- Status is never shown by colour alone.
- Layouts work from 320px wide and support right to left text through logical properties.

## Writing

Every word in docs, metadata and the interface follows these rules.

- Plain words, short sentences, "you" for the reader.
- Sentence case for every heading, label and button.
- Every claim is true for the skin as it ships today.
- Each skin's description is written for that skin. No templates.
- A description fits on one line under the skin's title: 80 characters at most, ending with a full stop. Say what it looks like and, if there is room, where it fits best. `pnpm check` enforces the length.
- No long dashes. Use a comma, a colon, a full stop or brackets.

## Skin Review

Every pull request that adds or changes a skin passes both lists.

### Automated

- `meta.json` matches the schema, and its dependencies match the imports.
- No raw colour values or built-in palette classes in skin source.
- No imports from the site, the router or other skins.
- No long dashes in any text.
- The skin renders in every mode it declares, for every Hue preset, with no console errors.
- Contrast checks pass for every preset.
- Type check and lint pass.

### By hand

- The props API matches the component's shared API.
- Keyboard: every control can be reached and used; the focus ring shows only for keyboard focus.
- Reduced motion: movement stops, nothing breaks.
- Touch: targets are large enough; nothing depends on hover.
- Light and dark, at 390px and 1280px wide: nothing overflows, nothing jumps between states.
- Effects are the point of the skin, crafted, and not decoration.
- The description is true, plain and specific.
