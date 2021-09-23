import { asReadonlyArray } from "common/asReadonlyArray";
import { nullthrows, Random, Num } from "common";
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

export default {
  randomHash: (): string =>
    Num.encode_base32(Random.index(PermutationsLazyArray.of(MARKET_DECK_I))),

  decode: (hash: string): readonly string[] =>
    nullthrows(
      asReadonlyArray(PermutationsLazyArray.of(MARKET_DECK_I))[
        Num.decode_base32(hash)
      ]
    ).slice(0, 7),
} as const;
