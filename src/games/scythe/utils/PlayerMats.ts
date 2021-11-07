import { Dict, MathUtils, nullthrows, Num, Vec } from "common";
import { ScytheProductId } from "../ScytheProductId";

export type MatId =
  | "agricultural"
  | "engineering"
  | "industrial"
  | "innovative"
  | "mechanical"
  | "militant"
  | "patriotic";

export interface Mat {
  name: string;
  rank: string;
  popularity: number;
  cash: number;
}

const PLAYER_MATS: Readonly<Record<MatId, Readonly<Mat>>> = {
  agricultural: { name: "Agricultural", rank: "5", popularity: 4, cash: 7 },
  engineering: { name: "Engineering", rank: "2", popularity: 2, cash: 5 },
  industrial: { name: "Industrial", rank: "1", popularity: 2, cash: 4 },
  innovative: { name: "Innovative", rank: "3a", popularity: 3, cash: 5 },
  mechanical: { name: "Mechanical", rank: "4", popularity: 3, cash: 6 },
  militant: { name: "Militant", rank: "2a", popularity: 3, cash: 4 },
  patriotic: { name: "Patriotic", rank: "3", popularity: 2, cash: 6 },
};

const MATS_IN_PRODUCTS: Readonly<
  Partial<Record<ScytheProductId, readonly MatId[]>>
> = {
  base: [
    "agricultural",
    "engineering",
    "industrial",
    "mechanical",
    "patriotic",
  ],
  invaders: ["innovative", "militant"],
};

export const PlayerMats = {
  ...PLAYER_MATS,

  decode(
    hash: string,
    playersCount: number,
    forFactions: boolean,
    products: readonly ScytheProductId[]
  ): readonly MatId[] {
    const index = Num.decode_base32(hash);

    const combinations = MathUtils.combinations_lazy_array(
      availableForProducts(products),
      playersCount
    );

    if (!forFactions) {
      return nullthrows(
        combinations.at(index),
        `Combination index ${index} overflown for combinations array ${combinations}`
      );
    }

    // When we have factions the number represents both the combination and
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
    matIds: readonly MatId[],
    forFactions: boolean,
    products: readonly ScytheProductId[]
  ): string {
    const combinations = MathUtils.combinations_lazy_array(
      availableForProducts(products),
      matIds.length
    );

    const combinationIdx = combinations.indexOf(matIds);
    if (!forFactions) {
      return Num.encode_base32(combinationIdx);
    }

    // When we have factions the order of player mats matters as what we care
    // about is pairings, therefore we need to encode the specific permutation
    // of the selected combination.
    const permutations = MathUtils.permutations_lazy_array(matIds);
    return Num.encode_base32(
      combinations.length * permutations.indexOf(matIds) + combinationIdx
    );
  },

  availableForProducts,
} as const;

function availableForProducts(
  products: readonly ScytheProductId[]
): readonly MatId[] {
  return Vec.flatten(Vec.values(Dict.select_keys(MATS_IN_PRODUCTS, products)));
}
