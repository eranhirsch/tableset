import { asReadonlyArray } from "common/asReadonlyArray";
import { nullthrows, random_offset } from "../../../common";
import Base32 from "../../../common/Base32";
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
    Base32.encode(random_offset(PermutationsLazyArray.of(MARKET_DECK_I))),

  decode: (hash: string): readonly string[] =>
    nullthrows(
      asReadonlyArray(PermutationsLazyArray.of(MARKET_DECK_I))[
        Base32.decode(hash)
      ]
    ).slice(0, 7),
} as const;
