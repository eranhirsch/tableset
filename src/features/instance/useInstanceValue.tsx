import { $, nullthrows, ReactUtils, Vec } from "common";
import { useFeaturesContext } from "features/useFeaturesContext";
import { StepId } from "model/Game";
import { VariableGameStep } from "model/VariableGameStep";
import { instanceSelectors } from "./instanceSlice";
import { useInstanceFromParam } from "./useInstanceFromParam";

const NO_DEPENDENCY_ID = "__noDep";

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

  const instanceEntry = ReactUtils.useAppEntityIdSelectorNullable(
    instanceSelectors,
    step.id
  );

  const paramInstance = useInstanceFromParam();
  if (paramInstance == null) {
    return step.coerceInstanceEntry(instanceEntry, context);
  }

  const value = paramInstance[step.id];
  if (value != null) {
    // The cast here is safe because avro makes sure our types match when
    // decoding.
    return value as T;
  }

  // This is needed for the meta steps (players, products)
  return step.coerceInstanceEntry(undefined, context);
}

export function useHasDownstreamInstanceValue(stepId: StepId): boolean {
  const instanceEntry = ReactUtils.useAppEntityIdSelectorNullable(
    instanceSelectors,
    stepId
  );
  const paramInstance = useInstanceFromParam();

  return (
    (paramInstance != null && paramInstance[stepId] != null) ||
    instanceEntry != null
  );
}

export function useOptionalInstanceValues(
  steps: readonly VariableGameStep[]
): readonly unknown[] {
  const context = useFeaturesContext();

  const fromSlice = [
    ReactUtils.useAppEntityIdSelectorNullable(
      instanceSelectors,
      steps[0]?.id ?? NO_DEPENDENCY_ID
    ),
    ReactUtils.useAppEntityIdSelectorNullable(
      instanceSelectors,
      steps[1]?.id ?? NO_DEPENDENCY_ID
    ),
    ReactUtils.useAppEntityIdSelectorNullable(
      instanceSelectors,
      steps[2]?.id ?? NO_DEPENDENCY_ID
    ),
    ReactUtils.useAppEntityIdSelectorNullable(
      instanceSelectors,
      steps[3]?.id ?? NO_DEPENDENCY_ID
    ),
    ReactUtils.useAppEntityIdSelectorNullable(
      instanceSelectors,
      steps[4]?.id ?? NO_DEPENDENCY_ID
    ),
    ReactUtils.useAppEntityIdSelectorNullable(
      instanceSelectors,
      steps[5]?.id ?? NO_DEPENDENCY_ID
    ),
    ReactUtils.useAppEntityIdSelectorNullable(
      instanceSelectors,
      steps[6]?.id ?? NO_DEPENDENCY_ID
    ),
    ReactUtils.useAppEntityIdSelectorNullable(
      instanceSelectors,
      steps[7]?.id ?? NO_DEPENDENCY_ID
    ),
    ReactUtils.useAppEntityIdSelectorNullable(
      instanceSelectors,
      steps[8]?.id ?? NO_DEPENDENCY_ID
    ),
    ReactUtils.useAppEntityIdSelectorNullable(
      instanceSelectors,
      steps[9]?.id ?? NO_DEPENDENCY_ID
    ),
  ];

  const paramsInstance = useInstanceFromParam();
  if (paramsInstance != null) {
    return Vec.map(steps, (step) =>
      step.id in paramsInstance
        ? // We don't need to coerce the values here because they are already
          // type-checked by avro when decoding the param
          paramsInstance[step.id]
        : // This is needed for meta-steps like players and products
          step.coerceInstanceEntry(undefined, context)
    );
  }

  return $(
    fromSlice,
    ($$) => Vec.zip(steps, $$),
    ($$) =>
      Vec.map($$, ([step, entry]) => step.coerceInstanceEntry(entry, context))
  );
}
