import { MathUtils, nullthrows, Random, Vec } from "common";
import { CombinationsLazyArray } from "common/standard_library/math/combinationsLazyArray";
import { ProvinceId, Provinces } from "./Provinces";

export const Destroyed = {
  perPlayerCount,

  randomIdx: (
    playerCount: number,
    ragnarokProvinceIds: readonly ProvinceId[]
  ): number =>
    Random.index(combinationsArray(ragnarokProvinceIds, playerCount)),

  decode: (
    idx: number,
    playerCount: number,
    ragnarokProvinceIds: readonly ProvinceId[]
  ): readonly ProvinceId[] =>
    nullthrows(
      combinationsArray(ragnarokProvinceIds, playerCount).at(idx),
      `Index ${idx} is out of range`
    ),
} as const;

function perPlayerCount(playerCount: number): number {
  return 5 - playerCount;
}

const combinationsArray = (
  ragnarokProvinceIds: readonly ProvinceId[],
  playerCount: number
): CombinationsLazyArray<ProvinceId> =>
  MathUtils.combinations_lazy_array(
    Vec.diff(Provinces.ids, ragnarokProvinceIds),
    perPlayerCount(playerCount)
  );
