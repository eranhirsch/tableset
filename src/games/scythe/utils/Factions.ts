import { Dict, MathUtils, nullthrows, Vec } from "common";
import { GamePiecesColor } from "model/GamePiecesColor";
import { ScytheProductId } from "../ScytheProductId";

export type FactionId =
  /* spell-checker: disable */
  | "albion"
  | "crimea"
  | "fenris"
  | "nordic"
  | "polania"
  | "rusviet"
  | "saxony"
  | "tesla"
  | "togawa";
/* spell-checker: enable */

interface Faction {
  name: string;
  color: GamePiecesColor;
  power: number;
  combatCards: number;
}
const FACTIONS: Readonly<Record<FactionId, Readonly<Faction>>> = {
  /* spell-checker: disable */
  albion: { name: "Clan Albion", color: "green", power: 3, combatCards: 0 },
  crimea: {
    name: "Crimean Khanate",
    color: "yellow",
    power: 5,
    combatCards: 0,
  },
  fenris: { name: "Fenris", color: "orange", power: 4, combatCards: 2 },
  nordic: { name: "Nordic Kingdoms", color: "blue", power: 4, combatCards: 1 },
  polania: {
    name: "Republic of Polania",
    color: "white",
    power: 2,
    combatCards: 3,
  },
  rusviet: { name: "Rusviet Union", color: "red", power: 3, combatCards: 2 },
  saxony: { name: "Saxony Empire", color: "black", power: 1, combatCards: 4 },
  tesla: { name: "Tesla", color: "cyan", power: 1, combatCards: 1 },
  togawa: {
    name: "Togawa Shogunate",
    color: "purple",
    power: 0,
    combatCards: 2,
  },
  /* spell-checker: enable */
};

const FACTIONS_IN_PRODUCTS: Readonly<
  Partial<Record<ScytheProductId, readonly FactionId[]>>
> = {
  base: ["crimea", "nordic", "polania", "rusviet", "saxony"],
  invaders: ["albion", "togawa"],
  fenris: ["fenris", "tesla"],
};

export const Factions = {
  ...FACTIONS,

  decode(
    index: number,
    playersCount: number,
    products: readonly ScytheProductId[]
  ): readonly FactionId[] {
    const combinations = MathUtils.combinations_lazy_array(
      availableForProducts(products),
      playersCount
    );
    const combinationIdx = index % combinations.length;
    const combination = nullthrows(
      combinations.at(combinationIdx),
      `Combination index ${combinationIdx} overflown for combinations array ${combinations}`
    );

    const permutations = MathUtils.permutations_lazy_array(combination);
    const permutationIdx = Math.floor(index / combinations.length);
    return nullthrows(
      permutations.at(permutationIdx),
      `Permutations index ${permutationIdx} overflown for permutations array ${permutations}`
    );
  },

  encode(
    factionIds: readonly FactionId[],
    products: readonly ScytheProductId[]
  ): number {
    const combinations = MathUtils.combinations_lazy_array(
      availableForProducts(products),
      factionIds.length
    );
    const permutations = MathUtils.permutations_lazy_array(factionIds);
    return (
      combinations.length * permutations.indexOf(factionIds) +
      combinations.indexOf(factionIds)
    );
  },

  availableForProducts,
} as const;

function availableForProducts(
  products: readonly ScytheProductId[]
): readonly FactionId[] {
  return Vec.flatten(
    Vec.values(Dict.select_keys(FACTIONS_IN_PRODUCTS, products))
  );
}
