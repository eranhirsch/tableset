import { useAppSelector } from "app/hooks";
import { StepId } from "games/core/IGame";
import IGameStep from "games/core/steps/IGameStep";
import { gameSelector } from "./gameSlice";

export const useGameStep = (stepId: StepId): IGameStep<unknown> =>
  useAppSelector(gameSelector).atEnforce(stepId);
