import { Strategy } from "../../core/Strategy";
import IGameStep, { TemplateContext } from "../IGameStep";

export default class FirstPlayerStep implements IGameStep {
  public readonly id: string = "firstPlayer";
  public readonly label: string = "First Player";

  public strategies({ playersTotal }: TemplateContext): Strategy[] {
    if (playersTotal < 2) {
      // Solo games don't have a starting player...
      return [Strategy.OFF];
    }
    return [Strategy.OFF, Strategy.RANDOM, Strategy.ASK, Strategy.FIXED];
  }
}
