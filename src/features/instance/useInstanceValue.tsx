import { nullthrows, Vec } from "common";
import { useFeaturesContext } from "features/useFeaturesContext";
import { StepId } from "model/Game";
import { VariableGameStep } from "model/VariableGameStep";
import { useInstanceFromParam } from "./useInstanceFromParam";

export function useRequiredInstanceValue<T>(step: VariableGameStep<T>): T {
  return nullthrows(
    useOptionalInstanceValue(step),
    `Missing required instance value of step '${step.id}'`
  );
}

export function useOptionalInstanceValue<T>(
  step: VariableGameStep<T>
): T | null {
  const context = useFeaturesContext();
  const instance = useInstanceFromParam();

  const value = instance[step.id];
  if (value != null) {
    // The cast here is safe because avro makes sure our types match when
    // decoding.
    return value as T;
  }

  // This is needed for the meta steps (players, products)
  return step.extractInstanceValue(instance, context);
}

export function useHasDownstreamInstanceValue(stepId: StepId): boolean {
  const instance = useInstanceFromParam();
  return instance[stepId] != null;
}

export function useOptionalInstanceValues(
  steps: readonly VariableGameStep[]
): readonly unknown[] {
  const context = useFeaturesContext();

  const instance = useInstanceFromParam();
  return Vec.map(steps, (step) =>
    step.id in instance
      ? // We don't need to coerce the values here because they are already
        // type-checked by avro when decoding the param
        instance[step.id]
      : // This is needed for meta-steps like players and products
        step.extractInstanceValue(instance, context)
  );
}
