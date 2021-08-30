import { Dictionary } from "@reduxjs/toolkit";
import { Strategy } from "../core/Strategy";
import { GamePiecesColor } from "../core/themeWithGameColors";
import { SetupStep } from "../features/instance/instanceSlice";
import { TemplateElement } from "../features/template/templateSlice";
import { SetupStepName } from "./concordia/ConcordiaGame";

export default abstract class Game {
  public abstract get playerColors(): GamePiecesColor[];

  public abstract strategiesFor(
    stepId: SetupStepName,
    template: Dictionary<TemplateElement<SetupStepName>>,
    playersTotal: number
  ): Strategy[];

  public abstract resolveRandom(
    stepId: SetupStepName,
    instance: ReadonlyArray<SetupStep<SetupStepName>>,
    playersTotal: number
  ): string;

  public abstract resolveDefault(
    stepId: SetupStepName,
    instance: ReadonlyArray<SetupStep<SetupStepName>>,
    playersTotal: number
  ): string;

  public abstract labelForItem(stepId: SetupStepName, value: string): string;
}
