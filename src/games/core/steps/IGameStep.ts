import { Dictionary } from "@reduxjs/toolkit";
import Strategy from "../../../core/Strategy";
import { SetupStep } from "../../../features/instance/instanceSlice";
import { PlayerId } from "../../../features/players/playersSlice";
import { TemplateElement } from "../../../features/template/templateSlice";
import { StepId } from "../IGame";

export interface TemplateContext {
  template: Readonly<Dictionary<Readonly<TemplateElement>>>;
  playerIds: readonly PlayerId[];
}

export interface InstanceContext {
  instance: readonly SetupStep[];
  playerIds: readonly PlayerId[];
}

export default interface IGameStep<T = never> {
  readonly id: StepId;
  readonly label: string;

  dependencies?: [...IGameStep<unknown>[]];

  isType?(value: any): value is T;

  hasValue?(context: TemplateContext | InstanceContext): boolean;
  extractInstanceValue?(context: InstanceContext): T;

  TemplateFixedValueLabel?(props: { value: any }): JSX.Element;
  TemplateFixedValueSelector?(props: { current: any }): JSX.Element;
  InstanceVariableComponent?(props: { value: any }): JSX.Element;
  InstanceDerivedComponent?(props: {
    context: InstanceContext;
  }): JSX.Element | null;

  strategies?(context: TemplateContext): readonly Strategy[];

  initialFixedValue?(playerIds: readonly string[]): T;
  refreshFixedValue?(current: T, playerIds: readonly string[]): T | undefined;

  resolveRandom?(context: InstanceContext): T;
  resolveDefault?(context: InstanceContext): T;
}
