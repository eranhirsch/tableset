import { Strategy } from "../../../core/Strategy";
import IGameStep, { TemplateContext } from "../../IGameStep";

export default class BonusTilesStep implements IGameStep {
  public readonly id: string = "bonusTiles";
  public readonly label: string = "Province Bonuses";

  public strategies({ template }: TemplateContext): Strategy[] {
    const { cityTiles } = template;
    if (cityTiles != null && cityTiles.strategy !== Strategy.OFF) {
      return [Strategy.COMPUTED];
    }
    return [Strategy.OFF];
  }
}
