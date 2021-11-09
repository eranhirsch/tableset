import { MathUtils, nullthrows, Num, Random, Vec } from "common";
import { FactionId, Factions } from "./Factions";

export const HomeBases = {
  randomHash: () =>
    Num.encode_base32(
      Random.index(MathUtils.permutations_lazy_array(availableHomeBases()))
    ),

  decode: (hash: string) =>
    nullthrows(
      MathUtils.permutations_lazy_array(availableHomeBases()).at(
        Num.decode_base32(hash)
      ),
      `Hash ${hash} could not be converted to a permutation`
    ),
} as const;

const availableHomeBases = (): readonly (FactionId | "empty")[] =>
  Vec.concat(Factions.availableForProducts(["base", "invaders"]), "empty");
