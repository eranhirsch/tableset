import { SetupStep } from "../features/instance/instanceSlice";
import { StepId } from "./IGame";

export default interface IGameStep {
  readonly id: StepId;
  readonly label: string;
  readonly items?: string[];

  resolveRandom?(
    instance: ReadonlyArray<SetupStep>,
    playersTotal: number
  ): string;

  labelForItem?(value: string): string;
}
