import {
  Dict,
  invariant,
  MathUtils,
  nullthrows,
  Num,
  Random,
  Vec,
} from "common";
import { CombinationsLazyArray } from "common/standard_library/math/combinationsLazyArray";
import { PermutationsLazyArray } from "common/standard_library/math/permutationsLazyArray";
import CityResourcesEncoder from "./CityResourcesEncoder";
import { MAPS } from "./MAPS";
import { Resource } from "./resource";

const DIVIDER = "-";
const SALSA_TILES_INDEX = 1;

const BONUS_TILES: Readonly<Record<Resource, number>> = {
  cloth: 4,
  wine: 5,
  tools: 6,
  food: 6,
  bricks: 3,

  // Salt have no bonus tiles
  salt: 0,
};

const EXTRA_BONUS_TILES_IN_SALSA: Readonly<Record<Resource, number>> = {
  cloth: 1,
  wine: 1,
  tools: 0,
  food: 1,
  bricks: 2,

  // Salt have no bonus tiles
  salt: 0,
};

export const LOCATIONS = [
  "Vbii",
  "Belgica",
  "Francia (near Mogonatiacvm)",
  "Francia (near Nida)",
  "Nemetes",
  "Agri Decvmates",
  "Alamannia",
  "Gallia",
  "Alpes",
  "Helvetia",
] as const;

type CastleResource = Readonly<Record<typeof LOCATIONS[number], Resource>>;

const remainingResources = (
  withSalsa: boolean,
  citiesHash: string,
  useSalsaTiles: boolean
): readonly Resource[] =>
  Vec.diff(
    // All tiles available (normalized)
    Vec.flatten(
      Vec.map_with_key(
        Dict.map_with_key(
          BONUS_TILES,
          (resource, total) =>
            // Add the extra salsa tiles if required
            total + (useSalsaTiles ? EXTRA_BONUS_TILES_IN_SALSA[resource] : 0)
        ),
        (resource, total) => Vec.fill(total, resource)
      )
    ),
    // Tiles used as bonus resources for provinces
    Vec.values(
      CityResourcesEncoder.decodeProvinceBonuses(
        "germania",
        withSalsa,
        citiesHash
      )
    )
  );

// TODO: These consts don't take the salsa tiles into account so they might
// be misleading to use. We need to rethink the textual instructions that use
// these in `germaniaRomanCastlesStep`.
export const EXPECTED_REMAINING_RESOURCES_COUNT =
  // Sum of all bonus tiles in the box
  MathUtils.sum(Vec.values(BONUS_TILES)) -
  // Number of provinces in the Germania Map
  Dict.size(Dict.flatten(Vec.values(MAPS.germania.provinces)));

export const NUM_LEFT_OVER =
  EXPECTED_REMAINING_RESOURCES_COUNT - LOCATIONS.length;

export default {
  randomHash(
    withSalsa: boolean,
    citiesHash: string,
    useSalsaTiles: boolean
  ): string {
    const remaining = remainingResources(withSalsa, citiesHash, useSalsaTiles);

    // Pick tiles in excess of the number of tiles we need to fulfil all
    // locations to be returned to the box
    const leftoverCombinations = leftoverTilesCombinations(
      remaining,
      useSalsaTiles
    );
    const leftoversIndex = leftoverCombinations.asCanonicalIndex(
      Random.index(leftoverCombinations)
    );

    const leftOvers = leftoverCombinations.at(leftoversIndex)!;
    const perms = castleTilesPermutations(remaining, leftOvers);
    const resourcesIndex = Random.index(perms);

    if (useSalsaTiles) {
      // If we randomly drew exactly all the extra tiles it is equivalent to
      // as if we never added them in. In those cases the generated hash should
      // "ignore" the useSalsaTiles flag because the hash is relevant regardless
      // of it.
      const leftOversCounts = Dict.count_values(leftOvers);
      if (
        Dict.every_with_key(
          EXTRA_BONUS_TILES_IN_SALSA,
          (resource, count) => count <= (leftOversCounts[resource] ?? 0)
        )
      ) {
        useSalsaTiles = false;
      }
    }

    return Vec.map(
      Vec.concat(
        [resourcesIndex, leftoversIndex],
        useSalsaTiles ? [SALSA_TILES_INDEX] : []
      ),
      ($$) => Num.encode_base32($$)
    ).join(DIVIDER);
  },

  decode(
    withSalsa: boolean,
    citiesHash: string,
    castlesHash: string
  ): CastleResource {
    const [resourcesIndex, leftoversIndex, useSalsaTilesIndex] = Vec.map(
      castlesHash.split(DIVIDER, 3),
      Num.decode_base32
    );

    const useSalsaTiles = useSalsaTilesIndex === SALSA_TILES_INDEX;

    const remaining = remainingResources(withSalsa, citiesHash, useSalsaTiles);
    const leftoverCombinations = leftoverTilesCombinations(
      remaining,
      useSalsaTiles
    );
    const leftOvers = nullthrows(
      leftoverCombinations.at(leftoversIndex),
      `Index ${leftoversIndex} from ${castlesHash} was out-of-range for combinations array ${leftoverCombinations}`
    );

    const perms = castleTilesPermutations(remaining, leftOvers);
    const resources = nullthrows(
      perms.at(resourcesIndex),
      `Index ${resourcesIndex} from ${castlesHash} was out-of-range for permutations array ${perms}`
    );

    // We use Dict instead of Shape here intentionally, we know that the output
    // would contain an entry for EACH location because of how we wrote the
    // algorithm.
    return Dict.associate(LOCATIONS, resources);
  },

  remainingResources,
} as const;

function castleTilesPermutations(
  remaining: readonly Resource[],
  leftOvers: readonly Resource[]
): PermutationsLazyArray<Resource> {
  // We remove the sampled left-overs from the tiles pool
  const locationTiles = Vec.diff(remaining, leftOvers);
  invariant(
    locationTiles.length === LOCATIONS.length,
    `Mismatch for number of tiles (${
      LOCATIONS.length
    }) to be used for randomization for the castles: ${locationTiles.join(
      ", "
    )}`
  );
  return MathUtils.permutations_lazy_array(locationTiles);
}

function leftoverTilesCombinations(
  remaining: readonly Resource[],
  useSalsaTiles: boolean
): CombinationsLazyArray<Resource> {
  return MathUtils.combinations_lazy_array_with_duplicates(
    remaining,
    NUM_LEFT_OVER +
      (useSalsaTiles
        ? MathUtils.sum(Vec.values(EXTRA_BONUS_TILES_IN_SALSA))
        : 0)
  );
}