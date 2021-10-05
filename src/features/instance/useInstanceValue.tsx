import { nullthrows, ReactUtils, type_invariant } from "common";
import { RandomGameStep } from "games/core/steps/createVariableGameStep";
import { instanceSelectors } from "./instanceSlice";

export const useRequiredInstanceValue = <T,>(step: RandomGameStep<T>): T =>
  nullthrows(
    useOptionalInstanceValue(step),
    `Missing required instance value of step '${step.id}'`
  );

export function useOptionalInstanceValue<T>(step: RandomGameStep<T>): T | null {
  const instanceEntry = ReactUtils.useAppEntityIdSelectorNullable(
    instanceSelectors,
    step.id
  );
  if (instanceEntry == null) {
    return null;
  }

  return type_invariant(
    instanceEntry.value,
    nullthrows(step.isType, `No type coercer defined for step ${step.id}`),
    `Value ${JSON.stringify(
      instanceEntry.value
    )} failed to validate type for step ${step.id}`
  );
}
