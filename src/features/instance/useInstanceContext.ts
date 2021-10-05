import { useAppSelector } from "app/hooks";
import { useFeaturesContext } from "features/useFeaturesContext";
import { InstanceContext } from "games/core/steps/createRandomGameStep";
import { useMemo } from "react";
import { instanceSelectors } from "./instanceSlice";

export function useInstanceContext(): Readonly<InstanceContext> {
  const featuresContext = useFeaturesContext();
  const instance = useAppSelector(instanceSelectors.selectAll);
  return useMemo(
    () => Object.freeze({ ...featuresContext, instance }),
    [featuresContext, instance]
  );
}
