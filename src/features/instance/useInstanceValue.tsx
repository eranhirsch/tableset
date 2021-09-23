import { nullthrows, type_invariant, ReactUtils } from "common";
import IGameStep from "../../games/core/steps/IGameStep";
import { instanceSelectors } from "./instanceSlice";

export function useInstanceValue<T>(step: IGameStep<T>): T | null {
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
