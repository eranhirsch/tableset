import {
  Dict,
  invariant,
  MathUtils,
  nullthrows,
  Num,
  Random,
  Shape,
  Vec
} from "common";
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

type CastleResource = Readonly<Record<typeof LOCATIONS[number], Resource>>;

export default {
  randomHash(mapId: MapId, citiesHash: string): string {
    const remainingResources = Vec.diff(
      // All tiles available (normalized)
      Vec.flatten(
        Vec.map_with_key(BONUS_TILES, (resource, total) =>
          Vec.fill(total, resource)
        )
      ),
      provinceBonusTiles(mapId, citiesHash)
    );

    // Pick 2 tiles to be left out (returned to the box)
    const leftOvers = Vec.sample(remainingResources, 2);
    const resourcesHash = Num.encode_base32(
      Random.index(
        MathUtils.permutations_lazy_array(
          // The remaining 10 tiles would be used for the castles
          Vec.diff(remainingResources, leftOvers)
        )
      )
    );

    return [
      resourcesHash,
      // To normalize the leftovers array we sort it
      ...Vec.sort(leftOvers),
    ].join(DIVIDER);
  },

  decode(
    mapId: MapId,
    citiesHash: string,
    castlesHash: string
  ): CastleResource {
    const [resourcesHash, ...leftOvers] = castlesHash.split(DIVIDER, 3);

    const leftOverResources = leftOvers.filter(
      (resourceStr): resourceStr is Resource => resourceStr in BONUS_TILES
    );
    invariant(
      leftOverResources.length === 2,
      `Not enough left-overs found in hash ${castlesHash}`
    );

    const usedResources = Vec.concat(
      provinceBonusTiles(mapId, citiesHash),
      leftOverResources
    );
    const remainingResources = Dict.map(
      Dict.left_join(BONUS_TILES, Shape.count_values(usedResources)),
      ([total, used]) => total - (used ?? 0)
    );

    const permutations = MathUtils.permutations_lazy_array(remainingResources);
    const castlesIndex = Num.decode_base32(resourcesHash);
    const resources = nullthrows(
      permutations.at(castlesIndex),
      `Index ${castlesIndex} is out of bounds for permutations ${permutations}`
    );

    invariant(
      resources.length === LOCATIONS.length,
      `Not enough resources in result: ${resources} for castlesHash ${castlesHash}`
    );
    // We use Dict instead of Shape here intentionally, we know that the output
    // would contain an entry for EACH location because of how we wrote the
    // algorithm.
    return Dict.associate(LOCATIONS, resources);
  },
} as const;

const provinceBonusTiles = (
  mapId: MapId,
  citiesHash: string
): readonly Resource[] =>
  Vec.values(CityResourcesEncoder.decodeProvinceBonuses(mapId, citiesHash));
