import { ContextBase } from "features/useFeaturesContext";
import { Queryable } from "games/core/steps/Queryable";
import { StepId } from "model/Game";

export interface MetaGameStep<T> extends Queryable<T> {
  id: StepId;
  computeInstanceValue(
    instance: Readonly<Record<StepId, unknown>>,
    context: ContextBase
  ): T | null;
}
