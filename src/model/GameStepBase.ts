import { StepId } from "./Game";

export interface GameStepBase {
  readonly id: StepId;
  readonly label: string;
  readonly InstanceManualComponent?: (() => JSX.Element) | string;
}
