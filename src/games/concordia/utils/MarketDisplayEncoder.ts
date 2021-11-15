import { MathUtils, nullthrows, Num, Random, Vec } from "common";

export const MARKET_DECK_I = {
  base: [
    "Architect",
    "Prefect",
    "Mercator",
    "Colonist",
    "Diplomat",
    "Mason",
    "Farmer",
    "Smith",
  ],
  venus: [
    "Architect",
    "Prefect/Architect",
    "Mercator",
    "Colonist",
    "Diplomat",
    "Farmer",
    "Smith",
  ],
} as const;

export default {
  randomHash: (venusScoring: boolean): string =>
    Num.encode_base32(
      Random.index(
        MathUtils.permutations_lazy_array(
          MARKET_DECK_I[venusScoring ? "venus" : "base"]
        )
      )
    ),

  decode: (venusScoring: boolean, hash: string): readonly string[] =>
    Vec.take(
      nullthrows(
        MathUtils.permutations_lazy_array(
          MARKET_DECK_I[venusScoring ? "venus" : "base"]
        ).at(Num.decode_base32(hash))
      ),
      7
    ),
} as const;
