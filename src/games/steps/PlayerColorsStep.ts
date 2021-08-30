import { Strategy } from "../../core/Strategy";
import { GamePiecesColor } from "../../core/themeWithGameColors";
import IGameStep, { TemplateContext } from "../IGameStep";

export default class PlayerColorsStep implements IGameStep {
  public readonly id: string = "playerColors";
  public readonly label: string = "Colors";

  public constructor(private availableColors: readonly GamePiecesColor[]) {}

  public strategies({ playersTotal }: TemplateContext): readonly Strategy[] {
    if (playersTotal < 1) {
      // No one to assign a color to
      return [Strategy.OFF];
    }

    if (playersTotal > this.availableColors.length) {
      // Too many players to assign colors to
      return [Strategy.OFF];
    }

    return [Strategy.OFF, Strategy.RANDOM, Strategy.ASK, Strategy.FIXED];
  }
}
