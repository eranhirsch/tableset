import { useAppSelector } from "app/hooks";
import { Vec } from "common";
import { gameStepsSelector } from "features/game/gameSlice";
import { isTemplatable } from "features/template/Templatable";
import { useFeaturesContext } from "features/useFeaturesContext";
import { GameStepBase } from "model/GameStepBase";
import { isSkippable } from "model/Skippable";
import { useMemo } from "react";
import { instanceSelectors } from "./instanceSlice";
import { useGameFromParam } from "./useGameFromParam";
import { useInstanceFromParam } from "./useInstanceFromParam";

export function useInstanceActiveSteps(): readonly GameStepBase[] {
  const paramsGame = useGameFromParam();
  const paramsInstance = useInstanceFromParam();
  const paramsInstanceArr = useMemo(
    () =>
      paramsInstance == null
        ? null
        : Vec.map_with_key(paramsInstance, (id, value) => ({ id, value })),
    [paramsInstance]
  );

  const featuresContext = useFeaturesContext();

  let allSteps = useAppSelector(gameStepsSelector);
  if (paramsGame != null) {
    allSteps = paramsGame.steps;
  }

  let instance = useAppSelector(instanceSelectors.selectAll);
  if (paramsInstanceArr != null) {
    instance = [...paramsInstanceArr];
  }

  const instanceContext = useMemo(
    () => Object.freeze({ ...featuresContext, instance }),
    [featuresContext, instance]
  );

  return useMemo(
    () =>
      Vec.filter(
        Vec.values(allSteps),
        (step) =>
          !(
            (isSkippable(step) && step.skip(instanceContext)) ||
            (isTemplatable(step) && step.isVariant)
          )
      ),
    [allSteps, instanceContext]
  );
}
