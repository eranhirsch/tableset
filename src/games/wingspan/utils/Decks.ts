import { Dict, Vec } from "common";
import { WingspanProductId } from "../steps/productsMetaStep";

const ALL_IDS = ["base", "swift", "europe", "oceania"] as const;
export type DeckId = typeof ALL_IDS[number];

interface Deck {
  name: string;
  numCards: number;
  identifier?: string;
  product: WingspanProductId;
}

const DECKS: Readonly<Required<Record<DeckId, Deck>>> = {
  base: { name: "Base", numCards: 170, product: "base" },
  swift: {
    name: "Swift-Start",
    numCards: 10,
    identifier: "gray top-right corner",
    product: "base",
  },
  europe: {
    name: "European Birds",
    numCards: 81,
    identifier: 'gray "EE" in the bottom-right corner',
    product: "europe",
  },
  oceania: {
    name: "Oceania Birds",
    numCards: 95,
    identifier: 'gray "OE" in the bottom-right corner',
    product: "oceania",
  },
};

export const Decks = {
  ALL_IDS,
  availableForProducts: (productIds: readonly WingspanProductId[]) =>
    Vec.keys(Dict.filter(DECKS, ({ product }) => productIds.includes(product))),
  ...DECKS,
} as const;
