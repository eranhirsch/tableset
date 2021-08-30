import { Dictionary } from "@reduxjs/toolkit";
import { Strategy } from "../core/Strategy";
import { GamePiecesColor } from "../core/themeWithGameColors";
import { TemplateElement } from "../features/template/templateSlice";
import { SetupStepName } from "./concordia/ConcordiaGame";

export default abstract class Game {
  public abstract get playerColors(): GamePiecesColor[];
  public abstract strategiesFor(
    stepId: SetupStepName,
    template: Dictionary<TemplateElement<SetupStepName>>,
    playersTotal: number
  ): Strategy[];
}
