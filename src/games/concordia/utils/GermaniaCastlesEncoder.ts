import {
  Dict,
  invariant,
  MathUtils,
  nullthrows,
  Num,
  Random,
  Vec,
} from "common";
import { PermutationsLazyArray } from "common/standard_library/math/permutationsLazyArray";
import CityResourcesEncoder from "./CityResourcesEncoder";
import { MAPS } from "./MAPS";
import { Resource } from "./resource";

const DIVIDER = "/";

export const BONUS_TILES = Object.freeze({
  cloth: 4,
  wine: 5,
  tools: 6,
  food: 6,
  bricks: 3,
} as Record<Resource, number>);

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
  citiesHash: string
): readonly Resource[] =>
  Vec.diff(
    // All tiles available (normalized)
    Vec.flatten(
      Vec.map_with_key(BONUS_TILES, (resource, total) =>
        Vec.fill(total, resource)
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

export const EXPECTED_REMAINING_RESOURCES_COUNT =
  // Sum of all bonus tiles in the box
  MathUtils.sum(Vec.values(BONUS_TILES)) -
  // Number of provinces in the Germania Map
  Dict.size(Dict.flatten(Vec.values(MAPS.germania.provinces)));

export const NUM_LEFT_OVER =
  EXPECTED_REMAINING_RESOURCES_COUNT - LOCATIONS.length;

export default {
  randomHash(withSalsa: boolean, citiesHash: string): string {
    const remaining = remainingResources(withSalsa, citiesHash);

    // Pick tiles in excess of the number of tiles we need to fulfil all
    // locations to be returned to the box
    const leftOvers = Vec.sample(remaining, NUM_LEFT_OVER);

    const perms = castleTilesPermutations(remaining, leftOvers);
    const resourcesHash = Num.encode_base32(Random.index(perms));

    return [
      resourcesHash,
      // To normalize the leftovers array we sort it
      ...Vec.sort(leftOvers),
    ].join(DIVIDER);
  },

  decode(
    withSalsa: boolean,
    citiesHash: string,
    castlesHash: string
  ): CastleResource {
    const remaining = remainingResources(withSalsa, citiesHash);

    const [resourcesHash, ...leftOversStr] = castlesHash.split(DIVIDER);
    const leftOvers = leftOversStr.filter(
      (resourceStr): resourceStr is Resource => resourceStr in BONUS_TILES
    );
    invariant(
      leftOvers.length === NUM_LEFT_OVER,
      `Not enough left-overs found in hash ${castlesHash}`
    );

    const perms = castleTilesPermutations(remaining, leftOvers);
    const resources = nullthrows(
      perms.at(Num.decode_base32(resourcesHash)),
      `Encountered issue when handling ${castlesHash}`
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
    }) to be used for randomization for the casltes: ${locationTiles.join(
      ", "
    )}`
  );
  return MathUtils.permutations_lazy_array(locationTiles);
}
