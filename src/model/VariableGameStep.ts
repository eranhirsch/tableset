import {
  InstanceContext,
  TemplateContext,
} from "games/core/steps/createRandomGameStep";
import { GameStepBase } from "./GameStepBase";

export interface VariableGameStep<T = unknown> extends GameStepBase {
  isType?(value: unknown): value is T;
  hasValue(context: TemplateContext | InstanceContext): boolean;
  extractInstanceValue(context: InstanceContext): T | null;
}
