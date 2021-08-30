import { Strategy } from "../../../core/Strategy";
import IGameStep, { TemplateContext } from "../../IGameStep";

export default class StartingColonistsStep implements IGameStep {
  public readonly id: string = "startingColonists";
  public readonly label: string = "Starting Colonists";

  public strategies({ template }: TemplateContext): Strategy[] {
    const { map } = template;
    if (map != null && map.strategy !== Strategy.OFF) {
      return [Strategy.COMPUTED];
    }
    return [Strategy.OFF];
  }
}
