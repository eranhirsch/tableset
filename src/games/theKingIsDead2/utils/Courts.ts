import { $, MathUtils, Random, tuple, Vec } from "common";
import { PlayerId } from "features/players/playersSlice";
import { allFactionCubes, ALL_FACTION_IDS, FactionId } from "./Factions";

const NUM_PER_PLAYER = 2;

const COMBOS_ARR = MathUtils.combinations_lazy_array_with_duplicates(
  Vec.flatten(Vec.fill(2, ALL_FACTION_IDS)),
  NUM_PER_PLAYER
);

export const Courts = {
  NUM_PER_PLAYER,

  randomIndex: (playerIds: readonly PlayerId[]): number =>
    $(
      allFactionCubes(playerIds!.length),
      ($$) =>
        playerIds!.reduce(
          ([digits, remainingCubes], _playerId) =>
            $(
              remainingCubes,
              ($$) => Random.sample($$, NUM_PER_PLAYER),
              ($$) =>
                tuple(
                  Vec.concat(digits, COMBOS_ARR.indexOf($$)),
                  Vec.diff(remainingCubes, $$)
                )
            ),
          [[], $$] as readonly [
            digits: readonly number[],
            cubes: readonly FactionId[]
          ]
        ),
      ($$) => $$[0],
      ($$) =>
        $$.reduceRight((index, digit) => index * COMBOS_ARR.length + digit, 0)
    ),

  decode: (
    index: number,
    playerIds: readonly PlayerId[]
  ): readonly (readonly FactionId[])[] =>
    $(
      index,
      ($$) =>
        playerIds.reduce(
          ([courts, remainingIndx], _playerId) =>
            $(
              remainingIndx % COMBOS_ARR.length,
              ($$) => COMBOS_ARR.at($$),
              $.nullthrows(`Index ${index} is out of range`),
              ($$) => Vec.concat(courts, [$$]),
              ($$) => tuple($$, Math.floor(remainingIndx / COMBOS_ARR.length))
            ),
          [[], $$] as readonly [
            courts: readonly (readonly FactionId[])[],
            index: number
          ]
        ),
      ($$) => $$[0]
    ),
} as const;
