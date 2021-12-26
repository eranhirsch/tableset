import { Vec } from "common";
import { TerraformingMarsProductId } from "../steps/productsMetaStep";

const ALL_DECK_IDS = ["base", "corporateEra", "venus"] as const;
export type DeckId = typeof ALL_DECK_IDS[number];

interface Deck {
  name: string;
  corps: number;
  projects: number;
  icon: string;
}

export const Decks: Readonly<Required<Record<DeckId, Deck>>> = {
  base: { name: "Base", projects: 137, corps: 10, icon: "" },
  corporateEra: {
    name: "Corporate Era",
    projects: 71,
    corps: 2,
    icon: "blue and white",
  },
  venus: {
    name: "Venus Next",
    projects: 49,
    corps: 5,
    icon: "red and white",
  },
};

export const availableDecksForProducts = (
  productIds: readonly TerraformingMarsProductId[]
): readonly DeckId[] =>
  Vec.filter_nulls([
    "base",
    "corporateEra",
    productIds.includes("venus") ? "venus" : null,
  ]);

export const activeDecks = (
  isSolo: boolean,
  isCorporateEra: boolean,
  isVenus: boolean
): readonly DeckId[] =>
  Vec.filter_nulls([
    "base",
    isSolo || isCorporateEra ? "corporateEra" : null,
    isVenus ? "venus" : null,
  ]);
