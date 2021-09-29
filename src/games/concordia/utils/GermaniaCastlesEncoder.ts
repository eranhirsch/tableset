import { Dict, Vec, Random, MathUtils, Num, nullthrows } from "common";
import CityResourcesEncoder from "./CityResourcesEncoder";
import { MapId } from "./Maps";
import { Resource } from "./resource";

const DIVIDER = "/";

const BONUS_TILES = Object.freeze({
  cloth: 4,
  wine: 5,
  tools: 6,
  food: 6,
  bricks: 3,
} as Record<Resource, number>);

const LOCATIONS = [
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

type CastleResource = Readonly<{ [location: string]: Resource }>;

export default {
  randomHash(mapId: MapId, citiesHash: string): string {
    const usedResources = Dict.count_values(
      Vec.values(CityResourcesEncoder.decodeProvinceBonuses(mapId, citiesHash))
    );

    // We shuffle the whole array instead of just sampling 2 items because we
    // also want to remove them from the array so we can generate a permutation
    // from the remaining items. This is just a cleaner way to do that using JS
    // array deconstruction.
    const [leftOver1, leftOver2, ...afterLeftOver] = Vec.shuffle(
      Vec.map_with_key(BONUS_TILES, (resource, total) =>
        Vec.fill(total - (usedResources[resource] ?? 0), resource)
      ).flat()
    );

    // To normalize the leftovers array we sort it
    const leftOvers = Vec.sort([leftOver1, leftOver2]);

    const permutations = MathUtils.permutations_lazy_array(afterLeftOver);
    const castlesIndex = Random.index(permutations);
    const resourcesHash = Num.encode_base32(castlesIndex);

    return [resourcesHash, ...leftOvers].join(DIVIDER);
  },

  decode(
    mapId: MapId,
    citiesHash: string,
    castlesHash: string
  ): CastleResource {
    const [resourcesHash, ...leftOvers] = castlesHash.split(DIVIDER, 3);

    const usedResources = Dict.count_values(
      Vec.values(CityResourcesEncoder.decodeProvinceBonuses(mapId, citiesHash))
    );
    const remainingResources = Dict.map_with_key(
      BONUS_TILES,
      (resource, total) =>
        total -
        (usedResources[resource] ?? 0) -
        (leftOvers[0] === resource ? 1 : 0) -
        (leftOvers[1] === resource ? 1 : 0)
    );

    const permutations = MathUtils.permutations_lazy_array(remainingResources);
    const castlesIndex = Num.decode_base32(resourcesHash);
    const resources = nullthrows(
      permutations.at(castlesIndex),
      `Index ${castlesIndex} is out of bounds for permutations ${permutations}`
    );

    return Dict.associate(LOCATIONS, resources);
  },
} as const;
