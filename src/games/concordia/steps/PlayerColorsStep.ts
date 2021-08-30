import { Strategy } from "../../../core/Strategy";
import IGameStep, { TemplateContext } from "../../IGameStep";

// TODO: Move this to a global scope
export default class PlayerColorsStep implements IGameStep {
  public readonly id: string = "playerColors";
  public readonly label: string = "Colors";

  public strategies({ playersTotal }: TemplateContext): Strategy[] {
    if (playersTotal === 0 || playersTotal > 5) {
      return [Strategy.OFF];
    }
    return [Strategy.OFF, Strategy.RANDOM, Strategy.ASK, Strategy.FIXED];
  }
}
