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
import { MapId, MAPS, Zone } from "./Maps";
import { Resource, RESOURCE_COST } from "./resource";

const HASH_SEPARATOR = "-";

type ZoneResourceTiles = Readonly<Record<Resource, number>>;

export const CITY_TILES: Readonly<Record<Zone, ZoneResourceTiles>> =
  Object.freeze({
    A: Object.freeze({ bricks: 2, food: 2, tools: 1, wine: 1, cloth: 1 }),
    B: Object.freeze({ bricks: 2, food: 3, tools: 1, wine: 1, cloth: 1 }),
    C: Object.freeze({ bricks: 3, food: 2, tools: 2, wine: 2, cloth: 1 }),
    D: Object.freeze({ bricks: 1, food: 1, tools: 1, wine: 1, cloth: 1 }),
  });

type CityResources = Readonly<{ [cityName: string]: Resource }>;
type ProvinceCityResources = Readonly<
  Record<string /* provinceName */, CityResources>
>;
type ProvinceBonusResource = Readonly<
  Record<string /* provinceName */, Resource>
>;

export default {
  randomHash: (mapId: MapId): string =>
    Vec.map_with_key(MAPS[mapId].provinces, (zone) =>
      Num.encode_base32(
        Random.index(MathUtils.permutations_lazy_array(CITY_TILES[zone]))
      )
    ).join(HASH_SEPARATOR),

  decodeCityResources,

  decodeProvinceBonuses: (mapId: MapId, hash: string): ProvinceBonusResource =>
    Dict.map_with_key(
      decodeCityResources(mapId, hash),
      (provinceName, cityResources) =>
        nullthrows(
          MathUtils.max_by(
            Vec.values(cityResources),
            (resource) => RESOURCE_COST[resource]
          ),
          `Province ${provinceName} had no city resources`
        )
    ),
} as const;

function decodeCityResources(
  mapId: MapId,
  hash: string
): ProvinceCityResources {
  return Dict.flatten(
    Vec.map(
      Vec.map(
        Vec.zip(
          Vec.values(
            Shape.inner_join(
              MAPS[mapId].provinces,
              Dict.map(CITY_TILES, MathUtils.permutations_lazy_array)
            )
          ),
          hash.split(HASH_SEPARATOR).map(Num.decode_base32)
        ),
        ([[provinces, permutations], permutationIndex]) =>
          tuple(
            provinces,
            nullthrows(
              permutations.at(permutationIndex),
              `Index ${permutationIndex} is out of bounds for permutations ${permutations}`
            )
          )
      ),
      ([provinces, resources]) =>
        Dict.map(provinces, (cities) => {
          const cityResources = Vec.zip(cities, resources);
          invariant(
            cityResources.length === cities.length,
            `Number of resources ${cityResources.length} didn't match number of cities ${cities.length}`
          );
          resources = resources.slice(cities.length);
          return Dict.from_entries(cityResources);
        })
    )
  );
}
