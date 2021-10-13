import {
  Dict,
  invariant,
  MathUtils,
  nullthrows,
  Num,
  Random,
  Shape,
  tuple,
  Vec,
} from "common";
import { MapId, MAPS, Zone } from "./MAPS";
import { Resource, RESOURCE_COST } from "./resource";

const HASH_SEPARATOR = "-";

export const CITY_TILES: Readonly<
  Record<Zone, Readonly<Record<Exclude<Resource, "salt">, number>>>
> = {
  A: { bricks: 2, food: 2, tools: 1, wine: 1, cloth: 1 },
  B: { bricks: 2, food: 3, tools: 1, wine: 1, cloth: 1 },
  C: { bricks: 3, food: 2, tools: 2, wine: 2, cloth: 1 },
  D: { bricks: 1, food: 1, tools: 1, wine: 1, cloth: 1 },
};

/**
 * The maps that came with Salsa include an extra city in each zone. When
 * playing without salt, these need to be fulfilled with tiles from unused
 * zones via the following mapping.
 */
export const SALT_MAP_EXTRA_RESOURCE: Readonly<Record<Zone, Resource>> = {
  A: "tools",
  B: "wine",
  C: "cloth",
  D: "bricks",
};

/**
 * When playing with Salt on regular maps (which don't have an extra city per-
 * zone) we need to remove one regular resource tile per-zone to make room for
 * the salt one.
 */
export const REGULAR_MAPS_SALT_ALTERNATIVE: Readonly<Record<Zone, Resource>> = {
  A: "food",
  B: "tools",
  C: "wine",
  D: "bricks",
};

type CityResources = Readonly<Record<string /* cityName */, Resource>>;
type ProvinceCityResources = Readonly<
  Record<string /* provinceName */, CityResources>
>;
type ProvinceBonusResource = Readonly<
  Record<string /* provinceName */, Resource>
>;

export default {
  randomHash: (mapId: MapId, withSalsa: boolean): string =>
    Vec.map_with_key(MAPS[mapId].provinces, (zone) =>
      Num.encode_base32(
        Random.index(
          MathUtils.permutations_lazy_array(
            withSalsa ? saltTiles(zone, mapId) : noSaltTiles(zone, mapId)
          )
        )
      )
    ).join(HASH_SEPARATOR),

  decodeCityResources,

  decodeProvinceBonuses: (
    mapId: MapId,
    withSalsa: boolean,
    hash: string
  ): ProvinceBonusResource =>
    Dict.map(decodeCityResources(mapId, withSalsa, hash), (cityResources) =>
      nullthrows(
        MathUtils.max_by(
          Vec.values(cityResources).filter((resource) => resource !== "salt"),
          (resource) => RESOURCE_COST[resource]
        ),
        `Empty city resources encountered for ${mapId} and ${hash}`
      )
    ),
} as const;

function decodeCityResources(
  mapId: MapId,
  withSalsa: boolean,
  hash: string
): ProvinceCityResources {
  const zonesWithoutSalt = Dict.from_keys(Vec.keys(CITY_TILES), (zone) =>
    withSalsa ? saltTiles(zone, mapId) : noSaltTiles(zone, mapId)
  );
  const allPerms = Dict.map(
    zonesWithoutSalt,
    MathUtils.permutations_lazy_array
  );
  const withHashIndices = Vec.zip(
    Vec.values(Shape.inner_join(MAPS[mapId].provinces, allPerms)),
    hash.split(HASH_SEPARATOR).map(Num.decode_base32)
  );
  const zoneResources = Vec.map(
    withHashIndices,
    ([[provinces, permutations], permutationIndex]) =>
      tuple(
        provinces,
        nullthrows(
          permutations.at(permutationIndex),
          `Index ${permutationIndex} is out of bounds for permutations ${permutations}`
        )
      )
  );
  const provincesResources = Vec.map(zoneResources, ([provinces, resources]) =>
    Dict.map(provinces, (cities) => {
      const cityResources = Vec.zip(cities, resources);
      invariant(
        cityResources.length === cities.length,
        `Number of resources ${cityResources.length} didn't match number of cities ${cities.length}`
      );
      resources = resources.slice(cities.length);
      return Dict.from_entries(cityResources);
    })
  );
  return Dict.flatten(provincesResources);
}

/**
 * Return the city tiles for the zone, when playing without salsa
 */
const noSaltTiles = (zone: Zone, mapId: MapId): typeof CITY_TILES[Zone] =>
  MAPS[mapId].isSaltMap
    ? Dict.map_with_key(
        CITY_TILES[zone],
        (resource, count) =>
          count + (resource === SALT_MAP_EXTRA_RESOURCE[zone] ? 1 : 0)
      )
    : CITY_TILES[zone];

const saltTiles = (
  zone: Zone,
  mapId: MapId
): Readonly<Record<Resource, number>> =>
  Dict.merge(
    MAPS[mapId].isSaltMap
      ? CITY_TILES[zone]
      : // Remove one tile from each zone in regular maps
        Dict.map_with_key(
          CITY_TILES[zone],
          (resource, count) =>
            count - (resource === REGULAR_MAPS_SALT_ALTERNATIVE[zone] ? 1 : 0)
        ),
    // Add the salt tile to the zone tiles
    { salt: 1 }
  );
