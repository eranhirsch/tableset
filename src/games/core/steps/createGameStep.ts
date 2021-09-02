import { StepId } from "../IGame";
import IGameStep from "./IGameStep";

export interface CreateGameStepOptions {
  // Used to identify, validate, and find the game step inside the game. Use
  // camelCase!
  id: StepId;

  // Optional: We convert the camelCase id into a label automatically. Only use
  // this if you want a different label for your step
  labelOverride?: string;
}

export default function createGameStep({
  id,
  labelOverride,
}: CreateGameStepOptions): IGameStep<never> {
  return {
    id,
    label:
      labelOverride ??
      id[0].toUpperCase() + id.replaceAll(/[A-Z]/g, " $&").slice(1),
  };
}
