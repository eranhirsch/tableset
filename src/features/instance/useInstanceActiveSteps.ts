import { Vec } from "common";
import { isTemplatable } from "features/template/Templatable";
import { useFeaturesContext } from "features/useFeaturesContext";
import { isSkippable } from "model/Skippable";
import { useMemo } from "react";
import { GameStepBase } from "./GameStepBase";
import { useGameFromParam } from "./useGameFromParam";
import { useInstanceFromParam } from "./useInstanceFromParam";

export function useInstanceActiveSteps(): readonly GameStepBase[] {
  const { steps } = useGameFromParam();
  const instance = useInstanceFromParam();

  const featuresContext = useFeaturesContext();

  const instanceContext = useMemo(
    () => Object.freeze({ ...featuresContext, instance }),
    [featuresContext, instance]
  );

  return useMemo(
    () =>
      Vec.filter(
        Vec.values(steps),
        (step) =>
          !(
            (isTemplatable(step) && step.isVariant) ||
            (isSkippable(step) && step.skip(instanceContext))
          )
      ),
    [instanceContext, steps]
  );
}
