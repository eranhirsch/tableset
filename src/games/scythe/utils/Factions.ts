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

export interface Faction {
  name: string;
  color: GamePiecesColor;
  power: number;
  combatCards: number;
  order: number;
}
const FACTIONS: Readonly<Record<FactionId, Readonly<Faction>>> = {
  /* spell-checker: disable */
  albion: {
    name: "Clan Albion",
    color: "green",
    power: 3,
    combatCards: 0,
    order: 6,
  },
  crimea: {
    name: "Crimean Khanate",
    color: "yellow",
    power: 5,
    combatCards: 0,
    order: 3,
  },
  fenris: {
    name: "Fenris",
    color: "orange",
    power: 4,
    combatCards: 2,
    // TODO: this is incorrect, fix this with the setup instructions for fenris and tesla
    order: 7,
  },
  nordic: {
    name: "Nordic Kingdoms",
    color: "blue",
    power: 4,
    combatCards: 1,
    order: 0,
  },
  polania: {
    name: "Republic of Polania",
    color: "white",
    power: 2,
    combatCards: 3,
    order: 5,
  },
  rusviet: {
    name: "Rusviet Union",
    color: "red",
    power: 3,
    combatCards: 2,
    order: 1,
  },
  saxony: {
    name: "Saxony Empire",
    color: "black",
    power: 1,
    combatCards: 4,
    order: 4,
  },
  tesla: {
    name: "Tesla",
    color: "cyan",
    power: 1,
    combatCards: 1,
    // TODO: this is incorrect, fix this with the setup instructions for fenris and tesla
    order: 7,
  },
  togawa: {
    name: "Togawa Shogunate",
    color: "purple",
    power: 0,
    combatCards: 2,
    order: 2,
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
    forPlayerMats: boolean,
    products: readonly ScytheProductId[]
  ): readonly FactionId[] {
    const combinations = MathUtils.combinations_lazy_array(
      availableForProducts(products),
      playersCount
    );

    if (!forPlayerMats) {
      return nullthrows(
        combinations.at(index),
        `Combination index ${index} overflown for combinations array ${combinations}`
      );
    }

    // When we have player mats the number represents both the combination and
    // the permutation of the combination (because we care about pairings of
    // player mats and the faction), we need to do some calculations to extract
    // them.

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
    forPlayerMats: boolean,
    products: readonly ScytheProductId[]
  ): number {
    const combinations = MathUtils.combinations_lazy_array(
      availableForProducts(products),
      factionIds.length
    );

    const combinationIdx = combinations.indexOf(factionIds);
    if (!forPlayerMats) {
      return combinationIdx;
    }

    // When we have player mats the order of factions matters as what we care
    // about is pairings, therefore we need to encode the specific permutation
    // of the selected combination.
    const permutations = MathUtils.permutations_lazy_array(factionIds);
    return (
      combinations.length * permutations.indexOf(factionIds) + combinationIdx
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
