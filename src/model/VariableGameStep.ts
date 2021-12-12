import { ContextBase } from "features/useFeaturesContext";
import {
  InstanceContext,
  TemplateContext,
} from "games/core/steps/createRandomGameStep";
import { Queryable } from "games/core/steps/Queryable";
import { GameStepBase } from "../features/instance/GameStepBase";
import { StepId } from "./Game";

export interface VariableGameStep<T = unknown>
  extends GameStepBase,
    Queryable<T> {
  hasValue(context: TemplateContext | InstanceContext): boolean;
  extractInstanceValue(
    upstreamInstance: Readonly<Record<StepId, unknown>>,
    context: ContextBase
  ): T | null;
}
