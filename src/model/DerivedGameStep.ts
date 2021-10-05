import { InstanceContext } from "../games/core/steps/createVariableGameStep";
import { GameStepBase } from "./GameStepBase";

export interface DerivedGameStep extends GameStepBase {
  InstanceDerivedComponent?(props: {
    context: InstanceContext;
  }): JSX.Element | null;
}
