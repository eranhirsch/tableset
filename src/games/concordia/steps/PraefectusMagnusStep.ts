import { Strategy } from "../../../core/Strategy";
import IGameStep, { TemplateContext } from "../../IGameStep";

export class PraefectusMagnusStep implements IGameStep {
  public readonly id: string = "praefectusMagnus";
  public readonly label: string = "Praefectus Magnus";

  public strategies({ template }: TemplateContext): Strategy[] {
    const { playOrder } = template;
    if (playOrder != null && playOrder.strategy !== Strategy.OFF) {
      return [Strategy.COMPUTED];
    }
    return [Strategy.OFF];
  }
}
