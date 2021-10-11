import { useAppSelector } from "app/hooks";
import { Vec } from "common";
import { gameStepsSelector } from "features/game/gameSlice";
import { GameStepBase } from "model/GameStepBase";
import { isSkippable } from "model/Skippable";
import { useMemo } from "react";
import { useInstanceContext } from "./useInstanceContext";

export function useInstanceActiveSteps(): readonly GameStepBase[] {
  const allSteps = useAppSelector(gameStepsSelector);
  const instanceContext = useInstanceContext();
  return useMemo(
    () =>
      Vec.values(allSteps).filter(
        (step) => !isSkippable(step) || !step.skip(instanceContext)
      ),
    [allSteps, instanceContext]
  );
}
