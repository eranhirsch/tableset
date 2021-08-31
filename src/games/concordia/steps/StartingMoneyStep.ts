import { Strategy } from "../../../core/Strategy";
import IGameStep, { TemplateContext } from "../../core/steps/IGameStep";

export default class StartingMoneyStep implements IGameStep {
  public readonly id: string = "startingMoney";
  public readonly label: string = "Starting Money";

  public strategies({ template }: TemplateContext): Strategy[] {
    const { playOrder } = template;
    if (playOrder != null && playOrder.strategy !== Strategy.OFF) {
      return [Strategy.COMPUTED];
    }
    return [Strategy.OFF];
  }
}
