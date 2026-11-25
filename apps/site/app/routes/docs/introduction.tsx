import { CodeBlock } from "~/components/code-block";
import { A, C, DocPage, List, P, docMeta } from "~/components/docs";
import { Section } from "~/components/section";

export const meta = () => docMeta("/docs");

const swap = `// Before
import { Button } from "@/components/skins/button-flat";

// After: a new look, and nothing else in your code changes
import { Button } from "@/components/skins/button-glass";

export function Toolbar() {
  return (
    <Button variant="secondary" size="lg">
      Deploy
    </Button>
  );
}
`;

export default function Introduction() {
  return (
    <DocPage path="/docs">
      <Section id="components-and-skins" title="Components and skins">
        <P>
          A component is one kind of control, such as a button. A skin is one look for it: flat, glass, brutal, pixel and many more. Each skin is a
          single file built with React and Tailwind CSS, and you can read all of it on its page before you add it.
        </P>
      </Section>

      <Section id="same-props" title="Same props, any skin">
        <P>
          Every skin of a component takes the same props. To change how your buttons look, change the import. Variants, sizes, loading and
          disabled states all carry over.
        </P>
        <CodeBlock title="toolbar.tsx" code={swap} />
      </Section>

      <Section id="one-colour" title="One colour for everything">
        <P>
          Skins never use fixed colours. They read a shared set of tokens, so when you pick a colour every skin follows it at once, and
          the contrast of every text pair is checked for you. <A to="/docs/theming">Theming</A> shows how.
        </P>
      </Section>

      <Section id="own-the-code" title="You own the code">
        <P>
          There is no component package to install or keep up to date. A skin is copied into your project, by the CLI or by hand, and from
          then on it is yours to change. <A to="/docs/installation">Installation</A> covers both ways.
        </P>
      </Section>

      <Section id="built-on" title="What skins are built with">
        <List>
          <li>React 19 and Tailwind CSS v4.</li>
          <li>Base UI for focus, keyboard and screen reader behaviour, wherever a component needs it.</li>
          <li>Motion in skins whose animation needs more than a CSS transition.</li>
          <li>Nothing tied to one framework, so skins work in Next.js, Vite, React Router and the rest.</li>
        </List>
        <P>Each skin lists exactly what it needs, so adding one never pulls in packages another skin uses.</P>
      </Section>

      <Section id="light-and-dark" title="Light and dark">
        <P>
          Each mode is drawn by hand, never made by inverting the other. Most skins support both. A skin made for one mode says so on its
          page and in its tags.
        </P>
      </Section>

      <Section id="license" title="License">
        <P>
          Skins UI is open source under the MIT license. Use it in personal and commercial projects. <C>LICENSE</C> in the repository has the
          full text.
        </P>
      </Section>
    </DocPage>
  );
}
