import { Dictionary } from "@reduxjs/toolkit";
import { Strategy } from "../core/Strategy";
import { SetupStep } from "../features/instance/instanceSlice";
import { TemplateElement } from "../features/template/templateSlice";
import { StepId } from "./IGame";

export interface TemplateContext {
  template: Readonly<Dictionary<Readonly<TemplateElement>>>;
  playersTotal: number;
}

export default interface IGameStep {
  readonly id: StepId;
  readonly label: string;
  readonly items?: readonly string[];

  resolveRandom?(instance: readonly SetupStep[], playersTotal: number): string;

  labelForItem?(value: string): string;

  strategies?(context: Readonly<TemplateContext>): readonly Strategy[];
}
