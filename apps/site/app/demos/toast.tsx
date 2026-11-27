import type { ComponentType, ReactNode } from "react";
import type { Demo, Values } from "~/demos/index";

type Manager = { add: (options: { title?: string; description?: string; type?: string }) => string };

/** The button that adds a toast: it has to live inside the provider to reach it. */
function Trigger({ useToast, Button, values }: { useToast: () => Manager; Button: ComponentType<Record<string, unknown>>; values: Values }) {
  const toast = useToast();
  const type = values.type === "default" ? undefined : String(values.type);
  return (
    <Button onClick={() => toast.add({ title: String(values.title ?? ""), description: String(values.description ?? ""), type })}>
      Show toast
    </Button>
  );
}

/** Saving a change: the most common reason for a toast. */
export const toast: Demo = {
  controls: [
    { name: "title", type: "string", default: "Changes saved" },
    { name: "description", type: "string", default: "Your new skin is live for everyone on the team." },
    { name: "type", type: "enum", options: ["default", "success", "error"], default: "success", description: "Success and error add an icon in their status colour." },
  ],
  render({ parts, values, Button }) {
    const Provider = parts.ToastProvider as ComponentType<{ children?: ReactNode }>;
    const useToast = parts.useToast as unknown as () => Manager;
    return (
      <Provider>
        <Trigger useToast={useToast} Button={Button} values={values} />
      </Provider>
    );
  },
  usage({ values, skin, button }) {
    const type = values.type === "default" ? "" : `, type: "${String(values.type)}"`;
    return [
      `import { Button } from "@/components/skins/${button}";`,
      `import { ToastProvider, useToast } from "@/components/skins/${skin}";`,
      "",
      "export function App() {",
      "  return (",
      "    <ToastProvider>",
      "      <SaveButton />",
      "    </ToastProvider>",
      "  );",
      "}",
      "",
      "function SaveButton() {",
      "  const toast = useToast();",
      "  return (",
      "    <Button",
      "      onClick={() =>",
      "        toast.add({",
      `          title: "${String(values.title ?? "")}",`,
      `          description: "${String(values.description ?? "")}"${type},`,
      "        })",
      "      }",
      "    >",
      "      Show toast",
      "    </Button>",
      "  );",
      "}",
      "",
    ].join("\n");
  },
};
