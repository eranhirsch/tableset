import { $, MathUtils, nullthrows, Random, Vec } from "common";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId, Factions } from "./Factions";

export type HomeBaseId = FactionId | "empty";

const ALL_HOME_BASE_IDS = Vec.concat(Factions.ALL_IDS, "empty");

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

    const combsArr = MathUtils.combinations_lazy_array(ALL_HOME_BASE_IDS, 8);
    const combIdx = combsArr.indexOf(selected);

    const permIdx = Random.index(MathUtils.permutations_lazy_array(selected));

    return permIdx * combsArr.length + combIdx;
  },

  decode(idx: number): readonly HomeBaseId[] {
    const combsArr = MathUtils.combinations_lazy_array(ALL_HOME_BASE_IDS, 8);

    const combIdx = idx % combsArr.length;
    const permIdx = Math.floor(idx / combsArr.length);

    const selected = nullthrows(
      combsArr.at(combIdx),
      `Combination Idx ${combIdx} out of range`
    );

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
