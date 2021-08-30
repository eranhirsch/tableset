import { Strategy } from "../../../core/Strategy";
import IGameStep, { TemplateContext } from "../../IGameStep";
import { Resource } from "../ConcordiaGame";
import { CityResourceMapping } from "./CityTilesStep";

export default class BonusTilesStep implements IGameStep {
  public readonly id: string = "bonusTiles";
  public readonly label: string = "Province Bonuses";

  public static fromCityTiles(
    cityResourceMapping: CityResourceMapping
  ): Readonly<{ [provinceName: string]: Resource }> {
    return Object.fromEntries(
      Object.entries(cityResourceMapping).map(([provinceName, cities]) => [
        provinceName,
        Object.values(cities).reduce((highest, resource) => {
          const options = [highest, resource];
          return options.includes("cloth")
            ? "cloth"
            : options.includes("wine")
            ? "wine"
            : options.includes("tools")
            ? "tools"
            : options.includes("food")
            ? "food"
            : "bricks";
        }),
      ])
    );
  }

  public strategies({ template }: TemplateContext): Strategy[] {
    const { cityTiles } = template;
    if (cityTiles != null && cityTiles.strategy !== Strategy.OFF) {
      return [Strategy.COMPUTED];
    }
    return [Strategy.OFF];
  }
}
