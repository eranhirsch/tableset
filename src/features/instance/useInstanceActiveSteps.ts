import { Vec } from "common";
import { isTemplatable } from "features/template/Templatable";
import { useFeaturesContext } from "features/useFeaturesContext";
import { GameStepBase } from "model/GameStepBase";
import { isSkippable } from "model/Skippable";
import { useMemo } from "react";
import { useGameFromParam } from "./useGameFromParam";
import { useInstanceFromParam } from "./useInstanceFromParam";

export function useInstanceActiveSteps(): readonly GameStepBase[] {
  const { steps } = useGameFromParam();
  const instance = useInstanceFromParam();

  const featuresContext = useFeaturesContext();

  const instanceContext = useMemo(
    () =>
      Object.freeze({
        ...featuresContext,
        instance: Vec.map_with_key(instance, (id, value) => ({ id, value })),
      }),
    [featuresContext, instance]
  );

  return useMemo(
    () =>
      Vec.filter(
        Vec.values(steps),
        (step) =>
          !(
            (isSkippable(step) && step.skip(instanceContext)) ||
            (isTemplatable(step) && step.isVariant)
          )
      ),
    [instanceContext, steps]
  );
}
