import { nullthrows, Vec } from "common";
import { useFeaturesContext } from "features/useFeaturesContext";
import { useMemo } from "react";
import { StepId } from "./Game";
import { instanceValue, InstanceValueStep } from "./instanceValue";
import { useInstanceFromParam } from "./useInstanceFromParam";

export function useRequiredInstanceValue<T>(step: InstanceValueStep<T>): T {
  return nullthrows(
    useOptionalInstanceValue(step),
    `Missing required instance value of step '${step.id}'`
  );
}

export function useOptionalInstanceValue<T>(
  step: InstanceValueStep<T>
): T | null {
  const context = useFeaturesContext();
  const instance = useInstanceFromParam();
  return useMemo(
    () => instanceValue(step, instance, context),
    [context, instance, step]
  );
}

export function useHasDownstreamInstanceValue(stepId: StepId): boolean {
  const instance = useInstanceFromParam();
  return instance[stepId] != null;
}

export function useOptionalInstanceValues(
  steps: readonly InstanceValueStep<unknown>[]
): readonly unknown[] {
  const context = useFeaturesContext();
  const instance = useInstanceFromParam();
  return useMemo(
    () => Vec.map(steps, (step) => instanceValue(step, instance, context)),
    [context, instance, steps]
  );
}
