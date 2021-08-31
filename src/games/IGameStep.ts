import { Dictionary } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { Strategy } from "../core/Strategy";
import { SetupStep } from "../features/instance/instanceSlice";
import { Player, PlayerId } from "../features/players/playersSlice";
import {
  ConstantTemplateElement,
  TemplateElement,
  TemplateState,
} from "../features/template/templateSlice";
import { StepId } from "./IGame";

export interface TemplateContext {
  template: Readonly<Dictionary<Readonly<TemplateElement>>>;
  playersTotal: number;
}

export interface InstanceContext {
  instance: readonly SetupStep[];
  playerIds: readonly PlayerId[];
}

export default interface IGameStep {
  readonly id: StepId;
  readonly label: string;

  renderTemplateFixedLabel?(value: any): JSX.Element;
  renderTemplateFixedValueSelector?(current: any): JSX.Element;
  renderInstanceContent?(value: any): JSX.Element;

  strategies?(context: Readonly<TemplateContext>): readonly Strategy[];

  initialFixedValue?(playerIds: string[]): ConstantTemplateElement;

  resolveRandom?(context: InstanceContext): any;
  resolveDefault?(context: InstanceContext): string;

  onPlayerAdded?(
    state: WritableDraft<TemplateState>,
    context: { addedPlayer: Player }
  ): void;
  onPlayerRemoved?(
    state: WritableDraft<TemplateState>,
    context: { removedPlayerId: PlayerId; playersTotal: number }
  ): void;
}

interface CreateGameStepOptions {
  // Used to identify, validate, and find the game step inside the game. Use
  // camelCase!
  id: StepId;

  // Optional: We convert the camelCase id into a label automatically. Only use
  // this if you want a different label for your step
  labelOverride?: string;
}

export function createGameStep({
  id,
  labelOverride,
}: CreateGameStepOptions): IGameStep {
  return {
    id,
    label:
      labelOverride ??
      id[0].toUpperCase() + id.replaceAll(/[A-Z]/g, " $&").slice(1),
  };
}