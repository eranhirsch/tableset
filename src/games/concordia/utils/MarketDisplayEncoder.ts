import Base32 from "../../../common/Base32";
import nullthrows from "../../../common/err/nullthrows";
import { random_offset } from "../../../common/lib_utils/array_pick_random_item";
import { PermutationsLazyArray } from "../../../common/PermutationsLazyArray";

export const MARKET_DECK_I = [
  "Architect",
  "Prefect",
  "Mercator",
  "Colonist",
  "Diplomat",
  "Mason",
  "Farmer",
  "Smith",
] as const;

export default abstract class MarketDisplayEncoder {
  public static randomHash(): string {
    return Base32.encode(
      random_offset(PermutationsLazyArray.forPermutation(MARKET_DECK_I))
    );
  }

  public static decode(hash: string): readonly string[] {
    const permutationIdx = Base32.decode(hash);
    return nullthrows(
      PermutationsLazyArray.forPermutation(MARKET_DECK_I).at(permutationIdx)
    ).slice(0, 7);
  }
}
