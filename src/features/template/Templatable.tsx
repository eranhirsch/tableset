import { ContextBase } from "model/ContextBase";
import { GameStepBase } from "model/GameStepBase";
import { templateSelectors } from "./templateSlice";

export interface Templatable extends GameStepBase {
  canBeTemplated(
    template: ReturnType<typeof templateSelectors["selectEntities"]>,
    context: ContextBase
  ): boolean;
}

export const isTemplatable = (x: GameStepBase): x is Templatable =>
  (x as Partial<Templatable>).canBeTemplated != null;
