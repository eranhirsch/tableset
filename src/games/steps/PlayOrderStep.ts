import { Strategy } from "../../core/Strategy";
import IGameStep, { TemplateContext } from "../IGameStep";

export default class PlayOrderStep implements IGameStep {
  public readonly id: string = "playOrder";
  public readonly label: string = "Seating";

  public strategies({ playersTotal }: TemplateContext): Strategy[] {
    if (playersTotal < 3) {
      // It's trivially uninteresting to talk about order when there aren't
      // enough players
      return [Strategy.OFF];
    }

    return [Strategy.OFF, Strategy.RANDOM, Strategy.ASK, Strategy.FIXED];
  }
}
