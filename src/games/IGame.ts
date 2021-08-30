import { Dictionary } from "@reduxjs/toolkit";
import { Strategy } from "../core/Strategy";
import { GamePiecesColor } from "../core/themeWithGameColors";
import { SetupStep } from "../features/instance/instanceSlice";
import { TemplateElement } from "../features/template/templateSlice";
import IGameStep from "./IGameStep";

export type StepId = string;

export default interface IGame {
  readonly playerColors: GamePiecesColor[];
  readonly order: StepId[];

  at(id: StepId): IGameStep | undefined;

  strategiesFor(
    stepId: StepId,
    template: Dictionary<TemplateElement>,
    playersTotal: number
  ): Strategy[];

  resolveDefault(
    stepId: StepId,
    instance: ReadonlyArray<SetupStep>,
    playersTotal: number
  ): string;
}
