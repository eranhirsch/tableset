import { Chip } from "@material-ui/core";
import { EntityId } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../../app/hooks";
import useAppEntityIdSelectorEnforce from "../../../common/hooks/useAppEntityIdSelectorEnforce";
import templateSlice, {
  selectors as templateStepSelectors,
} from "../templateSlice";

export default function ItemsListPanel({
  stepId,
  items,
}: {
  stepId: EntityId;
  items: string[];
}) {
  const dispatch = useAppDispatch();

  const step = useAppEntityIdSelectorEnforce(templateStepSelectors, stepId);

  return (
    <>
      {items.map((item) => (
        <Chip
          key={`${step.name}_${item}`}
          variant={step.value === item ? "filled" : "outlined"}
          label={item}
          onClick={() =>
            dispatch(
              step.value === item
                ? templateSlice.actions.fixedValueCleared(step.name)
                : templateSlice.actions.fixedValueSet({
                    stepId: step.name,
                    value: item,
                  })
            )
          }
        />
      ))}
    </>
  );
}
