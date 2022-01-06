import { $, MathUtils, Random, tuple, Vec } from "common";
import { CombinationsLazyArrayWithDuplicates } from "common/standard_library/math/combinationsLazyArray";
import { PlayerId } from "features/players/playersSlice";
import { Courts } from "./Courts";
import { allFactionCubes, FactionId } from "./Factions";
import { ALL_REGION_IDS, RegionId } from "./Regions";

const NUM_PER_REGION = 4;
const NUM_PER_HOME_REGION = 2;

const HOME_REGIONS: Readonly<Partial<Record<RegionId, FactionId>>> = {
  moray: "scottish",
  essex: "english",
  gwynedd: "welsh",
};

export const Followers = {
  NUM_PER_REGION,
  NUM_PER_HOME_REGION,

  HOME_REGIONS,

  randomIndex: (playerIds: readonly PlayerId[], courtIndex: number): number =>
    $(
      allFactionCubes(playerIds.length),
      ($$) => Vec.diff($$, Vec.flatten(Courts.decode(courtIndex, playerIds))),
      (all) =>
        ALL_REGION_IDS.reduce(
          ([digits, remainingCubes], regionId) =>
            $(
              NUM_PER_REGION -
                (HOME_REGIONS[regionId] != null ? NUM_PER_HOME_REGION : 0),
              ($$) => Random.sample(remainingCubes, $$),
              ($$) =>
                tuple(
                  Vec.concat(digits, [encode($$, remainingCubes)]),
                  Vec.diff(remainingCubes, $$)
                )
            ),
          [[], all] as readonly [
            digits: readonly (readonly [digit: number, radix: number])[],
            cubes: readonly FactionId[]
          ]
        ),
      ($$) => $$[0],
      ($$) =>
        $$.reduceRight((total, [digit, radix]) => total * radix + digit, 0)
    ),

  decode: (
    index: number,
    playerIds: readonly PlayerId[],
    courtIndex: number
  ): readonly FactionId[] =>
    $(
      allFactionCubes(playerIds.length),
      ($$) => Vec.diff($$, Vec.flatten(Courts.decode(courtIndex, playerIds))),
      (all) =>
        ALL_REGION_IDS.reduce(
          ([followers, ongoingIndex], regionId) =>
            $(
              NUM_PER_REGION -
                (HOME_REGIONS[regionId] != null ? NUM_PER_HOME_REGION : 0),
              ($$) =>
                decode(ongoingIndex, $$, Vec.diff(all, Vec.flatten(followers))),
              ($$) => tuple(Vec.concat(followers, $$[0]), $$[1])
            ),
          [[], index] as readonly [
            followers: readonly (readonly FactionId[])[],
            ongoingIndex: number
          ]
        ),
      ($$) => $$[0],
      ($$) => Vec.flatten($$)
    ),
} as const;

function encode<T>(
  sample: readonly T[],
  pool: readonly T[]
): readonly [digit: number, radix: number] {
  const combosArr = possibleCombos(pool, sample.length);

  return $(
    // We are going to iterate over the whole combinations space
    Vec.range(0, combosArr.length - 1),
    // We are looking for just the canonical indexes, these represent unique
    // combinations
    ($$) =>
      Vec.filter($$, (index) => index === combosArr.asCanonicalIndex(index)),
    // Our encoding will return the index of the sample in the combinations
    // array and the total number of them so we can use it in the encoder.
    ($$) => tuple($$.indexOf(combosArr.indexOf(sample)), $$.length)
  );
}

function decode<T>(
  index: number,
  length: number,
  pool: readonly T[]
): [sample: readonly T[], remainingIndex: number] {
  const combosArr = possibleCombos(pool, length);

  return $(
    // We are going to iterate over the whole combinations space
    Vec.range(0, combosArr.length - 1),
    // We are looking for just the canonical indexes, these represent unique
    // combinations
    ($$) =>
      Vec.filter($$, (index) => index === combosArr.asCanonicalIndex(index)),
    // We use the index to find both the sample used in encoding, and to trim
    // the index for the next iteration, this is similar to how we break down a
    // number into it's digits by performing modulo and integer divide. The
    // different here is that we also convert the "digit" into a specific unique
    // combination based on the array we computed.
    ($$) => [
      combosArr.at($$[index % $$.length])!,
      Math.floor(index / $$.length),
    ]
  );
}

const possibleCombos = <T>(
  pool: readonly T[],
  length: number
): CombinationsLazyArrayWithDuplicates<T> =>
  $(
    pool,
    // Find all unique items in the pool
    Vec.unique,
    // Create a new pool which contains enough copies of each item in the pool
    // to recreate the sample
    ($$) => Vec.fill(length, $$),
    Vec.flatten,
    // Then intersect it with the original pool to make sure we don't take into
    // account additional copies we don't actually have.
    ($$) => Vec.intersect(pool, $$),
    // Then create the combinations array for them so we can start working with
    // the combination possibilities.
    ($$) => MathUtils.combinations_lazy_array_with_duplicates($$, length)
  );
