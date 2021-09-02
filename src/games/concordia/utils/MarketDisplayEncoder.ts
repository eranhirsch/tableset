import Base32 from "../../../common/Base32";
import nullthrows from "../../../common/err/nullthrows";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";
import { MARKET_DECK_I } from "../steps/marketCardsStep";

export default abstract class MarketDisplayEncoder {
  public static randomHash(): string {
    const permutations = PermutationsLazyArray.forPermutation(MARKET_DECK_I);
    const selectedIdx = Math.floor(Math.random() * permutations.length);
    return Base32.encode(selectedIdx);
  }

  public static decode(hash: string): readonly string[] {
    const permutationIdx = Base32.decode(hash);
    return nullthrows(
      PermutationsLazyArray.forPermutation(MARKET_DECK_I).at(permutationIdx)
    ).slice(0, 7);
  }
}
