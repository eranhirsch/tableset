import { StepId } from "./Game";

export interface GameStepBase {
  readonly id: StepId;
  readonly label: string;
  readonly isOptional: boolean;
  readonly InstanceManualComponent?: (() => JSX.Element) | string;
}
