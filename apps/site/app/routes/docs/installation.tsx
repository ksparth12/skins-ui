import { CodeBlock, CommandBlock, addCommand, runCommand } from "~/components/code-block";
import { A, C, DocPage, P, docMeta } from "~/components/docs";
import { Section, Step } from "~/components/section";

export const meta = () => docMeta("/docs/installation");

const REGISTRY = "https://skinsui.dev/r";

const usage = `import { Button } from "@/components/skins/button-flat";

export function Save() {
  return <Button>Save changes</Button>;
}
`;

const css = `@import "tailwindcss";
@import "./skins.css";
`;

const html = `<html class="dark">
`;

export default function Installation() {
  return (
    <DocPage path="/docs/installation">
      <Section id="requirements" title="Requirements">
        <P>
          A React 19 project with Tailwind CSS v4. Any framework works: Next.js, Vite, React Router and others. Skins are written in
          TypeScript.
        </P>
      </Section>

      <Section id="cli" title="With the CLI">
        <P>Skins install with the shadcn CLI, which copies the file into your project and installs what it needs.</P>
        <ol className="grid grid-cols-1">
          <Step n={1} title="Set up the CLI">
            <P>
              Skip this step if your project already has a <C>components.json</C> file.
            </P>
            <CommandBlock commands={runCommand("shadcn@latest init")} />
          </Step>
          <Step n={2} title="Add a skin">
            <CommandBlock commands={runCommand(`shadcn@latest add ${REGISTRY}/button-flat.json`)} />
            <P>
              The skin is saved to <C>components/skins</C> and its packages are installed. The first skin you add also writes the tokens
              into your main CSS file, once.
            </P>
          </Step>
          <Step n={3} title="Use it" last>
            <CodeBlock title="save.tsx" code={usage} />
          </Step>
        </ol>
      </Section>

      <Section id="manual" title="By hand">
        <ol className="grid grid-cols-1">
          <Step n={1} title="Add the tokens">
            <P>
              Download <A to="/r/skins.css">skins.css</A>, put it next to your main CSS file and import it after Tailwind.
            </P>
            <CodeBlock title="app.css" code={css} />
          </Step>
          <Step n={2} title="Install the skin's packages">
            <P>
              Each skin page lists them under Installation. Most skins need only Base UI.
            </P>
            <CommandBlock commands={addCommand(["@base-ui/react"])} />
          </Step>
          <Step n={3} title="Copy the skin" last>
            <P>
              Copy the source from the skin's page into <C>components/skins</C>, and change the import paths if your project keeps
              components somewhere else.
            </P>
          </Step>
        </ol>
      </Section>

      <Section id="dark-mode" title="Dark mode">
        <P>
          Skins switch to their dark look when a parent element has the <C>dark</C> class, usually <C>{"<html>"}</C>. Add or remove the class
          however your app already handles themes.
        </P>
        <CodeBlock title="index.html" code={html} />
        <P>
          With <C>skins.css</C>, <C>data-theme="dark"</C> works too, and a <C>light</C> class keeps one part of a dark page light.
        </P>
      </Section>
    </DocPage>
  );
}
