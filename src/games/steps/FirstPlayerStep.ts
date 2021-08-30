import { Strategy } from "../../core/Strategy";
import IGameStep, { TemplateContext } from "../IGameStep";

// TODO: Move this to a global scope
export default class FirstPlayerStep implements IGameStep {
  public readonly id: string = "firstPlayer";
  public readonly label: string = "First Player";

  public strategies({ playersTotal }: TemplateContext): Strategy[] {
    if (playersTotal < 2 || playersTotal > 5) {
      return [Strategy.OFF];
    }
    return [Strategy.OFF, Strategy.RANDOM, Strategy.ASK, Strategy.FIXED];
  }
}
