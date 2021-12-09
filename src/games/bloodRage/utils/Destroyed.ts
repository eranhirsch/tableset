import { $, MathUtils, nullthrows, Random, Vec } from "common";
import { CombinationsLazyArray } from "common/standard_library/math/combinationsLazyArray";
import { ProvinceId, Provinces } from "./Provinces";
import { Ragnarok } from "./Ragnarok";

export const Destroyed = {
  perPlayerCount,
  randomIdx: (playerCount: number, ragnarokIdx: number): number =>
    Random.index(combinationsArray(ragnarokIdx, playerCount)),
  decode: (
    idx: number,
    playerCount: number,
    ragnarokIdx: number
  ): readonly ProvinceId[] =>
    nullthrows(
      combinationsArray(ragnarokIdx, playerCount).at(idx),
      `Index ${idx} is out of range`
    ),
} as const;

function perPlayerCount(playerCount: number): number {
  return 5 - playerCount;
}

const combinationsArray = (
  ragnarokIdx: number,
  playerCount: number
): CombinationsLazyArray<ProvinceId> =>
  $(
    ragnarokIdx,
    Ragnarok.decode,
    ($$) => Vec.diff(Provinces.ids, $$),
    ($$) => MathUtils.combinations_lazy_array($$, perPlayerCount(playerCount))
  );
