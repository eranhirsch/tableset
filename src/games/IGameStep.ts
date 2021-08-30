import { StepId } from "./Game";

export default interface IGameStep {
  readonly id: StepId;
  readonly label: string;
}
