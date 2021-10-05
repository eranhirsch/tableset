import {
  InstanceContext,
  TemplateContext,
} from "games/core/steps/createVariableGameStep";
import { GameStepBase } from "./GameStepBase";

export interface VariableGameStep<T = unknown> extends GameStepBase {
  hasValue(context: TemplateContext | InstanceContext): boolean;
  extractInstanceValue(context: InstanceContext): T | null;
}
