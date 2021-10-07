import { nullthrows, ReactUtils } from "common";
import { VariableGameStep } from "model/VariableGameStep";
import { instanceSelectors } from "./instanceSlice";

export function useRequiredInstanceValue<T>(step: VariableGameStep<T>): T {
  return nullthrows(
    useOptionalInstanceValue(step),
    `Missing required instance value of step '${step.id}'`
  );
}

export function useOptionalInstanceValue<T>(
  step: VariableGameStep<T>
): T | null {
  const instanceEntry = ReactUtils.useAppEntityIdSelectorNullable(
    instanceSelectors,
    step.id
  );

  return step.coerceInstanceEntry(instanceEntry);
}
