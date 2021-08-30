import Base32 from "../../../common/Base32";
import invariant_violation from "../../../common/err/invariant_violation";
import nullthrows from "../../../common/err/nullthrows";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";
import { Strategy } from "../../../core/Strategy";
import IGameStep, { InstanceContext, TemplateContext } from "../../IGameStep";
import { MapId, MAPS, Zone } from "./MapStep";

const HASH_SEPERATOR = "-";

export type Resource = "bricks" | "food" | "tools" | "wine" | "cloth";

const CITY_TILES: Readonly<Record<Zone, Readonly<Record<Resource, number>>>> = {
  A: { bricks: 2, food: 2, tools: 1, wine: 1, cloth: 1 },
  B: { bricks: 2, food: 3, tools: 1, wine: 1, cloth: 1 },
  C: { bricks: 3, food: 2, tools: 2, wine: 2, cloth: 1 },
  D: { bricks: 1, food: 1, tools: 1, wine: 1, cloth: 1 },
};

export type CityResourceMapping = Readonly<{
  [provinceName: string]: Readonly<{ [cityName: string]: Resource }>;
}>;

export default class CityTilesStep implements IGameStep {
  public readonly id: string = "cityTiles";
  public readonly label: string = "City Resources";

  public static fromHash(map: string, hash: string): CityResourceMapping {
    const hashParts = hash.split(HASH_SEPERATOR);
    const { provinces } = MAPS[map as MapId];
    const x = Object.entries(provinces).reduce(
      (result, [zone, provinces], index) => {
        const zoneDef = CITY_TILES[zone as Zone];
        const permutationIdx = Base32.decode(hashParts[index]);
        const resources = [
          ...nullthrows(new PermutationsLazyArray(zoneDef).at(permutationIdx)),
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

  public strategies({ template }: TemplateContext): Strategy[] {
    const { map } = template;
    if (map == null || map.strategy === Strategy.OFF) {
      return [Strategy.OFF];
    }
    return [Strategy.OFF, Strategy.RANDOM];
  }

  public resolveRandom({ instance }: InstanceContext): string {
    const mapDef = instance.find((step) => step.id === "map");
    if (mapDef == null || mapDef.id !== "map") {
      // TODO: create a generic dependancy error
      invariant_violation(`Couldn't find 'map' dependancy`);
    }
    const mapId = mapDef.value as MapId;
    const { provinces } = MAPS[mapId];
    const hashes = Object.keys(provinces).map((zone) => {
      const tiles = CITY_TILES[zone as Zone];
      const permutations = new PermutationsLazyArray(tiles);
      const selectedIdx = Math.floor(Math.random() * permutations.length);
      return Base32.encode(selectedIdx);
    });
    return hashes.join(HASH_SEPERATOR);
  }
}
