import { Strategy } from "../../../core/Strategy";
import IGameStep, { TemplateContext } from "../../IGameStep";

// TODO: Move this to a global scope
export default class PlayOrderStep implements IGameStep {
  public readonly id: string = "playOrder";
  public readonly label: string = "Seating";

  public strategies({ playersTotal }: TemplateContext): Strategy[] {
    if (playersTotal < 3 || playersTotal > 5) {
      return [Strategy.OFF];
    }
    return [Strategy.OFF, Strategy.RANDOM, Strategy.ASK, Strategy.FIXED];
  }
}
