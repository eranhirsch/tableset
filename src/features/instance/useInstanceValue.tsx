import { nullthrows, type_invariant, ReactUtils } from "common";
import IGameStep from "../../model/IGameStep";
import { instanceSelectors } from "./instanceSlice";

export const useRequiredInstanceValue = <T,>(step: IGameStep<T>): T =>
  nullthrows(
    useOptionalInstanceValue(step),
    `Missing required instance value of step '${step.id}'`
  );

export function useOptionalInstanceValue<T>(step: IGameStep<T>): T | null {
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
