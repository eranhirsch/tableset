import { $, $nullthrows, MathUtils, Random, Vec } from "common";
import { FactionId, Factions } from "./Factions";

type HomeBaseId = FactionId | "empty";

export const HomeBases = {
  randomIdx: (): number =>
    $(
      availableHomeBases,
      ($$) => MathUtils.permutations_lazy_array($$),
      ($$) => Random.index($$)
    ),

  decode: (idx: number): readonly HomeBaseId[] =>
    $(
      availableHomeBases,
      ($$) => MathUtils.permutations_lazy_array($$),
      ($$) => $$.at(idx),
      $nullthrows(`Hash ${idx} could not be converted to a permutation`)
    ),
} as const;

const availableHomeBases = (): readonly HomeBaseId[] =>
  Vec.concat(Factions.availableForProducts(["base", "invaders"]), "empty");
