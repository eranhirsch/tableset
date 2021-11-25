import { $, MathUtils, Random, Vec } from "common";

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
  randomIdx: (venusScoring: boolean): number =>
    $(
      MARKET_DECK_I[venusScoring ? "venus" : "base"],
      ($$) => MathUtils.permutations_lazy_array($$),
      ($$) => Random.index($$)
    ),

  decode: (index: number, venusScoring: boolean): readonly string[] =>
    $(
      MARKET_DECK_I[venusScoring ? "venus" : "base"],
      ($$) => MathUtils.permutations_lazy_array($$),
      ($$) => $$.at(index),
      $.nullthrows(),
      ($$) => Vec.take($$, 7)
    ),
} as const;
