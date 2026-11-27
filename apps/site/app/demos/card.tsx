import type { ComponentType, MouseEvent } from "react";
import type { Demo } from "~/demos/index";

type Part = "Card" | "CardMedia" | "CardHeader" | "CardTitle" | "CardDescription" | "CardFooter";

const PHOTO = "https://assets.wensity.com/photos/architecture-interiors/forest-glass-house.webp";
const ALT = "A glass house lit from inside, among tall trees in the rain";

/** Depth is dark in both themes, where a solid button in the same colour would sink in, so it takes the light one. */
const variantFor = (slug: string) => (slug === "depth" ? "secondary" : "primary");

/** A place to stay: a picture, a title, a line about it, and the price with a way to book. */
export const card: Demo = {
  controls: [
    { name: "title", type: "string", default: "Glass house in the redwoods" },
    { name: "description", type: "string", default: "A quiet cabin under old trees, two hours from the city." },
    { name: "media", type: "boolean", default: true, description: "Shows the picture." },
    { name: "footer", type: "boolean", default: true, description: "Shows the price and the button." },
    { name: "link", type: "boolean", default: false, description: "Makes the whole card a link, so the button goes." },
  ],
  // Double border has no button of its own; the outlined one shares its fine lines.
  buttons: { double: "outline" },
  render({ parts, values, skin, Button }) {
    // The registry has already checked that every skin exports all of these.
    const { Card, CardMedia, CardHeader, CardTitle, CardDescription, CardFooter } = parts as Record<Part, ComponentType<Record<string, unknown>>>;
    const link = Boolean(values.link);
    return (
      <div className="w-full max-w-88">
        <Card size={values.size} href={link ? "#" : undefined} onClick={link ? (e: MouseEvent) => e.preventDefault() : undefined}>
          {Boolean(values.media) && <CardMedia src={PHOTO} alt={ALT} />}
          <CardHeader>
            <CardTitle>{String(values.title ?? "")}</CardTitle>
            {Boolean(values.description) && <CardDescription>{String(values.description)}</CardDescription>}
          </CardHeader>
          {Boolean(values.footer) && (
            <CardFooter className="justify-between">
              <span>
                <span className="font-semibold">$240</span> a night
              </span>
              {!link && (
                <Button size="sm" variant={variantFor(skin)}>
                  Book
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    );
  },
  usage({ values, skin, slug, button }) {
    const link = Boolean(values.link);
    const footer = Boolean(values.footer);
    const withButton = footer && !link;
    const names = ["Card", values.media && "CardMedia", "CardHeader", "CardTitle", values.description && "CardDescription", footer && "CardFooter"]
      .filter(Boolean)
      .sort() as string[];
    const attrs = [values.size && values.size !== "md" ? `size="${values.size}"` : "", link ? `href="/stays/glass-house"` : ""].filter(Boolean).join(" ");
    const lines = [
      ...(withButton ? [`import { Button } from "@/components/skins/${button}";`] : []),
      ...(names.length > 3
        ? ["import {", ...names.map((n) => `  ${n},`), `} from "@/components/skins/${skin}";`]
        : [`import { ${names.join(", ")} } from "@/components/skins/${skin}";`]),
      "",
      "export function Stay() {",
      "  return (",
      `    <Card${attrs ? " " + attrs : ""}>`,
      ...(values.media ? [`      <CardMedia src="${PHOTO}" alt="${ALT}" />`] : []),
      "      <CardHeader>",
      `        <CardTitle>${String(values.title ?? "")}</CardTitle>`,
      ...(values.description ? [`        <CardDescription>${String(values.description)}</CardDescription>`] : []),
      "      </CardHeader>",
      ...(footer
        ? [
            `      <CardFooter className="justify-between">`,
            "        <span>$240 a night</span>",
            ...(withButton ? [`        <Button size="sm"${variantFor(slug) === "primary" ? "" : ` variant="${variantFor(slug)}"`}>Book</Button>`] : []),
            "      </CardFooter>",
          ]
        : []),
      "    </Card>",
      "  );",
      "}",
    ];
    return lines.join("\n") + "\n";
  },
};
