import { InstanceContext } from "../games/core/steps/createRandomGameStep";
import { GameStepBase } from "./GameStepBase";

export interface DerivedGameStep extends GameStepBase {
  InstanceDerivedComponent?(props: {
    context: InstanceContext;
  }): JSX.Element | null;
}
