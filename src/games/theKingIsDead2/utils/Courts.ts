import { MathUtils, Random, tuple, Vec } from "common";
import { PlayerId } from "features/players/playersSlice";
import { allFactionCubes, FactionId } from "./Factions";

const NUM_PER_PLAYER = 2;

export const Courts = {
  NUM_PER_PLAYER,

  randomIndex: (playerIds: readonly PlayerId[]): number =>
    playerIds!
      .reduce(
        ([digits, remainingCubes], _playerId) => {
          const court = Random.sample(remainingCubes, NUM_PER_PLAYER);
          const courtCombos = MathUtils.combinations_lazy_array_with_duplicates(
            remainingCubes,
            NUM_PER_PLAYER
          );
          return tuple(
            Vec.concat(digits, [
              tuple(courtCombos.length, courtCombos.indexOf(court)),
            ]),
            Vec.diff(remainingCubes, court)
          );
        },
        [[], allFactionCubes(playerIds!.length)] as readonly [
          digits: readonly (readonly [radix: number, digit: number])[],
          cubes: readonly FactionId[]
        ]
      )[0]
      .reduceRight((index, [radix, digit]) => index * radix + digit, 0),

  decode: (
    index: number,
    playerIds: readonly PlayerId[]
  ): readonly (readonly FactionId[])[] =>
    playerIds.reduce(
      ([courts, remainingIndx, cubes], _playerId) => {
        const courtCombos = MathUtils.combinations_lazy_array_with_duplicates(
          cubes,
          NUM_PER_PLAYER
        );
        const digit = remainingIndx % courtCombos.length;
        const court = courtCombos.at(digit)!;
        return tuple(
          Vec.concat(courts, [court]),
          Math.floor(remainingIndx / courtCombos.length),
          Vec.diff(cubes, court)
        );
      },
      [[], index, allFactionCubes(playerIds.length)] as readonly [
        courts: readonly (readonly FactionId[])[],
        index: number,
        cubes: readonly FactionId[]
      ]
    )[0],
} as const;
