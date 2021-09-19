import { type_invariant } from "../../common/err/invariant";
import { nullthrows } from "../../common/err/nullthrows";
import { useAppEntityIdSelectorNullable } from "../../common/hooks/useAppEntityIdSelector";
import { instanceSelectors } from "./instanceSlice";
import IGameStep from "../../games/core/steps/IGameStep";

export function useInstanceValue<T>(step: IGameStep<T>): T | null {
  const instanceEntry = useAppEntityIdSelectorNullable(
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
