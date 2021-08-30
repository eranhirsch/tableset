import { Dictionary } from "@reduxjs/toolkit";
import { Strategy } from "../core/Strategy";
import { GamePiecesColor } from "../core/themeWithGameColors";
import { SetupStep } from "../features/instance/instanceSlice";
import { TemplateElement } from "../features/template/templateSlice";

export type StepId = string;

export interface IGameStep {
  readonly id: StepId;
  readonly label: string;
}

export class GenericGameStep implements IGameStep {
  public constructor(
    public readonly id: StepId,
    public readonly labelOverride?: string
  ) {}

  public get label(): string {
    if (this.labelOverride) {
      return this.labelOverride;
    }

    return (
      this.id[0].toUpperCase() + this.id.replaceAll(/[A-Z]/g, " $&").slice(1)
    );
  }
}

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

  stepLabel(stepId: StepId): string;

  labelForItem(stepId: StepId, value: string): string;

  itemsForStep(stepId: StepId): readonly string[];
}
