import { Dictionary } from "@reduxjs/toolkit";
import { Strategy } from "../core/Strategy";
import { SetupStep } from "../features/instance/instanceSlice";
import { TemplateElement } from "../features/template/templateSlice";
import { StepId } from "./IGame";

export interface TemplateContext {
  template: Dictionary<TemplateElement>;
  playersTotal: number;
}

export default interface IGameStep {
  readonly id: StepId;
  readonly label: string;
  readonly items?: string[];

  resolveRandom?(
    instance: ReadonlyArray<SetupStep>,
    playersTotal: number
  ): string;

  labelForItem?(value: string): string;

  strategies?(context: TemplateContext): Strategy[];
}
