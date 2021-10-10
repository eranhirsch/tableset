import {
  InstanceContext,
  Queryable,
  TemplateContext,
} from "games/core/steps/createRandomGameStep";
import { GameStepBase } from "./GameStepBase";

export interface VariableGameStep<T = unknown>
  extends GameStepBase,
    Queryable<T> {
  coerceInstanceEntry(
    instanceEntry: Readonly<{ id: string; value: unknown }> | undefined
  ): T | null;
  hasValue(context: TemplateContext | InstanceContext): boolean;
  extractInstanceValue(context: InstanceContext): T | null;
}
