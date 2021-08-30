import { StepId } from "./Game";

export interface IGameStep {
  readonly id: StepId;
  readonly label: string;
}
