import { useAppSelector } from "app/hooks";
import { StepId } from "model/IGame";
import IGameStep from "model/IGameStep";
import { gameSelector } from "./gameSlice";

export const useGameStep = (stepId: StepId): IGameStep<unknown> =>
  useAppSelector(gameSelector).atEnforce(stepId);
