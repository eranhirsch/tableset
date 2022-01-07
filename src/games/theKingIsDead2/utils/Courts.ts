import { $, MathUtils, Random, tuple, Vec } from "common";
import { PlayerId } from "features/players/playersSlice";
import { allFactionCubes, ALL_FACTION_IDS, FactionId } from "./Factions";

const NUM_PER_PLAYER = 2;

const COURT_ENCODER = $(
  ALL_FACTION_IDS,
  ($$) => Vec.fill(NUM_PER_PLAYER, $$),
  Vec.flatten,
  ($$) => MathUtils.combinations_lazy_array_with_duplicates($$, NUM_PER_PLAYER),
  ($$) =>
    Vec.maybe_map(Vec.range(0, $$.length - 1), (index) =>
      index === $$.asCanonicalIndex(index) ? $$.at(index) : undefined
    ),
  $.log()
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
                  Vec.concat(
                    digits,
                    COURT_ENCODER.findIndex((court) => Vec.equal(court, $$))
                  ),
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
        $$.reduceRight(
          (index, digit) => index * COURT_ENCODER.length + digit,
          0
        )
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
              remainingIndx % COURT_ENCODER.length,
              ($$) => COURT_ENCODER[$$],
              $.nullthrows(`Index ${index} is out of range`),
              ($$) => Vec.concat(courts, [$$]),
              ($$) =>
                tuple($$, Math.floor(remainingIndx / COURT_ENCODER.length))
            ),
          [[], $$] as readonly [
            courts: readonly (readonly FactionId[])[],
            index: number
          ]
        ),
      ($$) => $$[0]
    ),
} as const;
