import { Dictionary } from "@reduxjs/toolkit";
import { SetupStep } from "features/instance/instanceSlice";
import { Strategy } from "features/template/Strategy";
import { TemplateElement } from "features/template/templateSlice";
import { PlayerId } from "model/Player";
import { ProductId, StepId } from "./IGame";

interface ContextBase {
  playerIds: readonly PlayerId[];
  productIds: readonly ProductId[];
}

export interface TemplateContext extends ContextBase {
  template: Readonly<Dictionary<Readonly<TemplateElement>>>;
}

export interface InstanceContext extends ContextBase {
  instance: readonly SetupStep[];
}

export default interface IGameStep<T = never> {
  readonly id: StepId;
  readonly label: string;
  readonly isOptional: boolean;

  dependencies?: [...IGameStep<unknown>[]];

  isType?(value: any): value is T;

  hasValue?(context: TemplateContext | InstanceContext): boolean;
  extractInstanceValue?(context: InstanceContext): T | null;

  // TODO: make this non-optional
  InstanceManualComponent?: (() => JSX.Element) | string;

  InstanceVariableComponent?(props: { value: any }): JSX.Element;
  InstanceDerivedComponent?(props: {
    context: InstanceContext;
  }): JSX.Element | null;

  TemplateFixedValueLabel?: ((props: { value: any }) => JSX.Element) | string;
  TemplateFixedValueSelector?(props: { current: any }): JSX.Element;

  strategies?(context: TemplateContext): readonly Strategy[];

  initialFixedValue?(playerIds: readonly string[]): T;
  refreshFixedValue?(
    current: T,
    context: Omit<TemplateContext, "template">
  ): T | undefined;

  resolveRandom?(context: InstanceContext): T;
  resolveDefault?(context: InstanceContext): T;
}
