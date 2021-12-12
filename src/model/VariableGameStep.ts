import { ContextBase } from "features/useFeaturesContext";
import { Queryable } from "games/core/steps/Queryable";
import { GameStepBase } from "../features/instance/GameStepBase";
import { StepId } from "./Game";

export interface VariableGameStep<T = unknown>
  extends GameStepBase,
    Queryable<T> {
  extractInstanceValue(
    upstreamInstance: Readonly<Record<StepId, unknown>>,
    context: ContextBase
  ): T | null;
}
