import { Chip } from "@material-ui/core";
import { EntityId } from "@reduxjs/toolkit";
import { useEffect, useMemo } from "react";
import { useAppDispatch } from "../../../app/hooks";
import invariant_violation from "../../../common/err/invariant_violation";
import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import ConcordiaGame from "../../../games/concordia/ConcordiaGame";
import { Strategy } from "../../../core/Strategy";
import templateSlice, {
  selectors as templateStepSelectors,
} from "../templateSlice";

export default function ItemsListPanel({ stepId }: { stepId: EntityId }) {
  const dispatch = useAppDispatch();

  const step = useAppEntityIdSelectorEnforce(templateStepSelectors, stepId);

  if (step.strategy !== Strategy.FIXED) {
    invariant_violation(`strategy isn't FIXED for step ${stepId}`);
  }

  const items = useMemo(() => ConcordiaGame.itemsForStep(step.id), [step.id]);

  if (items == null || items.length === 0) {
    invariant_violation(
      `Step ${stepId} does not have any valid items for use with the FIXED strategy`
    );
  }

  useEffect(() => {
    if (step.value == null) {
      dispatch(
        templateSlice.actions.fixedValueSet({ stepId, value: items[0] })
      );
    }
  }, [dispatch, items, step.value, stepId]);

  return (
    <>
      {items.map((item) => (
        <Chip
          key={`${step.id}_${item}`}
          variant={step.value === item ? "filled" : "outlined"}
          label={item}
          onClick={
            step.value !== item
              ? () =>
                  dispatch(
                    templateSlice.actions.fixedValueSet({
                      stepId: step.id,
                      value: item,
                    })
                  )
              : undefined
          }
        />
      ))}
    </>
  );
}
