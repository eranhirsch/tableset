import Base32 from "../../../common/Base32";
import invariant_violation from "../../../common/err/invariant_violation";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";
import { Strategy } from "../../../core/Strategy";
import IGameStep, { InstanceContext, TemplateContext } from "../../IGameStep";
import ConcordiaGame, { MapZone } from "../ConcordiaGame";

const HASH_SEPERATOR = "-";

export default class CityTilesStep implements IGameStep {
  public readonly id: string = "cityTiles";
  public readonly label: string = "City Resources";

  public resolveRandom({ instance }: InstanceContext): string {
    const mapDef = instance.find((step) => step.id === "map");
    if (mapDef == null || mapDef.id !== "map") {
      // TODO: create a generic dependancy error
      invariant_violation(`Couldn't find 'map' dependancy`);
    }
    const mapId = mapDef.value as keyof typeof ConcordiaGame.MAPS;
    const { provinces } = ConcordiaGame.MAPS[mapId];
    const hashes = Object.keys(provinces).map((zone) => {
      const tiles = ConcordiaGame.CITY_TILES[zone as MapZone];
      const permutations = new PermutationsLazyArray(tiles);
      const selectedIdx = Math.floor(Math.random() * permutations.length);
      return Base32.encode(selectedIdx);
    });
    return hashes.join(HASH_SEPERATOR);
  }

  public strategies({ template }: TemplateContext): Strategy[] {
    const { map } = template;
    if (map == null || map.strategy === Strategy.OFF) {
      return [Strategy.OFF];
    }
    return [Strategy.OFF, Strategy.RANDOM];
  }
}
