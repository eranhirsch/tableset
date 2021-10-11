import { ContextBase } from "model/ContextBase";
import { GameStepBase } from "model/GameStepBase";
import { VariableGameStep } from "model/VariableGameStep";
import { templateSelectors } from "./templateSlice";

export interface WithDependencies extends GameStepBase {
  dependencies: [...VariableGameStep<unknown>[]];
}

export const isWithDependencies = (
  step: GameStepBase
): step is WithDependencies =>
  (step as Partial<WithDependencies>).dependencies != null;

export interface Templatable extends WithDependencies {
  canBeTemplated(
    template: ReturnType<typeof templateSelectors["selectEntities"]>,
    context: ContextBase
  ): boolean;
}

export const isTemplatable = (x: GameStepBase): x is Templatable =>
  (x as Partial<Templatable>).canBeTemplated != null;
