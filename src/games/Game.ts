import { Dictionary } from "@reduxjs/toolkit";
import { Strategy } from "../core/Strategy";
import { GamePiecesColor } from "../core/themeWithGameColors";
import { SetupStep } from "../features/instance/instanceSlice";
import { TemplateElement } from "../features/template/templateSlice";

export type StepId = string;

export default interface IGame {
  readonly playerColors: GamePiecesColor[];
  readonly order: StepId[];

  strategiesFor(
    stepId: StepId,
    template: Dictionary<TemplateElement>,
    playersTotal: number
  ): Strategy[];

  resolveRandom(
    stepId: StepId,
    instance: ReadonlyArray<SetupStep>,
    playersTotal: number
  ): string;

  resolveDefault(
    stepId: StepId,
    instance: ReadonlyArray<SetupStep>,
    playersTotal: number
  ): string;

  labelForItem(stepId: StepId, value: string): string;

  itemsForStep(stepId: StepId): readonly string[];
}
