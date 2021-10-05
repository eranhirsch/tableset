import { InstanceContext } from "../games/core/steps/createRandomGameStep";
import { GameStepBase } from "./GameStepBase";
import { Skippable } from "./Skippable";

export interface DerivedGameStep extends GameStepBase, Skippable {
  InstanceDerivedComponent(props: { context: InstanceContext }): JSX.Element;
}
