import Base32 from "../../../common/Base32";
import { nullthrows } from "../../../common/err";
import { random_offset } from "../../../common/lib_utils";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";
import { MapBoard, MapId, MAPS, Zone } from "./Maps";

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

export default class CityResourcesEncoder {
  private static readonly HASH_SEPERATOR = "-";

  public static forMapId(mapId: MapId) {
    return new CityResourcesEncoder(MAPS[mapId]);
  }

  private constructor(private map: MapBoard) {}

  public randomHash(): string {
    return Object.keys(this.map.provinces)
      .map((zone) =>
        Base32.encode(
          random_offset(PermutationsLazyArray.of(CITY_TILES[zone as Zone]))
        )
      )
      .join(CityResourcesEncoder.HASH_SEPERATOR);
  }

  public decode(hash: string): CityResourceMapping {
    const hashParts = hash.split(CityResourcesEncoder.HASH_SEPERATOR);
    const x = Object.entries(this.map.provinces).reduce(
      (result, [zone, provinces], index) => {
        const zoneDef = CITY_TILES[zone as Zone];
        const permutationIdx = Base32.decode(hashParts[index]);
        const resources = [
          ...nullthrows(PermutationsLazyArray.of(zoneDef).at(permutationIdx)),
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
    );
    return x;
  }
}
