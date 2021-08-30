import { Dictionary } from "@reduxjs/toolkit";
import { Strategy } from "../core/Strategy";
import { GamePiecesColor } from "../core/themeWithGameColors";
import { SetupStep } from "../features/instance/instanceSlice";
import { TemplateElement } from "../features/template/templateSlice";
import { SetupStepName } from "./concordia/ConcordiaGame";

export default interface IGame {
  readonly playerColors: GamePiecesColor[];
  readonly order: SetupStepName[];

  strategiesFor(
    stepId: SetupStepName,
    template: Dictionary<TemplateElement<SetupStepName>>,
    playersTotal: number
  ): Strategy[];

  resolveRandom(
    stepId: SetupStepName,
    instance: ReadonlyArray<SetupStep<SetupStepName>>,
    playersTotal: number
  ): string;

  resolveDefault(
    stepId: SetupStepName,
    instance: ReadonlyArray<SetupStep<SetupStepName>>,
    playersTotal: number
  ): string;

  labelForItem(stepId: SetupStepName, value: string): string;
}

