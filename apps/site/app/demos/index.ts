import type { ComponentType, ReactNode } from "react";
import type { PropSpec, Skin } from "~/lib/registry";
import { card } from "~/demos/card";
import { toast } from "~/demos/toast";

type Parts = Skin["parts"];
export type Values = Record<string, unknown>;

/**
 * How the playground shows a component built from parts: the controls it adds on top of the
 * component's own props, the composition it draws, and the matching usage code.
 */
export interface Demo {
  controls: PropSpec[];
  render: (args: { parts: Parts; values: Values; skin: string; Button: ComponentType<Record<string, unknown>> }) => ReactNode;
  usage: (args: { values: Values; skin: string; slug: string; button: string }) => string;
  /** The button skin each skin pairs with, when it is not the one of the same name. */
  buttons?: Record<string, string>;
}

export const demos: Record<string, Demo> = { card, toast };
