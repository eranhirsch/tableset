import { $, MathUtils, nullthrows, Random, Vec } from "common";
import { ScytheProductId } from "../ScytheProductId";
import { Factions } from "./Factions";

// IMPORTANT: The order here is important, keep empty first, and make sure that
// the faction IDs are also sorted by expansion.
const ALL_HOME_BASE_IDS = ["empty", ...Factions.ALL_IDS] as const;
export type HomeBaseId = typeof ALL_HOME_BASE_IDS[number];

export const HomeBases = {
  ALL_IDS: ALL_HOME_BASE_IDS,

  randomIdx(
    always: readonly HomeBaseId[],
    never: readonly HomeBaseId[],
    productIds: readonly ScytheProductId[]
  ): number {
    const selected = $(
      productIds,
      availableHomeBases,
      ($$) => Vec.diff($$, always),
      ($$) => Vec.diff($$, never),
      ($$) => Random.sample($$, 8 - always.length),
      ($$) => Vec.concat(always, $$)
    );

    const combIdx = MathUtils.combinations_lazy_array(
      ALL_HOME_BASE_IDS,
      8,
      true /* skipSorting */
    ).indexOf(selected);

    const permIdx = Random.index(MathUtils.permutations_lazy_array(selected));

    console.log(combIdx, permIdx, selected);

    return combIdx * Number(MathUtils.factorial(8)) + permIdx;
  },

  decode(idx: number): readonly HomeBaseId[] {
    const permIdx = idx % Number(MathUtils.factorial(8));
    const combIdx = Math.floor(idx / Number(MathUtils.factorial(8)));

    const selected = nullthrows(
      MathUtils.combinations_lazy_array(
        ALL_HOME_BASE_IDS,
        8,
        true /* skipSorting */
      ).at(combIdx),
      `Combination Idx ${combIdx} out of range`
    );

    console.log(combIdx, permIdx, selected);

    return nullthrows(
      MathUtils.permutations_lazy_array(selected).at(permIdx),
      `Permutation Idx ${permIdx} out of range`
    );
  },
} as const;

const availableHomeBases = (
  productIds: readonly ScytheProductId[]
): readonly HomeBaseId[] =>
  Vec.concat(Factions.availableForProducts(productIds), "empty");
