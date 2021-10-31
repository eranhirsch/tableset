import { SetupStep } from "features/instance/instanceSlice";
import {
  InstanceContext,
  TemplateContext,
} from "games/core/steps/createRandomGameStep";
import { Queryable } from "games/core/steps/Queryable";
import { ContextBase } from "./ContextBase";
import { StepId } from "./Game";
import { GameStepBase } from "./GameStepBase";

export interface VariableGameStep<T = unknown>
  extends GameStepBase,
    Queryable<T> {
  coerceInstanceEntry(
    instanceEntry: Readonly<{ id: string; value: unknown }> | undefined,
    context: Readonly<ContextBase>
  ): T | null;
  hasValue(context: TemplateContext | InstanceContext): boolean;
  extractInstanceValue(
    upstreamInstance: Readonly<Record<StepId, SetupStep>>,
    context: ContextBase
  ): T | null;
}
