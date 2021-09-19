import Base32 from "../../../common/Base32";
import { nullthrows } from "../../../common/err";
import { random_offset } from "../../../common/lib_utils";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";

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
      random_offset(PermutationsLazyArray.of(MARKET_DECK_I))
    );
  }

  public static decode(hash: string): readonly string[] {
    const permutationIdx = Base32.decode(hash);
    return nullthrows(
      PermutationsLazyArray.of(MARKET_DECK_I).at(permutationIdx)
    ).slice(0, 7);
  }
}
