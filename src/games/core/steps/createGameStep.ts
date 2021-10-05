import { StepId } from "../../../model/Game";
import { GameStepBase } from "../../../model/GameStepBase";

export interface CreateGameStepOptions {
  id: StepId;

  // Optional: We convert the camelCase id into a label automatically. Only use
  // this if you want a different label for your step
  labelOverride?: string;

  InstanceManualComponent?: (() => JSX.Element) | string;
}

export const createGameStep = ({
  id,
  labelOverride,
  InstanceManualComponent,
}: CreateGameStepOptions): GameStepBase => ({
  id,
  label:
    labelOverride ??
    id[0].toUpperCase() + id.replaceAll(/[A-Z]/g, " $&").slice(1),
  InstanceManualComponent,
});
