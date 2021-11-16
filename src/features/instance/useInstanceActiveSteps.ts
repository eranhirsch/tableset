import { useAppSelector } from "app/hooks";
import { Vec } from "common";
import { gameStepsSelector } from "features/game/gameSlice";
import { isRandomGameStep } from "games/core/steps/createRandomGameStep";
import { GameStepBase } from "model/GameStepBase";
import { isSkippable } from "model/Skippable";
import { useMemo } from "react";
import { useInstanceContext } from "./useInstanceContext";

export function useInstanceActiveSteps(): readonly GameStepBase[] {
  const allSteps = useAppSelector(gameStepsSelector);
  const instanceContext = useInstanceContext();
  return useMemo(
    () =>
      Vec.filter(
        Vec.values(allSteps),
        (step) =>
          !(
            (isSkippable(step) && step.skip(instanceContext)) ||
            (isRandomGameStep(step) && step.isVariant)
          )
      ),
    [allSteps, instanceContext]
  );
}
