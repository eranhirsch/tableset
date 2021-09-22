import { asReadonlyArray } from "common/asReadonlyArray";
import { nullthrows, random_offset } from "../../../common";
import Base32 from "../../../common/Base32";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";
import { MapId, MAPS, Zone } from "./Maps";

const HASH_SEPARATOR = "-";

export type Resource = "bricks" | "food" | "tools" | "wine" | "cloth";

type ZoneResourceTiles = Readonly<Record<Resource, number>>;

export const CITY_TILES: Readonly<Record<Zone, ZoneResourceTiles>> =
  Object.freeze({
    A: Object.freeze({ bricks: 2, food: 2, tools: 1, wine: 1, cloth: 1 }),
    B: Object.freeze({ bricks: 2, food: 3, tools: 1, wine: 1, cloth: 1 }),
    C: Object.freeze({ bricks: 3, food: 2, tools: 2, wine: 2, cloth: 1 }),
    D: Object.freeze({ bricks: 1, food: 1, tools: 1, wine: 1, cloth: 1 }),
  });

export type CityResourceMapping = Readonly<{
  [provinceName: string]: Readonly<{ [cityName: string]: Resource }>;
}>;

export default {
  randomHash: (mapId: MapId): string =>
    Object.keys(MAPS[mapId].provinces)
      .map((zone) =>
        Base32.encode(
          random_offset(PermutationsLazyArray.of(CITY_TILES[zone as Zone]))
        )
      )
      .join(HASH_SEPARATOR),

  decode: (mapId: MapId, hash: string): CityResourceMapping =>
    Object.entries(MAPS[mapId].provinces).reduce(
      (result, [zone, provinces], index) => {
        const zoneDef = CITY_TILES[zone as Zone];
        const permutationIdx = Base32.decode(hash.split(HASH_SEPARATOR)[index]);
        const resources = [
          ...nullthrows(
            asReadonlyArray(PermutationsLazyArray.of(zoneDef))[permutationIdx]
          ),
        ];

        Object.entries(provinces).forEach(([provinceName, cities]) => {
          const mappedResources: { [cityName: string]: Resource } = {};
          cities.forEach((cityName) => {
            mappedResources[cityName] = nullthrows(
              resources.pop(),
              `Not enough items in the resources permutation!`
            );
          });
          result[provinceName] = mappedResources;
        });

        return result;
      },
      {} as { [provinceName: string]: { [cityName: string]: Resource } }
    ),
} as const;
