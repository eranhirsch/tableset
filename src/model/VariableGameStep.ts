import {
  InstanceContext,
  TemplateContext,
} from "games/core/steps/createRandomGameStep";
import { GameStepBase } from "./GameStepBase";

export interface VariableGameStep<T = unknown> extends GameStepBase {
  hasValue(context: TemplateContext | InstanceContext): boolean;
  extractInstanceValue(context: InstanceContext): T | null;
}
