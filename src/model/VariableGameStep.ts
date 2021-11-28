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
  hasValue(context: TemplateContext | InstanceContext): boolean;
  extractInstanceValue(
    upstreamInstance: Readonly<Record<StepId, unknown>>,
    context: ContextBase
  ): T | null;
}
