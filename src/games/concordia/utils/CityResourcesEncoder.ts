import { C, Dict, MathUtils, nullthrows, Num, Random, Vec } from "common";
import { MapId, MAPS, Zone } from "./Maps";
import { Resource } from "./resource";

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
type ProvinceCityResources = Readonly<{
  [provinceName: string]: CityResources;
}>;

export default {
  randomHash: (mapId: MapId): string =>
    Vec.map_with_key(Dict.filter_nulls(MAPS[mapId].provinces), (zone) =>
      Num.encode_base32(
        Random.index(MathUtils.permutations_lazy_array(CITY_TILES[zone]))
      )
    ).join(HASH_SEPARATOR),

  decode: (mapId: MapId, hash: string): ProvinceCityResources =>
    C.reduce_with_key(
      Dict.filter_nulls(MAPS[mapId].provinces),
      (result, zone, provinces, index) => {
        const zoneDef = CITY_TILES[zone];
        const permutationIdx = Num.decode_base32(
          hash.split(HASH_SEPARATOR)[index]
        );
        const permutations = MathUtils.permutations_lazy_array(zoneDef);
        const resources = nullthrows(
          permutations.at(permutationIdx),
          `Index ${permutationIdx} is out of bounds for permutations ${permutations}`
        );

        let resourceIdx = 0;
        Vec.map_with_key(provinces, (provinceName, cities) => {
          const mappedResources: { [cityName: string]: Resource } = {};
          cities.forEach((cityName) => {
            mappedResources[cityName] = nullthrows(
              resources[resourceIdx++],
              `Not enough items in the resources permutation!`
            );
          });
          result = {
            ...result,
            [provinceName]: mappedResources,
          };
        });

        return result;
      },
      {} as ProvinceCityResources
    ),
} as const;
