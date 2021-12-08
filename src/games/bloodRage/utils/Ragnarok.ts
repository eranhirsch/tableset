import { $, MathUtils, Random } from "common";
import { ProvinceId, Provinces } from "./Provinces";

const STEPS_NUM = 3;

// This is all constant values, but it's better documented when we do it
// like this. In general this just means that we can order the returned
// provinces in any order (and that order matters).
const NUM_ORDERINGS = Number(MathUtils.factorial(STEPS_NUM));

export const Ragnarok = {
  randomIdx(): number {
    const combsIdx = Random.index(
      MathUtils.combinations_lazy_array(Provinces.ids, STEPS_NUM)
    );

    const permsIdx = Random.int(0, NUM_ORDERINGS);

    // We encode the 2 values as a single number by treating the numOrderings as
    // a radix.
    return combsIdx * NUM_ORDERINGS + permsIdx;
  },

  decode: (idx: number): readonly ProvinceId[] =>
    $(
      Provinces.ids,
      ($$) => MathUtils.combinations_lazy_array($$, STEPS_NUM),
      ($$) => $$.at(Math.floor(idx / NUM_ORDERINGS)),
      $.nullthrows(`Index ${idx} is out or range`),
      ($$) => MathUtils.permutations_lazy_array($$),
      ($$) => $$.at(idx % NUM_ORDERINGS),
      $.nullthrows(`Index ${idx} is out of range`)
    ),
} as const;
