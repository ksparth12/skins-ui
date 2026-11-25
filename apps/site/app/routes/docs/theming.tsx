import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { DEFAULT_PRESET, presets } from "@skins/hue";
import { CodeBlock } from "~/components/code-block";
import { A, C, DocPage, List, P, docMeta } from "~/components/docs";
import { hueCss, swatchColour, useHueChoice } from "~/components/hue-picker";
import { Section } from "~/components/section";

export const meta = () => docMeta("/docs/theming");

const ownCode = `export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-sk-accent-subtle px-3 py-2 text-sm text-sk-accent-subtle-fg">
      {children}
    </p>
  );
}
`;

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-ring";

/** The presets as labelled swatches. Picking one recolours the whole site and the CSS below. */
function PresetPicker() {
  const [value, choose] = useHueChoice();
  const current = presets.find((p) => p.id === value) ?? DEFAULT_PRESET;
  return (
    <div className="grid grid-cols-1 gap-4">
      <ToggleGroup aria-label="Colour" value={[current.id]} onValueChange={(next) => next[0] && choose(next[0])} className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <Toggle
            key={p.id}
            value={p.id}
            className={`inline-flex h-8 items-center gap-2 rounded-lg pr-3 pl-2 text-[13px] font-medium text-sk-muted transition-colors duration-100 hover:bg-sk-hover hover:text-sk-ink data-pressed:bg-sk-menu-on data-pressed:text-sk-ink ${focus}`}
          >
            <span aria-hidden="true" className="size-4 rounded-full inset-ring inset-ring-sk-border" style={{ backgroundColor: swatchColour[p.id] }} />
            {p.name}
          </Toggle>
        ))}
      </ToggleGroup>
      <CodeBlock title={`${current.id}.css`} code={hueCss(current.id) + "\n"} collapseAfter={12} />
    </div>
  );
}

export default function Theming() {
  return (
    <DocPage path="/docs/theming">
      <Section id="how-it-works" title="How it works">
        <P>
          You give Hue one colour. It builds a scale of eleven shades from it, plus a near-black shade of the same colour, and gives each
          job its own token: the accent fill and its hover and press, links, focus rings, soft tints and switch tracks.
        </P>
        <List>
          <li>Shades are made in OKLCH, so the steps look even whether you start from yellow or violet.</li>
          <li>Every text pair passes WCAG AA, and focus rings and indicators reach 3:1, in light and dark.</li>
          <li>Greys and status colours (danger, success, warning, info) never change, so they keep their meaning.</li>
        </List>
      </Section>

      <Section id="pick-a-colour" title="Pick a colour">
        <P>
          Choose a preset to see it on this whole site. Paste its CSS after the tokens, either below <C>skins.css</C> or below the tokens the
          CLI wrote, and your skins use it too.
        </P>
        <PresetPicker />
      </Section>

      <Section id="wide-colour" title="Wide colour">
        <P>
          Screens that show Display P3 get the fuller OKLCH version of every Hue colour. Other screens get an sRGB value chosen to match. The
          CSS handles this with a <C>color-gamut</C> media query, so there is nothing to set up.
        </P>
      </Section>

      <Section id="your-own-code" title="In your own code">
        <P>
          Every token is also a Tailwind colour. <C>--sk-accent</C> gives you <C>bg-sk-accent</C>, <C>text-sk-accent</C>,{" "}
          <C>border-sk-accent</C> and the rest, so your own components change colour with your skins. <A to="/docs/tokens">Tokens</A> lists
          them all.
        </P>
        <CodeBlock title="notice.tsx" code={ownCode} />
      </Section>
    </DocPage>
  );
}
