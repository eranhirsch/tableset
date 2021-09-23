import { asReadonlyArray } from "common/asReadonlyArray";
import { nullthrows, Random, Num, MathUtils } from "common";

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

export default {
  randomHash: (): string =>
    Num.encode_base32(
      Random.index(MathUtils.permutations_lazy_array(MARKET_DECK_I))
    ),

  decode: (hash: string): readonly string[] =>
    nullthrows(
      asReadonlyArray(MathUtils.permutations_lazy_array(MARKET_DECK_I))[
        Num.decode_base32(hash)
      ]
    ).slice(0, 7),
} as const;
