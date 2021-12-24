const ALL_DECK_IDS = ["base", "corporateEra"] as const;
export type DeckId = typeof ALL_DECK_IDS[number];

interface Deck {
  corps: number;
  projects: number;
}

export const Decks: Readonly<Required<Record<DeckId, Deck>>> = {
  base: { projects: 137, corps: 10 },
  corporateEra: { projects: 71, corps: 2 },
};
