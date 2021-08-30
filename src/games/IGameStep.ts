import { Dictionary } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { Strategy } from "../core/Strategy";
import { SetupStep } from "../features/instance/instanceSlice";
import { PlayerId } from "../features/players/playersSlice";
import templateSlice, {
  TemplateElement,
} from "../features/template/templateSlice";
import { StepId } from "./IGame";

export interface TemplateContext {
  template: Readonly<Dictionary<Readonly<TemplateElement>>>;
  playersTotal: number;
}

export interface InstanceContext {
  instance: readonly SetupStep[];
  playersTotal: number;
}

export default interface IGameStep<S extends StepId = StepId> {
  readonly id: S;
  readonly label: string;
  readonly items?: readonly string[];

  labelForItem?(value: string): string;

  strategies?(context: Readonly<TemplateContext>): readonly Strategy[];

  resolveRandom?(context: InstanceContext): string;
  resolveDefault?(context: InstanceContext): string;

  onPlayerRemoved?(
    state: WritableDraft<ReturnType<typeof templateSlice["reducer"]>>,
    removedPlayerId: PlayerId,
    playersTotal: number
  ): void;
}
