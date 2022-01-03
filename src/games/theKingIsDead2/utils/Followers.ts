import { $, Dict, MathUtils, nullthrows, Random, tuple, Vec } from "common";
import { PlayerId } from "features/players/playersSlice";
import { NUM_CUBES_PER_HOME_REGION } from "../steps/homeRegionStep";
import { Courts } from "./Courts";
import { allFactionCubes, FactionId, Factions } from "./Factions";
import { ALL_REGION_IDS, RegionId } from "./Regions";

const NUM_PER_REGION = 4;

export const HOME_REGION_IDS: readonly RegionId[] = Vec.filter(
  ALL_REGION_IDS,
  (rid) => Vec.values(Factions).some(({ homeRegion }) => rid === homeRegion)
);

const NUM_FOLLOWER_CUBES =
  ALL_REGION_IDS.length * NUM_PER_REGION -
  HOME_REGION_IDS.length * NUM_CUBES_PER_HOME_REGION;

export const Followers = {
  randomIndex(playerIds: readonly PlayerId[], courtIndex: number): number {
    const all = Vec.diff(
      allFactionCubes(playerIds.length),
      Vec.flatten(Courts.decode(courtIndex, playerIds))
    );
    const selectedFollowers = Random.sample(all, NUM_FOLLOWER_CUBES);

    // We encode how many english, scottish and welsh followers we have on the
    // map in an efficient way so that we can reverse the process later to get
    // the numbers back
    const allCount = Dict.count_values(all);
    const selectedCount = Dict.count_values(selectedFollowers);
    const selectedIndex =
      allCount.english * selectedCount.scottish + selectedCount.english;
    const selectedRadix = allCount.english * allCount.scottish;

    const followers = $(
      ALL_REGION_IDS.reduce(
        ([followers, remainingCubes], regionId) =>
          $(
            NUM_PER_REGION -
              (HOME_REGION_IDS.includes(regionId)
                ? NUM_CUBES_PER_HOME_REGION
                : 0),
            ($$) => Random.sample(remainingCubes, $$),
            ($$) =>
              tuple(Vec.concat(followers, [$$]), Vec.diff(remainingCubes, $$))
          ),
        [[], selectedFollowers] as readonly [
          followers: readonly (readonly FactionId[])[],
          cubes: readonly FactionId[]
        ]
      ),
      ($$) => $$[0],
      Vec.flatten
    );

    const followersIndex =
      MathUtils.permutations_lazy_array(followers).indexOf(followers);

    return selectedRadix * followersIndex + selectedIndex;
  },

  decode(
    index: number,
    playerIds: readonly PlayerId[],
    courtIndex: number
  ): readonly FactionId[] {
    const all = Vec.diff(
      allFactionCubes(playerIds.length),
      Vec.flatten(Courts.decode(courtIndex, playerIds))
    );
    const allCount = Dict.count_values(all);
    const selectedRadix = allCount.english * allCount.scottish;

    const selectedIndex = index % selectedRadix;
    const englishCount = selectedIndex % allCount.english;
    const scottishCount = Math.floor(selectedIndex / allCount.english);
    const selectedFollowers: readonly FactionId[] = Vec.flatten([
      Vec.fill(englishCount, "english"),
      Vec.fill(scottishCount, "scottish"),
      Vec.fill(NUM_FOLLOWER_CUBES - englishCount - scottishCount, "welsh"),
    ]);

    const followersIndex = Math.floor(index / selectedRadix);
    return nullthrows(
      MathUtils.permutations_lazy_array(selectedFollowers).at(followersIndex),
      `Index ${followersIndex} out of range`
    );
  },
} as const;
