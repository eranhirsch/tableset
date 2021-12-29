import { Vec } from "common";
import { TerraformingMarsProductId } from "../steps/productsMetaStep";

const ALL_DECK_IDS = ["base", "corporateEra", "venus", "prelude"] as const;
export type DeckId = typeof ALL_DECK_IDS[number];

interface Deck {
  name: string;
  corps: number;
  projects: number;
  preludes?: number;
  icon: string;
}

export const Decks: Readonly<Required<Record<DeckId, Deck>>> = {
  base: { name: "Base", projects: 137, corps: 10, icon: "" },
  corporateEra: {
    name: "Corporate Era",
    projects: 71,
    corps: 2,
    icon: "blue",
  },
  venus: {
    name: "Venus Next",
    projects: 49,
    corps: 5,
    icon: "red",
  },
  prelude: {
    name: "Prelude",
    projects: 7,
    corps: 5,
    preludes: 35,
    icon: "pink",
  },
};

export const availableDecksForProducts = (
  productIds: readonly TerraformingMarsProductId[]
): readonly DeckId[] =>
  Vec.filter_nulls([
    "base",
    "corporateEra",
    productIds.includes("venus") ? "venus" : null,
    productIds.includes("prelude") ? "prelude" : null,
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
    // Prelude is always active, there's no variants which takes out the 5 corps
    // or the 7 project cards, at least not officially
    "prelude",
  ]);
