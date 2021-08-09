import { Chip } from "@material-ui/core";
import { useAppDispatch } from "../../app/hooks";
import { availableItems } from "../../core/games/concordia/SetupStep";
import templateSlice, {
  selectors as templateStepSelectors,
} from "./templateSlice";
import { EntityId } from "@reduxjs/toolkit";
import useAppEntityIdSelectorEnforce from "../../common/hooks/useAppEntityIdSelectorEnforce";
import { type_invariant } from "../../common/err/invariant";
import PlayerOrderConfig from "./PlayerOrderConfig";

export default function FixedSettingsConfig({ stepId }: { stepId: EntityId }) {
  const dispatch = useAppDispatch();

  const step = useAppEntityIdSelectorEnforce(templateStepSelectors, stepId);

  if (step.name === "playOrder") {
    return (
      <PlayerOrderConfig
        order={
          step.value == null
            ? undefined
            : type_invariant(step.value, Array.isArray)
        }
      />
    );
  }

  const items = availableItems(step.name) ?? [];
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
