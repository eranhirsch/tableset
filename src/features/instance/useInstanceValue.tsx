import { $, nullthrows, ReactUtils, Vec } from "common";
import { useFeaturesContext } from "features/useFeaturesContext";
import { StepId } from "model/Game";
import { VariableGameStep } from "model/VariableGameStep";
import { instanceSelectors } from "./instanceSlice";

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

  return step.coerceInstanceEntry(instanceEntry, context);
}

export function useHasDownstreamInstanceValue(stepId: StepId): boolean {
  const instanceEntry = ReactUtils.useAppEntityIdSelectorNullable(
    instanceSelectors,
    stepId
  );
  return instanceEntry != null;
}

export function useOptionalInstanceValues(
  steps: readonly VariableGameStep[]
): readonly unknown[] {
  const context = useFeaturesContext();
  return $(
    [
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
    ],
    ($$) => Vec.zip(steps, $$),
    ($$) =>
      Vec.map($$, ([step, entry]) => step.coerceInstanceEntry(entry, context))
  );
}
