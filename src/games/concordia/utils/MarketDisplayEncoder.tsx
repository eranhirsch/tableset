import Base32 from "../../../common/Base32";
import nullthrows from "../../../common/err/nullthrows";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";

const MARKET_DECK_PHASE_1: readonly string[] = [
  "Architect",
  "Prefect",
  "Mercator",
  "Colonist",
  "Diplomat",
  "Mason",
  "Farmer",
  "Smith",
];

export default abstract class MarketDisplayEncoder {
  public static randomHash(): string {
    const permutations =
      PermutationsLazyArray.forPermutation(MARKET_DECK_PHASE_1);
    const selectedIdx = Math.floor(Math.random() * permutations.length);
    return Base32.encode(selectedIdx);
  }

  public static decode(hash: string): readonly string[] {
    const permutationIdx = Base32.decode(hash);
    return nullthrows(
      PermutationsLazyArray.forPermutation(MARKET_DECK_PHASE_1).at(
        permutationIdx
      )
    ).slice(0, 7);
  }
}
