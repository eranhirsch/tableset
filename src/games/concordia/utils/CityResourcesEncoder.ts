import {
  $,
  Dict,
  invariant,
  MathUtils,
  nullthrows,
  Num,
  Random,
  tuple,
  Vec,
} from "common";
import { MapId, MAPS, ZoneId } from "./MAPS";
import { Resource, RESOURCE_COST } from "./resource";

const HASH_SEPARATOR = "-";

export const CITY_TILES: Readonly<
  Record<ZoneId, Readonly<Record<Exclude<Resource, "salt">, number>>>
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
export const SALT_MAP_EXTRA_RESOURCE: Readonly<Record<ZoneId, Resource>> = {
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
export const REGULAR_MAPS_SALT_ALTERNATIVE: Readonly<Record<ZoneId, Resource>> =
  {
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
  Record<string /* provinceName */, Resource | null>
>;

export default {
  randomHash: (mapId: MapId, withSalsa: boolean): string =>
    Vec.map_with_key(MAPS[mapId].provinces, (zoneId) =>
      $(
        getTiles(zoneId, withSalsa, MAPS[mapId].isSaltMap ?? false),
        MathUtils.permutations_lazy_array,
        ($$) => Random.index($$),
        Num.encode_base32
      )
    ).join(HASH_SEPARATOR),

  decodeCityResources,

  decodeProvinceBonuses(
    mapId: MapId,
    withSalsa: boolean,
    hash: string
  ): ProvinceBonusResource {
    const bonusTiles = $(decodeCityResources(mapId, withSalsa, hash), ($$) =>
      Dict.map($$, (cityResources) =>
        $(
          cityResources,
          Vec.values,
          ($$) => Vec.filter($$, (resource) => resource !== "salt"),
          ($$) => MathUtils.max_by($$, (resource) => RESOURCE_COST[resource]),
          ($$) =>
            nullthrows(
              $$,
              `Empty city resources encountered for ${mapId} and ${hash}`
            )
        )
      )
    );

    if (mapId === "creta") {
      // In Creta we leave the brown province (with Gavdos) blank
      return { ...bonusTiles, Brown: null };
    }

    return bonusTiles;
  },
} as const;

function decodeCityResources(
  mapId: MapId,
  withSalsa: boolean,
  hash: string
): ProvinceCityResources {
  return $(
    // Start by looking at what provinces on this map
    MAPS[mapId].provinces,
    // pair each zone provinces definition with the permutations array of tiles
    // for that zone
    ($$) =>
      Vec.map_with_key($$, (zoneId, provinces) =>
        tuple(
          provinces,
          $(
            getTiles(zoneId, withSalsa, MAPS[mapId].isSaltMap ?? false),
            MathUtils.permutations_lazy_array
          )
        )
      ),
    // Zip the zones with the hashes for each zone
    ($$) => Vec.zip($$, hash.split(HASH_SEPARATOR)),
    // For each zone we now have everything we need to determine what the
    // resource is for each city in that zone.
    ($$) =>
      Vec.map($$, ([[provinces, permutations], permutationHash]) =>
        $(
          permutationHash,
          Num.decode_base32,
          // Get the permutation at the encoded index
          ($$) => permutations.at($$),
          ($$) =>
            nullthrows(
              $$,
              `Hash ${permutationHash} is out of bounds for permutations ${permutations}`
            ),
          // We now have a permutation of resources on this zone, we need to
          // match them up to the cities in each province
          (zoneResources) =>
            Dict.map(provinces, (cities) => {
              const cityResources = Vec.take(zoneResources, cities.length);
              invariant(
                cityResources.length === cities.length,
                `Not enough resources remaining for cities ${JSON.stringify(
                  provinces
                )}`
              );

              // IMPORTANT: We are deliberately updating the value of resources
              // (the function input param), this enables us to keep "memory"
              // between iterations of this loop.
              zoneResources = Vec.drop(zoneResources, cities.length);

              return Dict.associate(cities, cityResources);
            })
        )
      ),
    // We don't care about zones in the final output, just provinces, so we can
    // flatten/merge them together.
    Dict.flatten
  );
}

const getTiles = (
  zoneId: ZoneId,
  withSalsa: boolean,
  isSaltMap: boolean
): typeof CITY_TILES[ZoneId] =>
  withSalsa ? saltTiles(zoneId, isSaltMap) : noSaltTiles(zoneId, isSaltMap);

/**
 * Return the city tiles for the zone, when playing without salsa
 */
const noSaltTiles = (
  zoneId: ZoneId,
  isSaltMap: boolean
): typeof CITY_TILES[ZoneId] =>
  isSaltMap
    ? Dict.map_with_key(
        CITY_TILES[zoneId],
        (resource, count) =>
          count + (resource === SALT_MAP_EXTRA_RESOURCE[zoneId] ? 1 : 0)
      )
    : CITY_TILES[zoneId];

const saltTiles = (
  zoneId: ZoneId,
  isSaltMap: boolean
): Readonly<Record<Resource, number>> =>
  $(
    isSaltMap
      ? CITY_TILES[zoneId]
      : // Remove one tile from each zone in regular maps
        Dict.map_with_key(
          CITY_TILES[zoneId],
          (resource, count) =>
            count - (resource === REGULAR_MAPS_SALT_ALTERNATIVE[zoneId] ? 1 : 0)
        ),
    // Add the salt tile to the zone tiles
    ($$) => Dict.merge($$, { salt: 1 })
  );
